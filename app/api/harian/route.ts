import { NextRequest, NextResponse } from 'next/server';
import Harian from '../../../models/Harian';
import Joi from 'joi';
import dbConnect from '@/utils/db';
import { createResponse } from '@/utils/api';

const harianSchema = Joi.object({
    date: Joi.date().required().label('Tanggal'),
    startDateTime: Joi.string().required().label('Waktu Mulai'),
    endDateTime: Joi.string().required().label('Waktu Selesai'),
    rhk: Joi.string().required().label('RHK'),
    namaKegiatan: Joi.string().required().label('Nama Kegiatan'),
    deskripsiKegiatan: Joi.string().required().label('Deskripsi Kegiatan'),
    tautan: Joi.string().uri().label('Tautan'),
    files: Joi.array().items(Joi.object()).label('Berkas'),
    user_id: Joi.string().required().label('User ID'), // Menambahkan user_id ke skema
    createdAt: Joi.date().optional(),
    isSKP: Joi.boolean().optional(),
    updatedAt: Joi.date().optional(),
    progress: Joi.number().required().label('Progress'),
    absence: Joi.string().required().label('Absensi'),
    msg: Joi.object({
        status: Joi.string().optional().label('status msg'),
        message: Joi.string().optional().allow('').label('message msg')
    })
        .optional()
        .label('msg'),
    __v: Joi.optional(),
    _id: Joi.optional(),
    id: Joi.optional()
}).messages({
    'any.required': '{{#label}} wajib diisi.',
    'string.base': '{{#label}} harus berupa teks.',
    'string.empty': '{{#label}} tidak boleh kosong.',
    'date.base': '{{#label}} harus berupa tanggal yang valid.',
    'string.uri': '{{#label}} harus berupa tautan URL yang valid.',
    'array.base': '{{#label}} harus berupa array.'
});

function validateHarianData(data: any) {
    const { error } = harianSchema.validate(data, { abortEarly: false });
    if (error) {
        return error.details.map((err) => err.message);
    }
    return [];
}

export async function GET(req: NextRequest) {
    await dbConnect();

    try {
        const user_id = req.headers.get('user-id');
        const id = req.nextUrl.searchParams.get('id');
        const absence = req.nextUrl.searchParams.get('absence');
        let harian = [];

        if (id) {
            harian = await Harian.findOne({ _id: id, user_id });
        } else if (user_id) {
            if (absence) {
                harian = await Harian.find({ user_id, absence }).populate({
                    path: 'rhk',
                    populate: {
                        path: 'skp',
                        
                    }
                });
            } else {
                harian = await Harian.find({ user_id }).populate({
                    path: 'rhk',
                    populate: {
                        path: 'skp',
                        populate: {
                            path: 'skp'
                        }
                    }
                });
            }
        } else if (user_id) {
            harian = await Harian.find({ user_id }).populate({
                path: 'skp',
                populate: {
                    path: 'skp'
                }
            });
            
        } else {
            harian = await Harian.find({});
        }

        return NextResponse.json(createResponse(200, 'Success', harian, true));
    } catch (error) {
        console.error('GET error:', error);
        return NextResponse.json({ error: 'Failed to fetch Harian data' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    await dbConnect();
    try {
        const user_id = req.headers.get('user-id');

        if (!user_id) {
            return NextResponse.json(createResponse(400, 'User ID is required', null));
        }

        const body = await req.json();

        const bodyWithUser = { ...body, user_id };

        const errors = validateHarianData(bodyWithUser);
        if (errors.length > 0) {
            return NextResponse.json(createResponse(400, 'Failed', errors));
        }

        const newHarian = new Harian(bodyWithUser);
        await newHarian.save();
        return NextResponse.json(createResponse(201, 'Success', newHarian, true));
    } catch (error) {
        console.error('POST error:', error);
        return NextResponse.json({ error: 'Failed to create Harian' }, { status: 500 });
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

        const errors = validateHarianData(body);
        if (errors.length > 0) {
            return NextResponse.json(createResponse(400, 'Failed', errors));
        }

        const updatedHarian = await Harian.findOneAndUpdate({ _id: id }, body, { new: true });

        if (!updatedHarian) {
            return NextResponse.json(createResponse(404, 'Harian not found', null));
        }

        return NextResponse.json(createResponse(200, 'Success', updatedHarian, true));
    } catch (error) {
        console.error('PUT error:', error);
        return NextResponse.json({ error: 'Failed to update Harian' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    await dbConnect();

    try {
        const user_id = req.headers.get('user-id');
        const id = req.nextUrl.searchParams.get('id');

        if (!id || typeof id !== 'string') {
            return NextResponse.json(createResponse(400, 'Invalid or missing ID', null));
        }

        const deletedHarian = await Harian.findOneAndDelete({ _id: id, user_id });
        if (!deletedHarian) {
            return NextResponse.json(createResponse(404, 'Harian not found', null));
        }

        return NextResponse.json(createResponse(200, 'Success', deletedHarian, true));
    } catch (error) {
        console.error('DELETE error:', error);
        return NextResponse.json({ error: 'Failed to delete Harian' }, { status: 500 });
    }
}
