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

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    await dbConnect();

    try {
        const { id } = params;
        const periode = await Periode.findById(id);

        if (!periode) {
            return NextResponse.json(createResponse(404, 'Periode not found', null));
        }

        return NextResponse.json(createResponse(200, 'Success', periode, true));
    } catch (error) {
        console.error('GET by ID error:', error);
        return NextResponse.json({ error: 'Failed to fetch Periode' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    await dbConnect();

    try {
        const { id } = params;
        const body = await req.json();
        const errors = validatePeriodeData(body);

        if (errors.length > 0) {
            return NextResponse.json(createResponse(400, 'Failed', errors));
        }

        const updatedPeriode = await Periode.findOneAndUpdate({ _id: id }, body, { new: true });

        if (!updatedPeriode) {
            return NextResponse.json(createResponse(404, 'Periode not found', null));
        }

        return NextResponse.json(createResponse(200, 'Success', updatedPeriode, true));
    } catch (error) {
        console.error('PUT error:', error);
        return NextResponse.json({ error: 'Failed to update Periode' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    await dbConnect();

    try {
        const { id } = params;

        const deletedPeriode = await Periode.findById(id);
        if (!deletedPeriode) {
            return NextResponse.json(createResponse(404, 'Periode not found', null));
        }

        await deletedPeriode.cascadeDelete();

        return NextResponse.json(createResponse(200, 'Success', deletedPeriode, true));
    } catch (error) {
        console.error('DELETE error:', error);
        return NextResponse.json(createResponse(500, 'Failed to delete Periode', null, false));
    }
}
