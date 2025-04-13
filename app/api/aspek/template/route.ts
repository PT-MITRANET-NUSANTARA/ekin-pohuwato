import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/utils/db';
import { createResponse } from '@/utils/api';
import Aspek from '@/models/Aspek';
import { aspek } from '@/utils/blueprint';

export async function POST(req: NextRequest) {
    await dbConnect();

    try {
        const body = await req.json();
        const { userRHK, pendekatan } = body;

        if (!userRHK) {
            return NextResponse.json(createResponse(400, 'Failed', 'userRHK ID is required'));
        }

        if (!pendekatan || !aspek[pendekatan as keyof typeof aspek]) {
            return NextResponse.json(createResponse(400, 'Failed', 'Valid pendekatan is required'));
        }

        // Create aspect templates for the UserRHK
        const createdAspects = [];
        for (const aspectTemplate of aspek[pendekatan as keyof typeof aspek]) {
            const newAspek = new Aspek({
                userRHK: userRHK,
                jenis: aspectTemplate.jenis,
                indikator: aspectTemplate.indikator,
                target_tahunan: aspectTemplate.target_tahunan
            });
            
            await newAspek.save();
            createdAspects.push(newAspek);
        }

        return NextResponse.json(createResponse(201, 'Success', createdAspects, true));
    } catch (error) {
        console.error('POST error:', error);
        return NextResponse.json({ error: 'Failed to create aspect templates' }, { status: 500 });
    }
} 