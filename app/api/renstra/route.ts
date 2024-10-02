import { NextRequest, NextResponse } from 'next/server';
import Renstra from '../../../models/Renstra'; 
import Program from '../../../models/Program'; 

import Joi from 'joi';
import dbConnect from '@/utils/db'; 
import { createResponse } from '@/utils/api';

const renstraSchema = Joi.object({
  name: Joi.string().required().label('Name'),
  periode_start: Joi.date().required().label('Periode Start'),
  periode_end: Joi.date().required().label('Periode End'),
  programs: Joi.array().items(Joi.string().hex().length(24)).label('Programs'), // Expecting an array of ObjectId strings
  __v: Joi.optional(),
  _id: Joi.optional(),
  createdAt: Joi.date().optional(),
  updatedAt: Joi.date().optional(),
});

function validateRenstraData(data: any) {
  const { error } = renstraSchema.validate(data, { abortEarly: false });
  if (error) {
    return error.details.map((err) => err.message);
  }
  return [];
}

export async function GET(req: NextRequest) {
  await dbConnect();

  try {
    const id = req.nextUrl.searchParams.get('id');
    let renstras;
    await Program.find({});
    if (id) {
      renstras = await Renstra.findOne({ _id: id }).populate('programs');
    } else {
      renstras = await Renstra.find({}).populate('programs');
    }

    return NextResponse.json(createResponse(200, 'Success', renstras));
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch Renstra data' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const body = await req.json();
    
    const errors = validateRenstraData(body);
    if (errors.length > 0) {
      return NextResponse.json(createResponse(400, 'Failed', errors));
    }

    const newRenstra = new Renstra(body);
    await newRenstra.save();
    return NextResponse.json(createResponse(201, 'Success', newRenstra));
  } catch (error) {
    console.error('POST error:', error); // Added error logging
    return NextResponse.json({ error: 'Failed to create Renstra' }, { status: 500 });
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

    const errors = validateRenstraData(body);
    if (errors.length > 0) {
      return NextResponse.json(createResponse(400, 'Failed', errors));
    }

    const updatedRenstra = await Renstra.findOneAndUpdate(
      { _id: id },
      body,
      { new: true }
    );

    if (!updatedRenstra) {
      return NextResponse.json(createResponse(404, 'Renstra not found', null));
    }

    return NextResponse.json(createResponse(200, 'Success', updatedRenstra));
  } catch (error) {
    console.error('PUT error:', error); // Added error logging
    return NextResponse.json({ error: 'Failed to update Renstra' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  await dbConnect();

  try {
    const id = req.nextUrl.searchParams.get('id');
    if (!id || typeof id !== 'string') {
      return NextResponse.json(createResponse(400, 'Invalid or missing ID', null));
    }

    const deletedRenstra = await Renstra.findByIdAndDelete(id);
    if (!deletedRenstra) {
      return NextResponse.json(createResponse(404, 'Renstra not found', null));
    }

    return NextResponse.json(createResponse(200, 'Success', deletedRenstra));
  } catch (error) {
    console.error('DELETE error:', error); // Added error logging
    return NextResponse.json({ error: 'Failed to delete Renstra' }, { status: 500 });
  }
}
