import mongoose, { Document, Schema } from 'mongoose';

interface IIndikatorKinerja {
  name: string; 
  target: number; 
  satuan: string; 
}

interface ISubKegiatan extends Document {
  kegiatan: mongoose.Types.ObjectId
  name: string;
  indikator_kinerja: IIndikatorKinerja[];
  total_anggaran: number; 
}

interface ISubKegiatanMethods {}

interface SubKegiatanModel extends mongoose.Model<ISubKegiatan, ISubKegiatanMethods> {}

const SubKegiatanSchema = new Schema<ISubKegiatan, SubKegiatanModel, ISubKegiatanMethods>(
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

const SubKegiatan = mongoose.models.SubKegiatan || mongoose.model<ISubKegiatan, SubKegiatanModel>('SubKegiatan', SubKegiatanSchema);

export default SubKegiatan;
