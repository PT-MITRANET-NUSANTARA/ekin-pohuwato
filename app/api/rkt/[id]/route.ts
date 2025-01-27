import { NextRequest, NextResponse } from 'next/server';
import Joi from 'joi';
import dbConnect from '@/utils/db';
import { createResponse } from '@/utils/api';
import Program from '@/models/Program';
import RKT from '@/models/RKT';

const rktSchema = Joi.object({
    subKegiatan: Joi.string().hex().length(24).required().label('SubKegiatan'),
    periodeRKT: Joi.string().hex().length(24).required().label('PeriodeRKT'), // Referensi ObjectId ke SubKegiatan
    // Referensi ObjectId ke SubKegiatan
    name: Joi.string().required().label('Nama'),
    input: Joi.array()
        .items(
            Joi.object({
                name: Joi.string().required().label('Name Input'),
                _id: Joi.string().optional(),
                target: Joi.number().required().label('Target Input'),
                satuan: Joi.string().required().label('Satuan Input')
            })
        )
        .required()
        .label('Input'),
    output: Joi.array()
        .items(
            Joi.object({
                name: Joi.string().required().label('Name Output'),
                _id: Joi.string().optional(),

                target: Joi.number().required().label('Target Output'),
                satuan: Joi.string().required().label('Satuan Output')
            })
        )
        .required()
        .label('Output'),
    outcome: Joi.array()
        .items(
            Joi.object({
                name: Joi.string().required().label('Name Outcome'),
                _id: Joi.string().optional(),

                target: Joi.number().required().label('Target Outcome'),
                satuan: Joi.string().required().label('Satuan Outcome')
            })
        )
        .required()
        .label('Outcome'),
    total_anggaran: Joi.number().required().label('Total Anggaran'),
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
    'number.base': '{{#label}} harus berupa angka.',
    'number.empty': '{{#label}} tidak boleh kosong.',
    'object.base': '{{#label}} harus berupa objek yang valid.',
    'date.base': '{{#label}} harus berupa tanggal yang valid.'
});

function validateRKTData(data: any) {
    const { error } = rktSchema.validate(data, { abortEarly: false });
    if (error) {
        return error.details.map((err) => err.message);
    }
    return [];
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    await dbConnect();

    try {
        const { id } = params;

        const rkt = await RKT.findOne({ _id: id });

        return NextResponse.json(createResponse(200, 'Success', rkt, true));
    } catch (error) {
        console.error('GET error:', error);
        return NextResponse.json({ error: 'Failed to fetch RKT data' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    await dbConnect();

    try {
        const { id } = params;
        const body = await req.json();
        const errors = validateRKTData(body);
        if (errors.length > 0) {
            return NextResponse.json(createResponse(400, 'Failed', errors));
        }

        const updatedRKT = await RKT.findOneAndUpdate({ _id: id }, body, {
            new: true
        });

        if (!updatedRKT) {
            return NextResponse.json(createResponse(404, 'RKT not found', null));
        }

        return NextResponse.json(createResponse(200, 'Success', updatedRKT, true));
    } catch (error) {
        console.error('PUT error:', error); // Added error logging
        return NextResponse.json({ error: 'Failed to update RKT' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    await dbConnect();

    try {
        const { id } = params;

        const deletedRKT = await RKT.findById(id);
        if (!deletedRKT) {
            return NextResponse.json(createResponse(404, 'RKT not found', null));
        }
        deletedRKT.cascadeDelete();

        return NextResponse.json(createResponse(200, 'Success', deletedRKT, true));
    } catch (error) {
        console.error('DELETE error:', error); // Added error logging
        return NextResponse.json({ error: 'Failed to delete RKT' }, { status: 500 });
    }
}
