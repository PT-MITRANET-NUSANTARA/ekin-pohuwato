import mongoose, { Document, Schema } from 'mongoose';

enum MsgStatus {
  PERIKSA = 'Periksa',
  TERIMA = 'Terima',
  TOLAK = 'Tolak',
}

interface Msg {
  status: MsgStatus;
  message: string;
}

interface IHarian extends Document {
  absence: string;
  date: Date;
  startDateTime: string;
  endDateTime: string;
  rhk: mongoose.Schema.Types.ObjectId;
  isSKP: boolean;
  namaKegiatan: string;
  deskripsiKegiatan: string;
  progress: number;
  tautan?: string;
  files?: [object];
  msg?: Msg;
  user_id: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface IHarianMethods {}

interface HarianModel extends mongoose.Model<IHarian, IHarianMethods> {}

const HarianSchema = new Schema<IHarian, HarianModel, IHarianMethods>(
  {
    absence: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
      required: true,
    },
    isSKP: {
      type: Boolean,
      required: true,
      default: false,
    },
    startDateTime: {
      type: String,
      required: true,
    },
    endDateTime: {
      type: String,
      required: true,
    },
    progress: {
      type: Number,
      required: true,
    },
    msg: {
      status: {
        type: String,
        enum: Object.values(MsgStatus), 
        default: MsgStatus.PERIKSA, 
      },
      message: {
        type: String,
        required: false,
        default: '',
      },
    },
    rhk: {
      type: Schema.Types.ObjectId,
      ref: 'RHK',
      required: true,
    },
    namaKegiatan: {
      type: String,
      required: true,
    },
    deskripsiKegiatan: {
      type: String,
      required: true,
    },
    tautan: {
      type: String,
      required: false,
    },
    files: {
      type: [Object],
      required: false,
    },
    user_id: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Harian = mongoose.models.Harian || mongoose.model<IHarian>('Harian', HarianSchema);

export default Harian;
