import { NextRequest, NextResponse } from 'next/server';
import Kegiatan from '@/models/Kegiatan';
import Joi from 'joi';
import dbConnect from '@/utils/db';
import { createResponse } from '@/utils/api';
import Program from '@/models/Program';

const programSchema = Joi.object({
    name: Joi.string().required().label('Nama Program'),
    indikator_kinerja: Joi.array()
        .items(
            Joi.object({
                _id: Joi.optional(),

                name: Joi.string().required().label('Name Indikator Kinerja'),
                target: Joi.number().required().label('Target Indikator Kinerja'),
                satuan: Joi.string().required().label('Satuan Indikator Kinerja')
            })
        )
        .required()
        .label('Indikator Kinerja'),
    total_anggaran: Joi.number().required().label('Total Anggaran'),
    tujuan: Joi.string().hex().length(24).required().label('Tujuan'), // Mengharapkan ObjectId (24 karakter heksadesimal)
    __v: Joi.optional(),
    unit: Joi.object().required().label('Unit'),

    _id: Joi.optional(),
    id: Joi.optional(),
    renstra: Joi.optional()
}).messages({
    'any.required': '{{#label}} wajib diisi.',
    'string.base': '{{#label}} harus berupa teks.',
    'string.empty': '{{#label}} tidak boleh kosong.',
    'string.hex': '{{#label}} harus berupa nilai heksadesimal yang valid.',
    'string.length': '{{#label}} harus memiliki panjang tepat {{#limit}} karakter.',
    'number.base': '{{#label}} harus berupa angka.',
    'number.empty': '{{#label}} tidak boleh kosong.'
});

function validateProgramData(data: any) {
    const { error } = programSchema.validate(data, { abortEarly: false });
    if (error) {
        return error.details.map((err) => err.message);
    }
    return [];
}

export async function GET(req: NextRequest, { params }: { params: { unit_id: string } }) {
    await dbConnect();

    try {
        const { unit_id } = params;
        const page = req.nextUrl.searchParams.get('page');
        const limit = req.nextUrl.searchParams.get('limit');
        const filters = req.nextUrl.searchParams.get('filters');
        let programs;
        if (!(page && limit) || page === 'undefined' || limit === 'undefined') {
            programs = await Program.find({ 'unit.id': unit_id }).populate({
                path: 'tujuan',
                populate: {
                    path: 'renstra'
                }
            });
        } else {
            const f = JSON.parse(filters as string);
            f['unit.id'] = unit_id;
            programs = await Program.getAll(Number(page), Number(limit), f);
        }
        return NextResponse.json(createResponse(200, 'Success', programs, true));
    } catch (error) {
        console.error('GET error:', error);
        return NextResponse.json({ error: 'Failed to fetch Periode RKT data' }, { status: 500 });
    }
}
