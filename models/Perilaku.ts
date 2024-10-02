import mongoose, { Document, Schema } from 'mongoose';

export interface IPerilaku extends Document {
  skp: mongoose.Schema.Types.ObjectId; // Reference to the SKP document
  name: string;
  isi: string[];
  espektasi: string;
  feedback?: string;
  like?: boolean;
}

const PerilakuSchema: Schema = new Schema({
  skp: {
    type: Schema.Types.ObjectId,
    ref: 'SKP',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  isi: {
    type: [String],
    required: true
  },
  espektasi: {
    type: String,
    required: true
  },
  feedback: {
    type: String,
    required: false,
    default: ''
  },
  like: {
    type: Boolean,
    required: false,
    default: null
  }
});

const Perilaku = mongoose.models.Perilaku || mongoose.model<IPerilaku>('Perilaku', PerilakuSchema);

export default Perilaku;
