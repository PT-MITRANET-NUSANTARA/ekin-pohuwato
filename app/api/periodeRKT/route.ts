import { NextRequest, NextResponse } from 'next/server';
import PeriodeRKT from '../../../models/PeriodeRKT';
import SubKegiatan from '../../../models/SubKegiatan'; // Assuming SubKegiatan model exists
import Joi from 'joi';
import dbConnect from '@/utils/db';
import { createResponse } from '@/utils/api';
import getFilterQuery from '@/utils/getFilterQuery';

// Joi schema for PeriodeRKT validation
const periodeRKTSchema = Joi.object({
    periode_start: Joi.date().required().label('Periode Mulai'),
    periode_end: Joi.date().required().label('Periode Selesai'),
    RKTS: Joi.optional(),
    __v: Joi.optional(),
    _id: Joi.optional(),
    id: Joi.optional(),
    unit: Joi.object().required().label('Unit'),
    createdAt: Joi.date().optional(),
    updatedAt: Joi.date().optional(),
    renstra: Joi.string().hex().length(24).required().label('Renstra') // Expecting a string ObjectId
}).messages({
    'any.required': '{{#label}} wajib diisi.',
    'string.base': '{{#label}} harus berupa teks.',
    'string.empty': '{{#label}} tidak boleh kosong.',
    'string.hex': '{{#label}} harus berupa nilai heksadesimal yang valid.',
    'string.length': '{{#label}} harus memiliki panjang tepat {{#limit}} karakter.',
    'string.pattern.base': '{{#label}} harus berupa tahun yang valid (4 digit).',
    'date.base': '{{#label}} harus berupa tanggal yang valid.'
});

function validatePeriodeRKTData(data: any) {
    const { error } = periodeRKTSchema.validate(data, { abortEarly: false });
    if (error) {
        return error.details.map((err) => err.message);
    }
    return [];
}

// GET method to fetch PeriodeRKT
export async function GET(req: NextRequest) {
    await dbConnect();

    try {
        const page = req.nextUrl.searchParams.get('page');
        const limit = req.nextUrl.searchParams.get('limit');
        const filters = req.nextUrl.searchParams.get('filters');
        let periodeRKTs;

        if (!(page && limit) || page === 'undefined' || limit === 'undefined') {
            periodeRKTs = await PeriodeRKT.find(getFilterQuery(filters)).populate('renstra');
        } else {
            periodeRKTs = await PeriodeRKT.getAll(Number(page), Number(limit), JSON.parse(filters as string));
        }

        return NextResponse.json(createResponse(200, 'Success', periodeRKTs, true));
    } catch (error) {
        console.error('GET error:', error);
        return NextResponse.json({ error: 'Failed to fetch Periode RKT data' }, { status: 500 });
    }
}

// POST method to create PeriodeRKT
export async function POST(req: NextRequest) {
    await dbConnect();

    try {
        const body = await req.json();

        const errors = validatePeriodeRKTData(body);
        if (errors.length > 0) {
            return NextResponse.json(createResponse(400, 'Failed', errors, false));
        }

        const newPeriodeRKT = new PeriodeRKT(body);
        await newPeriodeRKT.save();
        return NextResponse.json(createResponse(201, 'Success', newPeriodeRKT, true));
    } catch (error) {
        console.error('POST error:', error);
        return NextResponse.json({ error: 'Failed to create Periode RKT' }, { status: 500 });
    }
}
