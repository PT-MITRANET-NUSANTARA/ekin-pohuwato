import { NextRequest, NextResponse } from 'next/server';
import Joi from 'joi';
import dbConnect from '@/utils/db';
import { createResponse } from '@/utils/api';
import Absence from '@/models/Absence';

// Schema validasi untuk Absence
const absenceSchema = Joi.object({
    user_id: Joi.string().required().label('User ID'),
    date: Joi.date().required().label('Tanggal'),
    unit: Joi.object().required().label('Unit'),
    status: Joi.string().valid('Hadir', 'Sakit', 'Izin', 'Alpha').required().label('Status')
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
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    await dbConnect();

    try {
        const { id } = params;

        let absences;

        absences = await Absence.findById(id);

        return NextResponse.json(createResponse(200, 'Success', absences, true));
    } catch (error) {
        console.error('GET error:', error);
        return NextResponse.json({ error: 'Failed to fetch Absence data' }, { status: 500 });
    }
}

// API Handler POST untuk Absence
export async function POST(req: NextRequest) {
    await dbConnect();

    try {
        const body = await req.json();

        const errors = validateAbsenceData(body);
        if (errors.length > 0) {
            return NextResponse.json(createResponse(400, 'Failed', errors));
        }

        const newAbsence = new Absence(body);
        await newAbsence.save();
        return NextResponse.json(createResponse(201, 'Success', newAbsence, true));
    } catch (error) {
        console.error('POST error:', error);
        return NextResponse.json({ error: 'Failed to create Absence' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    await dbConnect();

    try {
        const { id } = params;
        const body = await req.json();

        const errors = validateAbsenceData(body);
        if (errors.length > 0) {
            return NextResponse.json(createResponse(400, 'Failed', errors));
        }

        const updateAbsence = await Absence.findOneAndUpdate({ _id: id }, body, { new: true });

        if (!updateAbsence) {
            return NextResponse.json(createResponse(404, 'Periode RKT not found', null));
        }

        return NextResponse.json(createResponse(200, 'Success', updateAbsence, true));
    } catch (error) {
        console.error('PUT error:', error);
        return NextResponse.json({ error: 'Failed to update Periode RKT' }, { status: 500 });
    }
}

// DELETE method to delete PeriodeRKT
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {

    await dbConnect();

    try {
        const { id } = params;


        const deletedAbsence = await Absence.findById(id);
        if (!deletedAbsence) {
            return NextResponse.json(createResponse(404, 'Periode RKT not found', null));
        }

        await deletedAbsence.cascadeDelete();

        return NextResponse.json(createResponse(200, 'Success', deletedAbsence, true));
    } catch (error) {
        console.error('DELETE error:', error);
        return NextResponse.json({ error: 'Failed to delete Periode RKT' }, { status: 500 });
    }
}