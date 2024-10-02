import mongoose, { Document, Schema } from 'mongoose';

enum Jenis {
  KUALITAS = 'kualitas',
  KUANTITAS = 'kuantitas',
  WAKTU = 'waktu'
}

export interface IAspek extends Document {
  rhk: mongoose.Schema.Types.ObjectId; 
  jenis: Jenis; 
  indikator: string; 
  target_tahunan: string; 
  desc? : string;
}

const AspekSchema: Schema = new Schema({
  rhk: {
    type: Schema.Types.ObjectId,
    ref: 'RHK',
    required: true
  },
  jenis: {
    type: String,
    enum: Object.values(Jenis),
    required: true
  },
  indikator: {
    type: String,
    required: true
  },
  target_tahunan: {
    type: String,
    required: true
  },
  desc: {
    type: String,
    required: false,
    default: ''
  }
});

const Aspek = mongoose.models.Aspek || mongoose.model<IAspek>('Aspek', AspekSchema);

export default Aspek;
