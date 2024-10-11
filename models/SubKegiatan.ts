import mongoose, { Document, Schema } from 'mongoose';
import { IKegiatan } from './Kegiatan'; // Assuming the Kegiatan model is in a separate file

export interface IIndikatorKinerja {
  name: string; // Name of the performance indicator
  target: number; // Target for the performance indicator
  satuan: string; // Unit of measurement
}

export interface ISubKegiatan extends Document {
  kegiatan: mongoose.Types.ObjectId | IKegiatan; // Reference to the associated Kegiatan
  name: string; // Name of the sub-activity (sub-kegiatan)
  indikator_kinerja: IIndikatorKinerja[]; // Array of performance indicators
  total_anggaran: number; // Total budget for the sub-activity
}

const SubKegiatanSchema: Schema = new Schema(
  {
    kegiatan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Kegiatan',
      required: true,
    },
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
  },
  { timestamps: true }
);

SubKegiatanSchema.virtual('PeriodeRKTS', {
  ref: 'PeriodeRKT',
  localField: '_id',
  foreignField: 'subKegiatan',
  justOne: false,
});

const SubKegiatan = mongoose.models.SubKegiatan || mongoose.model<ISubKegiatan>('SubKegiatan', SubKegiatanSchema);

export default SubKegiatan;
