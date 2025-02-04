import { NextRequest, NextResponse } from 'next/server';
import Joi from 'joi';
import dbConnect from '@/utils/db';
import { createResponse } from '@/utils/api';
import MessageSKP from '@/models/MessageSKP';

const messageSKPSchema = Joi.object({
    skp: Joi.string().hex().length(24).required().label('SKP'), // Expected ObjectId as a string
    atasan: Joi.string().hex().length(24).required().label('Atasan'), // Expected ObjectId as a string
    jabatan: Joi.object().required().label('Jabatan'),
    status: Joi.string().valid('terima', 'tolak').required().label('Status'),
    isi: Joi.string().required().label('Isi'),
    __v: Joi.optional(),
    _id: Joi.optional(),
    createdAt: Joi.date().optional(),
    updatedAt: Joi.date().optional(),
}).messages({
    'any.required': '{{#label}} wajib diisi.',
    'string.base': '{{#label}} harus berupa teks.',
    'string.empty': '{{#label}} tidak boleh kosong.',
    'string.hex': '{{#label}} harus berupa nilai heksadesimal yang valid.',
    'string.length': '{{#label}} harus memiliki panjang tepat {{#limit}} karakter.',
    'string.valid': '{{#label}} harus memiliki salah satu nilai yang valid.',
    'date.base': '{{#label}} harus berupa tanggal yang valid.',
    'object.base': '{{#label}} harus berupa objek.',
});

// Validate function for the data
function validateMessageSKPData(data: any) {
    const { error } = messageSKPSchema.validate(data, { abortEarly: false });
    if (error) {
        return error.details.map((err) => err.message);
    }
    return [];
}

// GET Endpoint: Fetch MessageSKP by ID
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    await dbConnect();

    try {
        const { id } = params;

        const messageSKP = await MessageSKP.findOne({ _id: id }).populate({
            path: 'skp',
            populate: {
                path: 'atasan',
            },
        });

        if (!messageSKP) {
            return NextResponse.json(createResponse(404, 'MessageSKP not found', null));
        }

        return NextResponse.json(createResponse(200, 'Success', messageSKP, true));
    } catch (error) {
        console.error('GET error:', error);
        return NextResponse.json({ error: 'Failed to fetch MessageSKP data' }, { status: 500 });
    }
}

// PUT Endpoint: Update MessageSKP by ID
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    await dbConnect();

    try {
        const { id } = params;
        const body = await req.json();
        const errors = validateMessageSKPData(body);
        if (errors.length > 0) {
            return NextResponse.json(createResponse(400, 'Failed', errors));
        }

        const updatedMessageSKP = await MessageSKP.findOneAndUpdate({ _id: id }, body, { new: true });

        if (!updatedMessageSKP) {
            return NextResponse.json(createResponse(404, 'MessageSKP not found', null));
        }

        return NextResponse.json(createResponse(200, 'Success', updatedMessageSKP, true));
    } catch (error) {
        console.error('PUT error:', error);
        return NextResponse.json({ error: 'Failed to update MessageSKP' }, { status: 500 });
    }
}

// DELETE Endpoint: Delete MessageSKP by ID
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    await dbConnect();

    try {
        const { id } = params;
        const deletedMessageSKP = await MessageSKP.findByIdAndDelete(id);
        if (!deletedMessageSKP) {
            return NextResponse.json(createResponse(404, 'MessageSKP not found', null));
        }

        // Perform any cascading delete or cleanup operations here
        // await deletedMessageSKP.deleteOne()

        return NextResponse.json(createResponse(200, 'Success', deletedMessageSKP, true));
    } catch (error) {
        console.error('DELETE error:', error);
        return NextResponse.json({ error: 'Failed to delete MessageSKP' }, { status: 500 });
    }
}
