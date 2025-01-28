import { NextRequest, NextResponse } from 'next/server';
import SubKegiatan from '../../../models/SubKegiatan';
import Joi from 'joi';
import dbConnect from '@/utils/db';
import { createResponse } from '@/utils/api';
import getFilterQuery from '@/utils/getFilterQuery';

const subKegiatanSchema = Joi.object({
    kegiatan: Joi.string().hex().length(24).required().label('Kegiatan'),
    name: Joi.string().required().label('Nama'),
    indikator_kinerja: Joi.array()
        .items(
            Joi.object({
                _id: Joi.optional(),

                name: Joi.string().required().label('Nama Indikator Kinerja'),
                target: Joi.number().required().label('Target Indikator Kinerja'),
                satuan: Joi.string().required().label('Satuan Indikator Kinerja')
            })
        )
        .required()
        .label('Indikator Kinerja'),
    total_anggaran: Joi.number().required().label('Total Anggaran'),
    __v: Joi.optional(),
    _id: Joi.optional(),
    unit: Joi.object().required().label('Unit'),
    id: Joi.optional(),
    renstra: Joi.optional(),
    tujuan: Joi.optional(),
    program: Joi.optional()
}).messages({
    'any.required': '{{#label}} wajib diisi.',
    'string.base': '{{#label}} harus berupa teks.',
    'string.empty': '{{#label}} tidak boleh kosong.',
    'string.hex': '{{#label}} harus berupa nilai heksadesimal yang valid.',
    'string.length': '{{#label}} harus memiliki panjang tepat {{#limit}} karakter.',
    'number.base': '{{#label}} harus berupa angka.',
    'number.empty': '{{#label}} tidak boleh kosong.',
    'number.min': '{{#label}} harus memiliki nilai minimal {{#limit}}.',
    'number.max': '{{#label}} tidak boleh melebihi {{#limit}}.'
});

function validateSubKegiatanData(data: any) {
    const { error } = subKegiatanSchema.validate(data, { abortEarly: false });
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
        let subKegiatans;

        if (!(page && limit) || page === 'undefined' || limit === 'undefined') {
            subKegiatans = await SubKegiatan.find(getFilterQuery(filters)).populate({
                path: 'kegiatan',
                populate: {
                    path: 'program',
                    populate: {
                        path: 'tujuan',
                        populate: {
                            path: 'renstra'
                        }
                    }
                }
            });
        } else {
            subKegiatans = await SubKegiatan.getAll(Number(page), Number(limit), JSON.parse(filters as string));
        }

        return NextResponse.json(createResponse(200, 'Success', subKegiatans, true));
    } catch (error) {
        console.error('GET error:', error);
        return NextResponse.json({ error: 'Failed to fetch SubKegiatan data' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    await dbConnect();

    try {
        const body = await req.json();
        const errors = validateSubKegiatanData(body);

        if (errors.length > 0) {
            return NextResponse.json(createResponse(400, 'Failed', errors));
        }

        const newSubKegiatan = new SubKegiatan(body);
        await newSubKegiatan.save();
        return NextResponse.json(createResponse(201, 'Success', newSubKegiatan, true));
    } catch (error) {
        console.error('POST error:', error); // Added error logging
        return NextResponse.json({ error: 'Failed to create SubKegiatan' }, { status: 500 });
    }
}
