import { NextRequest, NextResponse } from "next/server";
import UMPEG from "../../../models/UMPEG"; // Update the model reference to UMPEG
import Joi from "joi";
import dbConnect from "@/utils/db";
import { createResponse } from "@/utils/api";
import Verifikasi from "@/models/Verifikasi";

const verifikasiSchema = Joi.object({
  unit: Joi.object().required().label("Unit"),
  jabatan: Joi.object().required().label("Jabatan"),
  __v: Joi.optional(),
  _id: Joi.optional(),
  id: Joi.optional(),
  createdAt: Joi.date().optional(),
  updatedAt: Joi.date().optional(),
}).messages({
  "any.required": "{{#label}} wajib diisi.",
  "object.base": "{{#label}} harus berupa objek yang valid.",
  "date.base": "{{#label}} harus berupa tanggal yang valid.",
});

function validateVerifikasiData(data: any) {
  const { error } = verifikasiSchema.validate(data, { abortEarly: false });
  if (error) {
    return error.details.map((err) => err.message);
  }
  return [];
}

export async function GET(req: NextRequest) {
  await dbConnect();

  try {
    const id = req.nextUrl.searchParams.get("id");
    const unit_id = req.nextUrl.searchParams.get("unitId");
    const page = req.nextUrl.searchParams.get("page");
    const limit = req.nextUrl.searchParams.get("limit");

    let verifikasi:any = [];

    if (id) {
      verifikasi = await Verifikasi.findOne({ _id: id });
    } else if (unit_id) {
      verifikasi = await Verifikasi.findByUnitId(Number(unit_id));
    } else {
        if (Number(page) == 0 || Number(limit) == 0) {
          verifikasi = await Verifikasi.find({});
            
        }else
        {
            verifikasi = await Verifikasi.getAll(Number(page), Number(limit));

        }
    }

    return NextResponse.json(createResponse(200, "Success", verifikasi, true));
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch UMPEG data" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const body = await req.json();
    const errors = validateVerifikasiData(body);

    if (errors.length > 0) {
      return NextResponse.json(createResponse(400, "Failed", errors));
    }

    const newVerifikasi = new Verifikasi(body);
    await newVerifikasi.save();
    return NextResponse.json(createResponse(201, "Success", newVerifikasi, true));
  } catch (error) {
    console.error("POST error:", error); // Added error logging
    return NextResponse.json(
      { error: "Failed to create Verifikasi" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  await dbConnect();

  try {
    const body = await req.json();
    const id = req.nextUrl.searchParams.get("id");
    if (!id || typeof id !== "string") {
      return NextResponse.json(
        createResponse(400, "Invalid or missing ID", null)
      );
    }

    const errors = validateVerifikasiData(body);
    if (errors.length > 0) {
      return NextResponse.json(createResponse(400, "Failed", errors));
    }

    const updatedVerifikasi = await Verifikasi.findOne({"unit.id_sapk": id});

    if (!updatedVerifikasi) {
      return NextResponse.json(createResponse(404, "Verifikasi not found", null));
    }

    updatedVerifikasi.unit = body.unit;
    updatedVerifikasi.jabatan = body.jabatan;
    await updatedVerifikasi.save();
    return NextResponse.json(createResponse(200, "Success", updatedVerifikasi, true));
  } catch (error) {
    console.error("PUT error:", error); // Added error logging
    return NextResponse.json(
      { error: "Failed to update Verifikasi" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  await dbConnect();

  try {
    const id = req.nextUrl.searchParams.get("id");
    if (!id || typeof id !== "string") {
      return NextResponse.json(
        createResponse(400, "Invalid or missing ID", null)
      );
    }

    const deletedVerifikasi = await Verifikasi.findByIdAndDelete(id);
    if (!deletedVerifikasi) {
      return NextResponse.json(createResponse(404, "Verifikasi not found", null));
    }

    return NextResponse.json(createResponse(200, "Success", deletedVerifikasi, true));
  } catch (error) {
    console.error("DELETE error:", error); // Added error logging
    return NextResponse.json(
      { error: "Failed to delete Verifikasi" },
      { status: 500 }
    );
  }
}
