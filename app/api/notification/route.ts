import { NextRequest, NextResponse } from 'next/server';
import Notification from '@/models/Notification';
import Joi from 'joi';
import dbConnect from '@/utils/db';
import { createResponse } from '@/utils/api';

const notificationSchema = Joi.object({
    user_id: Joi.string().required().label('User ID'),
    message: Joi.string().required().label('Pesan Notifikasi'),
    type: Joi.string().valid('info', 'warning', 'error', 'success').default('info').label('Tipe Notifikasi'),
    read: Joi.boolean().default(false).label('Status Baca'),
    createdAt: Joi.date().optional(),
    updatedAt: Joi.date().optional()
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

// GET all notifications for a user
export async function GET(req: NextRequest) {
    await dbConnect();
    try {
        const userId = req.nextUrl.searchParams.get('userId');

        if (!userId) {
            return NextResponse.json(createResponse(400, 'Failed', ['User ID wajib diisi']));
        }

        const notifications = await Notification.find({ user_id: userId });

        return NextResponse.json(createResponse(200, 'Success', notifications, true));
    } catch (error) {
        console.error('GET error:', error);
        return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
    }
}

// POST a new notification
export async function POST(req: NextRequest) {
    await dbConnect();
    try {
        const body = await req.json();
        const errors = validateNotificationData(body);
        if (errors.length > 0) {
            return NextResponse.json(createResponse(400, 'Failed', errors));
        }

        const newNotification = new Notification(body);
        await newNotification.save();
        return NextResponse.json(createResponse(201, 'Success', newNotification, true));
    } catch (error) {
        console.error('POST error:', error);
        return NextResponse.json({ error: 'Failed to create notification' }, { status: 500 });
    }
}
