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

// GET all Visi
export async function GET(req: NextRequest) {
    await dbConnect();
    try {
        const page = req.nextUrl.searchParams.get('page');
        const limit = req.nextUrl.searchParams.get('limit');
        const filters = req.nextUrl.searchParams.get('filters');

        let visis;
        if (!(page && limit) || (page === 'undefined' || limit === 'undefined')) {
            visis = await Visi.find({}).populate('periode');
        } else {
            visis = await Visi.getAll(Number(page), Number(limit), JSON.parse(filters as string));
        }

        return NextResponse.json(createResponse(200, 'Success', visis, true));
    } catch (error) {
        console.error('GET error:', error);
        return NextResponse.json({ error: 'Failed to fetch Visi data' }, { status: 500 });
    }
}

// POST a new Visi
export async function POST(req: NextRequest) {
    await dbConnect();
    try {
        const body = await req.json();
        const errors = validateVisiData(body);
        if (errors.length > 0) {
            return NextResponse.json(createResponse(400, 'Failed', errors));
        }

        const newVisi = new Visi(body);
        await newVisi.save();
        return NextResponse.json(createResponse(201, 'Success', newVisi, true));
    } catch (error) {
        console.error('POST error:', error);
        return NextResponse.json({ error: 'Failed to create Visi' }, { status: 500 });
    }
}
