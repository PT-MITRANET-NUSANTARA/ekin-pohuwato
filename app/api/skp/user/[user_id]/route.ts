import { NextRequest, NextResponse } from 'next/server';
import Joi from 'joi';
import dbConnect from '@/utils/db';
import { createResponse } from '@/utils/api';
import { perilaku, aspek } from '@/utils/blueprint';
import Perilaku from '@/models/Perilaku';
import RKT from '@/models/RKT';
import getFilterQuery from '@/utils/getFilterQuery';
import Aspek from '@/models/Aspek';
import SKP from '@/models/SKP';

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
    jabatan: Joi.array().items(Joi.object().required()).required().label('Jabatan'),
    createdAt: Joi.date().optional(),
    lampiran: Joi.object().optional(),
    predikat: Joi.object().optional().label('Predikat'),
    hasil: Joi.object().optional().label('Hasil'),
    perilaku: Joi.object().optional().label('Perilaku'),
    updatedAt: Joi.date().optional(),
    periodeRKT: Joi.string().hex().length(24).required().label('PeriodeRKT'),
    renstra: Joi.string().hex().length(24).required().label('Renstra'),
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

export async function GET(req: NextRequest, { params }: { params: { user_id: string } }) {
    await dbConnect();

    try {
        const { user_id } = params;
        const page = req.nextUrl.searchParams.get('page');
        const limit = req.nextUrl.searchParams.get('limit');
        const filters = req.nextUrl.searchParams.get('filters');
        let skps;

        if (!(page && limit) || page === 'undefined' || limit === 'undefined') {
            skps = await SKP.find({ user_id: user_id }).populate('skp').populate('periodeRKT');
        } else {
            const f = JSON.parse(filters as string);
            f['user_id'] = user_id;
            skps = await SKP.getAll(Number(page), Number(limit), f);
        }

        return NextResponse.json(createResponse(200, 'Success', skps, true));
    } catch (error) {
        console.error('GET error:', error);
        return NextResponse.json({ error: 'Failed to fetch Periode RKT data' }, { status: 500 });
    }
}
