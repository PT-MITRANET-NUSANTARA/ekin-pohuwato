import { NextRequest, NextResponse } from 'next/server';

import Joi from 'joi';
import dbConnect from '@/utils/db';
import { createResponse } from '@/utils/api';
import Misi from '@/models/Misi';

const misiSchema = Joi.object({
    name: Joi.string().required().label('Nama Misi'),
    visi: Joi.string().hex().length(24).required().label('Visi'), // Expecting a string ObjectId
    __v: Joi.optional(),
    _id: Joi.optional(),
    createdAt: Joi.date().optional(),
    updatedAt: Joi.date().optional(),
    periode: Joi.optional()
}).messages({
    'any.required': '{{#label}} wajib diisi.',
    'string.base': '{{#label}} harus berupa teks.',
    'string.empty': '{{#label}} tidak boleh kosong.',
    'string.hex': '{{#label}} harus berupa nilai heksadesimal yang valid.',
    'string.length': '{{#label}} harus memiliki panjang tepat {{#limit}} karakter.'
});

// Function to validate Misi data
function validateMisiData(data: any) {
    const { error } = misiSchema.validate(data, { abortEarly: false });
    if (error) {
        return error.details.map((err) => err.message);
    }
    return [];
}

// GET method to fetch Misi data
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    await dbConnect();

    try {
        const { id } = params;
        const misi = await Misi.findById(id);

        if (!misi) {
            return NextResponse.json(createResponse(404, 'Misi not found', null));
        }

        return NextResponse.json(createResponse(200, 'Success', misi, true));
    } catch (error) {
        console.error('GET error:', error);
        return NextResponse.json({ error: 'Failed to fetch Misi data' }, { status: 500 });
    }
}

// PUT method to update an existing Misi record
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    await dbConnect();

    try {
        const { id } = params;
        const body = await req.json();
        const errors = validateMisiData(body);

        if (errors.length > 0) {
            return NextResponse.json(createResponse(400, 'Failed', errors));
        }

        const updatedMisi = await Misi.findOneAndUpdate({ _id: id }, body, { new: true });

        if (!updatedMisi) {
            return NextResponse.json(createResponse(404, 'Misi not found', null));
        }

        return NextResponse.json(createResponse(200, 'Success', updatedMisi, true));
    } catch (error) {
        console.error('PUT error:', error);
        return NextResponse.json({ error: 'Failed to update Misi' }, { status: 500 });
    }
}

// DELETE method to remove an existing Misi record
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    await dbConnect();

    try {
        const { id } = params;

        const deletedMisi = await Misi.findById(id);
        if (!deletedMisi) {
            return NextResponse.json(createResponse(404, 'Misi not found', null));
        }

        deletedMisi.cascadeDelete();

        return NextResponse.json(createResponse(200, 'Success', deletedMisi, true));
    } catch (error) {
        console.error('DELETE error:', error);
        return NextResponse.json({ error: 'Failed to delete Misi' }, { status: 500 });
    }
}
