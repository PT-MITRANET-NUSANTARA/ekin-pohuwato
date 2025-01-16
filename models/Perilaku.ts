import mongoose, { Document, Schema } from 'mongoose';

interface IPerilaku extends Document {
  skp: mongoose.Schema.Types.ObjectId; 
  name: string;
  isi: string[];
  espektasi: string;
  feedback?: object;
}

interface IPerilakuMethods {}

interface PerilakuModel extends mongoose.Model<IPerilaku, IPerilakuMethods> {}

const PerilakuSchema = new Schema<IPerilaku, PerilakuModel, IPerilakuMethods>({
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
    required: false
  },
  feedback: {
    type: Object,
    required: false,
    default: null
  },

});

const Perilaku = mongoose.models.Perilaku || mongoose.model<IPerilaku, PerilakuModel>('Perilaku', PerilakuSchema);

export default Perilaku;
