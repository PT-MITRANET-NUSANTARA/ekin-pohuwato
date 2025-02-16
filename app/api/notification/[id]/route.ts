import { NextRequest, NextResponse } from 'next/server';
import Notification from '@/models/Notification';
import Joi from 'joi';
import dbConnect from '@/utils/db';
import { createResponse } from '@/utils/api';

const notificationSchema = Joi.object({
    user_id: Joi.string().required().label('User ID'),
    message: Joi.string().required().label('Pesan Notifikasi'),
    type: Joi.string()
        .valid('info', 'warning', 'error', 'success')
        .default('info')
        .label('Tipe Notifikasi'),
    read: Joi.boolean().default(false).label('Status Baca'),
    createdAt: Joi.date().optional(),
    updatedAt: Joi.date().optional(),
    _id: Joi.optional(),
    __v: Joi.optional(),
}).messages({
    'any.required': '{{#label}} wajib diisi.',
    'string.base': '{{#label}} harus berupa teks.',
    'string.empty': '{{#label}} tidak boleh kosong.',
    'string.valid': '{{#label}} harus bernilai salah satu dari: info, warning, error, success.'
});

function validateNotificationData(data: any) {
    const { error } = notificationSchema.validate(data, { abortEarly: false });
    return error ? error.details.map((err) => err.message) : [];
}

// GET single Notification
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    await dbConnect();
    try {
        const { id } = params;
        const notification = await Notification.findOne({ _id: id });

        if (!notification) {
            return NextResponse.json(createResponse(404, 'Notification not found', null));
        }

        return NextResponse.json(createResponse(200, 'Success', notification, true));
    } catch (error) {
        console.error('GET error:', error);
        return NextResponse.json({ error: 'Failed to fetch notification' }, { status: 500 });
    }
}

// PUT update Notification
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    await dbConnect();
    try {
        const { id } = params;
        const body = await req.json();
        const errors = validateNotificationData(body);

        if (errors.length > 0) {
            return NextResponse.json(createResponse(400, 'Failed', errors));
        }

        const updatedNotification = await Notification.findOneAndUpdate({ _id: id }, body, { new: true });

        if (!updatedNotification) {
            return NextResponse.json(createResponse(404, 'Notification not found', null));
        }

        return NextResponse.json(createResponse(200, 'Success', updatedNotification, true));
    } catch (error) {
        console.error('PUT error:', error);
        return NextResponse.json({ error: 'Failed to update notification' }, { status: 500 });
    }
}

// DELETE a Notification
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    await dbConnect();
    try {
        const { id } = params;
        const deletedNotification = await Notification.findById(id);

        if (!deletedNotification) {
            return NextResponse.json(createResponse(404, 'Notification not found', null));
        }

        await deletedNotification.deleteOne();
        return NextResponse.json(createResponse(200, 'Success', deletedNotification, true));
    } catch (error) {
        console.error('DELETE error:', error);
        return NextResponse.json(createResponse(500, 'Failed to delete notification', null, false));
    }
}
