import mongoose, { Document, Schema } from 'mongoose';

export interface IIndikatorKinerja {
  name: string;
  target: number; 
  satuan: string;
}

interface IKegiatan extends Document {
  program: mongoose.Types.ObjectId
  name: string; 
  indikator_kinerja: IIndikatorKinerja[];
  total_anggaran: number; 
  subKegiatans?: mongoose.Types.ObjectId[]; 
}

interface IKegiatanMethods {}

interface KegiatanModel extends mongoose.Model<IKegiatan, IKegiatanMethods> {}

const KegiatanSchema = new Schema<IKegiatan, KegiatanModel, IKegiatanMethods>(
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

KegiatanSchema.virtual('subKegiatans', {
  ref: 'SubKegiatan',
  localField: '_id',
  foreignField: 'kegiatan',
  justOne: false,
});

const Kegiatan = mongoose.models.Kegiatan || mongoose.model<IKegiatan>('Kegiatan', KegiatanSchema);

export default Kegiatan;
