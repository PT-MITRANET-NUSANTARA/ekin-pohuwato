import mongoose, { Document, Schema } from 'mongoose';

export interface IPeriodeRKT extends Document {
    periode_start: Date; // Start date of the period
    periode_end: Date; // End date of the period
    createdAt?: Date;
    perjanjianKinerja: [string];
    unit: Object;
    updatedAt?: Date;
}

const PeriodeRKTSchema: Schema = new Schema(
    {
        periode_start: {
            type: Date,
            required: true
        },
        unit: {
            type: Object,
            required: true
            
        },
        periode_end: {
            type: Date,
            required: true
        },
     
        perjanjianKinerja: {
            type: [Object],
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
