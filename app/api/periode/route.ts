import { NextRequest, NextResponse } from 'next/server';
import Periode from '@/models/Periode';
import Joi from 'joi';
import dbConnect from '@/utils/db';
import { createResponse } from '@/utils/api';

const periodeSchema = Joi.object({
    periode_start: Joi.date().required().label('Periode Mulai'),
    periode_end: Joi.date().required().label('Periode Selesai'),
    __v: Joi.optional(),
    _id: Joi.optional(),
    createdAt: Joi.date().optional(),
    updatedAt: Joi.date().optional()
}).messages({
    'any.required': '{{#label}} wajib diisi.',
    'date.base': '{{#label}} harus berupa tanggal yang valid.'
});

function validatePeriodeData(data: any) {
    const { error } = periodeSchema.validate(data, { abortEarly: false });
    if (error) {
        return error.details.map((err) => err.message);
    }
    return [];
}

export async function GET(req: NextRequest) {
    await dbConnect();

    try {
        let periodes;
        const page = req.nextUrl.searchParams.get('page');
        const limit = req.nextUrl.searchParams.get('limit');
        const filters = req.nextUrl.searchParams.get('filters');

        if (!(page && limit) || (page === 'undefined' || limit === 'undefined')) {
            periodes = await Periode.find({});
        } else {
            periodes = await Periode.getAll(Number(page), Number(limit), JSON.parse(filters as string));
        }

        return NextResponse.json(createResponse(200, 'Success', periodes, true));
    } catch (error) {
        console.error('GET error:', error);
        return NextResponse.json({ error: 'Failed to fetch Periode data' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    await dbConnect();

    try {
        const body = await req.json();
        const errors = validatePeriodeData(body);

        if (errors.length > 0) {
            return NextResponse.json(createResponse(400, 'Failed', errors));
        }

        const newPeriode = new Periode(body);
        await newPeriode.save();
        return NextResponse.json(createResponse(201, 'Success', newPeriode, true));
    } catch (error) {
        console.error('POST error:', error);
        return NextResponse.json({ error: 'Failed to create Periode' }, { status: 500 });
    }
}
