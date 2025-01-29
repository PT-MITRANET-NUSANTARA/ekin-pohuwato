import { NextRequest, NextResponse } from 'next/server';
import FeedbackRHK from '@/models/FeedbackRHK'; // Sesuaikan path sesuai struktur proyek Anda
import Joi from 'joi';
import dbConnect from '@/utils/db';
import { createResponse } from '@/utils/api';
import getFilterQuery from '@/utils/getFilterQuery';

// Joi schema untuk validasi FeedbackRHK
const feedbackRHKSchema = Joi.object({
    penilai: Joi.string().hex().length(24).required().label('Penilai'), // ObjectId
    rhk: Joi.string().hex().length(24).required().label('RHK'), // ObjectId
    periodePenilaian: Joi.string().hex().length(24).optional().label('Periode Penilaian'), // ObjectId
    isi: Joi.string().required().label('Isi'),
    like: Joi.boolean().optional().label('Like')
}).messages({
    'any.required': '{{#label}} wajib diisi.',
    'string.hex': '{{#label}} harus berupa nilai heksadesimal yang valid.',
    'string.length': '{{#label}} harus memiliki panjang tepat {{#limit}} karakter.'
});

// Validasi data FeedbackRHK
function validateFeedbackRHKData(data: any) {
    const { error } = feedbackRHKSchema.validate(data, { abortEarly: false });
    if (error) {
        return error.details.map((err) => err.message);
    }
    return [];
}

// GET: Mendapatkan data FeedbackRHK
export async function GET(req: NextRequest) {
    await dbConnect();

    try {
        const page = req.nextUrl.searchParams.get('page');
        const limit = req.nextUrl.searchParams.get('limit');
        const filters = req.nextUrl.searchParams.get('filters');
        let feedbacks;

        
            if (page === 'undefined' || limit === 'undefined') {
                feedbacks = await FeedbackRHK.find(getFilterQuery(filters)).populate('penilai rhk periodePenilaian');
            } else {
                feedbacks = await FeedbackRHK.find(getFilterQuery(filters))
                    .skip((Number(page) - 1) * Number(limit))
                    .limit(Number(limit))
                    .populate('penilai rhk periodePenilaian');
            }

        return NextResponse.json(createResponse(200, 'Success', feedbacks, true));
    } catch (error) {
        console.error('GET error:', error);
        return NextResponse.json({ error: 'Failed to fetch FeedbackRHK data' }, { status: 500 });
    }
}

// POST: Membuat FeedbackRHK baru
export async function POST(req: NextRequest) {
    await dbConnect();

    try {
        const body = await req.json();

        const errors = validateFeedbackRHKData(body);
        if (errors.length > 0) {
            return NextResponse.json(createResponse(400, 'Validation Error', errors));
        }

        const newFeedback = new FeedbackRHK(body);
        await newFeedback.save();
        return NextResponse.json(createResponse(201, 'Success', newFeedback, true));
    } catch (error) {
        console.error('POST error:', error);
        return NextResponse.json({ error: 'Failed to create FeedbackRHK' }, { status: 500 });
    }
}