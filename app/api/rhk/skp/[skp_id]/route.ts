import { NextRequest, NextResponse } from 'next/server';
import Joi from 'joi';
import dbConnect from '@/utils/db';
import { createResponse } from '@/utils/api';
import RHK from '@/models/RHK';

const rhkSchema = Joi.object({
    skp: Joi.string().required().label('SKP'),
    rhk: Joi.string().optional().label('RHK').allow(null),
    rkt: Joi.string().optional().label('RKT').allow(null),
    desc: Joi.string().required().label('Deskripsi'),
    jenis: Joi.string().valid('utama', 'tambahan', 'Utama', 'Tambahan').required().label('Jenis'),
    rencana: Joi.object().label('Rencana'),
    klasifikasi: Joi.string().valid('organisasi', 'individu', 'Organisasi', 'Individu').optional().label('Klasifikasi'),
    __v: Joi.optional(),
    unit: Joi.object().required().label('Unit'),
    _id: Joi.optional()
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

export async function GET(req: NextRequest, { params }: { params: { skp_id: string } }) {
    await dbConnect();

    try {
        const { skp_id } = params;
        const page = req.nextUrl.searchParams.get('page');
        const limit = req.nextUrl.searchParams.get('limit');
        const filters = req.nextUrl.searchParams.get('filters');
        let rhks;

        if (!(page && limit) || page === 'undefined' || limit === 'undefined') {
            rhks = await RHK.find({ skp: skp_id }).populate('aspek').populate('rkt');
        } else {
            const f = JSON.parse(filters as string);
            f['skp'] = { skp: skp_id}
            rhks = await RHK.getAll(Number(page), Number(limit), f);
        }

        return NextResponse.json(createResponse(200, 'Success', rhks, true));
    } catch (error) {
        console.error('GET error:', error);
        return NextResponse.json({ error: 'Failed to fetch Periode RKT data' }, { status: 500 });
    }
}
