import { NextRequest, NextResponse } from 'next/server';
import FeedbackPerilaku from '@/models/FeedbackPerilaku'; // Sesuaikan path sesuai struktur proyek Anda
import Joi from 'joi';
import dbConnect from '@/utils/db';
import { createResponse } from '@/utils/api';
import getFilterQuery from '@/utils/getFilterQuery';

// Joi schema untuk validasi FeedbackPerilaku
const feedbackPerilakuSchema = Joi.object({
    penilai: Joi.string().hex().length(24).required().label('Penilai'), // ObjectId
    perilaku: Joi.string().hex().length(24).required().label('Perilaku'), // ObjectId
    periodePenilaian: Joi.string().hex().length(24).optional().label('Periode Penilaian'), // ObjectId
    isi: Joi.string().required().label('Isi'),
    like: Joi.boolean().optional().label('Like')
}).messages({
    'any.required': '{{#label}} wajib diisi.',
    'string.hex': '{{#label}} harus berupa nilai heksadesimal yang valid.',
    'string.length': '{{#label}} harus memiliki panjang tepat {{#limit}} karakter.'
});

// Validasi data FeedbackPerilaku
function validateFeedbackPerilakuData(data: any) {
    const { error } = feedbackPerilakuSchema.validate(data, { abortEarly: false });
    if (error) {
        return error.details.map((err) => err.message);
    }
    return [];
}

// GET: Mendapatkan data FeedbackPerilaku
export async function GET(req: NextRequest) {
    await dbConnect();

    try {
        const page = req.nextUrl.searchParams.get('page');
        const limit = req.nextUrl.searchParams.get('limit');
        const filters = req.nextUrl.searchParams.get('filters');
        let feedbacks;

  
            if (page === 'undefined' || limit === 'undefined') {
                feedbacks = await FeedbackPerilaku.find(getFilterQuery(filters)).populate('penilai perilaku periodePenilaian');
            } else {
                feedbacks = await FeedbackPerilaku.find(getFilterQuery(filters))
                    .skip((Number(page) - 1) * Number(limit))
                    .limit(Number(limit))
                    .populate('penilai perilaku periodePenilaian');
            }

        return NextResponse.json(createResponse(200, 'Success', feedbacks, true));
    } catch (error) {
        console.error('GET error:', error);
        return NextResponse.json({ error: 'Failed to fetch FeedbackPerilaku data' }, { status: 500 });
    }
}

// POST: Membuat FeedbackPerilaku baru
export async function POST(req: NextRequest) {
    await dbConnect();

    try {
        const body = await req.json();

        const errors = validateFeedbackPerilakuData(body);
        if (errors.length > 0) {
            return NextResponse.json(createResponse(400, 'Validation Error', errors));
        }

        const newFeedback = new FeedbackPerilaku(body);
        await newFeedback.save();
        return NextResponse.json(createResponse(201, 'Success', newFeedback, true));
    } catch (error) {
        console.error('POST error:', error);
        return NextResponse.json({ error: 'Failed to create FeedbackPerilaku' }, { status: 500 });
    }
}