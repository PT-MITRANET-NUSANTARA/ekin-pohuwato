import { NextRequest, NextResponse } from 'next/server';
import SubKegiatan from '@/models/SubKegiatan';
import Joi from 'joi';
import dbConnect from '@/utils/db';
import { createResponse } from '@/utils/api';
import Kegiatan from '@/models/Kegiatan';

const kegiatanSchema = Joi.object({
    program: Joi.string().hex().length(24).required().label('Program'), // Mengasumsikan ini adalah referensi ObjectId
    name: Joi.string().required().label('Nama Kegiatan'),
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
    renstra: Joi.optional(),
    tujuan: Joi.optional(),
    id: Joi.optional()
}).messages({
    'any.required': '{{#label}} wajib diisi.',
    'string.base': '{{#label}} harus berupa teks.',
    'string.empty': '{{#label}} tidak boleh kosong.',
    'string.hex': '{{#label}} harus berupa nilai heksadesimal yang valid.',
    'string.length': '{{#label}} harus memiliki panjang tepat {{#limit}} karakter.',
    'number.base': '{{#label}} harus berupa angka.',
    'number.empty': '{{#label}} tidak boleh kosong.'
});

function validateKegiatanData(data: any) {
    const { error } = kegiatanSchema.validate(data, { abortEarly: false });
    if (error) {
        return error.details.map((err) => err.message);
    }
    return [];
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    await dbConnect();
    try {
        const { id } = params;
        const kegiatan = await Kegiatan.findOne({ _id: id }).populate('subKegiatans').populate('program');

        return NextResponse.json(createResponse(200, 'Success', kegiatan, true));
    } catch (error) {
        console.error('GET error:', error);
        return NextResponse.json({ error: 'Failed to fetch Kegiatan data' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    await dbConnect();

    try {
        const { id } = params;
        const body = await req.json();
        const errors = validateKegiatanData(body);
        if (errors.length > 0) {
            return NextResponse.json(createResponse(400, 'Failed', errors));
        }

        const updatedKegiatan = await Kegiatan.findOneAndUpdate({ _id: id }, body, { new: true });

        if (!updatedKegiatan) {
            return NextResponse.json(createResponse(404, 'Kegiatan not found', null));
        }

        return NextResponse.json(createResponse(200, 'Success', updatedKegiatan, true));
    } catch (error) {
        console.error('PUT error:', error);
        return NextResponse.json({ error: 'Failed to update Kegiatan' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    await dbConnect();

    try {
        const { id } = params;

        const deletedKegiatan = await Kegiatan.findById(id);
        if (!deletedKegiatan) {
            return NextResponse.json(createResponse(404, 'Kegiatan not found', null));
        }
        deletedKegiatan.cascadeDelete();

        return NextResponse.json(createResponse(200, 'Success', deletedKegiatan, true));
    } catch (error) {
        console.error('DELETE error:', error);
        return NextResponse.json({ error: 'Failed to delete Kegiatan' }, { status: 500 });
    }
}
