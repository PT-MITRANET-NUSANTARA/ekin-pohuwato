import mongoose, { Document, Schema } from 'mongoose';
import { IRenstra } from './Renstra';  // Assuming the Renstra model is in a separate file
import { IKegiatan } from './Kegiatan';
import Kegiatan  from './Kegiatan';

export interface IProgram extends Document {
  name: string; // Name of the program
  sasaran_strategis: string; // Strategic target
  indikator_kinerja: string; // Performance indicator
  target_indikator: string; // Target for the indicator
  satuan: string; // Unit of measure
  total_anggaran: number; // Total budget
  renstra: mongoose.Types.ObjectId | IRenstra; // Reference to the associated Renstra
  kegiatan: IKegiatan[]; // Array of Kegiatan documents
  programs: mongoose.Types.ObjectId[] | IProgram[];  // Array of ObjectId references to Program documents or populated Program documents
  createdAt?: Date;
  updatedAt?: Date;
}

const ProgramSchema: Schema = new Schema({
  name: {
    type: String,
    required: true
  },
  sasaran_strategis: {
    type: String,
    required: true
  },
  indikator_kinerja: {
    type: String,
    required: true
  },
  target_indikator: {
    type: String,
    required: true
  },
  satuan: {
    type: String,
    required: true
  },
  total_anggaran: {
    type: Number,
    required: true
  },
  renstra: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Renstra',
    required: true
  }
}, { timestamps: true });

ProgramSchema.virtual('kegiatans', {
    ref: 'Kegiatan',
    localField: '_id',
    foreignField: 'program',
    justOne: false
    });

const Program = mongoose.models.Program || mongoose.model<IProgram>('Program', ProgramSchema);

export default Program;
