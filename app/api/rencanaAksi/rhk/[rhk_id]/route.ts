import { NextRequest, NextResponse } from 'next/server';

import Joi from 'joi';
import dbConnect from '@/utils/db';
import { createResponse } from '@/utils/api';
import RencanaAksi from '@/models/RencanaAksi';

// Validation schema for RencanaAksi
const rencanaAksiSchema = Joi.object({
    isi: Joi.string().required().label('Isi Rencana Aksi'),
    rhk: Joi.string().required().label('RHK'),
    periodePenilaian: Joi.string().required().label('Periode Penilaian'),
    target: Joi.string().required().label('Target'),
    __v: Joi.optional(),
    _id: Joi.optional(),
    createdAt: Joi.date().optional(),
    updatedAt: Joi.date().optional()
}).messages({
    'any.required': '{{#label}} wajib diisi.',
    'string.base': '{{#label}} harus berupa string.'
});

// Validate function for RencanaAksi data
function validateRencanaAksiData(data: any) {
    const { error } = rencanaAksiSchema.validate(data, { abortEarly: false });
    if (error) {
        return error.details.map((err) => err.message);
    }
    return [];
}

// GET route
export async function GET(req: NextRequest, { params }: { params: { rhk_id: string } }) {
    await dbConnect();

    try {
        let rencanaAksis;
        const { rhk_id } = params;
        const periode = req.nextUrl.searchParams.get('periodePenilaian');
        if (periode) {
            rencanaAksis = await RencanaAksi.find({ rhk: rhk_id, periodePenilaian: periode });
        } else {
            rencanaAksis = await RencanaAksi.find({ rhk: rhk_id });
        }

        return NextResponse.json(createResponse(200, 'Success', rencanaAksis, true));
    } catch (error) {
        console.error('GET error:', error);
        return NextResponse.json({ error: 'Failed to fetch Rencana Aksi data' }, { status: 500 });
    }
}
