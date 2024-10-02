import mongoose, { Document, Schema } from 'mongoose';
import { IAspek } from './Aspek';

enum Jenis {
  UTAMA = 'utama',
  TAMBAHAN = 'tambahan'
}

enum Klasifikasi {
  ORGANISASI = 'organisasi',
  INDIVIDU = 'individu'
}

export interface IRHK extends Document {
  skp: mongoose.Schema.Types.ObjectId;
  rhk?: mongoose.Schema.Types.ObjectId; // Reference to another RHK document (nullable)
  jenis: Jenis;
  rencana: string;
  klasifikasi?: Klasifikasi;
  createdAt?: Date; // Optional since it will be auto-managed by Mongoose
  updatedAt?: Date; 
}

const RHKSchema: Schema = new Schema({
  skp: {
    type: Schema.Types.ObjectId,
    ref: 'SKP',
    required: true
  },
  rhk: {
    type: Schema.Types.ObjectId,
    ref: 'RHK',
    required: false
  },
  jenis: {
    type: String,
    enum: Object.values(Jenis),
    required: true
  },
  klasifikasi: {
    type: String,
    enum: Object.values(Klasifikasi),
    required: false
  },
  rencana: {
    type: String,
    required: true
  },
  
}, { timestamps: true});


RHKSchema.virtual('aspek', {
  ref: 'Aspek',
  localField: '_id',
  foreignField: 'rhk',
  justOne: false
});

const RHK = mongoose.models.RHK || mongoose.model<IRHK>('RHK', RHKSchema);

export default RHK;
