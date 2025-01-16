import mongoose, { Document, Schema } from 'mongoose';

interface ITPP extends Document {
  user_id: string;
  jabatan: Object;
  status: boolean; 
  unit: Object;
  periodeRKT: mongoose.Schema.Types.ObjectId; 
}

interface ITPPMethods {}

interface TPPModel extends mongoose.Model<ITPP, ITPPMethods> {}

const TPPSchema = new Schema<ITPP, TPPModel, ITPPMethods>({
  user_id: {
    type: String,
    required: true
  },
  unit: {
    type: Object,
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


const TPP = mongoose.models.TPP || mongoose.model<ITPP, TPPModel>('TPP', TPPSchema);

export default TPP;
