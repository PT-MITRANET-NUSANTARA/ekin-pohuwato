import { NextRequest, NextResponse } from 'next/server';
import SKP from '../../../models/SKP';
import RHK from '../../../models/RHK';
import Joi from 'joi';
import dbConnect from '@/utils/db';
import { createResponse } from '@/utils/api';
import { perilaku, aspek } from '@/utils/blueprint';
import Perilaku from '@/models/Perilaku';
import RKT from '@/models/RKT';
import getFilterQuery from '@/utils/getFilterQuery';
import Aspek from '@/models/Aspek';
import MessageSKP from '@/models/MessageSKP';

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
    renstra: Joi.optional(),
    createdAt: Joi.date().optional(),
    lampiran: Joi.object().optional(),
    posjab: Joi.array().items(Joi.optional()).label('Posjab'),
    updatedAt: Joi.date().optional(),
    periodeRKT: Joi.array().items(Joi.optional()).optional().label('PeriodeRKT'),
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

export async function GET(req: NextRequest) {
    await dbConnect();

    try {
        const page = req.nextUrl.searchParams.get('page');
        const limit = req.nextUrl.searchParams.get('limit');
        const filters = req.nextUrl.searchParams.get('filters');
        let skps;

        if (!(page && limit) || page === 'undefined' || limit === 'undefined') {
            skps = await SKP.find(getFilterQuery(filters)).populate('skp').populate('periodeRKT');
        } else {
            skps = await SKP.getAll(Number(page), Number(limit), JSON.parse(filters as string));
        }

        return NextResponse.json(createResponse(200, 'Success', skps, true));
    } catch (error) {
        console.error('GET error:', error);
        return NextResponse.json({ error: 'Failed to fetch SKP data' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    await dbConnect();
    try {
        const skp = req.nextUrl.searchParams.get('skp');

        const body = await req.json();

        const errors = validateSKPData(body);

        if (errors.length > 0) {
            return NextResponse.json(createResponse(400, 'Validation Failed', errors));
        }

        const newSKP = new SKP(body);

        await newSKP.save();
        const message = new MessageSKP({
            skp: newSKP._id,
            status: 'submitted',
            user_id: body.user_id
        });
        await message.save()
        if (newSKP) {
            for (const item of perilaku) {
                const perilakuData = new Perilaku({
                    skp: newSKP._id,
                    name: item.name,
                    isi: item.isi,
                    espektasi: item.espektasi,
                    feedback: item.feedback
                });

                await perilakuData.save();
            }
            if (skp || skp !== 'undefined') {
                const rkts = await RKT.find({ periodeRKT: newSKP.periodeRKT });
                for (const rkt of rkts) {
                    const rhk = new RHK({
                        skp: newSKP._id,
                        rkt: rkt._id,
                        jenis: 'utama',
                        klasifikasi: 'organisasi',
                        desc: rkt.name,
                        status: 'approved',
                        posjab: body.jabatan[0].id_posjab
                    });
                    await rhk.save();

                    for (const a of aspek[newSKP['pendekatan']]) {
                        const newAspek = new Aspek({
                            rhk: rhk._id,
                            jenis: a.jenis,
                            indikator: a.indikator,
                            target_tahunan: a.target_tahunan
                        });

                        await newAspek.save();
                    }
                }
            }
        }

        return NextResponse.json(createResponse(201, 'Success', newSKP, true));
    } catch (error) {
        console.error('POST error:', error);
        return NextResponse.json({ error: 'Failed to create SKP' }, { status: 500 });
    }
}
