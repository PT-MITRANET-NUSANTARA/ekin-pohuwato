import { NextRequest, NextResponse } from 'next/server';
import Perilaku from '../../../models/Perilaku';
import Joi from 'joi';
import dbConnect from '@/utils/db';
import { createResponse } from '@/utils/api';

const perilakuSchema = Joi.object({
  skp: Joi.string().hex().length(24).required().label('SKP'), // Expecting ObjectId
  name: Joi.string().required().label('Nama Perilaku'),
  isi: Joi.array().items(Joi.string().required()).required().label('Isi Perilaku'),
  espektasi: Joi.string().optional().label('Espektasi').allow(''),
  feedback: Joi.object().optional().label('Feedback').allow(''),
  __v: Joi.optional(),
  _id: Joi.optional(),
  id: Joi.optional(),
}).messages({
  'any.required': '{{#label}} wajib diisi.',
  'string.base': '{{#label}} harus berupa teks.',
  'string.empty': '{{#label}} tidak boleh kosong.',
  'string.hex': '{{#label}} harus berupa nilai heksadesimal yang valid.',
  'string.length': '{{#label}} harus memiliki panjang tepat {{#limit}} karakter.',
  'array.base': '{{#label}} harus berupa array.',
});

function validatePerilakuData(data: any) {
  const { error } = perilakuSchema.validate(data, { abortEarly: false });
  if (error) {
    return error.details.map((err) => err.message);
  }
  return [];
}

export async function GET(req: NextRequest) {
  await dbConnect();
  try {
    const id = req.nextUrl.searchParams.get('id');
    let perilaku;

    if (id) {
      perilaku = await Perilaku.findById(id).populate('skp');
    } else {
      perilaku = await Perilaku.find().populate('skp');
    }

    return NextResponse.json(createResponse(200, 'Success', perilaku));
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch Perilaku data' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const body = await req.json();
    
    const errors = validatePerilakuData(body);
    
    if (errors.length > 0) {
      return NextResponse.json(createResponse(400, 'Failed', errors));
    }

    const newPerilaku = new Perilaku(body);
    await newPerilaku.save();
    return NextResponse.json(createResponse(201, 'Success', newPerilaku));
  } catch (error) {
    console.error('POST error:', error); 
    return NextResponse.json({ error: 'Failed to create Perilaku' }, { status: 500 });
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
    
    const errors = validatePerilakuData(body);

    if (errors.length > 0) {
      return NextResponse.json(createResponse(400, 'Failed', errors));
    }

    const updatedPerilaku = await Perilaku.findByIdAndUpdate(
      id,
      body,
      { new: true }
    ).populate('skp');

    if (!updatedPerilaku) {
      return NextResponse.json(createResponse(404, 'Perilaku not found', null));
    }

    return NextResponse.json(createResponse(200, 'Success', updatedPerilaku, true));
  } catch (error) {
    console.log(error);
    
    console.error('PUT error:', error); 
    return NextResponse.json({ error: 'Failed to update Perilaku' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  await dbConnect();

  try {
    const id = req.nextUrl.searchParams.get('id');
    if (!id || typeof id !== 'string') {
      return NextResponse.json(createResponse(400, 'Invalid or missing ID', null));
    }

    const deletedPerilaku = await Perilaku.findByIdAndDelete(id);
    if (!deletedPerilaku) {
      return NextResponse.json(createResponse(404, 'Perilaku not found', null));
    }

    return NextResponse.json(createResponse(200, 'Success', deletedPerilaku));
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete Perilaku' }, { status: 500 });
  }
}
