import mongoose, { Document, Schema } from 'mongoose';

export interface IUMPEG extends Document {
  unit: Object;
  jabatan: Object;
}

const UMPEGSchema: Schema = new Schema({
  unit: {
    type: Object,
    required: true
  },
  jabatan: {
    type: Object,
    required: true
  }
}, { timestamps: true });

const UMPEG = mongoose.models.UMPEG || mongoose.model<IUMPEG>('UMPEG', UMPEGSchema);

export default UMPEG;
