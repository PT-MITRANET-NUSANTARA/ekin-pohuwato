import mongoose, { Document, Schema } from 'mongoose';

interface base {
    name: string;
    target_capaian: number;
    satuan: string;
}

interface IRKT extends Document {
    periodeRKT: mongoose.Types.ObjectId 
    name: string; 
    input: base[];
    output: base[];
    outcome: base[];
    subKegiatan: mongoose.Schema.Types.ObjectId; 
    unit: Object;
    total_anggaran: number; 
}

interface IRKTMethods {}

interface RKTModel extends mongoose.Model<IRKT, IRKTMethods> {}

const RKTSchema: Schema = new Schema<IRKT, RKTModel, IRKTMethods>(
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

RKTSchema.virtual('rhks', {
    ref: 'RHK',
    localField: '_id',
    foreignField: 'rkt',
    justOne: false
})

const RKT = mongoose.models.RKT || mongoose.model<IRKT, RKTModel>('RKT', RKTSchema);

export default RKT;
