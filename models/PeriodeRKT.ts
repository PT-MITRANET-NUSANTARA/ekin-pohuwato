import mongoose, { Document, Schema } from 'mongoose';

export interface IPeriodeRKT extends Document {
    year: string; // The year as a string
    subKegiatan: mongoose.Schema.Types.ObjectId; // Single reference to a SubKegiatan document
    createdAt?: Date;
    perjanjianKinerja: string;
    updatedAt?: Date;
}

const PeriodeRKTSchema: Schema = new Schema(
    {
        year: {
            type: String,
            required: true,
            match: /^[0-9]{4}$/, // Regex pattern to ensure it's a 4-digit string
        },
        subKegiatan: {
            type: Schema.Types.ObjectId,
            ref: 'SubKegiatan', // Single reference to SubKegiatan model
            required: true
        },
        perjanjianKinerja: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true, // Automatically manage createdAt and updatedAt fields
        toObject: { virtuals: true }, // Include virtuals when converting to objects
        toJSON: { virtuals: true } // Include virtuals when converting to JSON
    }
);

PeriodeRKTSchema.virtual('RKTS', {
    ref: 'RKT',
    localField: '_id',
    foreignField: 'periodeRKT',
    justOne: false
});

PeriodeRKTSchema.virtual('SKPS', {
    ref: 'SKP',
    localField: '_id',
    foreignField: 'periodeRKT',
    justOne: false
});

const PeriodeRKT = mongoose.models.PeriodeRKT || mongoose.model<IPeriodeRKT>('PeriodeRKT', PeriodeRKTSchema);

export default PeriodeRKT;
