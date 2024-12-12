import { NextRequest, NextResponse } from 'next/server';
import SKP from '../../../models/SKP';
import RHK from '../../../models/RHK';
import Joi from 'joi';
import dbConnect from '@/utils/db';
import { createResponse } from '@/utils/api';
import { perilaku } from '@/utils/blueprint';
import Perilaku from '@/models/Perilaku';
import RKT from '@/models/RKT';
import Aspek from '@/models/Aspek';
import { IAspek } from '@/models/Aspek';

const skpSchema = Joi.object({
    periode_awal: Joi.date().required().label('Periode Awal'),
    periode_akhir: Joi.date().required().label('Periode Akhir'),
    pendekatan: Joi.string().valid('kualitatif', 'kuantitatif').required().label('Pendekatan'),
    keterangan: Joi.string().allow('').label('Keterangan'),
    user_id: Joi.string().required().label('User ID'),
    skp: Joi.array().items(Joi.string().optional()).optional().label('SKP'),
    __v: Joi.optional(),
    _id: Joi.optional(),
    id: Joi.optional(),
    jabatan: Joi.array().items(Joi.object().required()).required().label('Jabatan'),
    createdAt: Joi.date().optional(),
    updatedAt: Joi.date().optional(),
    periodeRKT: Joi.string().hex().length(24).required().label('PeriodeRKT'),
    renstra: Joi.string().hex().length(24).required().label('Renstra'),
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
        const user_id = req.headers.get('user-id');
        const skp_id = req.headers.get('skp-id');
        const periode_id = req.headers.get('periode-id');
        const id = req.nextUrl.searchParams.get('id');
        let skps = [];

        if (user_id) {
            if (skp_id) {
                
                skps = await SKP.findOne({
                    user_id: user_id, // Pastikan user_id sesuai
                    periodeRKT: periode_id, // Pastikan periode_id sesuai
                    skp: { $in: [skp_id] } // Cek apakah skp_id ada di dalam array skp
                  })  .populate({
                    path: 'rhks',
                    populate: [
                        { path: 'rhk', populate: { path: 'rkt' } },
                        { path: 'aspek', populate: { path: 'rhk' } }
                    ]
                })
                .populate('perilakus');;
            }
            else if (periode_id) {
                skps = await SKP.findOne({ user_id, periodeRKT: periode_id })
                    .populate({
                        path: 'rhks',
                        populate: [
                            { path: 'rhk', populate: { path: 'rkt' } },
                            { path: 'aspek', populate: { path: 'rhk' } }
                        ]
                    })
                    .populate('perilakus');
            } else {
                skps = id ? await SKP.findOne({ _id: id, user_id }).populate('rhks').populate('perilakus') : await SKP.find({ user_id }).populate('rhks');
            }
        } else if (skp_id) {
            skps = await SKP.find({ skp: { $in: [skp_id] } });
        } else if (id) {
            skps = await SKP.findOne({ _id: id })
                .populate('perilakus')
                .populate({
                    path: 'rhks',
                    populate: [
                        { path: 'rhk', populate: { path: 'rkt' } }, // Populate 'rhk' dan 'rkt' di dalamnya
                        { path: 'aspek' }, // Populate 'aspek'
                        { path: 'harians' }, // Populate 'harians'
                        { path: 'rkt' } // Populate 'rkt' secara langsung dari 'rhks'
                    ]
                })
                .populate('skp') // Populate 'skp'
                .populate('penilaians'); // Populate 'penilaians'
        } else {
            skps = await SKP.find({});
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
        const user_id = req.headers.get('user-id');
        const atasan = req.nextUrl.searchParams.get('atasan');
        if (!user_id) {
            return NextResponse.json(createResponse(400, 'User ID is required', null));
        }
        console.log('HERE', atasan);
        console.log('HEREE', typeof atasan);

        const body = await req.json();
        const bodyWithUser = { ...body, user_id };

        const errors = validateSKPData(bodyWithUser);

        if (errors.length > 0) {
            return NextResponse.json(createResponse(400, 'Validation Failed', errors));
        }

        const newSKP = new SKP(bodyWithUser);
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
            if (atasan == '1') {
                const rkts = await RKT.find({ periodeRKT: newSKP.periodeRKT });
                for (const rkt of rkts) {
                    const rhk = new RHK({
                        skp: newSKP._id,
                        rkt: rkt._id,
                        jenis: 'utama',
                        klasifikasi: 'organisasi',
                        desc: rkt.name,
                    });
                    await rhk.save();
                }
            }
        }

        return NextResponse.json(createResponse(201, 'Success', newSKP, true));
    } catch (error) {
        console.error('POST error:', error);
        return NextResponse.json({ error: 'Failed to create SKP' }, { status: 500 });
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

        const errors = validateSKPData(body);
        if (errors.length > 0) {
            return NextResponse.json(createResponse(400, 'Failed', errors));
        }
        const updatedSKP = await SKP.findOneAndUpdate({ _id: id }, body, { new: true });

        if (!updatedSKP) {
            return NextResponse.json(createResponse(404, 'SKP not found', null));
        }

        return NextResponse.json(createResponse(200, 'Success', updatedSKP, true));
    } catch (error) {
        console.error('PUT error:', error); // Added error logging
        return NextResponse.json({ error: 'Failed to update SKP' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    await dbConnect();

    try {
        const id = req.nextUrl.searchParams.get('id');

        if (!id || typeof id !== 'string') {
            return NextResponse.json(createResponse(400, 'Invalid or missing ID', null));
        }

        const deletedSKP = await SKP.findByIdAndDelete(id);
        if (!deletedSKP) {
            return NextResponse.json(createResponse(404, 'SKP not found', null));
        }

        await RHK.deleteMany({ skp: id });

        return NextResponse.json(createResponse(200, 'Success', deletedSKP, true));
    } catch (error) {
        console.error('DELETE error:', error); // Added error logging
        return NextResponse.json({ error: 'Failed to delete SKP' }, { status: 500 });
    }
}
