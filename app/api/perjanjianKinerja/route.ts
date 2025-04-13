import { NextRequest, NextResponse } from 'next/server';
import PerjanjianKinerja from '../../../models/PerjanjianKinerja';
import Joi from 'joi';
import dbConnect from '@/utils/db';
import { createResponse } from '@/utils/api';
import getFilterQuery from '@/utils/getFilterQuery';

// Joi schema for file object validation
const fileSchema = Joi.object({
    fileId: Joi.string().required().label('File ID'),
    name: Joi.string().required().label('File Name'),
    type: Joi.string().allow('').optional().label('File Type'),
    uid: Joi.string().allow('').optional().label('File UID')
});

// Joi schema for PerjanjianKinerja validation
const perjanjianKinerjaSchema = Joi.object({
    periodeRKT: Joi.string().hex().length(24).required().label('Periode RKT'),
    unit: Joi.object().required().label('Unit'),
    file_perjanjian: Joi.array().items(fileSchema).label('File Perjanjian'),
    __v: Joi.optional(),
    _id: Joi.optional(),
    id: Joi.optional(),
    createdAt: Joi.date().optional(),
    updatedAt: Joi.date().optional()
}).messages({
    'any.required': '{{#label}} wajib diisi.',
    'string.base': '{{#label}} harus berupa teks.',
    'string.empty': '{{#label}} tidak boleh kosong.',
    'string.hex': '{{#label}} harus berupa nilai heksadesimal yang valid.',
    'string.length': '{{#label}} harus memiliki panjang tepat {{#limit}} karakter.',
    'date.base': '{{#label}} harus berupa tanggal yang valid.'
});

// Helper function to ensure data format is correct
const normalizeData = (data: any) => {
    // Handle case where file_perjanjian might be a stringified array
    if (data.file_perjanjian && typeof data.file_perjanjian === 'string') {
        try {
            data.file_perjanjian = JSON.parse(data.file_perjanjian);
        } catch (e) {
            console.error("Error parsing file_perjanjian:", e);
            data.file_perjanjian = [];
        }
    }
    
    // Ensure file_perjanjian is an array
    if (!Array.isArray(data.file_perjanjian)) {
        data.file_perjanjian = [];
    }
    
    return data;
};

function validatePerjanjianKinerjaData(data: any) {
    // Normalize data before validation
    const normalizedData = normalizeData(data);
    
    const { error } = perjanjianKinerjaSchema.validate(normalizedData, { abortEarly: false });
    if (error) {
        return error.details.map((err) => err.message);
    }
    return [];
}

// GET method to fetch PerjanjianKinerja
export async function GET(req: NextRequest) {
    await dbConnect();

    try {
        const page = req.nextUrl.searchParams.get('page');
        const limit = req.nextUrl.searchParams.get('limit');
        const filters = req.nextUrl.searchParams.get('filters');
        let perjanjianKinerjas;

        if (!(page && limit) || page === 'undefined' || limit === 'undefined') {
            perjanjianKinerjas = await PerjanjianKinerja.find(getFilterQuery(filters)).populate('periodeRKT');
        } else {
            perjanjianKinerjas = await PerjanjianKinerja.getAll(Number(page), Number(limit), JSON.parse(filters as string));
        }

        return NextResponse.json(createResponse(200, 'Success', perjanjianKinerjas, true));
    } catch (error) {
        console.error('GET error:', error);
        return NextResponse.json({ error: 'Failed to fetch Perjanjian Kinerja data' }, { status: 500 });
    }
}

// POST method to create PerjanjianKinerja
export async function POST(req: NextRequest) {
    await dbConnect();

    try {
        let body = await req.json();
        
        // Normalize data to ensure file_perjanjian is an array
        body = normalizeData(body);
        console.log("Normalized data:", JSON.stringify(body, null, 2));

        const errors = validatePerjanjianKinerjaData(body);
        if (errors.length > 0) {
            return NextResponse.json(createResponse(400, 'Failed', errors, false));
        }

        const newPerjanjianKinerja = new PerjanjianKinerja(body);
        await newPerjanjianKinerja.save();
        return NextResponse.json(createResponse(201, 'Success', newPerjanjianKinerja, true));
    } catch (error: any) {
        console.error('POST error:', error);
        return NextResponse.json({ error: error.message || 'Failed to create Perjanjian Kinerja' }, { status: 500 });
    }
} 