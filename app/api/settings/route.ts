import { NextRequest, NextResponse } from 'next/server';
import { serialize } from 'cookie';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { createResponse } from '@/utils/api';
import { getByNIP } from '@/controller/IDSN/JabatanController';
import Settings from '@/models/Settings';


export async function GET(req: NextRequest) {
    try {
        const settings = await Settings.findOne();
        return NextResponse.json(createResponse(200, 'Success', settings));
    } catch (error) {
        console.error('GET error:', error);
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}
