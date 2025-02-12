import { NextRequest, NextResponse } from 'next/server';
import Joi from 'joi';
import dbConnect from '@/utils/db';
import { createResponse } from '@/utils/api';
import Harian from '@/models/Harian';

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

// export async function GET(req: NextRequest, { params }: { params: { skp_id: string } }) {
//     await dbConnect();

//     try {
//         const { skp_id } = params;

//         const populateOptions = {
//             path: 'rhk',
//             populate: {
//                 path: 'skp',
//                 populate: {
//                     path: 'skp'
//                 }
//             }
//         };

//         const filter: any = { skp_id };
//         if (unit_id) filter['unit.id'] = unit_id;
//         if (date) filter.date = date;

//         const harian = await Harian.find(filter).populate(populateOptions);

//         return NextResponse.json(createResponse(200, 'Success', harian, true));
//     } catch (error) {
//         console.error('GET error:', error);
//         return NextResponse.json({ error: 'Failed to fetch Periode RKT data' }, { status: 500 });
//     }
// }
