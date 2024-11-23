import mongoose, { Document, Schema } from 'mongoose';

export interface ITPP extends Document {
  user_id: string;
  jabatan: Object;
  status: boolean; 
  periodeRKT: mongoose.Schema.Types.ObjectId; 
}

const TPPSchema: Schema = new Schema({
  user_id: {
    type: String,
    required: true
  },
  jabatan: {
    type: Object,
    required: true
  },
  status: {
    type: Boolean,
    required: true
  },
  periodeRKT: {
    type: Schema.Types.ObjectId,
    ref: 'PeriodeRKT',
    required: true
  }
});

const TPP = mongoose.models.TPP || mongoose.model<ITPP>('TPP', TPPSchema);

export default TPP;
