import mongoose, { Document, Schema } from 'mongoose';
import SubKegiatan, { ISubKegiatan } from './SubKegiatan'; // Assuming the SubKegiatan model is in a separate file
import { IPeriodeRKT } from './PeriodeRKT';

export interface base {
    name: string; // Name of the performance indicator
    target_capaian: number; // Target for the indicator
    satuan: string; // Unit of measure
}

export interface IRKT extends Document {
    periodeRKT: mongoose.Types.ObjectId | IPeriodeRKT; // Reference to the associated SubKegiatan
    name: string; // Name of the RKT
    input: base[];
    output: base[];
    outcome: base[];
    subKegiatan: mongoose.Schema.Types.ObjectId; // Single reference to a SubKegiatan document
    unit: Object;
    total_anggaran: number; // Total budget for the RKT
}

const RKTSchema: Schema = new Schema(
    {
        periodeRKT: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'PeriodeRKT',
            required: true
        },
        subKegiatan: {
            type: Schema.Types.ObjectId,
            ref: 'SubKegiatan', // Single reference to SubKegiatan model
            required: true
        },
        name: {
            type: String,
            required: true
        },
        input: [
            {
                name: {
                    type: String,
                    required: true
                },
                target: {
                    type: Number,
                    required: true
                },
                satuan: {
                    type: String,
                    required: true
                }
            }
        ],
        output: [
            {
                name: {
                    type: String,
                    required: true
                },
                target: {
                    type: Number,
                    required: true
                },
                satuan: {
                    type: String,
                    required: true
                }
            }
        ],
        outcome: [
            {
                name: {
                    type: String,
                    required: true
                },
                target: {
                    type: Number,
                    required: true
                },
                satuan: {
                    type: String,
                    required: true
                }
            }
        ],
        unit: {
            type: Object,
            required: true
        },
        total_anggaran: {
            type: Number,
            required: true
        }
    },
    { timestamps: true }
);

const RKT = mongoose.models.RKT || mongoose.model<IRKT>('RKT', RKTSchema);

export default RKT;
