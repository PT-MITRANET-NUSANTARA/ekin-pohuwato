import mongoose, { Document, Schema } from 'mongoose';
import { IKegiatan } from './Kegiatan';  // Assuming the Kegiatan model is in a separate file

export interface ISubKegiatan extends Document {
  kegiatan: mongoose.Types.ObjectId | IKegiatan; // Reference to the associated Kegiatan
  name: string; // Name of the sub-activity (sub-kegiatan)
  indikator_kinerja: string; // Performance indicator for the sub-activity
  target_indikator: string; // Target for the performance indicator
  satuan: string; // Unit of measurement
  total_anggaran: number; // Total budget for the sub-activity
}

const SubKegiatanSchema: Schema = new Schema({
  kegiatan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Kegiatan',
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

SubKegiatanSchema.virtual('relatedKegiatan', {
  ref: 'Kegiatan',
  localField: '_id',
  foreignField: 'subKegiatan',
  justOne: true
});

SubKegiatanSchema.virtual('rkts', {
  ref: 'RKT',
  localField: '_id',
  foreignField: 'subKegiatan',
  justOne: false
});

const SubKegiatan = mongoose.models.SubKegiatan || mongoose.model<ISubKegiatan>('SubKegiatan', SubKegiatanSchema);

export default SubKegiatan;
