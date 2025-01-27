import { NextRequest, NextResponse } from 'next/server';
import Joi from 'joi';
import dbConnect from '@/utils/db';
import { createResponse } from '@/utils/api';
import PeriodeRKT from '@/models/PeriodeRKT';

// Joi schema for PeriodeRKT validation
const periodeRKTSchema = Joi.object({
    periode_start: Joi.date().required().label('Periode Mulai'),
    periode_end: Joi.date().required().label('Periode Selesai'),
    perjanjianKinerja: Joi.array().label('Perjanjian Kinerja'),
    RKTS: Joi.optional(),
    __v: Joi.optional(),
    _id: Joi.optional(),
    id: Joi.optional(),
    renstra: Joi.string().hex().length(24).required().label('Renstra'), // Expecting a string ObjectId
    unit: Joi.object().required().label('Unit'),
    createdAt: Joi.date().optional(),
    updatedAt: Joi.date().optional()
}).messages({
    'any.required': '{{#label}} wajib diisi.',
    'string.base': '{{#label}} harus berupa teks.',
    'string.empty': '{{#label}} tidak boleh kosong.',
    'string.hex': '{{#label}} harus berupa nilai heksadesimal yang valid.',
    'string.length': '{{#label}} harus memiliki panjang tepat {{#limit}} karakter.',
    'string.pattern.base': '{{#label}} harus berupa tahun yang valid (4 digit).',
    'date.base': '{{#label}} harus berupa tanggal yang valid.'
});

function validatePeriodeRKTData(data: any) {
    const { error } = periodeRKTSchema.validate(data, { abortEarly: false });
    if (error) {
        return error.details.map((err) => err.message);
    }
    return [];
}

// GET method to fetch PeriodeRKT
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    await dbConnect();

    try {
        const { id } = params;
        const periiodeRkt = await PeriodeRKT.findById(id).populate({
            path: 'RKTS',
            populate: {
                path: 'subKegiatan',
                populate: {
                    path: 'kegiatan',
                    populate: {
                        path: 'program',
                        populate: {
                            path: 'tujuan'
                        }
                    }
                }
            }
        }).populate('renstra');

        return NextResponse.json(createResponse(200, 'Success', periiodeRkt, true));
    } catch (error) {
        console.error('GET error:', error);
        return NextResponse.json({ error: 'Failed to fetch Periode RKT data' }, { status: 500 });
    }
}

// PUT method to update PeriodeRKT
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    await dbConnect();

    try {
        const { id } = params;
        const body = await req.json();

        const errors = validatePeriodeRKTData(body);
        if (errors.length > 0) {
            return NextResponse.json(createResponse(400, 'Failed', errors));
        }

        const updatedPeriodeRKT = await PeriodeRKT.findOneAndUpdate({ _id: id }, body, { new: true });

        if (!updatedPeriodeRKT) {
            return NextResponse.json(createResponse(404, 'Periode RKT not found', null));
        }

        return NextResponse.json(createResponse(200, 'Success', updatedPeriodeRKT, true));
    } catch (error) {
        console.error('PUT error:', error);
        return NextResponse.json({ error: 'Failed to update Periode RKT' }, { status: 500 });
    }
}

// DELETE method to delete PeriodeRKT
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    await dbConnect();

    try {
        const { id } = params;

        const deletedPeriodeRKT = await PeriodeRKT.findById(id);
        if (!deletedPeriodeRKT) {
            return NextResponse.json(createResponse(404, 'Periode RKT not found', null));
        }

        await deletedPeriodeRKT.cascadeDelete();

        return NextResponse.json(createResponse(200, 'Success', deletedPeriodeRKT, true));
    } catch (error) {
        console.error('DELETE error:', error);
        return NextResponse.json({ error: 'Failed to delete Periode RKT' }, { status: 500 });
    }
}
