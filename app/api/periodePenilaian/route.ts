import { NextRequest, NextResponse } from 'next/server';
import PeriodePenilaian from '../../../models/PeriodePenilaian'; 
import Joi from 'joi';
import dbConnect from '@/utils/db';
import { createResponse } from '@/utils/api';

// Schema for validating PeriodePenilaian
const periodePenilaianSchema = Joi.object({
  periodeStart: Joi.date().required().label('Periode Mulai'),
  periodeEnd: Joi.date().required().label('Periode Selesai'),
  name: Joi.string().required().label('Name'),
  skp: Joi.string().hex().length(24).required().label('SKP'), // Expecting string ObjectId
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
  'date.base': '{{#label}} harus berupa tanggal yang valid.',
});

function validatePeriodePenilaianData(data: any) {
  const { error } = periodePenilaianSchema.validate(data, { abortEarly: false });
  if (error) {
    return error.details.map((err) => err.message);
  }
  return [];
}

// GET method to fetch PeriodePenilaian
export async function GET(req: NextRequest) {
  await dbConnect();

  try {
    const id = req.nextUrl.searchParams.get('id');
    const skp_id = req.headers.get('skp-id');
    let periodePenilaians;

    if (id) {
      periodePenilaians = await PeriodePenilaian.findOne({ _id: id }).populate('skp');
    } 
    else if (skp_id) {
      periodePenilaians = await PeriodePenilaian.find({ skp: skp_id }).populate('skp');
    }
    else {
      periodePenilaians = await PeriodePenilaian.find({}).populate('skp');
    }

    return NextResponse.json(createResponse(200, 'Success', periodePenilaians, true));
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch Periode Penilaian data' }, { status: 500 });
  }
}

// POST method to create PeriodePenilaian
export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const body = await req.json();
    
    const errors = validatePeriodePenilaianData(body);
    if (errors.length > 0) {
      return NextResponse.json(createResponse(400, 'Failed', errors));
    }

    const newPeriodePenilaian = new PeriodePenilaian(body);
    await newPeriodePenilaian.save();
    return NextResponse.json(createResponse(201, 'Success', newPeriodePenilaian, true));
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ error: 'Failed to create Periode Penilaian' }, { status: 500 });
  }
}

// PUT method to update PeriodePenilaian
export async function PUT(req: NextRequest) {
  await dbConnect();

  try {
    const body = await req.json();
    const id = req.nextUrl.searchParams.get('id');
    if (!id || typeof id !== 'string') {
      return NextResponse.json(createResponse(400, 'Invalid or missing ID', null));
    }

    const errors = validatePeriodePenilaianData(body);
    if (errors.length > 0) {
      return NextResponse.json(createResponse(400, 'Failed', errors));
    }

    const updatedPeriodePenilaian = await PeriodePenilaian.findOneAndUpdate(
      { _id: id },
      body,
      { new: true }
    );

    if (!updatedPeriodePenilaian) {
      return NextResponse.json(createResponse(404, 'Periode Penilaian not found', null));
    }

    return NextResponse.json(createResponse(200, 'Success', updatedPeriodePenilaian, true));
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ error: 'Failed to update Periode Penilaian' }, { status: 500 });
  }
}

// DELETE method to delete PeriodePenilaian
export async function DELETE(req: NextRequest) {
  await dbConnect();

  try {
    const id = req.nextUrl.searchParams.get('id');
    if (!id || typeof id !== 'string') {
      return NextResponse.json(createResponse(400, 'Invalid or missing ID', null));
    }

    const deletedPeriodePenilaian = await PeriodePenilaian.findByIdAndDelete(id);
    if (!deletedPeriodePenilaian) {
      return NextResponse.json(createResponse(404, 'Periode Penilaian not found', null));
    }

    return NextResponse.json(createResponse(200, 'Success', deletedPeriodePenilaian, true));
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete Periode Penilaian' }, { status: 500 });
  }
}
