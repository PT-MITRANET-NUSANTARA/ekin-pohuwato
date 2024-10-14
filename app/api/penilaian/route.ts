import { NextRequest, NextResponse } from 'next/server';
import Penilaian from '../../../models/Penilaian';
import Joi from 'joi';
import dbConnect from '@/utils/db';
import { createResponse } from '@/utils/api';

// Joi schema for validating Penilaian
const penilaianSchema = Joi.object({
  ratingKinerja: Joi.number().min(1).max(5).optional().label('Rating Kinerja'),
  ratingPerilaku: Joi.number().min(1).max(5).optional().required().label('Rating Perilaku'),
  periodePenilaian: Joi.string().hex().length(24).required().label('Periode Penilaian'), // Expecting string ObjectId
  __v: Joi.optional(),
  _id: Joi.optional(),
  createdAt: Joi.date().optional(),
  updatedAt: Joi.date().optional(),
}).messages({
  'any.required': '{{#label}} wajib diisi.',
  'number.base': '{{#label}} harus berupa angka.',
  'number.min': '{{#label}} harus bernilai minimal {{#limit}}.',
  'number.max': '{{#label}} harus bernilai maksimal {{#limit}}.',
  'string.hex': '{{#label}} harus berupa nilai heksadesimal yang valid.',
  'string.length': '{{#label}} harus memiliki panjang tepat {{#limit}} karakter.',
});

function validatePenilaianData(data: any) {
  const { error } = penilaianSchema.validate(data, { abortEarly: false });
  if (error) {
    return error.details.map((err) => err.message);
  }
  return [];
}

// GET method to fetch Penilaian
export async function GET(req: NextRequest) {
  await dbConnect();

  try {
    const id = req.nextUrl.searchParams.get('id');
    let penilaians;

    if (id) {
      penilaians = await Penilaian.findOne({ _id: id }).populate('periodePenilaian');
    } else {
      penilaians = await Penilaian.find({}).populate('periodePenilaian');
    }

    return NextResponse.json(createResponse(200, 'Success', penilaians, true));
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch Penilaian data' }, { status: 500 });
  }
}

// POST method to create Penilaian
export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const body = await req.json();
    
    const errors = validatePenilaianData(body);
    if (errors.length > 0) {
      return NextResponse.json(createResponse(400, 'Failed', errors));
    }

    const newPenilaian = new Penilaian(body);
    await newPenilaian.save();
    return NextResponse.json(createResponse(201, 'Success', newPenilaian, true));
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ error: 'Failed to create Penilaian' }, { status: 500 });
  }
}

// PUT method to update Penilaian
export async function PUT(req: NextRequest) {
  await dbConnect();

  try {
    const body = await req.json();
    const id = req.nextUrl.searchParams.get('id');
    if (!id || typeof id !== 'string') {
      return NextResponse.json(createResponse(400, 'Invalid or missing ID', null));
    }

    const errors = validatePenilaianData(body);
    if (errors.length > 0) {
      return NextResponse.json(createResponse(400, 'Failed', errors));
    }

    const updatedPenilaian = await Penilaian.findOneAndUpdate(
      { _id: id },
      body,
      { new: true }
    );

    if (!updatedPenilaian) {
      return NextResponse.json(createResponse(404, 'Penilaian not found', null));
    }

    return NextResponse.json(createResponse(200, 'Success', updatedPenilaian, true));
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ error: 'Failed to update Penilaian' }, { status: 500 });
  }
}

// DELETE method to delete Penilaian
export async function DELETE(req: NextRequest) {
  await dbConnect();

  try {
    const id = req.nextUrl.searchParams.get('id');
    if (!id || typeof id !== 'string') {
      return NextResponse.json(createResponse(400, 'Invalid or missing ID', null));
    }

    const deletedPenilaian = await Penilaian.findByIdAndDelete(id);
    if (!deletedPenilaian) {
      return NextResponse.json(createResponse(404, 'Penilaian not found', null));
    }

    return NextResponse.json(createResponse(200, 'Success', deletedPenilaian, true));
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete Penilaian' }, { status: 500 });
  }
}
