import mongoose, { Document, Schema } from 'mongoose';

export interface IPeriode extends Document {
    periode_start: Date; // Start date of the period
    periode_end: Date; // End date of the period
    createdAt?: Date;
    updatedAt?: Date;
}

const PeriodeSchema: Schema = new Schema(
    {
        periode_start: {
            type: Date,
            required: true
        },
        periode_end: {
            type: Date,
            required: true
        }
    },
    { timestamps: true }
);

PeriodeSchema.virtual('Visis', {
    ref: 'Visi',
    localField: '_id',
    foreignField: 'periode',
    justOne: false
});

const Periode = mongoose.models.Periode || mongoose.model<IPeriode>('Periode', PeriodeSchema);

export default Periode;
