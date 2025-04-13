import { NextRequest, NextResponse } from 'next/server';
import UserRHK, { Status } from '@/models/UserRHK';
import Joi from 'joi';
import dbConnect from '@/utils/db';
import { createResponse } from '@/utils/api';
import getFilterQuery from '@/utils/getFilterQuery';

const userRHKSchema = Joi.object({
    user: Joi.string().required().label('User'),
    description: Joi.string().optional().label('Description'),
    rkt: Joi.string().optional().label('RKT').allow(null),
    skp: Joi.string().required().label('SKP'),
    jenis: Joi.string().valid('utama', 'tambahan').required().label('Jenis'),
    klasifikasi: Joi.string().valid('organisasi', 'individu').optional().label('Klasifikasi'),
    posjab: Joi.string().required().label('Position/Jabatan'),
    __v: Joi.optional(),
    _id: Joi.optional(),
}).messages({
    'any.required': '{{#label}} wajib diisi.',
    'string.base': '{{#label}} harus berupa teks.',
    'string.empty': '{{#label}} tidak boleh kosong.',
    'string.valid': '{{#label}} harus salah satu dari {{#valids}}.'
});

function validateUserRHKData(data: any) {
    const { error } = userRHKSchema.validate(data, { abortEarly: false });
    if (error) {
        return error.details.map((err) => err.message);
    }
    return [];
}

export async function GET(req: NextRequest) {
    await dbConnect();

    try {
        const page = req.nextUrl.searchParams.get('page');
        const limit = req.nextUrl.searchParams.get('limit');
        const filters = req.nextUrl.searchParams.get('filters');
        let userRHKs;
        
        if (page === 'undefined' || limit === 'undefined' || (!page && !limit)) {
            // Simple find without pagination
            const filterQuery = getFilterQuery(filters);
            const results = await UserRHK.find(filterQuery)
                .populate('aspects')
                .populate('rkt');
            userRHKs = results; // Return the array directly
        } else {
            // Paginated query with the same population pattern
            const query = UserRHK.find(getFilterQuery(filters))
                .populate('aspects')
                .populate('rkt')
                .populate('skp')
                .skip((Number(page) - 1) * Number(limit))
                .limit(Number(limit));
                
            const [results, total] = await Promise.all([
                query,
                UserRHK.countDocuments(getFilterQuery(filters))
            ]);
            
            userRHKs = {
                data: results,
                pagination: {
                    currentPage: Number(page),
                    totalPages: Math.ceil(total / Number(limit)),
                    totalItems: total,
                    pageSize: Number(limit)
                }
            };
        }

        return NextResponse.json(createResponse(200, 'Success', userRHKs, true));
    } catch (error) {
        console.error('GET error:', error);
        return NextResponse.json({ error: 'Failed to fetch UserRHK data' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    await dbConnect();

    try {
        const body = await req.json();

        const errors = validateUserRHKData(body);

        if (errors.length > 0) {
            return NextResponse.json(createResponse(400, 'Failed', errors));
        }

        const newUserRHK = new UserRHK(body);
        await newUserRHK.save();

        return NextResponse.json(createResponse(201, 'Success', newUserRHK, true));
    } catch (error) {
        console.error('POST error:', error);
        return NextResponse.json({ error: 'Failed to create UserRHK' }, { status: 500 });
    }
} 