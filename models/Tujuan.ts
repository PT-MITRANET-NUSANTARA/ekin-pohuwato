import mongoose, { Document, Schema } from 'mongoose';
import { IRenstra } from './Renstra';

export interface ITujuan extends Document {
    sasaran_strategis: string; // Strategic target
    indikator_kinerja: string; // Performance indicator
    target_indikator: string; // Target for the indicator
    satuan: string; // Unit of measure
    createdAt?: Date;
    updatedAt?: Date;
    renstra: mongoose.Types.ObjectId | IRenstra; // Reference to the associated Renstra
}

const TujuanSchema: Schema = new Schema(
    {
        sasaran_strategis: {
            type: String,
            required: true
        },
        indikator_kinerja: {
            type: String,
            required: true
        },
        target_indikator: {
            type: String,
            required: true
        },
        satuan: {
            type: String,
            required: true
        },
        renstra: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Renstra',
            required: true
        }
    },
    { timestamps: true }
);

TujuanSchema.virtual('Programs', {
    ref: 'Program',
    localField: '_id',
    foreignField: 'tujuan',
    justOne: false
});

const Tujuan = mongoose.models.Tujuan || mongoose.model<ITujuan>('Tujuan', TujuanSchema);

export default Tujuan;
