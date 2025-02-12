import { NextRequest, NextResponse } from 'next/server';
import Joi from 'joi';
import dbConnect from '@/utils/db';
import { createResponse } from '@/utils/api';
import Harian from '@/models/Harian';
import buildFilterQuery from '@/utils/buildFilterQuery';

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
    unit: Joi.object().required().label('Unit'),
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

export async function GET(req: NextRequest, { params }: { params: { absence_id: string } }) {
    await dbConnect();

    try {
        const { absence_id } = params;

        const populateOptions = {
            path: 'rhk',
            populate: {
                path: 'skp',
                populate: {
                    path: 'skp'
                }
            }
        };

        const page = req.nextUrl.searchParams.get('page');
        const limit = req.nextUrl.searchParams.get('limit');
        const filters = req.nextUrl.searchParams.get('filters');
        let harian;
        console.log(await Harian.find({}).populate('messageHarian'));
        
        if (!(page && limit) || page === 'undefined' || limit === 'undefined') {
            harian = await Harian.find({ absence_id: absence_id }).populate('messageHarian').populate(populateOptions);
        } else {
            console.log('HEREABSENCE');
            const skip = (Number(page) - 1) * Number(limit);
            const f = JSON.parse(filters as string);
            f['absence'] = absence_id;
            const query = await Harian.find(buildFilterQuery(f))
                .skip(skip)
                .limit(Number(limit))
               
                .populate({
                    path: 'rhk',
                    populate: {
                        path: 'skp'
                    }
                })
                .populate({
                    path: 'skp',
                    populate: {
                        path: 'skp'
                    }
                }) .populate('messageHarian');

            const total = await Harian.countDocuments(buildFilterQuery(f));

            harian = {
                data: query,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(total / Number(limit)),
                    totalItems: total,
                    pageSize: Number(limit)
                }
            };
        }

        return NextResponse.json(createResponse(200, 'Success', harian, true));
    } catch (error) {
        console.error('GET error:', error);
        return NextResponse.json({ error: 'Failed to fetch Periode RKT data' }, { status: 500 });
    }
}
