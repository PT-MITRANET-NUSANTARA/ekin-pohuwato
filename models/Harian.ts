import mongoose, { Document, Schema } from 'mongoose';

interface msg 
{
  status: boolean;
  message: string;
}

// Define the Harian interface extending Document
export interface IHarian extends Document {
  absence: string;
  date: Date;
  startDateTime: string;
  endDateTime: string;
  rhk: mongoose.Schema.Types.ObjectId;
  namaKegiatan: string;
  deskripsiKegiatan: string;
  progress: number;
  tautan?: string;
  files?: [object];
  msg?: msg;
  user_id: string; // Reference to User ID
  createdAt?: Date;
  updatedAt?: Date;
}

// Define the Harian schema
const HarianSchema: Schema = new Schema({
  absence: {
    type: String,
    required: true 
  },
  date: {
    type: Date,
    default: Date.now,
    required: true
  },
  startDateTime: {
    type: Date,
    required: true
  },
  progress: {
    type: Number,
    required: true
  },
  endDateTime: {
    type: Date,
    required: true
  },
  msg: {
    status: {
      type: Boolean,
      required: false
    },
    message: {
      type: String,
      required: false
    }
  },
  rhk: {
    type: Schema.Types.ObjectId,
    ref: 'RHK',
    required: true
  },
  namaKegiatan: {
    type: String,
    required: true
  },
  deskripsiKegiatan: {
    type: String,
    required: true
  },
  tautan: {
    type: String,
    required: false
  },
  files: {
    type: [Object],
    required: false
  },
  user_id: {
    type: String,
    required: true
  }
}, { timestamps: true });

// Create the Harian model
const Harian = mongoose.models.Harian || mongoose.model<IHarian>('Harian', HarianSchema);

export default Harian;
