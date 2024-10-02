import { NextRequest, NextResponse } from 'next/server';
import RKT from '../../../models/RKT';
import Joi from 'joi';
import dbConnect from '@/utils/db';
import { createResponse } from '@/utils/api';
import Program from '@/models/Program';

const rktSchema = Joi.object({
  subKegiatan: Joi.string().hex().length(24).required().label('SubKegiatan'), // ObjectId reference to SubKegiatan
  name: Joi.string().required().label('Name'),
  input: Joi.object({
    name: Joi.string().required().label('Name'),
    target_capaian: Joi.string().required().label('Target Capaian'),
    satuan: Joi.string().required().label('Satuan'),
  }).required().label('Data Input'),
  output: Joi.object({
    name: Joi.string().required().label('Name'),
    target_capaian: Joi.string().required().label('Target Capaian'),
    satuan: Joi.string().required().label('Satuan'),
  }).required().label('Output'),
  outcome: Joi.object({
    name: Joi.string().required().label('Name'),
    target_capaian: Joi.string().required().label('Target Capaian'),
    satuan: Joi.string().required().label('Satuan'),
  }).required().label('Outcome'),
  total_anggaran : Joi.number().required().label('Total Anggaran'), 
  __v: Joi.optional(),
  _id: Joi.optional(),
  id: Joi.optional(),
  unit: Joi.object().required().label('Unit'),
  createdAt: Joi.date().optional(),
  updatedAt: Joi.date().optional(),
});

function validateRKTData(data: any) {
  const { error } = rktSchema.validate(data, { abortEarly: false });
  if (error) {
    return error.details.map((err) => err.message);
  }
  return [];
}

export async function GET(req: NextRequest) {
  await dbConnect();

  try {
    const id = req.nextUrl.searchParams.get('id');
    const unit_id = req.nextUrl.searchParams.get('unitId');
    let rkts = [];

    if (id) {
      rkts = await RKT.findOne({ _id: id });
    }
    else if(unit_id){
      rkts = await RKT.find({'unit.id': unit_id});
    }
    else {
      rkts = await RKT.find({});
    }

    return NextResponse.json(createResponse(200, 'Success', rkts));
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch RKT data' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const body = await req.json();
    const errors = validateRKTData(body);

    if (errors.length > 0) {
      return NextResponse.json(createResponse(400, 'Failed', errors));
    }

    const newRKT = new RKT(body);
    await newRKT.save();
    return NextResponse.json(createResponse(201, 'Success', newRKT));
  } catch (error) {
    console.error('POST error:', error); // Added error logging
    return NextResponse.json({ error: 'Failed to create RKT' }, { status: 500 });
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

    const errors = validateRKTData(body);
    if (errors.length > 0) {
      return NextResponse.json(createResponse(400, 'Failed', errors));
    }

    const updatedRKT = await RKT.findOneAndUpdate(
      { _id: id },
      body,
      { new: true }
    );

    if (!updatedRKT) {
      return NextResponse.json(createResponse(404, 'RKT not found', null));
    }

    return NextResponse.json(createResponse(200, 'Success', updatedRKT));
  } catch (error) {
    console.error('PUT error:', error); // Added error logging
    return NextResponse.json({ error: 'Failed to update RKT' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  await dbConnect();

  try {
    const id = req.nextUrl.searchParams.get('id');
    if (!id || typeof id !== 'string') {
      return NextResponse.json(createResponse(400, 'Invalid or missing ID', null));
    }

    const deletedRKT = await RKT.findByIdAndDelete(id);
    if (!deletedRKT) {
      return NextResponse.json(createResponse(404, 'RKT not found', null));
    }

    return NextResponse.json(createResponse(200, 'Success', deletedRKT));
  } catch (error) {
    console.error('DELETE error:', error); // Added error logging
    return NextResponse.json({ error: 'Failed to delete RKT' }, { status: 500 });
  }
}
