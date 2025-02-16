import { NextRequest, NextResponse } from 'next/server';
import TPP from '../../../models/TPP';
import Joi from 'joi';
import dbConnect from '@/utils/db';
import { createResponse } from '@/utils/api';

// Joi schema for validation
const tppSchema = Joi.object({
    user_id: Joi.string().required().label('User ID'),
    jabatan: Joi.object().required().label('Jabatan'),
    status: Joi.boolean().required().label('Status'),
    unit: Joi.object().required().label('Unit'),
    periodeRKT: Joi.string().hex().length(24).required().label('PeriodeRKT'),
    date: Joi.date().required().label('Date')
}).messages({
    'any.required': '{{#label}} wajib diisi.',
    'string.base': '{{#label}} harus berupa teks.',
    'string.empty': '{{#label}} tidak boleh kosong.',
    'boolean.base': '{{#label}} harus berupa nilai benar atau salah.',
    'string.hex': '{{#label}} harus berupa nilai heksadesimal.',
    'string.length': '{{#label}} harus memiliki panjang tepat {{#limit}} karakter.'
});

function validateTPPData(data: any) {
    const { error } = tppSchema.validate(data, { abortEarly: false });
    if (error) {
        return error.details.map((err) => err.message);
    }
    return [];
}

// GET route to fetch TPP data
export async function GET(req: NextRequest) {
    await dbConnect();

    try {
        const user_id = req.headers.get('user-id');
        const unit_id = req.headers.get('unit-id');
        const periodeRKT = req.headers.get('periodeRKT');
        const id = req.nextUrl.searchParams.get('id');
        const page = req.nextUrl.searchParams.get('page');
        const limit = req.nextUrl.searchParams.get('limit');
        const filters = req.nextUrl.searchParams.get('filters');
        let tpps;

        if (id) {
            tpps = await TPP.findOne({ _id: id }).populate('periodeRKT');
        } else if (user_id && periodeRKT) {
            tpps = await TPP.findOne({ user_id, periodeRKT }).populate('periodeRKT');
        } else if (user_id) {
            tpps = await TPP.find({ user_id }).populate('periodeRKT');
        }
        else if(unit_id) {
            tpps = await TPP.find({ 'unit.induk.id': unit_id }).populate('periodeRKT');
        }
        else {
            if (page === 'undefined' || limit === 'undefined') {
                tpps = await TPP.find({}).populate('periodeRKT');
            } else {
                tpps = await TPP.getAll(Number(page), Number(limit), JSON.parse(filters as string));
            }
        }

        return NextResponse.json(createResponse(200, 'Success', tpps, true));
    } catch (error) {
        console.error('GET error:', error);
        return NextResponse.json({ error: 'Failed to fetch TPP data' }, { status: 500 });
    }
}

// POST route to create a new TPP record
export async function POST(req: NextRequest) {
    await dbConnect();

    try {
        const body = await req.json();
        const errors = validateTPPData(body);

        if (errors.length > 0) {
            return NextResponse.json(createResponse(400, 'Validation Failed', errors));
        }

        const newTPP = new TPP(body);
        await newTPP.save();

        return NextResponse.json(createResponse(201, 'Success', newTPP, true));
    } catch (error) {
        console.error('POST error:', error);
        return NextResponse.json({ error: 'Failed to create TPP' }, { status: 500 });
    }
}

// PUT route to update a TPP record
export async function PUT(req: NextRequest) {
    await dbConnect();

    try {
        const id = req.nextUrl.searchParams.get('id');
        const body = await req.json();

        if (!id || typeof id !== 'string') {
            return NextResponse.json(createResponse(400, 'Invalid or missing ID', null));
        }

        const errors = validateTPPData(body);
        if (errors.length > 0) {
            return NextResponse.json(createResponse(400, 'Validation Failed', errors));
        }

        const updatedTPP = await TPP.findOneAndUpdate({ _id: id }, body, { new: true });

        if (!updatedTPP) {
            return NextResponse.json(createResponse(404, 'TPP not found', null));
        }

        return NextResponse.json(createResponse(200, 'Success', updatedTPP, true));
    } catch (error) {
        console.error('PUT error:', error);
        return NextResponse.json({ error: 'Failed to update TPP' }, { status: 500 });
    }
}

// DELETE route to delete a TPP record
export async function DELETE(req: NextRequest) {
    await dbConnect();

    try {
        const id = req.nextUrl.searchParams.get('id');

        if (!id || typeof id !== 'string') {
            return NextResponse.json(createResponse(400, 'Invalid or missing ID', null));
        }

        const deletedTPP = await TPP.findById(id);

        if (!deletedTPP) {
            return NextResponse.json(createResponse(404, 'TPP not found', null));
        }

        deletedTPP.cascadeDelete();

        return NextResponse.json(createResponse(200, 'Success', deletedTPP, true));
    } catch (error) {
        console.error('DELETE error:', error);
        return NextResponse.json({ error: 'Failed to delete TPP' }, { status: 500 });
    }
}
