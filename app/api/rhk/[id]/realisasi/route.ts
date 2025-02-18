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
        const jenis = req.nextUrl.searchParams.get('jenis');
        const aspek = req.nextUrl.searchParams.get('aspek');
        const periode = req.nextUrl.searchParams.get('periode');

        // Validasi aspek dan periode
        const rhkAspek = await Aspek.findById(aspek);
        if (!rhkAspek) {
            return NextResponse.json({ error: 'Aspek tidak ditemukan' }, { status: 404 });
        }

        const rhkPeriode = await PeriodePenilaian.findById(periode);
        if (!rhkPeriode) {
            return NextResponse.json({ error: 'Periode tidak ditemukan' }, { status: 404 });
        }

        // Jika jenis aspek adalah 'deskripsi', kembalikan realisasi langsung
        if (rhkAspek.jenis === 'deskripsi') {
            return NextResponse.json(
                createResponse(
                    200,
                    'Success',
                    rhkAspek.realisasi && typeof rhkAspek.realisasi === 'object' && 'isi' in rhkAspek.realisasi 
                        ? (rhkAspek.realisasi as { isi: string }).isi 
                        : '',
                    true
                )
            );
            
        }

        let realisasi;

        // Jika jenis adalah 'utama', hitung realisasi secara rekursif
        if (jenis === 'utama') {
            const rhk = await RHK.findById(id);
            if (!rhk) {
                return NextResponse.json({ error: 'RHK tidak ditemukan' }, { status: 404 });
            }

            if (rhkAspek.jenis === 'kualitas') {
                realisasi = await kualitasRecursive(rhkAspek, rhkPeriode, rhk, 0);
            } else if (rhkAspek.jenis === 'kuantitas') {
                realisasi = await kuantitasRecursive(rhkAspek, rhkPeriode, rhk, 0);
            } else if (rhkAspek.jenis === 'waktu') {
                realisasi = await waktuRecursive(rhkAspek, rhkPeriode, rhk, 0);
            }
        } else {
            // Jika bukan 'utama', hitung realisasi berdasarkan harian
            const rhk = await RHK.findById(id);
            if (!rhk) {
                return NextResponse.json({ error: 'RHK tidak ditemukan' }, { status: 404 });
            }

            const harian = await Harian.find({
                rhk: rhk._id,
                isSKP: true,
                date: {
                    $gte: rhkPeriode.periodeStart,
                    $lte: rhkPeriode.periodeEnd
                }
            });

            realisasi = getRealisasi(rhkAspek, harian);
        }

        return NextResponse.json(createResponse(200, 'Success', realisasi, true));
    } catch (error) {
        console.error('GET error:', error);
        return NextResponse.json({ error: 'Gagal mengambil data RHK' }, { status: 500 });
    }
}

const kualitasRecursive = async (aspek: any, periode: any, rhk: any, realisasi: number): Promise<string> => {
    let tmp = realisasi;

    // Ambil data harian untuk RHK saat ini
    const harian = await Harian.find({
        rhk: rhk._id,
        isSKP: true,
        date: {
            $gte: periode.periodeStart,
            $lte: periode.periodeEnd
        }
    });

    // Hitung persentase kualitas
    const percentase = harian.reduce((max, item) => {
        return item.progress > max.progress ? item : max;
    }, harian[0]);

    if (percentase) {
        const percent = (percentase.progress / 100) * aspek.target_tahunan.target;
        tmp += percent;
    } else {
        tmp += 0;
    }

    // Cari RHK bawahan
    const childRhk = await RHK.find({ rhk: rhk._id });

    // Jika ada bawahan, hitung realisasi secara rekursif
    if (childRhk.length > 0) {
        for (const item of childRhk) {
            tmp = parseFloat(await kualitasRecursive(aspek, periode, item, tmp));
        }
    }

    return tmp + '%';
};

const kuantitasRecursive = async (aspek: any, periode: any, rhk: any, realisasi: number): Promise<string> => {
    let tmp = realisasi;

    // Ambil data harian untuk RHK saat ini
    const harian = await Harian.find({
        rhk: rhk._id,
        isSKP: true,
        date: {
            $gte: periode.periodeStart,
            $lte: periode.periodeEnd
        }
    });

    // Hitung persentase kualitas
    const percentase = harian.reduce((max, item) => {
        return item.progress > max.progress ? item : max;
    }, harian[0]);

    if (percentase) {
        const target = aspek.target_tahunan.target;
        const realisasi = percentase.progress;
        const percent = Math.floor((realisasi / 100) * target); // Bulatkan ke bawah
        tmp += percent;
    } else {
        tmp += 0;
    }

    // Cari RHK bawahan
    const childRhk = await RHK.find({ rhk: rhk._id });

    // Jika ada bawahan, hitung realisasi secara rekursif
    if (childRhk.length > 0) {
        for (const item of childRhk) {
            tmp = parseFloat(await kualitasRecursive(aspek, periode, item, tmp));
        }
    }

    return tmp + ' ' + aspek.target_tahunan.satuan;
};

const waktuRecursive = async (aspek: any, periode: any, rhk: any, realisasi: number): Promise<string> => {
    let tmp = realisasi;

    // Ambil data harian untuk RHK saat ini
    const harian = await Harian.find({
        rhk: rhk._id,
        isSKP: true,
        date: {
            $gte: periode.periodeStart,
            $lte: periode.periodeEnd
        }
    });

    tmp += harian.length;
    // Cari RHK bawahan
    const childRhk = await RHK.find({ rhk: rhk._id });

    // Jika ada bawahan, hitung realisasi secara rekursif
    if (childRhk.length > 0) {
        for (const item of childRhk) {
            tmp = parseFloat(await kualitasRecursive(aspek, periode, item, tmp));
        }
    }

    return tmp + ' ' + aspek.target_tahunan.satuan;
};

const getRealisasi = (aspek: any, harian: any): string => {
    if (aspek.jenis === 'kualitas') {
        const percentase = harian.reduce((max:any, item:any) => {
            return item.progress > max.progress ? item : max;
        }, harian[0]);

        if (percentase) {
            const percent = (percentase.progress / 100) * aspek.target_tahunan.target;
            return percent + '%';
        } else {
            return '0%';
        }
    } else if (aspek.jenis === 'kuantitas') {
        const percentase = harian.reduce((max:any, item:any)  => {
            return item.progress > max.progress ? item : max;
        }, harian[0]);

        if (percentase) {
            const target = aspek.target_tahunan.target;
            const realisasi = percentase.progress;
            const percent = Math.floor((realisasi / 100) * target); // Bulatkan ke bawah
            return percent + ' ' + aspek.target_tahunan.satuan;
        } else {
            return '0%';
        }
    } else if (aspek.jenis === 'waktu') {
        return harian.length + ' ' + aspek.target_tahunan.satuan;
    } else {
        return '';
    }
};
