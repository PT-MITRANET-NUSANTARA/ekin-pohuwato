import mongoose, { Document, Schema } from 'mongoose';
import { IProgram } from './Program';  // Assuming the Program model is in a separate file

export interface IRenstra extends Document {
  name: string;
  periode_start: string;
  periode_end: string;
  programs: mongoose.Types.ObjectId[] | IProgram[];  // Array of ObjectId references to Program documents or populated Program documents
  createdAt?: Date;
  updatedAt?: Date;
}

const RenstraSchema: Schema = new Schema({
  name: {
    type: String,
    required: true
  },
  periode_start: {
    type: String,
    required: true
  },
  periode_end: {
    type: String,
    required: true
  },

}, { timestamps: true });

RenstraSchema.virtual('programs', {
    ref: 'Program',
    localField: '_id',
    foreignField: 'renstra',
    justOne: false
    });

const Renstra = mongoose.models.Renstra || mongoose.model<IRenstra>('Renstra', RenstraSchema);

export default Renstra;
