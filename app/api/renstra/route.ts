import { NextRequest, NextResponse } from 'next/server';
import Renstra from '../../../models/Renstra';
import Program from '../../../models/Program';

import Joi from 'joi';
import dbConnect from '@/utils/db';
import { createResponse } from '@/utils/api';
import getFilterQuery from '@/utils/getFilterQuery';

const renstraSchema = Joi.object({
    periode_start: Joi.date().required().label('Periode Mulai'),
    periode_end: Joi.date().required().label('Periode Selesai'),
    misi: Joi.array().items(Joi.string().hex().length(24)).required().label('Misi'), // Mengharapkan array string ObjectId
    programs: Joi.array().items(Joi.string().hex().length(24)).label('Program'), // Mengharapkan array string ObjectId
    __v: Joi.optional(),
    _id: Joi.optional(),
    unit: Joi.object().required().label('Unit'),
    createdAt: Joi.date().optional(),
    updatedAt: Joi.date().optional(),
    periode: Joi.optional(),
    visi: Joi.optional()
}).messages({
    'any.required': '{{#label}} wajib diisi.',
    'string.base': '{{#label}} harus berupa teks.',
    'string.empty': '{{#label}} tidak boleh kosong.',
    'string.hex': '{{#label}} harus berupa nilai heksadesimal yang valid.',
    'string.length': '{{#label}} harus memiliki panjang tepat {{#limit}} karakter.',
    'date.base': '{{#label}} harus berupa tanggal yang valid.',
    'array.base': '{{#label}} harus berupa array.'
});

function validateRenstraData(data: any) {
    const { error } = renstraSchema.validate(data, { abortEarly: false });
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
        let renstras;

        if (!(page && limit) || page === 'undefined' || limit === 'undefined') {
            renstras = await Renstra.find(getFilterQuery(filters)).populate({
                path: 'misi',
                populate: {
                    path: 'visi',
                }
            });
        } else {
            renstras = await Renstra.getAll(Number(page), Number(limit), JSON.parse(filters as string));
        }

        return NextResponse.json(createResponse(200, 'Success', renstras, true));
    } catch (error) {
        console.error('GET error:', error);
        return NextResponse.json({ error: 'Failed to fetch Renstra data' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    await dbConnect();

    try {
        const body = await req.json();

        const errors = validateRenstraData(body);
        if (errors.length > 0) {
            return NextResponse.json(createResponse(400, 'Failed', errors));
        }

        const newRenstra = new Renstra(body);
        await newRenstra.save();
        return NextResponse.json(createResponse(201, 'Success', newRenstra, true));
    } catch (error) {
        console.error('POST error:', error); // Added error logging
        return NextResponse.json({ error: 'Failed to create Renstra' }, { status: 500 });
    }
}