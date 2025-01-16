import mongoose, { Document, Schema } from 'mongoose';

enum Jenis {
  KUALITAS = 'kualitas',
  KUANTITAS = 'kuantitas',
  WAKTU = 'waktu',
  DESKRIPSI = 'deskripsi'
}

interface IAspek extends Document {
  rhk: mongoose.Schema.Types.ObjectId; 
  jenis: Jenis; 
  indikator: string; 
  target_tahunan: Object; 
  desc? : string;
  feedback: Object;
}

interface IAspekMethods {}

interface AspekModel extends mongoose.Model<IAspek, IAspekMethods> {}

const AspekSchema = new Schema<IAspek, AspekModel, IAspekMethods>({
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
  feedback: {
    type: Object,
    required: false,
    default: null
  },
  target_tahunan: {
    type: Object,
    required: true
  },
  desc: {
    type: String,
    required: false,
    default: ''
  }
});

const Aspek = mongoose.models.Aspek || mongoose.model<IAspek, AspekModel>('Aspek', AspekSchema);

export default Aspek;
