import { NextRequest, NextResponse } from 'next/server';
import Joi from 'joi';
import dbConnect from '@/utils/db';
import { createResponse } from '@/utils/api';
import RHK from '@/models/RHK';

const rhkSchema = Joi.object({
    skp: Joi.string().required().label('SKP'),
    rhk: Joi.string().optional().label('RHK').allow(null),
    rkt: Joi.string().optional().label('RKT').allow(null),
    desc: Joi.string().required().label('Deskripsi'),
    jenis: Joi.string().valid('utama', 'tambahan', 'Utama', 'Tambahan').required().label('Jenis'),
    klasifikasi: Joi.string().valid('organisasi', 'individu', 'Organisasi', 'Individu').optional().label('Klasifikasi'),
    __v: Joi.optional(),
    posjab: Joi.string().label('Posjab'),
    _id: Joi.optional()
}).messages({
    'any.required': '{{#label}} wajib diisi.',
    'string.base': '{{#label}} harus berupa teks.',
    'string.empty': '{{#label}} tidak boleh kosong.',
    'string.valid': '{{#label}} harus salah satu dari {{#valids}}.'
});

function validateRHKData(data: any) {
    const { error } = rhkSchema.validate(data, { abortEarly: false });
    if (error) {
        return error.details.map((err) => err.message);
    }
    return [];
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    await dbConnect();

    try {
        const { id } = params;

        const rhk = await RHK.findById(id)
            .populate('aspek')
            .populate('rhk')
            .populate({
                path: 'harians',
                populate: {
                    path: 'rhk'
                }
            });

        return NextResponse.json(createResponse(200, 'Success', rhk, true));
    } catch (error) {
        console.error('GET error:', error);
        return NextResponse.json({ error: 'Failed to fetch RHK data' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    await dbConnect();

    try {
        const { id } = params;
        const body = await req.json();

        const errors = validateRHKData(body);
        if (errors.length > 0) {
            return NextResponse.json(createResponse(400, 'Failed', errors));
        }
        const updatedRHK = await RHK.findOneAndUpdate({ _id: id }, body, { new: true });

        if (!updatedRHK) {
            return NextResponse.json(createResponse(404, 'RHK not found', null));
        }

        return NextResponse.json(createResponse(200, 'Success', updatedRHK, true));
    } catch (error) {
        console.error('PUT error:', error);
        return NextResponse.json({ error: 'Failed to update RHK' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    await dbConnect();

    try {
        const { id } = params;

        const deletedRHK = await RHK.findById(id);
        if (!deletedRHK) {
            return NextResponse.json(createResponse(404, 'RHK not found', null));
        }

        deletedRHK.cascadeDelete();

        return NextResponse.json(createResponse(200, 'Success', deletedRHK, true));
    } catch (error) {
        console.error('DELETE error:', error);
        return NextResponse.json({ error: 'Failed to delete RHK' }, { status: 500 });
    }
}
