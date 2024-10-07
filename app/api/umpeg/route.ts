import { NextRequest, NextResponse } from "next/server";
import UMPEG from "../../../models/UMPEG"; // Update the model reference to UMPEG
import Joi from "joi";
import dbConnect from "@/utils/db";
import { createResponse } from "@/utils/api";

const umpegSchema = Joi.object({
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

function validateUMPEGData(data: any) {
  const { error } = umpegSchema.validate(data, { abortEarly: false });
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

    let umpegs = [];

    if (id) {
      umpegs = await UMPEG.findOne({ _id: id });
    } else if (unit_id) {
      umpegs = await UMPEG.find({ "unit.id": Number(unit_id) });
    } else {
      umpegs = await UMPEG.find({});
    }

    return NextResponse.json(createResponse(200, "Success", umpegs, true));
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
    const errors = validateUMPEGData(body);

    if (errors.length > 0) {
      return NextResponse.json(createResponse(400, "Failed", errors));
    }

    const newUMPEG = new UMPEG(body);
    await newUMPEG.save();
    return NextResponse.json(createResponse(201, "Success", newUMPEG, true));
  } catch (error) {
    console.error("POST error:", error); // Added error logging
    return NextResponse.json(
      { error: "Failed to create UMPEG" },
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

    const errors = validateUMPEGData(body);
    if (errors.length > 0) {
      return NextResponse.json(createResponse(400, "Failed", errors));
    }

    const updatedUMPEG = await UMPEG.findOneAndUpdate({ _id: id }, body, {
      new: true,
    });

    if (!updatedUMPEG) {
      return NextResponse.json(createResponse(404, "UMPEG not found", null));
    }

    return NextResponse.json(createResponse(200, "Success", updatedUMPEG, true));
  } catch (error) {
    console.error("PUT error:", error); // Added error logging
    return NextResponse.json(
      { error: "Failed to update UMPEG" },
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

    const deletedUMPEG = await UMPEG.findByIdAndDelete(id);
    if (!deletedUMPEG) {
      return NextResponse.json(createResponse(404, "UMPEG not found", null));
    }

    return NextResponse.json(createResponse(200, "Success", deletedUMPEG, true));
  } catch (error) {
    console.error("DELETE error:", error); // Added error logging
    return NextResponse.json(
      { error: "Failed to delete UMPEG" },
      { status: 500 }
    );
  }
}
