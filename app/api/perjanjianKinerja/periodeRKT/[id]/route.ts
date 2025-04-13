import { NextRequest, NextResponse } from 'next/server';
import PerjanjianKinerja from '../../../../../models/PerjanjianKinerja';
import dbConnect from '@/utils/db';
import { createResponse } from '@/utils/api';
import getFilterQuery from '@/utils/getFilterQuery';

// Helper function to ensure data format is correct for output
const normalizeOutput = (data: any) => {
    if (data && Array.isArray(data.data)) {
        // Ensure each item's file_perjanjian is properly handled
        data.data = data.data.map((item: any) => {
            if (item.file_perjanjian && typeof item.file_perjanjian === 'string') {
                try {
                    item.file_perjanjian = JSON.parse(item.file_perjanjian);
                } catch (e) {
                    console.error("Error parsing file_perjanjian:", e);
                    item.file_perjanjian = [];
                }
            }
            
            // Ensure it's an array
            if (!Array.isArray(item.file_perjanjian)) {
                item.file_perjanjian = [];
            }
            
            return item;
        });
    }
    
    return data;
};

// GET method to fetch PerjanjianKinerja by PeriodeRKT ID
export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    await dbConnect();

    try {
        const page = req.nextUrl.searchParams.get('page');
        const limit = req.nextUrl.searchParams.get('limit');
        const filters = req.nextUrl.searchParams.get('filters');
        let filterObj = {};
        
        try {
            filterObj = filters ? JSON.parse(filters) : {};
        } catch (e) {
            console.error('Error parsing filters:', e);
        }
        
        // Add the periodeRKT ID to the filters
        const allFilters = { ...filterObj, periodeRKT: params.id };
        
        let perjanjianKinerjas;
        if (!(page && limit) || page === 'undefined' || limit === 'undefined') {
            perjanjianKinerjas = await PerjanjianKinerja.find({ periodeRKT: params.id, ...getFilterQuery(filters) })
                .populate('periodeRKT');
        } else {
            const skip = (Number(page) - 1) * Number(limit);
            const query = PerjanjianKinerja.find({ periodeRKT: params.id, ...getFilterQuery(filters) });
            const [results, total] = await Promise.all([
                query.skip(skip).limit(Number(limit)).populate('periodeRKT'),
                PerjanjianKinerja.countDocuments({ periodeRKT: params.id, ...getFilterQuery(filters) })
            ]);

            perjanjianKinerjas = {
                data: results,
                pagination: {
                    currentPage: Number(page),
                    totalPages: Math.ceil(total / Number(limit)),
                    totalItems: total,
                    pageSize: Number(limit)
                }
            };
        }
        
        // Normalize output to ensure file_perjanjian is always an array
        const normalizedOutput = normalizeOutput(perjanjianKinerjas);

        return NextResponse.json(createResponse(200, 'Success', normalizedOutput, true));
    } catch (error: any) {
        console.error('GET error:', error);
        return NextResponse.json({ error: error.message || 'Failed to fetch Perjanjian Kinerja data for this PeriodeRKT' }, { status: 500 });
    }
} 