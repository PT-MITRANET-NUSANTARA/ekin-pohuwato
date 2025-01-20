import { NextRequest, NextResponse } from 'next/server';
import Program from '../../../models/Program';
import Kegiatan from '@/models/Kegiatan';
import Joi from 'joi';
import dbConnect from '@/utils/db';
import { createResponse } from '@/utils/api';

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

export async function GET(req: NextRequest) {
    await dbConnect();
    try {
        const id = req.nextUrl.searchParams.get('id');
        const page = req.nextUrl.searchParams.get('page');
        const limit = req.nextUrl.searchParams.get('limit');
        const filters = req.nextUrl.searchParams.get('filters');
        let programs;

        if (id) {
            programs = await Program.findOne({ _id: id }).populate({
                path: 'tujuan',
                populate: {
                    path: 'renstra'
                }
            });
        } else {
            if (page === 'undefined' || limit === 'undefined') {
                programs = await Program.find({}).populate({
                    path: 'tujuan',
                    populate: {
                        path: 'renstra'
                    }
                });
            } else {
                programs = await Program.getAll(Number(page), Number(limit), JSON.parse(filters as string));
            }
        }

        return NextResponse.json(createResponse(200, 'Success', programs, true));
    } catch (error) {
        console.error('GET error:', error);
        return NextResponse.json({ error: 'Failed to fetch Program data' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    await dbConnect();

    try {
        const body = await req.json();

        const errors = validateProgramData(body);

        if (errors.length > 0) {
            return NextResponse.json(createResponse(400, 'Failed', errors));
        }

        const newProgram = new Program(body);
        await newProgram.save();
        return NextResponse.json(createResponse(201, 'Success', newProgram, true));
    } catch (error) {
        console.error('POST error:', error);
        return NextResponse.json({ error: 'Failed to create Program' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    await dbConnect();

    try {
        const body = await req.json();

        const id = req.nextUrl.searchParams.get('id');
        if (!id || typeof id !== 'string') {
            return NextResponse.json(createResponse(400, 'Invalid or missing ID', null));
        }

        const errors = validateProgramData(body);

        if (errors.length > 0) {
            return NextResponse.json(createResponse(400, 'Failed', errors));
        }

        const updatedProgram = await Program.findOneAndUpdate({ _id: id }, body, { new: true }).populate('kegiatans').populate('renstra');

        if (!updatedProgram) {
            return NextResponse.json(createResponse(404, 'Program not found', null));
        }

        return NextResponse.json(createResponse(200, 'Success', updatedProgram, true));
    } catch (error) {
        console.log(error);

        console.error('PUT error:', error);
        return NextResponse.json({ error: 'Failed to update Program' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    await dbConnect();

    try {
        const id = req.nextUrl.searchParams.get('id');
        if (!id || typeof id !== 'string') {
            return NextResponse.json(createResponse(400, 'Invalid or missing ID', null));
        }

        const deletedProgram = await Program.findById(id);
        if (!deletedProgram) {
            return NextResponse.json(createResponse(404, 'Program not found', null));
        }
        deletedProgram.cascadeDelete();
        return NextResponse.json(createResponse(200, 'Success', deletedProgram, true));
    } catch (error) {
        console.error('DELETE error:', error); // Added error logging
        return NextResponse.json({ error: 'Failed to delete Program' }, { status: 500 });
    }
}
