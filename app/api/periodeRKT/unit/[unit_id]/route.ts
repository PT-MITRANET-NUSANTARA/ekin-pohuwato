import { NextRequest, NextResponse } from 'next/server';
import Joi from 'joi';
import dbConnect from '@/utils/db';
import { createResponse } from '@/utils/api';
import PeriodeRKT from '@/models/PeriodeRKT';

// Joi schema for PeriodeRKT validation
const periodeRKTSchema = Joi.object({
    periode_start: Joi.date().required().label('Periode Mulai'),
    periode_end: Joi.date().required().label('Periode Selesai'),
    perjanjianKinerja: Joi.array().label('Perjanjian Kinerja'),
    RKTS: Joi.optional(),
    __v: Joi.optional(),
    renstra: Joi.string().hex().length(24).required().label('Renstra'), // Expecting a string ObjectId

    _id: Joi.optional(),
    id: Joi.optional(),
    unit: Joi.object().required().label('Unit'),
    createdAt: Joi.date().optional(),
    updatedAt: Joi.date().optional()
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
export async function GET(req: NextRequest, { params }: { params: { unit_id: string } }) {
    await dbConnect();

    try {
        const { unit_id } = params;
        const page = req.nextUrl.searchParams.get('page');
        const limit = req.nextUrl.searchParams.get('limit');
        const filters = req.nextUrl.searchParams.get('filters');
        let periodeRKTs;
        if (!(page && limit) || page === 'undefined' || limit === 'undefined') {
            periodeRKTs = await PeriodeRKT.find({ 'unit.id': unit_id }).populate('renstra');
        } else {
            const f = JSON.parse(filters as string);
            f['unit.id'] = unit_id;
            periodeRKTs = await PeriodeRKT.getAll(Number(page), Number(limit), f);
        }

        return NextResponse.json(createResponse(200, 'Success', periodeRKTs, true));
    } catch (error) {
        console.error('GET error:', error);
        return NextResponse.json({ error: 'Failed to fetch Periode RKT data' }, { status: 500 });
    }
}
