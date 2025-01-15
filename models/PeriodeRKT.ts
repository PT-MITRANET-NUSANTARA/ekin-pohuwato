import mongoose, { Document, Schema } from 'mongoose';

interface IPeriodeRKT extends Document {
    periode_start: Date; 
    periode_end: Date; 
    createdAt?: Date;
    perjanjianKinerja: [string];
    unit: Object;
    updatedAt?: Date;
}

interface IPeriodeRKTMethods{}

interface PeriodeRKTModel extends mongoose.Model<IPeriodeRKT, IPeriodeRKTMethods> {
}

const PeriodeRKTSchema = new Schema<IPeriodeRKT, PeriodeRKTModel, IPeriodeRKTMethods>(
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

PeriodeRKTSchema.virtual('TPPS', {
    ref: 'TPP',
    localField: '_id',
    foreignField: 'periodeRKT',
    justOne: false
});

const PeriodeRKT = mongoose.models.PeriodeRKT || mongoose.model<IPeriodeRKT, PeriodeRKTModel>('PeriodeRKT', PeriodeRKTSchema);

export default PeriodeRKT;
