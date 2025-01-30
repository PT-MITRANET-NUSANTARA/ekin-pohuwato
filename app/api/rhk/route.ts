import { NextRequest, NextResponse } from 'next/server';
import RHK from '../../../models/RHK'; // Adjust the path as necessary
import Joi from 'joi';
import dbConnect from '@/utils/db';
import { createResponse } from '@/utils/api';
import Aspek from '@/models/Aspek';
import Harian from '@/models/Harian';
import getFilterQuery from '@/utils/getFilterQuery';
import SKP from '@/models/SKP';
import { aspek } from '@/utils/blueprint';

const rhkSchema = Joi.object({
    skp: Joi.string().required().label('SKP'),
    rhk: Joi.string().optional().label('RHK').allow(null),
    rkt: Joi.string().optional().label('RKT').allow(null),
    desc: Joi.string().required().label('Deskripsi'),
    jenis: Joi.string().valid('utama', 'tambahan', 'Utama', 'Tambahan').required().label('Jenis'),
    klasifikasi: Joi.string().valid('organisasi', 'individu', 'Organisasi', 'Individu').optional().label('Klasifikasi'),
    __v: Joi.optional(),
    _id: Joi.optional(),
        posjab: Joi.string().label('Posjab'),
    
}).messages({
    'any.required': '{{#label}} wajib diisi.',
    'string.base': '{{#label}} harus berupa teks.',
    'string.empty': '{{#label}} tidak boleh kosong.',
    'string.valid': '{{#label}} harus salah satu dari {{#valids}}.'
});

function validateRHKData(data: any) {
    const { error } = rhkSchema.validate(data, { abortEarly: false });
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
        let rhks;

        if (page === 'undefined' || limit === 'undefined') {
            rhks = await RHK.find(getFilterQuery(filters)).populate('aspek');
        } else {
            rhks = await RHK.getAll(Number(page), Number(limit), JSON.parse(filters as string));
        }

        return NextResponse.json(createResponse(200, 'Success', rhks, true));
    } catch (error) {
        console.error('GET error:', error);
        return NextResponse.json({ error: 'Failed to fetch RHK data' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    await dbConnect();

    try {
        const body = await req.json();

        const errors = validateRHKData(body);

        if (errors.length > 0) {
            return NextResponse.json(createResponse(400, 'Failed', errors));
        }

        const skp = await SKP.findById(body.skp);
        if (!skp) {
            return NextResponse.json(createResponse(400, 'Failed', 'SKP not found'));
        }
        const newRHK = new RHK(body);
        await newRHK.save();
        for (const a of aspek[skp['pendekatan']]) {
            const newAspek = new Aspek({
                rhk: newRHK._id,
                jenis: a.jenis,
                indikator: a.indikator,
                target_tahunan: a.target_tahunan
            });

            await newAspek.save();
        }

        return NextResponse.json(createResponse(201, 'Success', newRHK, true));
    } catch (error) {
        console.error('POST error:', error);
        return NextResponse.json({ error: 'Failed to create RHK' }, { status: 500 });
    }
}
