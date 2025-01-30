import { NextRequest, NextResponse } from 'next/server';
import Joi from 'joi';
import dbConnect from '@/utils/db';
import { createResponse } from '@/utils/api';
import { perilaku } from '@/utils/blueprint';
import Perilaku from '@/models/Perilaku';
import RKT from '@/models/RKT';
import SKP from '@/models/SKP';
import RHK from '@/models/RHK';

const skpSchema = Joi.object({
    periode_awal: Joi.date().required().label('Periode Awal'),
    periode_akhir: Joi.date().required().label('Periode Akhir'),
    pendekatan: Joi.string().valid('kualitatif', 'kuantitatif').required().label('Pendekatan'),
    keterangan: Joi.string().allow('').label('Keterangan'),
    penilaians: Joi.optional(),
    perilakus: Joi.optional(),
    rhks: Joi.optional(),
    user_id: Joi.string().required().label('User ID'),
    skp: Joi.array().items(Joi.optional()).optional().label('SKP'),
    __v: Joi.optional(),
    _id: Joi.optional(),
    id: Joi.optional(),
    renstra: Joi.optional(),
    posjab: Joi.array().items(Joi.optional()).label('Posjab'),

    jabatan: Joi.array().items(Joi.object().required()).required().label('Jabatan'),
    createdAt: Joi.date().optional(),
    lampiran: Joi.object().optional(),
    predikat: Joi.object().optional().label('Predikat'),
    hasil: Joi.object().optional().label('Hasil'),
    perilaku: Joi.object().optional().label('Perilaku'),
    updatedAt: Joi.date().optional(),
    periodeRKT: Joi.array().items(Joi.optional()).optional().label('PeriodeRKT'),

    status: Joi.string().valid('draft', 'submitted', 'approved', 'rejected').label('Status').optional()
}).messages({
    'any.required': '{{#label}} wajib diisi.',
    'date.base': '{{#label}} harus berupa tanggal yang valid.',
    'date.empty': '{{#label}} tidak boleh kosong.',
    'string.base': '{{#label}} harus berupa teks.',
    'string.empty': '{{#label}} tidak boleh kosong.',
    'string.valid': '{{#label}} harus salah satu dari {{#valids}}.',
    'array.base': '{{#label}} harus berupa array.',
    'object.base': '{{#label}} harus berupa objek.',
    'string.min': '{{#label}} harus memiliki minimal {{#limit}} karakter.',
    'string.max': '{{#label}} tidak boleh melebihi {{#limit}} karakter.',
    'array.min': '{{#label}} harus memiliki setidaknya {{#limit}} item.',
    'array.max': '{{#label}} tidak boleh melebihi {{#limit}} item.',
    'any.only': '{{#label}} harus bernilai salah satu dari {{#valids}}.',
    'string.pattern.base': '{{#label}} memiliki format yang tidak valid.',
    'string.alphanum': '{{#label}} hanya boleh berisi karakter alfanumerik.',
    'alternatives.match': '{{#label}} tidak valid.',
    'any.invalid': '{{#label}} tidak valid.',
    'date.less': '{{#label}} harus sebelum {{#limit}}.',
    'date.greater': '{{#label}} harus setelah {{#limit}}.'
});

function validateSKPData(data: any) {
    const { error } = skpSchema.validate(data, { abortEarly: false });
    if (error) {
        return error.details.map((err) => err.message);
    }
    return [];
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    await dbConnect();

    try {
        const { id } = params;

        const skp = await SKP.findById(id)
            .populate({
                path: 'perilakus',
                populate: {
                    path: 'FeedbackPerilakus'
                }
            })
            .populate({
                path: 'rhks',
                populate: [
                    { path: 'rhk', populate: [{ path: 'rkt' }, { path: 'harians' }] }, // Populate 'rhk' dan 'rkt' di dalamnya
                    { path: 'aspek' }, // Populate 'aspek'
                    { path: 'harians' }, // Populate 'harians'
                    { path: 'rkt' },
                    { path: 'FeedbackRHKs' } // Populate 'rkt' secara langsung dari 'rhks'
                ]
            })
            .populate('skp') // Populate 'skp'
            .populate('penilaians'); // Populate 'penilaians'

        return NextResponse.json(createResponse(200, 'Success', skp, true));
    } catch (error) {
        console.error('GET error:', error);
        return NextResponse.json({ error: 'Failed to fetch SKP data' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    await dbConnect();

    try {
        const { id } = params;
        const body = await req.json();

        const errors = validateSKPData(body);
        if (errors.length > 0) {
            return NextResponse.json(createResponse(400, 'Failed', errors));
        }
        const updatedSKP = await SKP.findOneAndUpdate({ _id: id }, body, { new: true });

        if (!updatedSKP) {
            return NextResponse.json(createResponse(404, 'SKP not found', null));
        }

        return NextResponse.json(createResponse(200, 'Success', updatedSKP, true));
    } catch (error) {
        console.error('PUT error:', error); // Added error logging
        return NextResponse.json({ error: 'Failed to update SKP' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    await dbConnect();

    try {
        const { id } = params;

        const deletedSKP = await SKP.findById(id);
        if (!deletedSKP) {
            return NextResponse.json(createResponse(404, 'SKP not found', null));
        }
        deletedSKP.cascadeDelete();

        return NextResponse.json(createResponse(200, 'Success', deletedSKP, true));
    } catch (error) {
        console.error('DELETE error:', error); // Added error logging
        return NextResponse.json({ error: 'Failed to delete SKP' }, { status: 500 });
    }
}
