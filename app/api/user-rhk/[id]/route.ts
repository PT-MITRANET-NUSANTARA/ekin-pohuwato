import { NextRequest, NextResponse } from 'next/server';
import UserRHK, { Status } from '@/models/UserRHK';
import Joi from 'joi';
import dbConnect from '@/utils/db';
import { createResponse } from '@/utils/api';

const userRHKSchema = Joi.object({
    user: Joi.string().required().label('User'),
    description: Joi.string().optional().label('Description'),
    status: Joi.string().valid(...Object.values(Status)).optional().label('Status'),
    rkt: Joi.string().optional().label('RKT').allow(null),
    skp: Joi.string().required().label('SKP'),
    jenis: Joi.string().valid('utama', 'tambahan').required().label('Jenis'),
    klasifikasi: Joi.string().valid('organisasi', 'individu').optional().label('Klasifikasi'),
    posjab: Joi.string().required().label('Position/Jabatan'),
    __v: Joi.optional(),
    _id: Joi.optional(),
}).messages({
    'any.required': '{{#label}} wajib diisi.',
    'string.base': '{{#label}} harus berupa teks.',
    'string.empty': '{{#label}} tidak boleh kosong.',
    'string.valid': '{{#label}} harus salah satu dari {{#valids}}.'
});

function validateUserRHKData(data: any) {
    const { error } = userRHKSchema.validate(data, { abortEarly: false });
    if (error) {
        return error.details.map((err) => err.message);
    }
    return [];
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    await dbConnect();

    try {
        const id = params.id;
        const userRHK = await UserRHK.findById(id).populate('childRHKs');

        if (!userRHK) {
            return NextResponse.json(createResponse(404, 'UserRHK not found', null));
        }

        return NextResponse.json(createResponse(200, 'Success', userRHK, true));
    } catch (error) {
        console.error('GET error:', error);
        return NextResponse.json(createResponse(500, 'Failed to fetch UserRHK', error));
    }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    await dbConnect();

    try {
        const id = params.id;
        const body = await req.json();

        const errors = validateUserRHKData(body);

        if (errors.length > 0) {
            return NextResponse.json(createResponse(400, 'Failed', errors));
        }

        const userRHK = await UserRHK.findByIdAndUpdate(id, body, { new: true });

        if (!userRHK) {
            return NextResponse.json(createResponse(404, 'UserRHK not found', null));
        }

        return NextResponse.json(createResponse(200, 'Success', userRHK, true));
    } catch (error) {
        console.error('PUT error:', error);
        return NextResponse.json(createResponse(500, 'Failed to update UserRHK', error));
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    await dbConnect();

    try {
        const id = params.id;
        const userRHK = await UserRHK.findById(id);

        if (!userRHK) {
            return NextResponse.json(createResponse(404, 'UserRHK not found', null));
        }

        // Use the cascadeDelete method to also delete related RHKs
        await userRHK.cascadeDelete();

        return NextResponse.json(createResponse(200, 'Success', null, true));
    } catch (error) {
        console.error('DELETE error:', error);
        return NextResponse.json(createResponse(500, 'Failed to delete UserRHK', error));
    }
} 