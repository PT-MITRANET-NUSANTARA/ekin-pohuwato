import mongoose, { Document, Schema } from 'mongoose';
import { IRenstra } from './Renstra'; // Assuming the Renstra model is in a separate file
import { IKegiatan } from './Kegiatan';
import Kegiatan from './Kegiatan';

export interface IIndikatorKinerja {
  name: string; // Name of the performance indicator
  target: number; // Target for the indicator
  satuan: string; // Unit of measure
}

export interface IProgram extends Document {
  name: string; // Name of the program
  sasaran_strategis: string; // Strategic target
  indikator_kinerja: IIndikatorKinerja[]; // Array of performance indicators
  total_anggaran: number; // Total budget
  renstra: mongoose.Types.ObjectId | IRenstra; // Reference to the associated Renstra
  kegiatan: IKegiatan[]; // Array of Kegiatan documents
  programs: mongoose.Types.ObjectId[] | IProgram[]; // Array of ObjectId references to Program documents or populated Program documents
  createdAt?: Date;
  updatedAt?: Date;
}

const ProgramSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    indikator_kinerja: [
      {
        name: {
          type: String,
          required: true,
        },
        target: {
          type: Number,
          required: true,
        },
        satuan: {
          type: String,
          required: true,
        },
      },
    ],
    total_anggaran: {
      type: Number,
      required: true,
    },
    tujuan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tujuan',
      required: true,
    },
  },
  { timestamps: true }
);

ProgramSchema.virtual('kegiatans', {
  ref: 'Kegiatan',
  localField: '_id',
  foreignField: 'program',
  justOne: false,
});

const Program = mongoose.models.Program || mongoose.model<IProgram>('Program', ProgramSchema);

export default Program;
