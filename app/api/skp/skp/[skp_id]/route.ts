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
import MessageSKP from '@/models/MessageSKP';
import buildFilterQuery from '@/utils/buildFilterQuery';
import mongoose from 'mongoose';

const skpSchema = Joi.object({
    pendekatan: Joi.string().valid('kualitatif', 'kuantitatif').required().label('Pendekatan'),
    keterangan: Joi.string().allow('').label('Keterangan'),
    perilakus: Joi.optional(),
    rhks: Joi.optional(),
    user_id: Joi.string().required().label('User ID'),
    skp: Joi.array().items(Joi.optional()).optional().label('SKP'),
    __v: Joi.optional(),
    _id: Joi.optional(),
    id: Joi.optional(),
    jabatan: Joi.array().items(Joi.object().required()).required().label('Jabatan'),
    posjab: Joi.array().items(Joi.optional()).label('Posjab'),
    createdAt: Joi.date().optional(),
        isJPT: Joi.object().optional(),
    
    lampiran: Joi.object().optional(),
    updatedAt: Joi.date().optional(),
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

export async function GET(req: NextRequest, { params }: { params: { skp_id: string } }) {
    await dbConnect();

    try {
        const { skp_id } = params;
        const page = req.nextUrl.searchParams.get('page');
        const limit = req.nextUrl.searchParams.get('limit');
        const filters = req.nextUrl.searchParams.get('filters');
        let skps;

        // Filter dasar untuk memastikan `skp` adalah array dan tidak kosong
        const baseFilter = {
            $expr: {
                $eq: [
                    { $arrayElemAt: ['$skp', -1] }, // Ambil elemen terakhir dari array `skp`
                    new mongoose.Types.ObjectId(skp_id) // Bandingkan dengan `skp_id`
                ]
            }
        };

        // console.log(await SKP.find(baseFilter));
        

        if (!page || !limit || page === 'undefined' || limit === 'undefined') {
            // Jika tidak ada pagination, gunakan filter dasar
            skps = await SKP.find(baseFilter).populate('skp').populate('periodeRKT');
        } else {

            const skip = (Number(page) - 1) * Number(limit);
            console.log({
                ...baseFilter,
                ...buildFilterQuery(JSON.parse(filters as string))
            });
            
            const query = await SKP.find({
                ...baseFilter,
                ...buildFilterQuery(JSON.parse(filters as string))
            }).skip(skip).limit(Number(limit)).populate('skp').populate('periodeRKT').populate('messageSKP');

            const total = await SKP.countDocuments({
                ...baseFilter,
                ...buildFilterQuery(JSON.parse(filters as string))
            });

            skps = {
                data: query,
                total,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(total / Number(limit)),
                    totalItems: total,
                    pageSize: limit
                }
            }
        }

        return NextResponse.json(createResponse(200, 'Success', skps, true));
    } catch (error) {
        console.error('GET error:', error);
        return NextResponse.json({ error: 'Failed to Get SKP' }, { status: 500 });
    }
}

export async function POST(req: NextRequest, { params }: { params: { skp_id: string } }) {
    await dbConnect();
    try {
        const { skp_id } = params;
        const body = await req.json();
        const skp: any = await SKP.findById(skp_id);

        const errors = validateSKPData(body);
        if (errors.length > 0) {
            return NextResponse.json(createResponse(400, 'Validation Failed', errors));
        }

        if (!skp) {
            return NextResponse.json(createResponse(400, 'Validation Failed', 'SKP tidak ditemukan'));
        }

        // const userSkp = await SKP.find{{skp:skp._id, user_id: body.user_id}};
        const userSkp = await SKP.findOne({
            skp: skp._id,
            user_id: body.user_id,
            periodeRKT: skp.periodeRKT
        });

        console.log('SKP', userSkp);

        if (userSkp) {
            return NextResponse.json(createResponse(400, 'Validation Failed', 'SKP sudah ada'));
        }

        const updatedBody = { ...body, skp: [skp._id], periodeRKT: [skp.periodeRKT], periode_awal: skp.periode_awal, periode_akhir: skp.periode_akhir };
        const newSKP = new SKP(updatedBody);
        const message = new MessageSKP({
            skp: newSKP._id,
            status: 'submitted',
            user_id: body.user_id
        });
        await message.save()
        await newSKP.save();
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
        }
        return NextResponse.json(createResponse(201, 'Success', newSKP, true));
    } catch (error) {
        console.error('POST error:', error);
        return NextResponse.json({ error: 'Failed to create SKP' }, { status: 500 });
    }
}
