import mongoose, { Document, Schema } from 'mongoose';
import { IProgram } from './Program'; // Assuming the Program model is in a separate file
import { ISubKegiatan } from './SubKegiatan'; // Assuming the SubKegiatan model is in a separate file

export interface IIndikatorKinerja {
  name: string; // Name of the performance indicator
  target: number; // Target for the performance indicator
  satuan: string; // Unit of measurement
}

export interface IKegiatan extends Document {
  program: mongoose.Types.ObjectId | IProgram; // Reference to the associated Program
  name: string; // Name of the activity (kegiatan)
  indikator_kinerja: IIndikatorKinerja[]; // Array of performance indicators
  total_anggaran: number; // Total budget for the activity
  subKegiatans?: ISubKegiatan[]; // Array of SubKegiatan documents (optional)
}

const KegiatanSchema: Schema = new Schema(
  {
    program: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Program',
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

// Virtual field for related SubKegiatan documents
KegiatanSchema.virtual('subKegiatans', {
  ref: 'SubKegiatan',
  localField: '_id',
  foreignField: 'kegiatan',
  justOne: false,
});

const Kegiatan = mongoose.models.Kegiatan || mongoose.model<IKegiatan>('Kegiatan', KegiatanSchema);

export default Kegiatan;
