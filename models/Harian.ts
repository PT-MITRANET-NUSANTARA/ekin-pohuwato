import mongoose, { Document, Schema } from 'mongoose';

// Define the Harian interface extending Document
export interface IHarian extends Document {
  date: Date;
  startDateTime: Date;
  endDateTime: Date;
  rhk: mongoose.Schema.Types.ObjectId;
  namaKegiatan: string;
  deskripsiKegiatan: string;
  tautan?: string;
  files?: string[];
  user_id: string; // Reference to User ID
  createdAt?: Date;
  updatedAt?: Date;
}

// Define the Harian schema
const HarianSchema: Schema = new Schema({
  date: {
    type: Date,
    default: Date.now,
    required: true
  },
  startDateTime: {
    type: Date,
    required: true
  },
  endDateTime: {
    type: Date,
    required: true
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
    type: [String],
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
