import { NextRequest, NextResponse } from 'next/server';
import Joi from 'joi';
import dbConnect from '@/utils/db';
import { createResponse } from '@/utils/api';
import RHK from '@/models/RHK';

export async function GET(req: NextRequest, { params }: { params: { periodePenilaian_id: string } }) {
    await dbConnect();

    try {
        const { periodePenilaian_id } = params;
        const page = req.nextUrl.searchParams.get('page');
        const limit = req.nextUrl.searchParams.get('limit');
        const filters = req.nextUrl.searchParams.get('filters');
        let rhks;

        if (!(page && limit) || page === 'undefined' || limit === 'undefined') {
            rhks = await RHK.find({ periodePenilaian: periodePenilaian_id })
                .populate('aspek')
                .populate({
                    path: 'userRHK',
                    populate: [
                        { path: 'rkt' },
                        { path: 'skp' }
                    ]
                })
                .populate('periodePenilaian')
                .populate('skp');
        } else {
            const f = JSON.parse(filters as string);
            f['periodePenilaian'] = periodePenilaian_id;
            rhks = await RHK.getAll(Number(page), Number(limit), f);
        }

        return NextResponse.json(createResponse(200, 'Success', rhks, true));
    } catch (error) {
        console.error('GET error:', error);
        return NextResponse.json({ error: 'Failed to fetch RHK data' }, { status: 500 });
    }
} 