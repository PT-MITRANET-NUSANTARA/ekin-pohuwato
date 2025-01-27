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

export async function GET(req: NextRequest, { params }: { params: { program_id: string } }) {
    await dbConnect();
    await SubKegiatan.find({});
    try {
        const { program_id } = params;
        
        const kegiatans = await Kegiatan.find({ program: program_id }).populate('program').populate('subKegiatans');

        return NextResponse.json(createResponse(200, 'Success', kegiatans, true));
    } catch (error) {
        console.error('GET error:', error);
        return NextResponse.json({ error: 'Failed to fetch Kegiatan data' }, { status: 500 });
    }
}