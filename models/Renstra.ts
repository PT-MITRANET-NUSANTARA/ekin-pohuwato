import mongoose, { Document, Schema } from 'mongoose';
import { IProgram } from './Program'; // Assuming the Program model is in a separate file
import { IMisi } from './Misi';

export interface IRenstra extends Document {
    name: string;
    periode_start: string;
    periode_end: string;
    misi: mongoose.Types.ObjectId | IMisi; 
    programs: mongoose.Types.ObjectId[] | IProgram[]; // Array of ObjectId references to Program documents or populated Program documents
    createdAt?: Date;
    updatedAt?: Date;
}

const RenstraSchema: Schema = new Schema(
    {
        periode_start: {
            type: String,
            required: true
        },
        periode_end: {
            type: String,
            required: true
        },
        misi: {
            type: [Schema.Types.ObjectId],
            ref: 'Misi',
            required: true
        }
    },
    { timestamps: true }
);

RenstraSchema.virtual('Tujuans', {
    ref: 'Tujuan',
    localField: '_id',
    foreignField: 'renstra',
    justOne: false
});

const Renstra = mongoose.models.Renstra || mongoose.model<IRenstra>('Renstra', RenstraSchema);

export default Renstra;
