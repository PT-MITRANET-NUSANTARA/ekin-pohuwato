import { NextRequest, NextResponse } from 'next/server';
import UserRHK from '@/models/UserRHK';
import RHK from '@/models/RHK';
import Joi from 'joi';
import dbConnect from '@/utils/db';
import { createResponse } from '@/utils/api';
import Aspek from '@/models/Aspek';
import { aspek } from '@/utils/blueprint';
import SKP from '@/models/SKP';

const deriveRHKSchema = Joi.object({
    userRHKId: Joi.string().required().label('User RHK ID'),
    periodePenilaianId: Joi.string().required().label('Periode Penilaian ID'),
    skpId: Joi.string().required().label('SKP ID'),
}).messages({
    'any.required': '{{#label}} wajib diisi.',
    'string.base': '{{#label}} harus berupa teks.',
    'string.empty': '{{#label}} tidak boleh kosong.',
    'string.valid': '{{#label}} harus salah satu dari {{#valids}}.'
});

function validateDeriveRHKData(data: any) {
    const { error } = deriveRHKSchema.validate(data, { abortEarly: false });
    if (error) {
        return error.details.map((err) => err.message);
    }
    return [];
}

export async function POST(req: NextRequest) {
    await dbConnect();

    try {
        const body = await req.json();
        const { userRHKId, periodePenilaianId, skpId } = body;

        const errors = validateDeriveRHKData(body);
        if (errors.length > 0) {
            return NextResponse.json(createResponse(400, 'Failed', errors));
        }

        // Get the UserRHK to derive from (with all necessary data)
        const userRHK = await UserRHK.findById(userRHKId);
        if (!userRHK) {
            return NextResponse.json(createResponse(404, 'UserRHK not found', null));
        }

        // Get the SKP data separately to avoid type issues
        const skp = await SKP.findById(userRHK.skp);
        if (!skp) {
            return NextResponse.json(createResponse(404, 'SKP not found', null));
        }

        // Verify that the target SKP exists
        const targetSKP = await SKP.findById(skpId);
        if (!targetSKP) {
            return NextResponse.json(createResponse(404, 'Target SKP not found', null));
        }

        // Check if an RHK already exists for this UserRHK and periodePenilaian
        const existingRHK = await RHK.findOne({
            userRHK: userRHKId,
            periodePenilaian: periodePenilaianId
        });

        if (existingRHK) {
            return NextResponse.json(createResponse(400, 'RHK already exists for this UserRHK and period', null));
        }

        // Create a new RHK derived from the UserRHK
        const newRHK = new RHK({
            userRHK: userRHKId,
            periodePenilaian: periodePenilaianId,
            skp: skpId, // Use the provided SKP ID
            desc: userRHK.description || '', 
        });

        await newRHK.save();

        // Create default aspects based on the SKP approach
        if (skp.pendekatan && aspek[skp.pendekatan]) {
            for (const a of aspek[skp.pendekatan]) {
                const newAspek = new Aspek({
                    rhk: newRHK._id,
                    jenis: a.jenis,
                    indikator: a.indikator,
                    target_tahunan: a.target_tahunan
                });
    
                await newAspek.save();
            }
        }

        // Fetch the newly created RHK with its aspects
        const completeRHK = await RHK.findById(newRHK._id).populate('aspek');

        return NextResponse.json(createResponse(201, 'Success', completeRHK, true));
    } catch (error) {
        console.error('POST error:', error);
        return NextResponse.json(createResponse(500, 'Failed to derive RHK', error));
    }
} 