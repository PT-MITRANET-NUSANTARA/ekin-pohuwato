import { NextRequest, NextResponse } from 'next/server';

import Joi from 'joi';
import dbConnect from '@/utils/db';
import { createResponse } from '@/utils/api';
import RencanaAksi from '@/models/RencanaAkse';

// Validation schema for RencanaAksi
const rencanaAksiSchema = Joi.object({
    isi: Joi.string().required().label('Isi Rencana Aksi'),
    skp: Joi.string().required().label('SKP'),
    periodePenilaian: Joi.string().required().label('Periode Penilaian'),
    target: Joi.string().required().label('Target'),
    __v: Joi.optional(),
    _id: Joi.optional(),
    createdAt: Joi.date().optional(),
    updatedAt: Joi.date().optional()
}).messages({
    'any.required': '{{#label}} wajib diisi.',
    'string.base': '{{#label}} harus berupa string.',
});

// Validate function for RencanaAksi data
function validateRencanaAksiData(data: any) {
    const { error } = rencanaAksiSchema.validate(data, { abortEarly: false });
    if (error) {
        return error.details.map((err) => err.message);
    }
    return [];
}

// GET route
export async function GET(req: NextRequest) {
    await dbConnect();

    try {
        let rencanaAksis;
        const id = req.nextUrl.searchParams.get('id');
        const page = req.nextUrl.searchParams.get('page');
        const limit = req.nextUrl.searchParams.get('limit');
        const filters = req.nextUrl.searchParams.get('filters');
        if (id) {
            rencanaAksis = await RencanaAksi.findOne({ _id: id }).populate(['skp', 'periodePenilaian']);
        } else {
            if (page === 'undefined' || limit === 'undefined') {
                rencanaAksis = await RencanaAksi.find({}).populate(['skp', 'periodePenilaian']);
            } else {
                rencanaAksis = await RencanaAksi.getAll(Number(page), Number(limit), JSON.parse(filters as string));
            }
        }

        return NextResponse.json(createResponse(200, 'Success', rencanaAksis, true));
    } catch (error) {
        console.error('GET error:', error);
        return NextResponse.json({ error: 'Failed to fetch Rencana Aksi data' }, { status: 500 });
    }
}

// POST route
export async function POST(req: NextRequest) {
    await dbConnect();

    try {
        const body = await req.json();

        const errors = validateRencanaAksiData(body);
        if (errors.length > 0) {
            return NextResponse.json(createResponse(400, 'Failed', errors));
        }

        const newRencanaAksi = new RencanaAksi(body);
        await newRencanaAksi.save();
        return NextResponse.json(createResponse(201, 'Success', newRencanaAksi, true));
    } catch (error) {
        console.error('POST error:', error);
        return NextResponse.json({ error: 'Failed to create Rencana Aksi' }, { status: 500 });
    }
}

// PUT route
export async function PUT(req: NextRequest) {
    await dbConnect();

    try {
        const body = await req.json();
        const id = req.nextUrl.searchParams.get('id');
        if (!id || typeof id !== 'string') {
            return NextResponse.json(createResponse(400, 'Invalid or missing ID', null));
        }

        const errors = validateRencanaAksiData(body);
        if (errors.length > 0) {
            return NextResponse.json(createResponse(400, 'Failed', errors));
        }

        const updatedRencanaAksi = await RencanaAksi.findOneAndUpdate({ _id: id }, body, { new: true });

        if (!updatedRencanaAksi) {
            return NextResponse.json(createResponse(404, 'Rencana Aksi not found', null));
        }

        return NextResponse.json(createResponse(200, 'Success', updatedRencanaAksi, true));
    } catch (error) {
        console.error('PUT error:', error);
        return NextResponse.json({ error: 'Failed to update Rencana Aksi' }, { status: 500 });
    }
}

// DELETE route
export async function DELETE(req: NextRequest) {
    await dbConnect();

    try {
        const id = req.nextUrl.searchParams.get('id');

        if (!id || typeof id !== 'string') {
            return NextResponse.json(createResponse(400, 'Invalid or missing ID', null));
        }

        const deletedRencanaAksi = await RencanaAksi.findById(id);
        if (!deletedRencanaAksi) {
            return NextResponse.json(createResponse(404, 'Rencana Aksi not found', null));
        }

        await deletedRencanaAksi.cascadeDelete();

        return NextResponse.json(createResponse(200, 'Success', deletedRencanaAksi, true));
    } catch (error) {
        console.error('DELETE error:', error);
        return NextResponse.json(createResponse(500, 'Failed to delete Rencana Aksi', null, false));
    }
}
