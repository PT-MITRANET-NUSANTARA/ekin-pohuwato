import { NextRequest, NextResponse } from 'next/server';
import Visi from '../../../models/Visi';

import Joi from 'joi';
import dbConnect from '@/utils/db';
import { createResponse } from '@/utils/api';
import Misi from '@/models/Misi';
import Renstra from '@/models/Renstra';
import Tujuan from '@/models/Tujuan';
import Program from '@/models/Program';
import Kegiatan from '@/models/Kegiatan';
import PeriodeRKT from '@/models/PeriodeRKT';
import SubKegiatan from '@/models/SubKegiatan';
import RKT from '@/models/RKT';
import SKP from '@/models/SKP';
import RHK from '@/models/RHK';
import Aspek from '@/models/Aspek';
import Harian from '@/models/Harian';
import Perilaku from '@/models/Perilaku';
import Penilaian from '@/models/Penilaian';
import PeriodePenilaian from '@/models/PeriodePenilaian';
import TPP from '@/models/TPP';

const visiSchema = Joi.object({
    name: Joi.string().required().label('Nama Visi'),
    periode: Joi.string().hex().length(24).required().label('Periode'), // Expecting a string ObjectId
    __v: Joi.optional(),
    _id: Joi.optional(),
    createdAt: Joi.date().optional(),
    updatedAt: Joi.date().optional()
}).messages({
    'any.required': '{{#label}} wajib diisi.',
    'string.base': '{{#label}} harus berupa teks.',
    'string.empty': '{{#label}} tidak boleh kosong.',
    'string.hex': '{{#label}} harus berupa nilai heksadesimal yang valid.',
    'string.length': '{{#label}} harus memiliki panjang tepat {{#limit}} karakter.'
});

// Function to validate Visi data
function validateVisiData(data: any) {
    const { error } = visiSchema.validate(data, { abortEarly: false });
    if (error) {
        return error.details.map((err) => err.message);
    }
    return [];
}

// GET method to fetch Visi data
export async function GET(req: NextRequest) {
    await dbConnect();

    try {
        const id = req.nextUrl.searchParams.get('id');
        let visis;
        if (id) {
            visis = await Visi.findOne({ _id: id }).populate('periode'); // Populate the periode reference
        } else {
            visis = await Visi.find({}).populate('periode'); // Populate the periode reference
        }

        return NextResponse.json(createResponse(200, 'Success', visis, true));
    } catch (error) {
        console.error('GET error:', error);
        return NextResponse.json({ error: 'Failed to fetch Visi data' }, { status: 500 });
    }
}

// POST method to create a new Visi record
export async function POST(req: NextRequest) {
    await dbConnect();

    try {
        const body = await req.json();

        const errors = validateVisiData(body);
        if (errors.length > 0) {
            return NextResponse.json(createResponse(400, 'Failed', errors));
        }

        const newVisi = new Visi(body);
        await newVisi.save();
        return NextResponse.json(createResponse(201, 'Success', newVisi, true));
    } catch (error) {
        console.error('POST error:', error);
        return NextResponse.json({ error: 'Failed to create Visi' }, { status: 500 });
    }
}

// PUT method to update an existing Visi record
export async function PUT(req: NextRequest) {
    await dbConnect();

    try {
        const body = await req.json();
        const id = req.nextUrl.searchParams.get('id');
        if (!id || typeof id !== 'string') {
            return NextResponse.json(createResponse(400, 'Invalid or missing ID', null));
        }

        const errors = validateVisiData(body);
        if (errors.length > 0) {
            return NextResponse.json(createResponse(400, 'Failed', errors));
        }

        const updatedVisi = await Visi.findOneAndUpdate({ _id: id }, body, { new: true });

        if (!updatedVisi) {
            return NextResponse.json(createResponse(404, 'Visi not found', null));
        }

        return NextResponse.json(createResponse(200, 'Success', updatedVisi, true));
    } catch (error) {
        console.error('PUT error:', error);
        return NextResponse.json({ error: 'Failed to update Visi' }, { status: 500 });
    }
}

// DELETE method to remove an existing Visi record
export async function DELETE(req: NextRequest) {
    await dbConnect();

    try {
        const id = req.nextUrl.searchParams.get('id');
        if (!id || typeof id !== 'string') {
            return NextResponse.json(createResponse(400, 'Invalid or missing ID', null));
        }

        const deletedVisi = await Visi.findByIdAndDelete(id);
        if (!deletedVisi) {
            return NextResponse.json(createResponse(404, 'Visi not found', null));
        }
        const misi_id = await Misi.find({ visi: id }).select('_id');
        const misis = await Misi.deleteMany({ visi: id });

        const resntras = await Renstra.deleteMany({ misi: { $in: misi_id.map((misi) => misi._id) } });

        const Tujuans = await Tujuan.deleteMany({ renstra: { $in: resntras } });
        const Programs = await Program.deleteMany({ tujuan: { $in: Tujuans } });
        const Kegiatans = await Kegiatan.deleteMany({ program: { $in: Programs } });
        const SubKegiatans = await SubKegiatan.deleteMany({ kegiatan: { $in: Kegiatans } });
        const PeriodeRKTS = await PeriodeRKT.deleteMany({ subKegiatan: { $in: SubKegiatans } });

        const TPPS = await TPP.deleteMany({ periodeRKT: { $in: PeriodeRKTS } });
        const RKTS = await RKT.deleteMany({ periodeRKT: { $in: PeriodeRKTS } });
        const RHKS_RKT = await RHK.deleteMany({ rkt: { $in: RKTS } });
        await Aspek.deleteMany({ rhk: { $in: RHKS_RKT } });
        await Harian.deleteMany({ rhk: { $in: RHKS_RKT } });

        const SKPS = await SKP.deleteMany({ periodeRKT: { $in: PeriodeRKTS } });
        const RHKS_SKP = await RHK.deleteMany({ skp: { $in: SKPS } });
        await Aspek.deleteMany({ rhk: { $in: RHKS_SKP } });
        await Harian.deleteMany({ rhk: { $in: RHKS_SKP } });

        await Perilaku.deleteMany({ skp: { $in: SKPS } });
        const PeriodePenilaians = await PeriodePenilaian.deleteMany({ skp: { $in: SKPS } });
        await Penilaian.deleteMany({ periodePenilaian: { $in: PeriodePenilaians } });

        return NextResponse.json(createResponse(200, 'Success', deletedVisi, true));
    } catch (error) {
        console.error('DELETE error:', error);
        return NextResponse.json({ error: 'Failed to delete Visi' }, { status: 500 });
    }
}
