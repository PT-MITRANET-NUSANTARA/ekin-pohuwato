import mongoose, { Document, Schema } from 'mongoose';
import { IRenstra } from './Renstra';

export interface IIndikatorKinerja {
    name: string; // Name of the performance indicator
    target: number; // Target for the indicator
    satuan: string; // Unit of measure
}

export interface ITujuan extends Document {
    sasaran_strategis: string; // Strategic target
    indikator_kinerja: IIndikatorKinerja[]; // Updated to use an array of performance indicators
    createdAt?: Date;
    updatedAt?: Date;
    name: string; // Name of the goal
    renstra: mongoose.Types.ObjectId | IRenstra; // Reference to the associated Renstra
}

const TujuanSchema: Schema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        sasaran_strategis: {
            type: String,
            required: true,
        },
        indikator_kinerja: [
            {
                name: {
                    type: String,
                    required: true,
                },
                target: {
                    type: Number,
                    required: true,
                },
                satuan: {
                    type: String,
                    required: true,
                },
            },
        ],
        renstra: {
            type: Schema.Types.ObjectId,
            ref: 'Renstra',
            required: true,
        },
    },
    { timestamps: true }
);

TujuanSchema.virtual('Programs', {
    ref: 'Program',
    localField: '_id',
    foreignField: 'tujuan',
    justOne: false,
});

const Tujuan = mongoose.models.Tujuan || mongoose.model<ITujuan>('Tujuan', TujuanSchema);

export default Tujuan;
