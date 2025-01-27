import { NextRequest, NextResponse } from 'next/server';
import Visi from '@/models/Visi';
import Joi from 'joi';
import dbConnect from '@/utils/db';
import { createResponse } from '@/utils/api';

const visiSchema = Joi.object({
    name: Joi.string().required().label('Nama Visi'),
    // periode: Joi.string().hex().length(24).required().label('Periode'),
    __v: Joi.optional(),
    _id: Joi.optional(),
    createdAt: Joi.date().optional(),
    updatedAt: Joi.date().optional()
}).messages({
    'any.required': '{{#label}} wajib diisi.',
    'string.base': '{{#label}} harus berupa teks.',
    'string.empty': '{{#label}} tidak boleh kosong.',
    'string.hex': '{{#label}} harus berupa nilai heksadesimal yang valid.',
    'string.length': '{{#label}} harus memiliki panjang tepat {{#limit}} karakter.'
});

function validateVisiData(data: any) {
    const { error } = visiSchema.validate(data, { abortEarly: false });
    return error ? error.details.map((err) => err.message) : [];
}

// GET single Visi
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    await dbConnect();
    try {
        const { id } = params;
        const visi = await Visi.findOne({ _id: id }).populate('periode');

        if (!visi) {
            return NextResponse.json(createResponse(404, 'Visi not found', null));
        }

        return NextResponse.json(createResponse(200, 'Success', visi, true));
    } catch (error) {
        console.error('GET error:', error);
        return NextResponse.json({ error: 'Failed to fetch Visi data' }, { status: 500 });
    }
}

// PUT update Visi
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    await dbConnect();
    try {
        const { id } = params;
        const body = await req.json();
        const errors = validateVisiData(body);

        if (errors.length > 0) {
            return NextResponse.json(createResponse(400, 'Failed', errors));
        }

        const updatedVisi = await Visi.findOneAndUpdate({ _id: id }, body, { new: true });

        if (!updatedVisi) {
            return NextResponse.json(createResponse(404, 'Visi not found', null));
        }

        return NextResponse.json(createResponse(200, 'Success', updatedVisi, true));
    } catch (error) {
        console.error('PUT error:', error);
        return NextResponse.json({ error: 'Failed to update Visi' }, { status: 500 });
    }
}

// DELETE a Visi
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    await dbConnect();
    try {
        const { id } = params;
        const deletedVisi = await Visi.findById(id);

        if (!deletedVisi) {
            return NextResponse.json(createResponse(404, 'Visi not found', null));
        }

        await deletedVisi.cascadeDelete();
        return NextResponse.json(createResponse(200, 'Success', deletedVisi, true));
    } catch (error) {
        console.error('DELETE error:', error);
        return NextResponse.json(createResponse(500, 'Failed to delete Visi', null, false));
    }
}
