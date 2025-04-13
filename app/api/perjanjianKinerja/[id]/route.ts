import { NextRequest, NextResponse } from 'next/server';
import PerjanjianKinerja from '../../../../models/PerjanjianKinerja';
import Joi from 'joi';
import dbConnect from '@/utils/db';
import { createResponse } from '@/utils/api';

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

// GET method to fetch a single PerjanjianKinerja by ID
export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    await dbConnect();

    try {
        const perjanjianKinerja = await PerjanjianKinerja.findById(params.id).populate('periodeRKT');
        if (!perjanjianKinerja) {
            return NextResponse.json(createResponse(404, 'Perjanjian Kinerja not found', null), { status: 404 });
        }
        return NextResponse.json(createResponse(200, 'Success', perjanjianKinerja, true));
    } catch (error) {
        console.error('GET error:', error);
        return NextResponse.json({ error: 'Failed to fetch Perjanjian Kinerja data' }, { status: 500 });
    }
}

// PUT method to update a PerjanjianKinerja by ID
export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    await dbConnect();

    try {
        let body = await req.json();
        
        // Normalize data to ensure file_perjanjian is an array
        body = normalizeData(body);
        console.log("Update with normalized data:", JSON.stringify(body, null, 2));
        
        const errors = validatePerjanjianKinerjaData(body);
        if (errors.length > 0) {
            return NextResponse.json(createResponse(400, 'Failed', errors, false));
        }

        const updatedPerjanjianKinerja = await PerjanjianKinerja.findByIdAndUpdate(
            params.id,
            body,
            { new: true, runValidators: true }
        );

        if (!updatedPerjanjianKinerja) {
            return NextResponse.json(createResponse(404, 'Perjanjian Kinerja not found', null), { status: 404 });
        }

        return NextResponse.json(createResponse(200, 'Success', updatedPerjanjianKinerja, true));
    } catch (error: any) {
        console.error('PUT error:', error);
        return NextResponse.json({ error: error.message || 'Failed to update Perjanjian Kinerja' }, { status: 500 });
    }
}

// DELETE method to delete a PerjanjianKinerja by ID
export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    await dbConnect();

    try {
        const perjanjianKinerja = await PerjanjianKinerja.findById(params.id);
        if (!perjanjianKinerja) {
            return NextResponse.json(createResponse(404, 'Perjanjian Kinerja not found', null), { status: 404 });
        }

        await perjanjianKinerja.cascadeDelete();
        return NextResponse.json(createResponse(200, 'Success', { message: 'Perjanjian Kinerja deleted successfully' }, true));
    } catch (error: any) {
        console.error('DELETE error:', error);
        return NextResponse.json({ error: error.message || 'Failed to delete Perjanjian Kinerja' }, { status: 500 });
    }
} 