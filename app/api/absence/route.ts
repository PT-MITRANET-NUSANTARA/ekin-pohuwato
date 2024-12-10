import { NextRequest, NextResponse } from 'next/server';
import Absence from '../../../models/Absence';
import Joi from 'joi';
import dbConnect from '@/utils/db';
import { createResponse } from '@/utils/api';

// Schema validasi untuk Absence
const absenceSchema = Joi.object({
  user_id: Joi.string().required().label('User ID'),
  date: Joi.date().required().label('Tanggal'),
  status: Joi.string()
    .valid('Hadir', 'Sakit', 'Izin', 'Alpha')
    .required()
    .label('Status'),
}).messages({
  'any.required': '{{#label}} wajib diisi.',
  'string.base': '{{#label}} harus berupa teks.',
  'string.empty': '{{#label}} tidak boleh kosong.',
  'date.base': '{{#label}} harus berupa tanggal yang valid.',
  'string.valid': '{{#label}} harus salah satu dari: Hadir, Sakit, Izin, Alpha.',
});

function validateAbsenceData(data: any) {
  const { error } = absenceSchema.validate(data, { abortEarly: false });
  if (error) {
    return error.details.map((err) => err.message);
  }
  return [];
}

// API Handler GET untuk Absence
export async function GET(req: NextRequest) {
  await dbConnect();

  try {
    const user_id = req.headers.get('user-id');
    const id = req.nextUrl.searchParams.get('id');
    let absences = [];

    if (id) {
      absences = await Absence.findOne({ _id: id, user_id });
    } else if (user_id) {
      absences = await Absence.find({ user_id });
    } else {
      absences = await Absence.find({});
    }

    return NextResponse.json(createResponse(200, 'Success', absences, true));
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch Absence data' }, { status: 500 });
  }
}

// API Handler POST untuk Absence
export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const user_id = req.headers.get('user-id');

    if (!user_id) {
      return NextResponse.json(createResponse(400, 'User ID is required', null));
    }

    const body = await req.json();
    const bodyWithUser = { ...body, user_id };

    const errors = validateAbsenceData(bodyWithUser);
    if (errors.length > 0) {
      return NextResponse.json(createResponse(400, 'Failed', errors));
    }

    const newAbsence = new Absence(bodyWithUser);
    await newAbsence.save();
    return NextResponse.json(createResponse(201, 'Success', newAbsence, true));
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ error: 'Failed to create Absence' }, { status: 500 });
  }
}

// API Handler PUT untuk Absence
export async function PUT(req: NextRequest) {
  await dbConnect();

  try {
    const body = await req.json();
    const id = req.nextUrl.searchParams.get('id');

    if (!id || typeof id !== 'string') {
      return NextResponse.json(createResponse(400, 'Invalid or missing ID', null));
    }

    const errors = validateAbsenceData(body);
    if (errors.length > 0) {
      return NextResponse.json(createResponse(400, 'Failed', errors));
    }

    const updatedAbsence = await Absence.findOneAndUpdate({ _id: id }, body, { new: true });

    if (!updatedAbsence) {
      return NextResponse.json(createResponse(404, 'Absence not found', null));
    }

    return NextResponse.json(createResponse(200, 'Success', updatedAbsence, true));
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ error: 'Failed to update Absence' }, { status: 500 });
  }
}

// API Handler DELETE untuk Absence
export async function DELETE(req: NextRequest) {
  await dbConnect();

  try {
    const user_id = req.headers.get('user-id');
    const id = req.nextUrl.searchParams.get('id');

    if (!id || typeof id !== 'string') {
      return NextResponse.json(createResponse(400, 'Invalid or missing ID', null));
    }

    const deletedAbsence = await Absence.findOneAndDelete({ _id: id, user_id });
    if (!deletedAbsence) {
      return NextResponse.json(createResponse(404, 'Absence not found', null));
    }

    return NextResponse.json(createResponse(200, 'Success', deletedAbsence, true));
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete Absence' }, { status: 500 });
  }
}
