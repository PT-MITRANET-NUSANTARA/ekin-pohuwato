import mongoose, { Document, Schema } from 'mongoose';
import { IAspek } from './Aspek';

enum Jenis {
    UTAMA = 'utama',
    TAMBAHAN = 'tambahan'
}

enum Klasifikasi {
    ORGANISASI = 'organisasi',
    INDIVIDU = 'individu'
}

export interface IRHK extends Document {
    skp: mongoose.Schema.Types.ObjectId;
    rhk?: mongoose.Schema.Types.ObjectId; // Reference to another RHK document (nullable)
    rkt?: mongoose.Schema.Types.ObjectId; // Reference to the associated RKT document
    aspek?: IAspek[];
    jenis: Jenis;
    rencana: Object;
    klasifikasi?: Klasifikasi;
    createdAt?: Date; // Optional since it will be auto-managed by Mongoose
    updatedAt?: Date;
    desc: string;
}

const RHKSchema: Schema = new Schema(
    {
        skp: {
            type: Schema.Types.ObjectId,
            ref: 'SKP',
            required: true
        },
        desc: {
            type: String,
            required: false,
            default: ''
        },
        rhk: {
            type: Schema.Types.ObjectId,
            ref: 'RHK',
            required: false
        },
        rkt: {
            type: Schema.Types.ObjectId,
            ref: 'RKT',
            required: false
        },
        jenis: {
            type: String,
            enum: Object.values(Jenis),
            required: true
        },
        klasifikasi: {
            type: String,
            enum: Object.values(Klasifikasi),
            required: false
        },
        rencana: {
            type: Object,
            required: false
        }
    },
    {
        timestamps: true,
        toObject: { virtuals: true }, // This ensures virtuals are included when you convert to Object
        toJSON: { virtuals: true }
    }
);

RHKSchema.virtual('aspek', {
    ref: 'Aspek',
    localField: '_id',
    foreignField: 'rhk',
    justOne: false
});

RHKSchema.virtual('harians', {
    ref: 'Harian',
    localField: '_id',
    foreignField: 'rhk',
    justOne: false
});

const RHK = mongoose.models.RHK || mongoose.model<IRHK>('RHK', RHKSchema);

export default RHK;
