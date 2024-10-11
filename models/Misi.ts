import mongoose, { Document, Schema } from 'mongoose';
import { IVisi } from './Visi';

export interface IMisi extends Document {
    name: string; // Name of the mission
    createdAt?: Date;
    updatedAt?: Date;
    visi: mongoose.Types.ObjectId | IVisi;
}

const MisiSchema: Schema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        visi: {
            type: Schema.Types.ObjectId,
            ref: 'Visi',
            required: true
        }
    },
    { timestamps: true }
);

MisiSchema.virtual('Renstras', {
    ref: 'Renstra',
    localField: '_id',
    foreignField: 'misi',
    justOne: false
});


const Misi = mongoose.models.Misi || mongoose.model<IMisi>('Misi', MisiSchema);

export default Misi;
