import { NextRequest, NextResponse } from 'next/server';
import Joi from 'joi';
import dbConnect from '@/utils/db';
import { createResponse } from '@/utils/api';
import RHK from '@/models/RHK';

const rhkSchema = Joi.object({
    skp: Joi.string().required().label('SKP'),
    rhk: Joi.string().optional().label('RHK').allow(null),
    rkt: Joi.string().optional().label('RKT').allow(null),
    desc: Joi.string().required().label('Deskripsi'),
    jenis: Joi.string().valid('utama', 'tambahan', 'Utama', 'Tambahan').required().label('Jenis'),
    rencana: Joi.object().label('Rencana'),
    klasifikasi: Joi.string().valid('organisasi', 'individu', 'Organisasi', 'Individu').optional().label('Klasifikasi'),
    __v: Joi.optional(),
    unit: Joi.object().required().label('Unit'),
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

export async function GET(req: NextRequest, { params }: { params: { rhk_id: string } }) {
    await dbConnect();

    try {
        const { rhk_id } = params;
        const rhk = await RHK.findById(rhk_id).populate('skp').populate('userRHK');
        if (!rhk) {
            return NextResponse.json({ error: 'RHK not found' }, { status: 404 });
        }
        const rhks = await rhkRecursive(rhk);
        return NextResponse.json(createResponse(200, 'Success', rhks, true));
    } catch (error) {
        console.error('GET error:', error);
        return NextResponse.json({ error: 'Failed to fetch Periode RKT data' }, { status: 500 });
    }
}

const rhkRecursive = async (rhk: any) => {
    // Konversi dokumen Mongoose ke objek biasa, tambahkan properti child dan childUnique
    const data = { ...rhk.toObject(), child: [], childUnique: [] };

    // Ambil child berdasarkan parent ID
    const children = await RHK.find({ rhk: rhk._id }).populate('skp').populate('userRHK');
    console.log(children);

    if (children && children.length > 0) {
        // Proses rekursif untuk setiap child (struktur tanpa grouping)
        const recursiveChildren = await Promise.all(children.map(async (child: any) => await rhkRecursive(child)));

        // Simpan struktur rekursif "normal" ke properti child
        data.child = recursiveChildren;

        // Lakukan grouping berdasarkan skp._id untuk membuat struktur unik
        const grouped = recursiveChildren.reduce(
            (acc, child) => {
                // Gunakan key dari skp._id atau key default 'no-skp'
                const skpId = child.skp?._id?.toString() || 'no-skp';
                if (!acc[skpId]) {
                    acc[skpId] = {
                        skp: child.skp, // informasi skp dari child tersebut
                        child: child
                    };
                }
                return acc;
            },
            {} as { [key: string]: { skp: any; childItem: any[] } }
        );

        // Simpan hasil grouping ke properti childUnique
        data.childUnique = Object.values(grouped);
    }

    return data;
};
