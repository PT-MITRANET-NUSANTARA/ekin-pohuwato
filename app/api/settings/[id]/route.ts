import { NextRequest, NextResponse } from 'next/server';
import { serialize } from 'cookie';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { createResponse } from '@/utils/api';
import { getByNIP } from '@/controller/IDSN/JabatanController';
import Settings from '@/models/Settings';
import dbConnect from '@/utils/db';

export async function GET(req: NextRequest) {
    await dbConnect();

    try {
        const settings = await Settings.findOne();
        return NextResponse.json(createResponse(200, 'Success', settings));
    } catch (error) {
        console.error('GET error:', error);
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}

// PUT update Visi
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    await dbConnect();
    try {
        const { id } = params;
        const body = await req.json();
        // const errors = validateVisiData(body);

        // if (errors.length > 0) {
        //     return NextResponse.json(createResponse(400, 'Failed', errors));
        // }
        
        const updateSettings = await Settings.findOneAndUpdate({ _id: id }, body, { new: true });

        if (!updateSettings) {
            return NextResponse.json(createResponse(404, 'Visi not found', null));
        }

        return NextResponse.json(createResponse(200, 'Success', updateSettings, true));
    } catch (error) {
        console.error('PUT error:', error);
        return NextResponse.json({ error: 'Failed to update Visi' }, { status: 500 });
    }
}
