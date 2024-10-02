import { NextRequest, NextResponse } from 'next/server';
import RHK from '../../../models/RHK'; // Adjust the path as necessary
import Joi from 'joi';
import dbConnect from '@/utils/db';
import { createResponse } from '@/utils/api';

const rhkSchema = Joi.object({
  skp: Joi.string().required().label('SKP'),
  rhk: Joi.string().optional().label('RHK'),
  jenis: Joi.string().valid('utama', 'tambahan').required().label('Jenis'),
  rencana: Joi.string().required().label('Rencana'),
  klasifikasi: Joi.string().valid('organisasi', 'individu').optional().label('Klasifikasi'),
  __v: Joi.optional(),
  _id: Joi.optional(),
});

function validateRHKData(data: any) {
  const { error } = rhkSchema.validate(data, { abortEarly: false });
  if (error) {
    return error.details.map((err) => err.message);
  }
  return [];
}

export async function GET(req: NextRequest) {
  await dbConnect();

  try {
    const skpId = req.nextUrl.searchParams.get('skpId');
    const id = req.nextUrl.searchParams.get('id');
    let rhks = [];

    if (skpId) {
      rhks = id 
        ? await RHK.findOne({ _id: id, skp: skpId }).populate('aspek') 
        : await RHK.find({ skp: skpId }).populate('aspek');
    } else {
      rhks = await RHK.find({}).populate('aspek');
    }

    return NextResponse.json(createResponse(200, 'Success', rhks));
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch RHK data' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const body = await req.json();
    
    const errors = validateRHKData(body);

    if (errors.length > 0) {
      return NextResponse.json(createResponse(400, 'Failed', errors));
    }

    const newRHK = new RHK(body);
    await newRHK.save();
    return NextResponse.json(createResponse
      (201, 'Success', newRHK)
    );
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ error: 'Failed to create RHK' }, { status: 500 });
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

    const errors = validateRHKData(body);
    if (errors.length > 0) {
      return NextResponse.json(createResponse(400, 'Failed', errors));
    }

    const updatedRHK = await RHK.findOneAndUpdate({ _id: id }, body, { new: true });

    if (!updatedRHK) {
      return NextResponse.json(createResponse(404, 'RHK not found', null));
    }

    return NextResponse.json(createResponse(200, 'Success', updatedRHK));
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ error: 'Failed to update RHK' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  await dbConnect();

  try {
    const id = req.nextUrl.searchParams.get('id');

    if (!id || typeof id !== 'string') {
      return NextResponse.json(createResponse(400, 'Invalid or missing ID', null));
    }

    const deletedRHK = await RHK.findByIdAndDelete(id);

    if (!deletedRHK) {
      return NextResponse.json(createResponse
        (404, 'RHK not found', null)
      );
    }

    return NextResponse.json(createResponse(200, 'Success', deletedRHK));
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete RHK' }, { status: 500 });
  }
}
