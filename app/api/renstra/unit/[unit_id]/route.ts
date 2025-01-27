import { NextRequest, NextResponse } from 'next/server';

import Joi from 'joi';
import dbConnect from '@/utils/db';
import { createResponse } from '@/utils/api';
import Renstra from '@/models/Renstra';

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
    periode: Joi.optional()
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

export async function GET(req: NextRequest, { params }: { params: { unit_id: string } }) {
    await dbConnect();

    try {
        const { unit_id } = params;
        const page = req.nextUrl.searchParams.get('page');
        const limit = req.nextUrl.searchParams.get('limit');
        const filters = req.nextUrl.searchParams.get('filters');
        let renstras;

        if (!(page && limit) || page === 'undefined' || limit === 'undefined') {
            renstras = await Renstra.find({ 'unit.id': unit_id });
        } else {
            const f = JSON.parse(filters as string);
            f['unit.id'] = unit_id;
            renstras = await Renstra.getAll(Number(page), Number(limit), f);
        }

        return NextResponse.json(createResponse(200, 'Success', renstras, true));
    } catch (error) {
        console.error('GET error:', error);
        return NextResponse.json({ error: 'Failed to fetch Periode RKT data' }, { status: 500 });
    }
}
