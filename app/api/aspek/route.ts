import { NextRequest, NextResponse } from 'next/server';
import Aspek from '../../../models/Aspek';
import Joi from 'joi';
import dbConnect from '@/utils/db';
import { createResponse } from '@/utils/api';

const aspekSchema = Joi.object({
  rhk: Joi.string().hex().length(24).required().label('RHK'), // Expecting ObjectId
  jenis: Joi.string().valid('kualitas', 'kuantitas', 'waktu', 'deskripsi').required().label('Jenis'),
  indikator: Joi.string().required().label('Indikator'),
  target_tahunan: Joi.object().required().label('Target Tahunan'),
  feedback: Joi.object().optional().label('Feedback'),
  desc: Joi.string().optional().label('Deskripsi').allow(''),
  __v: Joi.optional(),
  _id: Joi.optional(),
  id: Joi.optional(),
}).messages({
  'any.required': '{{#label}} wajib diisi.',
  'string.base': '{{#label}} harus berupa teks.',
  'string.empty': '{{#label}} tidak boleh kosong.',
  'string.hex': '{{#label}} harus berupa nilai heksadesimal yang valid.',
  'string.length': '{{#label}} harus memiliki panjang tepat {{#limit}} karakter.',
});

function validateAspekData(data: any) {
  const { error } = aspekSchema.validate(data, { abortEarly: false });
  if (error) {
    return error.details.map((err) => err.message);
  }
  return [];
}

export async function GET(req: NextRequest) {
  await dbConnect();
  try {
    const id = req.nextUrl.searchParams.get('id');
    let aspek;

    if (id) {
      aspek = await Aspek.findById(id).populate('rhk');
    } else {
      aspek = await Aspek.find().populate('rhk');
    }

    return NextResponse.json(createResponse(200, 'Success', aspek));
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch Aspek data' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const body = await req.json();
    
    const errors = validateAspekData(body);
    
    if (errors.length > 0) {
      return NextResponse.json(createResponse(400, 'Failed', errors));
    }

    const newAspek = new Aspek(body);
    await newAspek.save();
    return NextResponse.json(createResponse(201, 'Success', newAspek));
  } catch (error) {
    console.error('POST error:', error); 
    return NextResponse.json({ error: 'Failed to create Aspek' }, { status: 500 });
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
    
    const errors = validateAspekData(body);

    if (errors.length > 0) {
      return NextResponse.json(createResponse(400, 'Failed', errors));
    }

    const updatedAspek = await Aspek.findByIdAndUpdate(
      id,
      body,
      { new: true }
    ).populate('rhk');

    if (!updatedAspek) {
      return NextResponse.json(createResponse(404, 'Aspek not found', null));
    }

    return NextResponse.json(createResponse(200, 'Success', updatedAspek, true));
  } catch (error) {
    console.log(error);
    
    console.error('PUT error:', error); 
    return NextResponse.json({ error: 'Failed to update Aspek' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  await dbConnect();

  try {
    const id = req.nextUrl.searchParams.get('id');
    if (!id || typeof id !== 'string') {
      return NextResponse.json(createResponse(400, 'Invalid or missing ID', null));
    }

    const deletedAspek = await Aspek.findByIdAndDelete(id);
    if (!deletedAspek) {
      return NextResponse.json(createResponse(404, 'Aspek not found', null));
    }

    return NextResponse.json(createResponse(200, 'Success', deletedAspek));
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete Aspek' }, { status: 500 });
  }
}
