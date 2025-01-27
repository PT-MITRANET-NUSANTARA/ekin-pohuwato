import { NextRequest, NextResponse } from 'next/server';
import Joi from 'joi';
import dbConnect from '@/utils/db';
import { createResponse } from '@/utils/api';
import SubKegiatan from '@/models/SubKegiatan';

const subKegiatanSchema = Joi.object({
    kegiatan: Joi.string().hex().length(24).required().label('Kegiatan'),
    name: Joi.string().required().label('Nama'),
    indikator_kinerja: Joi.array()
        .items(
            Joi.object({
                _id: Joi.optional(),

                name: Joi.string().required().label('Nama Indikator Kinerja'),
                target: Joi.number().required().label('Target Indikator Kinerja'),
                satuan: Joi.string().required().label('Satuan Indikator Kinerja')
            })
        )
        .required()
        .label('Indikator Kinerja'),
    total_anggaran: Joi.number().required().label('Total Anggaran'),
    __v: Joi.optional(),
    _id: Joi.optional(),
    unit: Joi.object().required().label('Unit'),
    id: Joi.optional(),
    renstra: Joi.optional(),
    tujuan: Joi.optional(),
    program: Joi.optional()
}).messages({
    'any.required': '{{#label}} wajib diisi.',
    'string.base': '{{#label}} harus berupa teks.',
    'string.empty': '{{#label}} tidak boleh kosong.',
    'string.hex': '{{#label}} harus berupa nilai heksadesimal yang valid.',
    'string.length': '{{#label}} harus memiliki panjang tepat {{#limit}} karakter.',
    'number.base': '{{#label}} harus berupa angka.',
    'number.empty': '{{#label}} tidak boleh kosong.',
    'number.min': '{{#label}} harus memiliki nilai minimal {{#limit}}.',
    'number.max': '{{#label}} tidak boleh melebihi {{#limit}}.'
});

function validateSubKegiatanData(data: any) {
    const { error } = subKegiatanSchema.validate(data, { abortEarly: false });
    if (error) {
        return error.details.map((err) => err.message);
    }
    return [];
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    await dbConnect();

    try {
        const { id } = params;

        const subKegiatan = await SubKegiatan.findOne({ _id: id });

        return NextResponse.json(createResponse(200, 'Success', subKegiatan, true));
    } catch (error) {
        console.error('GET error:', error);
        return NextResponse.json({ error: 'Failed to fetch SubKegiatan data' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    await dbConnect();

    try {
        const { id } = params;
        const body = await req.json();

        const errors = validateSubKegiatanData(body);
        if (errors.length > 0) {
            return NextResponse.json(createResponse(400, 'Failed', errors));
        }

        const updatedSubKegiatan = await SubKegiatan.findOneAndUpdate({ _id: id }, body, { new: true });

        if (!updatedSubKegiatan) {
            return NextResponse.json(createResponse(404, 'SubKegiatan not found', null));
        }

        return NextResponse.json(createResponse(200, 'Success', updatedSubKegiatan, true));
    } catch (error) {
        console.error('PUT error:', error);
        return NextResponse.json({ error: 'Failed to update SubKegiatan' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    await dbConnect();

    try {
        const { id } = params;

        const deletedSubKegiatan = await SubKegiatan.findById(id);
        if (!deletedSubKegiatan) {
            return NextResponse.json(createResponse(404, 'SubKegiatan not found', null));
        }
        await deletedSubKegiatan.cascadeDelete();

        return NextResponse.json(createResponse(200, 'Success', deletedSubKegiatan, true));
    } catch (error) {
        console.error('DELETE error:', error); // Added error logging
        return NextResponse.json({ error: 'Failed to delete SubKegiatan' }, { status: 500 });
    }
}
