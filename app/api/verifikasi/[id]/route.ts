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

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    await dbConnect();

    try {
        const { id } = params;
        const verifikasi = await Verifikasi.findById(id);

        return NextResponse.json(createResponse(200, 'Success', verifikasi, true));
    } catch (error) {
        console.error('GET error:', error);
        return NextResponse.json({ error: 'Failed to fetch UMPEG data' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    await dbConnect();

    try {
        const { id } = params;
        const body = await req.json();
        const errors = validateVerifikasiData(body);
        if (errors.length > 0) {
            return NextResponse.json(createResponse(400, 'Failed', errors));
        }

        const updatedVerifikasi = await Verifikasi.findOneAndUpdate({ _id: id }, body, { new: true });


        if (!updatedVerifikasi) {
            return NextResponse.json(createResponse(404, 'Verifikasi not found', null));
        }

        await updatedVerifikasi.save();
        return NextResponse.json(createResponse(200, 'Success', updatedVerifikasi, true));
    } catch (error) {
        console.error('PUT error:', error); // Added error logging
        return NextResponse.json({ error: 'Failed to update Verifikasi' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    await dbConnect();

    try {
        const { id } = params;

        const deletedVerifikasi = await Verifikasi.findByIdAndDelete(id);
        if (!deletedVerifikasi) {
            return NextResponse.json(createResponse(404, 'Verifikasi not found', null));
        }

        return NextResponse.json(createResponse(200, 'Success', deletedVerifikasi, true));
    } catch (error) {
        console.error('DELETE error:', error); // Added error logging
        return NextResponse.json({ error: 'Failed to delete Verifikasi' }, { status: 500 });
    }
}
