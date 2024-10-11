import { NextRequest, NextResponse } from 'next/server';
import PeriodeRKT from '../../../models/PeriodeRKT'; 
import SubKegiatan from '../../../models/SubKegiatan'; // Assuming SubKegiatan model exists
import Joi from 'joi';
import dbConnect from '@/utils/db';
import { createResponse } from '@/utils/api';

// Joi schema for PeriodeRKT validation
const periodeRKTSchema = Joi.object({
  periode_start: Joi.date().required().label('Periode Mulai'),
  periode_end: Joi.date().required().label('Periode Selesai'),
  perjanjianKinerja: Joi.string().required().label('Perjanjian Kinerja'),
  __v: Joi.optional(),
  _id: Joi.optional(),
  createdAt: Joi.date().optional(),
  updatedAt: Joi.date().optional(),
}).messages({
  'any.required': '{{#label}} wajib diisi.',
  'string.base': '{{#label}} harus berupa teks.',
  'string.empty': '{{#label}} tidak boleh kosong.',
  'string.hex': '{{#label}} harus berupa nilai heksadesimal yang valid.',
  'string.length': '{{#label}} harus memiliki panjang tepat {{#limit}} karakter.',
  'string.pattern.base': '{{#label}} harus berupa tahun yang valid (4 digit).',
  'date.base': '{{#label}} harus berupa tanggal yang valid.',
});

function validatePeriodeRKTData(data: any) {
  const { error } = periodeRKTSchema.validate(data, { abortEarly: false });
  if (error) {
    return error.details.map((err) => err.message);
  }
  return [];
}

// GET method to fetch PeriodeRKT
export async function GET(req: NextRequest) {
  await dbConnect();

  try {
    const id = req.nextUrl.searchParams.get('id');
    let periodeRKTs;

    if (id) {
      periodeRKTs = await PeriodeRKT.findOne({ _id: id }).populate('subKegiatan');
    } else {
      periodeRKTs = await PeriodeRKT.find({}).populate('subKegiatan');
    }

    return NextResponse.json(createResponse(200, 'Success', periodeRKTs, true));
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch Periode RKT data' }, { status: 500 });
  }
}

// POST method to create PeriodeRKT
export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const body = await req.json();
    
    const errors = validatePeriodeRKTData(body);
    if (errors.length > 0) {
      return NextResponse.json(createResponse(400, 'Failed', errors));
    }

    const newPeriodeRKT = new PeriodeRKT(body);
    await newPeriodeRKT.save();
    return NextResponse.json(createResponse(201, 'Success', newPeriodeRKT, true));
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ error: 'Failed to create Periode RKT' }, { status: 500 });
  }
}

// PUT method to update PeriodeRKT
export async function PUT(req: NextRequest) {
  await dbConnect();

  try {
    const body = await req.json();
    const id = req.nextUrl.searchParams.get('id');
    if (!id || typeof id !== 'string') {
      return NextResponse.json(createResponse(400, 'Invalid or missing ID', null));
    }

    const errors = validatePeriodeRKTData(body);
    if (errors.length > 0) {
      return NextResponse.json(createResponse(400, 'Failed', errors));
    }

    const updatedPeriodeRKT = await PeriodeRKT.findOneAndUpdate(
      { _id: id },
      body,
      { new: true }
    );

    if (!updatedPeriodeRKT) {
      return NextResponse.json(createResponse(404, 'Periode RKT not found', null));
    }

    return NextResponse.json(createResponse(200, 'Success', updatedPeriodeRKT, true));
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ error: 'Failed to update Periode RKT' }, { status: 500 });
  }
}

// DELETE method to delete PeriodeRKT
export async function DELETE(req: NextRequest) {
  await dbConnect();

  try {
    const id = req.nextUrl.searchParams.get('id');
    if (!id || typeof id !== 'string') {
      return NextResponse.json(createResponse(400, 'Invalid or missing ID', null));
    }

    const deletedPeriodeRKT = await PeriodeRKT.findByIdAndDelete(id);
    if (!deletedPeriodeRKT) {
      return NextResponse.json(createResponse(404, 'Periode RKT not found', null));
    }

    return NextResponse.json(createResponse(200, 'Success', deletedPeriodeRKT, true));
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete Periode RKT' }, { status: 500 });
  }
}
