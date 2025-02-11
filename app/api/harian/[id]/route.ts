import { NextRequest, NextResponse } from 'next/server';
import Joi from 'joi';
import dbConnect from '@/utils/db';
import { createResponse } from '@/utils/api';
import Harian from '@/models/Harian';
import MessageHarian from '@/models/MessageHarian';
import Absence from '@/models/Absence';
import Notification from '@/models/Notification';

const harianSchema = Joi.object({
    date: Joi.date().required().label('Tanggal'),
    startDateTime: Joi.string().required().label('Waktu Mulai'),
    endDateTime: Joi.string().required().label('Waktu Selesai'),
    rhk: Joi.string().required().label('RHK'),
    namaKegiatan: Joi.string().required().label('Nama Kegiatan'),
    deskripsiKegiatan: Joi.string().required().label('Deskripsi Kegiatan'),
    tautan: Joi.string().uri().label('Tautan'),
    files: Joi.array().items(Joi.object()).label('Berkas'),
    createdAt: Joi.date().optional(),
    skp: Joi.string().required().label('SKP'),
    status: Joi.string().valid('submitted', 'approved', 'rejected').label('Status').optional(),
    isSKP: Joi.boolean().optional(),
    updatedAt: Joi.date().optional(),
    progress: Joi.number().required().label('Progress'),
    absence: Joi.string().required().label('Absensi'),
    msg: Joi.string().optional().label('msg'),
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
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    await dbConnect();

    try {
        const { id } = params;
        const harian = await Harian.findById(id);

        return NextResponse.json(createResponse(200, 'Success', harian, true));
    } catch (error) {
        console.error('GET error:', error);
        return NextResponse.json({ error: 'Failed to fetch Harian data' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    await dbConnect();

    try {
        const { id } = params;
        const body = await req.json();

        const errors = validateHarianData(body);
        if (errors.length > 0) {
            return NextResponse.json(createResponse(400, 'Failed', errors));
        }

        const updatedHarian = await Harian.findOneAndUpdate({ _id: id }, body, { new: true });
        const absence = await Absence.findById(body.absence);
        const msg = new MessageHarian({
            harian: id,
            status: body.status,
            isi: body.status === 'rejected' ? body.msg : ' '
        });

        await msg.save();
        const notification = new Notification({
            user_id: absence?.jabatan?.nip_asn,
            message: `Harian ${body.status === 'rejected' ? 'ditolak' : 'disetujui'}`,
            type: body.status === 'rejected' ? 'error' : 'success'
        });

        await notification.save();

        if (!updatedHarian) {
            return NextResponse.json(createResponse(404, 'Harian not found', null));
        }

        return NextResponse.json(createResponse(200, 'Success', updatedHarian, true));
    } catch (error) {
        console.error('PUT error:', error);
        return NextResponse.json({ error: 'Failed to update Harian' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    await dbConnect();

    try {
        const { id } = params;

        const deletedHarian = await Harian.findById(id);
        if (!deletedHarian) {
            return NextResponse.json(createResponse(404, 'Harian not found', null));
        }
        await deletedHarian.cascadeDelete();

        return NextResponse.json(createResponse(200, 'Success', deletedHarian, true));
    } catch (error) {
        console.error('DELETE error:', error);
        return NextResponse.json({ error: 'Failed to delete Harian' }, { status: 500 });
    }
}
