import { NextRequest, NextResponse } from 'next/server';
import Joi from 'joi';
import dbConnect from '@/utils/db';
import { createResponse } from '@/utils/api';
import Harian, { IHarian } from '@/models/Harian';
import buildFilterQuery from '@/utils/buildFilterQuery';
import dayjs from 'dayjs';
import { get } from '@/controller/SettingsController';
import { apiRequest } from '@/utils/apiRequest';

const harianSchema = Joi.object({
    date: Joi.date().required().label('Tanggal'),
    startDateTime: Joi.string().required().label('Waktu Mulai'),
    endDateTime: Joi.string().required().label('Waktu Selesai'),
    rhk: Joi.string().required().label('RHK'),
    namaKegiatan: Joi.string().required().label('Nama Kegiatan'),
    deskripsiKegiatan: Joi.string().required().label('Deskripsi Kegiatan'),
    tautan: Joi.string().uri().label('Tautan'),
    files: Joi.array().items(Joi.object()).label('Berkas'),
    user_id: Joi.string().required().label('User ID'), // Menambahkan user_id ke skema
    createdAt: Joi.date().optional(),
    unit: Joi.object().required().label('Unit'),
    isSKP: Joi.boolean().optional(),
    updatedAt: Joi.date().optional(),
    progress: Joi.number().required().label('Progress'),
    absence: Joi.string().required().label('Absensi'),
    msg: Joi.object({
        status: Joi.string().optional().label('status msg'),
        message: Joi.string().optional().allow('').label('message msg')
    })
        .optional()
        .label('msg'),
    __v: Joi.optional(),
    _id: Joi.optional(),
    id: Joi.optional()
}).messages({
    'any.required': '{{#label}} wajib diisi.',
    'string.base': '{{#label}} harus berupa teks.',
    'string.empty': '{{#label}} tidak boleh kosong.',
    'date.base': '{{#label}} harus berupa tanggal yang valid.',
    'string.uri': '{{#label}} harus berupa tautan URL yang valid.',
    'array.base': '{{#label}} harus berupa array.'
});

function validateHarianData(data: any) {
    const { error } = harianSchema.validate(data, { abortEarly: false });
    if (error) {
        return error.details.map((err) => err.message);
    }
    return [];
}

const BASE_URL = process.env.BASE_URL;

export async function GET(req: NextRequest, { params }: { params: { absence_id: string } }) {
    await dbConnect();

    try {
        const { absence_id } = params;
        const time = req.nextUrl.searchParams.get('time');
        const harian = await Harian.find({ absence: absence_id, status: 'approved' });
        const detail = calculateTotalMinutes(harian);
        
        const data = {
            total: detail.menit,
            date: detail.date,
            mines: detail.menit - Number(time)
        };

        console.log('TIME', data);


        return NextResponse.json(createResponse(200, 'Success', data, true));
    } catch (error) {
        console.error('GET error:', error);
        return NextResponse.json({ error: 'Failed to fetch Periode RKT data' }, { status: 500 });
    }
}

interface TotalMinutesResult {
    menit: number;
    date: string;
}

const calculateTotalMinutes = (data: IHarian[]): TotalMinutesResult => {
    let menit = 0;
    let date = '';

    if (!data || data.length === 0) {
        return { menit: 0, date: '' };
    }

    data.forEach((item) => {
        const currentDate = dayjs(item.date).format('YYYY-MM-DD');
        if (!date) {
            date = currentDate;
        }

        const start = dayjs(`${currentDate} ${item.startDateTime}`, 'YYYY-MM-DD HH:mm:ss');
        const end = dayjs(`${currentDate} ${item.endDateTime}`, 'YYYY-MM-DD HH:mm:ss');

        const minutes = end.diff(start, 'minute');
        menit += minutes;
    });

    return { menit, date };
};
