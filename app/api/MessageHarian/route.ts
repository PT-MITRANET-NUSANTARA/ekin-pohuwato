import { NextRequest, NextResponse } from 'next/server';
import MessageHarian from '../../../models/MessageHarian';
import Joi from 'joi';
import dbConnect from '@/utils/db';
import { createResponse } from '@/utils/api';
import getFilterQuery from '@/utils/getFilterQuery';

// Joi Schema for MessageHarian validation
const messageHarianSchema = Joi.object({
    harian: Joi.string().hex().length(24).required().label('Harian'), // Expected ObjectId as a string
    messageHarian: Joi.string().hex().length(24).required().label('MessageHarian'), // Expected ObjectId as a string
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

// Function to validate MessageHarian data
function validateMessageHarianData(data: any) {
    const { error } = messageHarianSchema.validate(data, { abortEarly: false });
    if (error) {
        return error.details.map((err) => err.message);
    }
    return [];
}

// GET Endpoint: Fetch all MessageHarian with filters, pagination
export async function GET(req: NextRequest) {
    await dbConnect();

    try {
        const page = req.nextUrl.searchParams.get('page');
        const limit = req.nextUrl.searchParams.get('limit');
        const filters = req.nextUrl.searchParams.get('filters');
        let messagesHarian;

        if (!(page && limit) || page === 'undefined' || limit === 'undefined') {
            messagesHarian = await MessageHarian.find(getFilterQuery(filters)).populate({
                path: 'harian',
                populate: {
                    path: 'messageHarian',
                },
            });
        } else {
            messagesHarian = await MessageHarian.find(getFilterQuery(filters))
                .skip(Number(page) * Number(limit) - Number(limit))
                .limit(Number(limit));
        }

        return NextResponse.json(createResponse(200, 'Success', messagesHarian, true));
    } catch (error) {
        console.error('GET error:', error);
        return NextResponse.json({ error: 'Failed to fetch MessageHarian data' }, { status: 500 });
    }
}

// POST Endpoint: Create a new MessageHarian
export async function POST(req: NextRequest) {
    await dbConnect();

    try {
        const body = await req.json();

        const errors = validateMessageHarianData(body);
        if (errors.length > 0) {
            return NextResponse.json(createResponse(400, 'Failed', errors));
        }

        const newMessageHarian = new MessageHarian(body);
        await newMessageHarian.save();
        return NextResponse.json(createResponse(201, 'Success', newMessageHarian, true));
    } catch (error) {
        console.error('POST error:', error);
        return NextResponse.json({ error: 'Failed to create MessageHarian' }, { status: 500 });
    }
}

// PUT Endpoint: Update MessageHarian by ID
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    await dbConnect();

    try {
        const { id } = params;
        const body = await req.json();

        const errors = validateMessageHarianData(body);
        if (errors.length > 0) {
            return NextResponse.json(createResponse(400, 'Failed', errors));
        }

        const updatedMessageHarian = await MessageHarian.findOneAndUpdate({ _id: id }, body, { new: true });

        if (!updatedMessageHarian) {
            return NextResponse.json(createResponse(404, 'MessageHarian not found', null));
        }

        return NextResponse.json(createResponse(200, 'Success', updatedMessageHarian, true));
    } catch (error) {
        console.error('PUT error:', error);
        return NextResponse.json({ error: 'Failed to update MessageHarian' }, { status: 500 });
    }
}

// DELETE Endpoint: Delete MessageHarian by ID
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    await dbConnect();

    try {
        const { id } = params;
        const deletedMessageHarian = await MessageHarian.findById(id);

        if (!deletedMessageHarian) {
            return NextResponse.json(createResponse(404, 'MessageHarian not found', null));
        }

        // Perform any cascading delete or cleanup operations here
        await deletedMessageHarian.deleteOne();

        return NextResponse.json(createResponse(200, 'Success', deletedMessageHarian, true));
    } catch (error) {
        console.error('DELETE error:', error);
        return NextResponse.json({ error: 'Failed to delete MessageHarian' }, { status: 500 });
    }
}
