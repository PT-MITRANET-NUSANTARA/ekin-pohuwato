import { NextRequest, NextResponse } from 'next/server';
import Penilaian from '../../../models/Penilaian';
import Joi from 'joi';
import dbConnect from '@/utils/db';
import { createResponse } from '@/utils/api';

// Joi schema for validating Penilaian
const penilaianSchema = Joi.object({
    ratingKinerja: Joi.number().min(1).max(5).optional().label('Rating Kinerja').allow(null),
    ratingPerilaku: Joi.number().min(1).max(5).optional().label('Rating Perilaku').allow(null),
    ratingPredikat: Joi.number().min(1).max(5).optional().label('Rating Predikat').allow(null),

    periodePenilaian: Joi.string().hex().length(24).required().label('Periode Penilaian'), // Expecting string ObjectId
    __v: Joi.optional(),
    _id: Joi.optional(),
    id: Joi.optional(),
    skp: Joi.string().hex().length(24).required().label('SKP'), // Expecting string ObjectId
    penilai: Joi.string().hex().length(24).required().label('Penilai'), // Expecting string ObjectId
    createdAt: Joi.date().optional(),
    updatedAt: Joi.date().optional()
}).messages({
    'any.required': '{{#label}} wajib diisi.',
    'number.base': '{{#label}} harus berupa angka.',
    'number.min': '{{#label}} harus bernilai minimal {{#limit}}.',
    'number.max': '{{#label}} harus bernilai maksimal {{#limit}}.',
    'string.hex': '{{#label}} harus berupa nilai heksadesimal yang valid.',
    'string.length': '{{#label}} harus memiliki panjang tepat {{#limit}} karakter.'
});

function validatePenilaianData(data: any) {
    const { error } = penilaianSchema.validate(data, { abortEarly: false });
    if (error) {
        return error.details.map((err) => err.message);
    }
    return [];
}

// GET method to fetch Penilaian
export async function GET(req: NextRequest) {
    await dbConnect();

    try {
        const id = req.nextUrl.searchParams.get('id');
        const page = req.nextUrl.searchParams.get('page');
        const limit = req.nextUrl.searchParams.get('limit');
        const filters = req.nextUrl.searchParams.get('filters');
        const periode = req.nextUrl.searchParams.get('periode');
        const skp = req.nextUrl.searchParams.get('skp');
        let penilaians;

        console.log('here', skp, periode);
        
        if (id) {
            penilaians = await Penilaian.findOne({ _id: id }).populate('periodePenilaian');
        } else if (periode && skp && periode !== 'undefined' && skp !== 'undefined') {
            penilaians = await Penilaian.findOne({
                skp: skp,
                periodePenilaian: periode
            }).populate('periodePenilaian');
        } else {
            if (page === 'undefined' || limit === 'undefined') {
                penilaians = await Penilaian.find({}).populate('periodePenilaian');
            } else {
                penilaians = await Penilaian.getAll(Number(page), Number(limit), JSON.parse(filters as string));
            }
        }

        return NextResponse.json(createResponse(200, 'Success', penilaians, true));
    } catch (error) {
        console.error('GET error:', error);
        return NextResponse.json({ error: 'Failed to fetch Penilaian data' }, { status: 500 });
    }
}

// POST method to create Penilaian
export async function POST(req: NextRequest) {
    await dbConnect();

    try {
        const body = await req.json();

        const errors = validatePenilaianData(body);

        if (errors.length > 0) {
            return NextResponse.json(createResponse(400, 'Failed', errors));
        }

        const penilaians = await Penilaian.findOne({
            skp: body.skp,
            periodePenilaian: body.periodePenilaian
        }).populate('periodePenilaian');
        let nilai;
        if (penilaians) {
            
            const updatedPenilaian = await Penilaian.findOneAndUpdate({ _id: penilaians._id }, body, { new: true });
            nilai = updatedPenilaian;
        }else
        {
            const newPenilaian = new Penilaian(body);
            await newPenilaian.save();
            nilai = newPenilaian;
        }

 
        return NextResponse.json(createResponse(201, 'Success', nilai, true));
    } catch (error) {
        console.error('POST error:', error);
        return NextResponse.json({ error: 'Failed to create Penilaian' }, { status: 500 });
    }
}

// PUT method to update Penilaian
export async function PUT(req: NextRequest) {
    await dbConnect();

    try {
        const body = await req.json();
        const id = req.nextUrl.searchParams.get('id');
        if (!id || typeof id !== 'string') {
            return NextResponse.json(createResponse(400, 'Invalid or missing ID', null));
        }

        const errors = validatePenilaianData(body);
        if (errors.length > 0) {
            return NextResponse.json(createResponse(400, 'Failed', errors));
        }

        const updatedPenilaian = await Penilaian.findOneAndUpdate({ _id: id }, body, { new: true });

        if (!updatedPenilaian) {
            return NextResponse.json(createResponse(404, 'Penilaian not found', null));
        }

        return NextResponse.json(createResponse(200, 'Success', updatedPenilaian, true));
    } catch (error) {
        console.error('PUT error:', error);
        return NextResponse.json({ error: 'Failed to update Penilaian' }, { status: 500 });
    }
}

// DELETE method to delete Penilaian
export async function DELETE(req: NextRequest) {
    await dbConnect();

    try {
        const id = req.nextUrl.searchParams.get('id');
        if (!id || typeof id !== 'string') {
            return NextResponse.json(createResponse(400, 'Invalid or missing ID', null));
        }

        const deletedPenilaian = await Penilaian.findById(id);
        if (!deletedPenilaian) {
            return NextResponse.json(createResponse(404, 'Penilaian not found', null));
        }

        deletedPenilaian.cascadeDelete();

        return NextResponse.json(createResponse(200, 'Success', deletedPenilaian, true));
    } catch (error) {
        console.error('DELETE error:', error);
        return NextResponse.json({ error: 'Failed to delete Penilaian' }, { status: 500 });
    }
}
