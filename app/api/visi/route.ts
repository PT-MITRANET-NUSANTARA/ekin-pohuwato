import { NextRequest, NextResponse } from 'next/server';
import Visi from '../../../models/Visi';

import Joi from 'joi';
import dbConnect from '@/utils/db';
import { createResponse } from '@/utils/api';


const visiSchema = Joi.object({
    name: Joi.string().required().label('Nama Visi'),
    periode: Joi.string().hex().length(24).required().label('Periode'), // Expecting a string ObjectId
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

// Function to validate Visi data
function validateVisiData(data: any) {
    const { error } = visiSchema.validate(data, { abortEarly: false });
    if (error) {
        return error.details.map((err) => err.message);
    }
    return [];
}

// GET method to fetch Visi data
export async function GET(req: NextRequest) {
    await dbConnect();

    try {
        const id = req.nextUrl.searchParams.get('id');
        const page = req.nextUrl.searchParams.get('page');
        const limit = req.nextUrl.searchParams.get('limit');
        const filters = req.nextUrl.searchParams.get('filters');
        let visis;
        
        if (id) {
            visis = await Visi.findOne({ _id: id }).populate('periode'); // Populate the periode reference
        } else {
            if (page === 'undefined' || limit === 'undefined') {
                visis = await Visi.find({}).populate('periode'); // Populate the periode reference
            } else {
                visis = await Visi.getAll(Number(page), Number(limit), JSON.parse(filters as string));
            }
        }

        return NextResponse.json(createResponse(200, 'Success', visis, true));
    } catch (error) {
        console.error('GET error:', error);
        return NextResponse.json({ error: 'Failed to fetch Visi data' }, { status: 500 });
    }
}

// POST method to create a new Visi record
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

// PUT method to update an existing Visi record
export async function PUT(req: NextRequest) {
    await dbConnect();

    try {
        const body = await req.json();
        const id = req.nextUrl.searchParams.get('id');
        if (!id || typeof id !== 'string') {
            return NextResponse.json(createResponse(400, 'Invalid or missing ID', null));
        }

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

// DELETE method to remove an existing Visi record
export async function DELETE(req: NextRequest) {
    await dbConnect();

    try {
        const id = req.nextUrl.searchParams.get('id');
        if (!id || typeof id !== 'string') {
            return NextResponse.json(createResponse(400, 'Invalid or missing ID', null));
        }

        const deletedVisi = await Visi.findById(id);
        if (!deletedVisi) {
            return NextResponse.json(createResponse(404, 'Visi not found', null));
        }

        await deletedVisi.cascadeDelete();

        return NextResponse.json(createResponse(200, 'Success', deletedVisi, true));
    } catch (error) {
        console.error('DELETE error:', error);
        return NextResponse.json({ error: 'Failed to delete Visi' }, { status: 500 });
    }
}
