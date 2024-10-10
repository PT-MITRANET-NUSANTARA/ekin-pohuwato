import { NextRequest, NextResponse } from 'next/server';
import Misi from '../../../models/Misi'; 
import Joi from 'joi';
import dbConnect from '@/utils/db'; 
import { createResponse } from '@/utils/api';

const misiSchema = Joi.object({
  name: Joi.string().required().label('Nama Misi'),
  visi: Joi.string().hex().length(24).required().label('Visi'), // Expecting a string ObjectId
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
});

// Function to validate Misi data
function validateMisiData(data: any) {
  const { error } = misiSchema.validate(data, { abortEarly: false });
  if (error) {
    return error.details.map((err) => err.message);
  }
  return [];
}

// GET method to fetch Misi data
export async function GET(req: NextRequest) {
  await dbConnect();

  try {
    const id = req.nextUrl.searchParams.get('id');
    let misis;
    if (id) {
      misis = await Misi.findOne({ _id: id }).populate('visi'); // Populate the visi reference
    } else {
      misis = await Misi.find({}).populate('visi'); // Populate the visi reference
    }

    return NextResponse.json(createResponse(200, 'Success', misis, true));
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch Misi data' }, { status: 500 });
  }
}

// POST method to create a new Misi record
export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const body = await req.json();
    
    const errors = validateMisiData(body);
    if (errors.length > 0) {
      return NextResponse.json(createResponse(400, 'Failed', errors));
    }

    const newMisi = new Misi(body);
    await newMisi.save();
    return NextResponse.json(createResponse(201, 'Success', newMisi, true));
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ error: 'Failed to create Misi' }, { status: 500 });
  }
}

// PUT method to update an existing Misi record
export async function PUT(req: NextRequest) {
  await dbConnect();

  try {
    const body = await req.json();
    const id = req.nextUrl.searchParams.get('id');
    if (!id || typeof id !== 'string') {
      return NextResponse.json(createResponse(400, 'Invalid or missing ID', null));
    }

    const errors = validateMisiData(body);
    if (errors.length > 0) {
      return NextResponse.json(createResponse(400, 'Failed', errors));
    }

    const updatedMisi = await Misi.findOneAndUpdate(
      { _id: id },
      body,
      { new: true }
    );

    if (!updatedMisi) {
      return NextResponse.json(createResponse(404, 'Misi not found', null));
    }

    return NextResponse.json(createResponse(200, 'Success', updatedMisi, true));
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ error: 'Failed to update Misi' }, { status: 500 });
  }
}

// DELETE method to remove an existing Misi record
export async function DELETE(req: NextRequest) {
  await dbConnect();

  try {
    const id = req.nextUrl.searchParams.get('id');
    if (!id || typeof id !== 'string') {
      return NextResponse.json(createResponse(400, 'Invalid or missing ID', null));
    }

    const deletedMisi = await Misi.findByIdAndDelete(id);
    if (!deletedMisi) {
      return NextResponse.json(createResponse(404, 'Misi not found', null));
    }

    return NextResponse.json(createResponse(200, 'Success', deletedMisi, true));
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete Misi' }, { status: 500 });
  }
}
