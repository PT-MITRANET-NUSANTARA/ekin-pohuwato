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

export async function GET(req: NextRequest, { params }: { params: { periodeRkt_id: string } }) {
    await dbConnect();

    try {
        const { periodeRkt_id } = params;
        const unit_id = req.nextUrl.searchParams.get('unit_id');

        let rkts;
        if (unit_id) {
            rkts = await RKT.find({ periodeRKT: periodeRkt_id, 'unit.id': unit_id });
        } else {
            rkts = await RKT.find({ periodeRKT: periodeRkt_id });
        }

        return NextResponse.json(createResponse(200, 'Success', rkts, true));
    } catch (error) {
        console.error('GET error:', error);
        return NextResponse.json({ error: 'Failed to fetch Periode RKT data' }, { status: 500 });
    }
}
