import { NextRequest, NextResponse } from 'next/server';
import RKT from '../../../models/RKT';
import Joi from 'joi';
import dbConnect from '@/utils/db';
import { createResponse } from '@/utils/api';
import getFilterQuery from '@/utils/getFilterQuery';
import SubKegiatan from '@/models/SubKegiatan';

const rktSchema = Joi.object({
    subKegiatan: Joi.array().items(Joi.string().hex().length(24)).required().label('SubKegiatan'),
    periodeRKT: Joi.string().hex().length(24).required().label('PeriodeRKT'), // Referensi ObjectId ke SubKegiatan
    // Referensi ObjectId ke SubKegiatan
    // name: Joi.string().required().label('Nama'),
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
    label: Joi.optional(),
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

export async function GET(req: NextRequest) {
    await dbConnect();

    try {
        const page = req.nextUrl.searchParams.get('page');
        const limit = req.nextUrl.searchParams.get('limit');
        const filters = req.nextUrl.searchParams.get('filters');
        let rkts;

        if (!(page && limit) || page === 'undefined' || limit === 'undefined') {
            rkts = await RKT.find(getFilterQuery(filters)).populate('periodeRKT').populate('subKegiatan');
        } else {
            rkts = await RKT.getAll(Number(page), Number(limit), JSON.parse(filters as string));
        }

        return NextResponse.json(createResponse(200, 'Success', rkts, true));
    } catch (error) {
        console.error('GET error:', error);
        return NextResponse.json({ error: 'Failed to fetch RKT data' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    await dbConnect();

    try {
        const body = await req.json();
        const errors = validateRKTData(body);
        const subKegiatan = await SubKegiatan.find({ _id: { $in: body.subKegiatan } })
            .select('name')
            .lean();
        const subKegiatanString = subKegiatan.map((item) => item.name).join(', ');
        console.log(subKegiatanString);

        if (errors.length > 0) {
            return NextResponse.json(createResponse(400, 'Failed', errors));
        }

        const newRKT = new RKT({ ...body, name: subKegiatanString });
        await newRKT.save();
        return NextResponse.json(createResponse(201, 'Success', newRKT, true));
    } catch (error) {
        console.error('POST error:', error); // Added error logging
        return NextResponse.json({ error: 'Failed to create RKT' }, { status: 500 });
    }
}
