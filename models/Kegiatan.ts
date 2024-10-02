import mongoose, { Document, Schema } from 'mongoose';
import { IProgram } from './Program';  // Assuming the Program model is in a separate file
import { ISubKegiatan } from './SubKegiatan'; // Assuming the SubKegiatan model is in a separate file

export interface IKegiatan extends Document {
  program: mongoose.Types.ObjectId | IProgram; // Reference to the associated Program
  name: string; // Name of the activity (kegiatan)
  indikator_kinerja: string; // Performance indicator for the activity
  target_indikator: string; // Target for the performance indicator
  satuan: string; // Unit of measurement
  total_anggaran: number; // Total budget for the activity
  subKegiatans?: ISubKegiatan[]; // Array of SubKegiatan documents (optional)
}

const KegiatanSchema: Schema = new Schema({
  program: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Program',
    required: true
  },
  name: {
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
  }
});

// Virtual field for related SubKegiatan documents
KegiatanSchema.virtual('subKegiatans', {
  ref: 'SubKegiatan',
  localField: '_id',
  foreignField: 'kegiatan',
  justOne: false
});


const Kegiatan = mongoose.models.Kegiatan || mongoose.model<IKegiatan>('Kegiatan', KegiatanSchema);

export default Kegiatan;
