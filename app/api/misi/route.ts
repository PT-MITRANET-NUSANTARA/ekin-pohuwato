import { NextRequest, NextResponse } from 'next/server';

import Joi from 'joi';
import dbConnect from '@/utils/db';
import { createResponse } from '@/utils/api';
import Misi from '@/models/Misi';
import getFilterQuery from '@/utils/getFilterQuery';

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
export async function GET(req: NextRequest) {
    await dbConnect();

    try {
        const page = req.nextUrl.searchParams.get('page');
        const limit = req.nextUrl.searchParams.get('limit');
        const filters = req.nextUrl.searchParams.get('filters');
        
        let misis;

        if (!(page && limit) || page === 'undefined' || limit === 'undefined') {
            misis = await Misi.find(getFilterQuery(filters)).populate('visi'); // Populate the visi reference
        } else {
            misis = await Misi.getAll(Number(page), Number(limit), JSON.parse(filters as string));
        }

        return NextResponse.json(createResponse(200, 'Success', misis, true));
    } catch (error) {
        console.error('GET error:', error);
        return NextResponse.json({ error: 'Failed to fetch Misi data' }, { status: 500 });
    }
}

// POST method to create a new Misi record
export async function POST(req: NextRequest) {
    await dbConnect();

    try {
        const body = await req.json();

        const errors = validateMisiData(body);
        if (errors.length > 0) {
            return NextResponse.json(createResponse(400, 'Failed', errors));
        }

        const newMisi = new Misi(body);
        await newMisi.save();
        return NextResponse.json(createResponse(201, 'Success', newMisi, true));
    } catch (error) {
        console.error('POST error:', error);
        return NextResponse.json({ error: 'Failed to create Misi' }, { status: 500 });
    }
}