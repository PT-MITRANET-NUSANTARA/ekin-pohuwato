import { NextRequest, NextResponse } from 'next/server';
import Joi from 'joi';
import dbConnect from '@/utils/db';
import { createResponse } from '@/utils/api';
import RHK from '@/models/RHK';
import Aspek from '@/models/Aspek';
import PeriodePenilaian from '@/models/PeriodePenilaian';
import Harian from '@/models/Harian';

const rhkSchema = Joi.object({
    skp: Joi.string().required().label('SKP'),
    rhk: Joi.string().optional().label('RHK').allow(null),
    rkt: Joi.string().optional().label('RKT').allow(null),
    desc: Joi.string().required().label('Deskripsi'),
    jenis: Joi.string().valid('utama', 'tambahan', 'Utama', 'Tambahan').required().label('Jenis'),
    klasifikasi: Joi.string().valid('organisasi', 'individu', 'Organisasi', 'Individu').optional().label('Klasifikasi'),
    __v: Joi.optional(),
    posjab: Joi.string().label('Posjab'),
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

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    await dbConnect();

    try {
        const { id } = params;
        const periode = req.nextUrl.searchParams.get('periode');


        const rhkPeriode = await PeriodePenilaian.findById(periode);
        if (!rhkPeriode) {
            return NextResponse.json({ error: 'Periode tidak ditemukan' }, { status: 404 });
        }

        const rhk = await RHK.findById(id);
        if (!rhk) {
            return NextResponse.json({ error: 'Periode tidak ditemukan' }, { status: 404 });
        }
        const harian = await Harian.find({
            rhk: rhk?._id,
            isSKP: true,
            date: {
                $gte: rhkPeriode.periodeStart,
                $lte: rhkPeriode.periodeEnd
            }
        });
        return NextResponse.json(createResponse(200, 'Success', harian, true));
    } catch (error) {
        console.error('GET error:', error);
        return NextResponse.json({ error: 'Gagal mengambil data RHK' }, { status: 500 });
    }
}
