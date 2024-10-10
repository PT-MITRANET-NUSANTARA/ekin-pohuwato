import mongoose, { Document, Schema } from 'mongoose';
import { IPeriode } from './Periode';

export interface IVisi extends Document {
    name: string; // Name of the vision
    periode: mongoose.Types.ObjectId | IPeriode;
    createdAt?: Date;
    updatedAt?: Date;
}

const VisiSchema: Schema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        periode: {
            type: Schema.Types.ObjectId,
            ref: 'Periode',
            required: true
        },

    },
    { timestamps: true }
);

VisiSchema.virtual('Misis', {
    ref: 'Misi',
    localField: '_id',
    foreignField: 'visi',
    justOne: false
    });

const Visi = mongoose.models.Visi || mongoose.model<IVisi>('Visi', VisiSchema);

export default Visi;
