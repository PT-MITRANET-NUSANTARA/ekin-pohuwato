import { NextRequest, NextResponse } from 'next/server';
import Harian from '../../../models/Harian';
import Joi from 'joi';
import dbConnect from '@/utils/db';
import { createResponse } from '@/utils/api';

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
    isSKP: Joi.boolean().optional(),
    updatedAt: Joi.date().optional(),
    progress: Joi.number().required().label('Progress'),
    absence: Joi.string().required().label('Absensi'),
    unit: Joi.object().required().label('Unit'),
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

export async function GET(req: NextRequest) {
    await dbConnect();

    try {
        const page = req.nextUrl.searchParams.get('page');
        const limit = req.nextUrl.searchParams.get('limit');
        const filters = req.nextUrl.searchParams.get('filters');
        let harian;

        if (!(page && limit) || page === 'undefined' || limit === 'undefined') {
            harian = await Harian.find({});
        } else {
            harian = await Harian.getAll(Number(page), Number(limit), JSON.parse(filters as string));
        }

        return NextResponse.json(createResponse(200, 'Success', harian, true));
    } catch (error) {
        console.error('GET error:', error);
        return NextResponse.json({ error: 'Failed to fetch Harian data' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    await dbConnect();
    try {
        const body = await req.json();

        const errors = validateHarianData(body);
        if (errors.length > 0) {
            return NextResponse.json(createResponse(400, 'Failed', errors));
        }

        const newHarian = new Harian(body);
        await newHarian.save();
        return NextResponse.json(createResponse(201, 'Success', newHarian, true));
    } catch (error) {
        console.error('POST error:', error);
        return NextResponse.json({ error: 'Failed to create Harian' }, { status: 500 });
    }
}
