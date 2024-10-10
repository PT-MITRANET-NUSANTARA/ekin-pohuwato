import { NextRequest, NextResponse } from 'next/server';
import Tujuan from '../../../models/Tujuan'; 
import Joi from 'joi';
import dbConnect from '@/utils/db'; 
import { createResponse } from '@/utils/api';

const tujuanSchema = Joi.object({
  sasaran_strategis: Joi.string().required().label('Sasaran Strategis'),
  indikator_kinerja: Joi.string().required().label('Indikator Kinerja'),
  target_indikator: Joi.string().required().label('Target Indikator'),
  satuan: Joi.string().required().label('Satuan'),
  renstra: Joi.string().hex().length(24).required().label('Renstra'), // Expecting a string ObjectId
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

// Function to validate Tujuan data
function validateTujuanData(data: any) {
  const { error } = tujuanSchema.validate(data, { abortEarly: false });
  if (error) {
    return error.details.map((err) => err.message);
  }
  return [];
}

// GET method to fetch Tujuan data
export async function GET(req: NextRequest) {
  await dbConnect();

  try {
    const id = req.nextUrl.searchParams.get('id');
    let tujuans;
    if (id) {
      tujuans = await Tujuan.findOne({ _id: id }).populate('renstra'); // Populate the renstra reference
    } else {
      tujuans = await Tujuan.find({}).populate('renstra'); // Populate the renstra reference
    }

    return NextResponse.json(createResponse(200, 'Success', tujuans, true));
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch Tujuan data' }, { status: 500 });
  }
}

// POST method to create a new Tujuan record
export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const body = await req.json();
    
    const errors = validateTujuanData(body);
    if (errors.length > 0) {
      return NextResponse.json(createResponse(400, 'Failed', errors));
    }

    const newTujuan = new Tujuan(body);
    await newTujuan.save();
    return NextResponse.json(createResponse(201, 'Success', newTujuan, true));
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ error: 'Failed to create Tujuan' }, { status: 500 });
  }
}

// PUT method to update an existing Tujuan record
export async function PUT(req: NextRequest) {
  await dbConnect();

  try {
    const body = await req.json();
    const id = req.nextUrl.searchParams.get('id');
    if (!id || typeof id !== 'string') {
      return NextResponse.json(createResponse(400, 'Invalid or missing ID', null));
    }

    const errors = validateTujuanData(body);
    if (errors.length > 0) {
      return NextResponse.json(createResponse(400, 'Failed', errors));
    }

    const updatedTujuan = await Tujuan.findOneAndUpdate(
      { _id: id },
      body,
      { new: true }
    );

    if (!updatedTujuan) {
      return NextResponse.json(createResponse(404, 'Tujuan not found', null));
    }

    return NextResponse.json(createResponse(200, 'Success', updatedTujuan, true));
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ error: 'Failed to update Tujuan' }, { status: 500 });
  }
}

// DELETE method to remove an existing Tujuan record
export async function DELETE(req: NextRequest) {
  await dbConnect();

  try {
    const id = req.nextUrl.searchParams.get('id');
    if (!id || typeof id !== 'string') {
      return NextResponse.json(createResponse(400, 'Invalid or missing ID', null));
    }

    const deletedTujuan = await Tujuan.findByIdAndDelete(id);
    if (!deletedTujuan) {
      return NextResponse.json(createResponse(404, 'Tujuan not found', null));
    }

    return NextResponse.json(createResponse(200, 'Success', deletedTujuan, true));
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete Tujuan' }, { status: 500 });
  }
}
