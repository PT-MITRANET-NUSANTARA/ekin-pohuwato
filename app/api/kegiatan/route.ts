import { NextRequest, NextResponse } from 'next/server';
import Kegiatan from '../../../models/Kegiatan';
import SubKegiatan from '@/models/SubKegiatan';
import Joi from 'joi';
import dbConnect from '@/utils/db';
import { createResponse } from '@/utils/api';

const kegiatanSchema = Joi.object({
  program: Joi.string().hex().length(24).required().label('Program'), // Mengasumsikan ini adalah referensi ObjectId
  name: Joi.string().required().label('Nama Kegiatan'),
  indikator_kinerja: Joi.string().required().label('Indikator Kinerja'),
  target_indikator: Joi.string().required().label('Target Indikator'),
  satuan: Joi.string().required().label('Satuan'),
  total_anggaran: Joi.number().required().label('Total Anggaran'),
  __v: Joi.optional(),
  _id: Joi.optional(),
  id: Joi.optional(),
}).messages({
  'any.required': '{{#label}} wajib diisi.',
  'string.base': '{{#label}} harus berupa teks.',
  'string.empty': '{{#label}} tidak boleh kosong.',
  'string.hex': '{{#label}} harus berupa nilai heksadesimal yang valid.',
  'string.length': '{{#label}} harus memiliki panjang tepat {{#limit}} karakter.',
  'number.base': '{{#label}} harus berupa angka.',
  'number.empty': '{{#label}} tidak boleh kosong.',
});


function validateKegiatanData(data: any) {
  const { error } = kegiatanSchema.validate(data, { abortEarly: false });
  if (error) {
    return error.details.map((err) => err.message);
  }
  return [];
}

export async function GET(req: NextRequest) {
  await dbConnect();
  await SubKegiatan.find({});
  try {
    const id = req.nextUrl.searchParams.get('id');
    const program_id = req.headers.get('program-id');
    let kegiatans = [];

    if (id) {
      kegiatans = await Kegiatan.findOne({ _id: id }).populate('subKegiatans');
    } else if (program_id) {
      kegiatans = await Kegiatan.find({ program: program_id }).populate('program').populate('subKegiatans');
    } 
    else {
      kegiatans = await Kegiatan.find({})
    }

    return NextResponse.json(createResponse(200, 'Success', kegiatans));
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch Kegiatan data' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const body = await req.json();
    
    const errors = validateKegiatanData(body);
    
    if (errors.length > 0) {
      return NextResponse.json(createResponse(400, 'Failed', errors));
    }

    const newKegiatan = new Kegiatan(body);
    await newKegiatan.save();
    return NextResponse.json(createResponse(201, 'Success', newKegiatan));
  } catch (error) {
    console.error('POST error:', error); // Added error logging
    return NextResponse.json({ error: 'Failed to create Kegiatan' }, { status: 500 });
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

    const errors = validateKegiatanData(body);
    if (errors.length > 0) {
      return NextResponse.json(createResponse(400, 'Failed', errors));
    }

    const updatedKegiatan = await Kegiatan.findOneAndUpdate(
      { _id: id },
      body,
      { new: true }
    );

    if (!updatedKegiatan) {
      return NextResponse.json(createResponse(404, 'Kegiatan not found', null));
    }

    return NextResponse.json(createResponse(200, 'Success', updatedKegiatan));
  } catch (error) {
    console.error('PUT error:', error); 
    return NextResponse.json({ error: 'Failed to update Kegiatan' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  await dbConnect();

  try {
    const id = req.nextUrl.searchParams.get('id');
    if (!id || typeof id !== 'string') {
      return NextResponse.json(createResponse(400, 'Invalid or missing ID', null));
    }

    const deletedKegiatan = await Kegiatan.findByIdAndDelete(id);
    if (!deletedKegiatan) {
      return NextResponse.json(createResponse(404, 'Kegiatan not found', null));
    }

    return NextResponse.json(createResponse(200, 'Success', deletedKegiatan));
  } catch (error) {
    console.error('DELETE error:', error); 
    return NextResponse.json({ error: 'Failed to delete Kegiatan' }, { status: 500 });
  }
}
