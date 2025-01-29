import { NextRequest, NextResponse } from 'next/server';
import FeedbackPerilaku from '@/models/FeedbackPerilaku'; // Sesuaikan path sesuai struktur proyek Anda
import Joi from 'joi';
import dbConnect from '@/utils/db';
import { createResponse } from '@/utils/api';

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
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    await dbConnect();

    try {
        const { id } = params;

        let feedbacks;

        feedbacks = await FeedbackPerilaku.findById(id).populate('penilai perilaku periodePenilaian');

        return NextResponse.json(createResponse(200, 'Success', feedbacks, true));
    } catch (error) {
        console.error('GET error:', error);
        return NextResponse.json({ error: 'Failed to fetch FeedbackPerilaku data' }, { status: 500 });
    }
}

// PUT: Mengupdate FeedbackPerilaku
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {

    await dbConnect();

    try {
        const { id } = params;
        const body = await req.json();
        const errors = validateFeedbackPerilakuData(body);
        if (errors.length > 0) {
            return NextResponse.json(createResponse(400, 'Validation Error', errors));
        }

        const updatedFeedback = await FeedbackPerilaku.findOneAndUpdate({ _id: id }, body, { new: true });

        if (!updatedFeedback) {
            return NextResponse.json(createResponse(404, 'FeedbackPerilaku not found', null));
        }

        return NextResponse.json(createResponse(200, 'Success', updatedFeedback, true));
    } catch (error) {
        console.error('PUT error:', error);
        return NextResponse.json({ error: 'Failed to update FeedbackPerilaku' }, { status: 500 });
    }
}

// DELETE: Menghapus FeedbackPerilaku
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {

    await dbConnect();

    try {
        const { id } = params;
        const deletedFeedback = await FeedbackPerilaku.findByIdAndDelete(id);
        if (!deletedFeedback) {
            return NextResponse.json(createResponse(404, 'FeedbackPerilaku not found', null));
        }

        return NextResponse.json(createResponse(200, 'Success', deletedFeedback, true));
    } catch (error) {
        console.error('DELETE error:', error);
        return NextResponse.json({ error: 'Failed to delete FeedbackPerilaku' }, { status: 500 });
    }
}
