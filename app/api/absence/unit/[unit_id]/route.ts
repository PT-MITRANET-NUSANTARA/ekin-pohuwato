import { NextRequest, NextResponse } from 'next/server';
import Joi from 'joi';
import dbConnect from '@/utils/db';
import { createResponse } from '@/utils/api';
import Absence from '@/models/Absence';

// Schema validasi untuk Absence
const absenceSchema = Joi.object({
    user_id: Joi.string().required().label('User ID'),
    date: Joi.date().required().label('Tanggal'),
    status: Joi.string().valid('Hadir', 'Sakit', 'Izin', 'Alpha').required().label('Status'),
    unit: Joi.object().required().label('Unit')
}).messages({
    'any.required': '{{#label}} wajib diisi.',
    'string.base': '{{#label}} harus berupa teks.',
    'string.empty': '{{#label}} tidak boleh kosong.',
    'date.base': '{{#label}} harus berupa tanggal yang valid.',
    'string.valid': '{{#label}} harus salah satu dari: Hadir, Sakit, Izin, Alpha.'
});

function validateAbsenceData(data: any) {
    const { error } = absenceSchema.validate(data, { abortEarly: false });
    if (error) {
        return error.details.map((err) => err.message);
    }
    return [];
}

// API Handler GET untuk Absence
export async function GET(req: NextRequest, { params }: { params: { unit_id: string } }) {
    await dbConnect();

    try {
        const { unit_id } = params;
        const user_id = req.nextUrl.searchParams.get('user_id');
        let absences;

        absences = await Absence.find({ 'unit.id': unit_id, user_id: user_id });

        return NextResponse.json(createResponse(200, 'Success', absences, true));
    } catch (error) {
        console.error('GET error:', error);
        return NextResponse.json({ error: 'Failed to fetch Periode RKT data' }, { status: 500 });
    }
}
