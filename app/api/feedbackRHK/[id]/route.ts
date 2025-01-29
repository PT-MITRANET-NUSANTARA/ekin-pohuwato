import { NextRequest, NextResponse } from 'next/server';
import FeedbackRHK from '@/models/FeedbackRHK'; // Sesuaikan path sesuai struktur proyek Anda
import Joi from 'joi';
import dbConnect from '@/utils/db';
import { createResponse } from '@/utils/api';

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
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    await dbConnect();

    try {
        const { id } = params;

        let feedbacks;
        feedbacks = await FeedbackRHK.findById(id).populate('penilai rhk periodePenilaian');

        return NextResponse.json(createResponse(200, 'Success', feedbacks, true));
    } catch (error) {
        console.error('GET error:', error);
        return NextResponse.json({ error: 'Failed to fetch FeedbackRHK data' }, { status: 500 });
    }
}

// PUT: Mengupdate FeedbackRHK
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    await dbConnect();

    try {
        const { id } = params;
        const body = await req.json();

        const errors = validateFeedbackRHKData(body);
        if (errors.length > 0) {
            return NextResponse.json(createResponse(400, 'Validation Error', errors));
        }

        const updatedFeedback = await FeedbackRHK.findOneAndUpdate({ _id: id }, body, { new: true });

        if (!updatedFeedback) {
            return NextResponse.json(createResponse(404, 'FeedbackRHK not found', null));
        }

        return NextResponse.json(createResponse(200, 'Success', updatedFeedback, true));
    } catch (error) {
        console.error('PUT error:', error);
        return NextResponse.json({ error: 'Failed to update FeedbackRHK' }, { status: 500 });
    }
}

// DELETE: Menghapus FeedbackRHK
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    await dbConnect();

    try {
        const { id } = params;

        const deletedFeedback = await FeedbackRHK.findByIdAndDelete(id);
        if (!deletedFeedback) {
            return NextResponse.json(createResponse(404, 'FeedbackRHK not found', null));
        }

        return NextResponse.json(createResponse(200, 'Success', deletedFeedback, true));
    } catch (error) {
        console.error('DELETE error:', error);
        return NextResponse.json({ error: 'Failed to delete FeedbackRHK' }, { status: 500 });
    }
}
