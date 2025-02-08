import { NextRequest, NextResponse } from 'next/server';
PeriodePenilaian;
import Joi from 'joi';
import dbConnect from '@/utils/db';
import { createResponse } from '@/utils/api';
import getFilterQuery from '@/utils/getFilterQuery';
import PeriodePenilaian from '@/models/PeriodePenilaian';

// Schema for validating PeriodePenilaian
const periodePenilaianSchema = Joi.object({
    periodeStart: Joi.date().required().label('Periode Mulai'),
    periodeEnd: Joi.date().required().label('Periode Selesai'),
    name: Joi.string().required().label('Name'),
    skp: Joi.string().hex().length(24).required().label('SKP'), // Expecting string ObjectId
    periodePenilaian: Joi.string().hex().length(24).optional().label('Periode Penilaian'), // Expecting string ObjectId
    __v: Joi.optional(),
    _id: Joi.optional(),
    createdAt: Joi.date().optional(),
    updatedAt: Joi.date().optional()
}).messages({
    'any.required': '{{#label}} wajib diisi.',
    'string.base': '{{#label}} harus berupa teks.',
    'string.empty': '{{#label}} tidak boleh kosong.',
    'string.hex': '{{#label}} harus berupa nilai heksadesimal yang valid.',
    'string.length': '{{#label}} harus memiliki panjang tepat {{#limit}} karakter.',
    'date.base': '{{#label}} harus berupa tanggal yang valid.'
});

function validatePeriodePenilaianData(data: any) {
    const { error } = periodePenilaianSchema.validate(data, { abortEarly: false });
    if (error) {
        return error.details.map((err) => err.message);
    }
    return [];
}

// GET method to fetch PeriodePenilaian
export async function GET(req: NextRequest, { params }: { params: { skp_id: string } }) {
    await dbConnect();

    try {
        const { skp_id } = params;

        const page = req.nextUrl.searchParams.get('page');
        const limit = req.nextUrl.searchParams.get('limit');
        const filters = req.nextUrl.searchParams.get('filters');
        let periodePenilaians;

        if (page === 'undefined' || limit === 'undefined') {
            periodePenilaians = await PeriodePenilaian.find(getFilterQuery(filters)).populate('skp');
        } else {
            periodePenilaians = await PeriodePenilaian.getAll(Number(page), Number(limit), JSON.parse(filters as string));
        }

        return NextResponse.json(createResponse(200, 'Success', periodePenilaians, true));
    } catch (error) {
        console.error('GET error:', error);
        return NextResponse.json({ error: 'Failed to fetch Periode Penilaian data' }, { status: 500 });
    }
}

// POST method to create PeriodePenilaian
export async function POST(req: NextRequest) {
    await dbConnect();

    try {
        const body = await req.json();

        const errors = validatePeriodePenilaianData(body);
        if (errors.length > 0) {
            return NextResponse.json(createResponse(400, 'Failed', errors));
        }

        const newPeriodePenilaian = new PeriodePenilaian(body);
        await newPeriodePenilaian.save();
        return NextResponse.json(createResponse(201, 'Success', newPeriodePenilaian, true));
    } catch (error) {
        console.error('POST error:', error);
        return NextResponse.json({ error: 'Failed to create Periode Penilaian' }, { status: 500 });
    }
}
