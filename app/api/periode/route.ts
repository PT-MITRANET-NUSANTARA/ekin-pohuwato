import { NextRequest, NextResponse } from 'next/server';
import Periode from '../../../models/Periode';

import Joi from 'joi';
import dbConnect from '@/utils/db';
import { createResponse } from '@/utils/api';
import Visi from '@/models/Visi';
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

const periodeSchema = Joi.object({
    periode_start: Joi.date().required().label('Periode Mulai'),
    periode_end: Joi.date().required().label('Periode Selesai'),
    __v: Joi.optional(),
    _id: Joi.optional(),
    createdAt: Joi.date().optional(),
    updatedAt: Joi.date().optional()
}).messages({
    'any.required': '{{#label}} wajib diisi.',
    'date.base': '{{#label}} harus berupa tanggal yang valid.'
});

function validatePeriodeData(data: any) {
    const { error } = periodeSchema.validate(data, { abortEarly: false });
    if (error) {
        return error.details.map((err) => err.message);
    }
    return [];
}

export async function GET(req: NextRequest) {
    await dbConnect();

    try {
        const id = req.nextUrl.searchParams.get('id');
        let periodes;
        if (id) {
            periodes = await Periode.findOne({ _id: id });
        } else {
            periodes = await Periode.find({});
        }

        return NextResponse.json(createResponse(200, 'Success', periodes, true));
    } catch (error) {
        console.error('GET error:', error);
        return NextResponse.json({ error: 'Failed to fetch Periode data' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    await dbConnect();

    try {
        const body = await req.json();

        const errors = validatePeriodeData(body);
        if (errors.length > 0) {
            return NextResponse.json(createResponse(400, 'Failed', errors));
        }

        const newPeriode = new Periode(body);
        await newPeriode.save();
        return NextResponse.json(createResponse(201, 'Success', newPeriode, true));
    } catch (error) {
        console.error('POST error:', error);
        return NextResponse.json({ error: 'Failed to create Periode' }, { status: 500 });
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

        const errors = validatePeriodeData(body);
        if (errors.length > 0) {
            return NextResponse.json(createResponse(400, 'Failed', errors));
        }

        const updatedPeriode = await Periode.findOneAndUpdate({ _id: id }, body, { new: true });

        if (!updatedPeriode) {
            return NextResponse.json(createResponse(404, 'Periode not found', null));
        }

        return NextResponse.json(createResponse(200, 'Success', updatedPeriode, true));
    } catch (error) {
        console.error('PUT error:', error);
        return NextResponse.json({ error: 'Failed to update Periode' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    await dbConnect();

    try {
        const id = req.nextUrl.searchParams.get('id');

        if (!id || typeof id !== 'string') {
            return NextResponse.json(createResponse(400, 'Invalid or missing ID', null));
        }

        const deletedPeriode = await Periode.findByIdAndDelete(id);
        if (!deletedPeriode) {
            return NextResponse.json(createResponse(404, 'Periode not found', null));
        }

        const visis_id = await Visi.find({ periode: id });
        await Visi.deleteMany({ periode: id });

        const misi_id = await Misi.find({ visi: { $in: visis_id } });
        await Misi.deleteMany({ visi: { $in: visis_id } });

        const renstra_id = await Renstra.find({ misi: { $in: misi_id } });
        await Renstra.deleteMany({ misi: { $in: misi_id } });

        const tujuans_id = await Tujuan.find({ renstra: { $in: renstra_id } });
        await Tujuan.deleteMany({ renstra: { $in: renstra_id } });

        const programs_id = await Program.find({ tujuan: { $in: tujuans_id } });
        await Program.deleteMany({ tujuan: { $in: tujuans_id } });

        const kegiatans_id = await Kegiatan.find({ program: { $in: programs_id } });
        await Kegiatan.deleteMany({ program: { $in: programs_id } });

        const subKegiatans_id = await SubKegiatan.find({ kegiatan: { $in: kegiatans_id } });
        await SubKegiatan.deleteMany({ kegiatan: { $in: kegiatans_id } });

        const periodeRKTs_id = await PeriodeRKT.find({ subKegiatan: { $in: subKegiatans_id } });
        await PeriodeRKT.deleteMany({ subKegiatan: { $in: subKegiatans_id } });

        const tpps_id = await TPP.find({ periodeRKT: { $in: periodeRKTs_id } });
        await TPP.deleteMany({ periodeRKT: { $in: periodeRKTs_id } });

        const rkts_id = await RKT.find({ periodeRKT: { $in: periodeRKTs_id } });
        await RKT.deleteMany({ periodeRKT: { $in: periodeRKTs_id } });

        const rhks_rkt = await RHK.find({ rkt: { $in: rkts_id } });
        await RHK.deleteMany({ rkt: { $in: rkts_id } });

        await Aspek.deleteMany({ rhk: { $in: rhks_rkt } });
        await Harian.deleteMany({ rhk: { $in: rhks_rkt } });

        const skps_id = await SKP.find({ periodeRKT: { $in: periodeRKTs_id } });
        await SKP.deleteMany({ periodeRKT: { $in: periodeRKTs_id } });

        const rhks_skp = await RHK.find({ skp: { $in: skps_id } });
        await RHK.deleteMany({ skp: { $in: skps_id } });

        await Aspek.deleteMany({ rhk: { $in: rhks_skp } });
        await Harian.deleteMany({ rhk: { $in: rhks_skp } });

        await Perilaku.deleteMany({ skp: { $in: skps_id } });

        const periodePenilaians_id = await PeriodePenilaian.find({ skp: { $in: skps_id } });
        await PeriodePenilaian.deleteMany({ skp: { $in: skps_id } });

        await Penilaian.deleteMany({ periodePenilaian: { $in: periodePenilaians_id } });

        return NextResponse.json(createResponse(200, 'Success', deletedPeriode, true));
    } catch (error) {
        console.error('DELETE error:', error);
        return NextResponse.json(createResponse(500, 'Failed to delete Periode', null, false));
    }
}
