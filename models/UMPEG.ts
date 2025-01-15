import mongoose, { Document, Schema } from 'mongoose';

interface IUMPEG extends Document {
  unit: Object;
  jabatan: Object;
}

interface IUMPEGMethods {}

interface UMPEGModel extends mongoose.Model<IUMPEG, IUMPEGMethods> {}

const UMPEGSchema = new Schema<IUMPEG, UMPEGModel, IUMPEGMethods>({
  unit: {
    type: Object,
    required: true
  },
  jabatan: {
    type: Object,
    required: true
  }
}, { timestamps: true });

const UMPEG = mongoose.models.UMPEG || mongoose.model<IUMPEG, UMPEGModel>('UMPEG', UMPEGSchema);

export default UMPEG;
