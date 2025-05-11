import { NextRequest, NextResponse } from 'next/server';
import Joi from 'joi';
import dbConnect from '@/utils/db';
import { createResponse } from '@/utils/api';
import UserRHK from '@/models/UserRHK';

const userRhkSchema = Joi.object({
    skp: Joi.string().required().label('SKP'),
    user: Joi.string().required().label('User'),
    description: Joi.string().required().label('Deskripsi'),
    rkt: Joi.string().optional().label('RKT').allow(null),
    jenis: Joi.string().valid('utama', 'tambahan', 'Utama', 'Tambahan').required().label('Jenis'),
    klasifikasi: Joi.string().valid('organisasi', 'individu', 'Organisasi', 'Individu').optional().label('Klasifikasi'),
    posjab: Joi.string().required().label('Pos Jabatan'),
    status: Joi.string().valid('draft', 'submitted', 'approved', 'rejected').required().label('Status'),
    parentUserRHK: Joi.string().optional().allow(null).label('Parent UserRHK'),
    __v: Joi.optional(),
    _id: Joi.optional()
}).messages({
    'any.required': '{{#label}} wajib diisi.',
    'string.base': '{{#label}} harus berupa teks.',
    'string.empty': '{{#label}} tidak boleh kosong.',
    'string.valid': '{{#label}} harus salah satu dari {{#valids}}.'
});

function validateUserRHKData(data: any) {
    const { error } = userRhkSchema.validate(data, { abortEarly: false });
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
        let userRhks;

        if (!(page && limit) || page === 'undefined' || limit === 'undefined') {
            userRhks = await UserRHK.find({ skp: skp_id })
                .populate('rkts')
                .populate('aspects')
                .populate('parentUserRHK')
                .populate('childUserRHKs');
        } else {
            const f = JSON.parse(filters as string);
            f['skp'] = skp_id;
            userRhks = await UserRHK.getAll(Number(page), Number(limit), f);
        }

        return NextResponse.json(createResponse(200, 'Success', userRhks, true));
    } catch (error) {
        console.error('GET error:', error);
        return NextResponse.json({ error: 'Failed to fetch User RHK data' }, { status: 500 });
    }
}
