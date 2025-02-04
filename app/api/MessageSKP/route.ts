import { NextRequest, NextResponse } from 'next/server';
import MessageSKP from '../../../models/MessageSKP';
import Joi from 'joi';
import dbConnect from '@/utils/db';
import { createResponse } from '@/utils/api';
import getFilterQuery from '@/utils/getFilterQuery';

// Joi Schema for MessageSKP validation
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

function validateMessageSKPData(data: any) {
    const { error } = messageSKPSchema.validate(data, { abortEarly: false });
    if (error) {
        return error.details.map((err) => err.message);
    }
    return [];
}

export async function GET(req: NextRequest) {
    await dbConnect();

    try {
        const page = req.nextUrl.searchParams.get('page');
        const limit = req.nextUrl.searchParams.get('limit');
        const filters = req.nextUrl.searchParams.get('filters');
        let messagesSKP;

        if (!(page && limit) || page === 'undefined' || limit === 'undefined') {
            messagesSKP = await MessageSKP.find(getFilterQuery(filters)).populate({
                path: 'skp',
                populate: {
                    path: 'atasan',
                },
            });
        } else {
            messagesSKP = await MessageSKP.find(getFilterQuery(filters))
                .skip(Number(page) * Number(limit) - Number(limit))
                .limit(Number(limit));
        }

        return NextResponse.json(createResponse(200, 'Success', messagesSKP, true));
    } catch (error) {
        console.error('GET error:', error);
        return NextResponse.json({ error: 'Failed to fetch MessageSKP data' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    await dbConnect();

    try {
        const body = await req.json();

        const errors = validateMessageSKPData(body);
        if (errors.length > 0) {
            return NextResponse.json(createResponse(400, 'Failed', errors));
        }

        const newMessageSKP = new MessageSKP(body);
        await newMessageSKP.save();
        return NextResponse.json(createResponse(201, 'Success', newMessageSKP, true));
    } catch (error) {
        console.error('POST error:', error);
        return NextResponse.json({ error: 'Failed to create MessageSKP' }, { status: 500 });
    }
}
