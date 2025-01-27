import { NextRequest, NextResponse } from 'next/server';
import UMPEG from '../../../models/UMPEG'; // Update the model reference to UMPEG
import Joi from 'joi';
import dbConnect from '@/utils/db';
import { createResponse } from '@/utils/api';
import Verifikasi from '@/models/Verifikasi';
import getFilterQuery from '@/utils/getFilterQuery';

const verifikasiSchema = Joi.object({
    unit: Joi.object().required().label('Unit'),
    __v: Joi.optional(),
    _id: Joi.optional(),
    id: Joi.optional(),
    createdAt: Joi.date().optional(),
    updatedAt: Joi.date().optional()
}).messages({
    'any.required': '{{#label}} wajib diisi.',
    'object.base': '{{#label}} harus berupa objek yang valid.',
    'date.base': '{{#label}} harus berupa tanggal yang valid.'
});

function validateVerifikasiData(data: any) {
    const { error } = verifikasiSchema.validate(data, { abortEarly: false });
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

        let verifikasi;

        if (!(page && limit) || page === 'undefined' || limit === 'undefined') {
            verifikasi = await Verifikasi.find(getFilterQuery(filters));
        } else {
            verifikasi = await Verifikasi.getAll(Number(page), Number(limit), JSON.parse(filters as string));
        }

        return NextResponse.json(createResponse(200, 'Success', verifikasi, true));
    } catch (error) {
        console.error('GET error:', error);
        return NextResponse.json({ error: 'Failed to fetch UMPEG data' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    await dbConnect();

    try {
        const body = await req.json();
        const errors = validateVerifikasiData(body);

        if (errors.length > 0) {
            return NextResponse.json(createResponse(400, 'Failed', errors));
        }

        const newVerifikasi = new Verifikasi(body);
        await newVerifikasi.save();
        return NextResponse.json(createResponse(201, 'Success', newVerifikasi, true));
    } catch (error) {
        console.error('POST error:', error); // Added error logging
        return NextResponse.json({ error: 'Failed to create Verifikasi' }, { status: 500 });
    }
}