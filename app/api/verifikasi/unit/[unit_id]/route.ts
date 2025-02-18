import { NextRequest, NextResponse } from 'next/server';
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

export async function GET(req: NextRequest, { params }: { params: { unit_id: string } }) {
    await dbConnect();

    try {
        const { unit_id } = params;
        const page = req.nextUrl.searchParams.get('page');
        const limit = req.nextUrl.searchParams.get('limit');
        const filters = req.nextUrl.searchParams.get('filters');
        let verifikasi;

        if (!(page && limit) || page === 'undefined' || limit === 'undefined') {
            verifikasi = await Verifikasi.findOne({ 'unit.id_sapk': unit_id });
        } else {
            const f = JSON.parse(filters as string);
            f['unit.id'] = unit_id;
            verifikasi = await Verifikasi.getAll(Number(page), Number(limit), f);
        }

        return NextResponse.json(createResponse(200, 'Success', verifikasi, true));
    } catch (error) {
        console.error('GET error:', error);
        return NextResponse.json({ error: 'Failed to fetch Periode RKT data' }, { status: 500 });
    }
}