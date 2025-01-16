import mongoose, { Document, Schema } from 'mongoose';
import Kegiatan from './Kegiatan';

interface IIndikatorKinerja {
  name: string;
  target: number; 
  satuan: string; 
}

interface IProgram extends Document {
  name: string; 
  indikator_kinerja: IIndikatorKinerja[];
  total_anggaran: number;
  tujuan: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

interface IProgramMethods {}

interface ProgramModel extends mongoose.Model<IProgram, IProgramMethods> {}

const ProgramSchema = new Schema<IProgram, ProgramModel, IProgramMethods>(
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

const Program = mongoose.models.Program || mongoose.model<IProgram, ProgramModel>('Program', ProgramSchema);

export default Program;
