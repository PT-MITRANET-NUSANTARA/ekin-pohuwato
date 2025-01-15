import mongoose, { Document, Model, Schema } from 'mongoose';

interface IPeriode extends Document {
    periode_start: Date; // Start date of the period
    periode_end: Date; // End date of the period
    createdAt?: Date;
    updatedAt?: Date;
}

interface IPeriodeMethods{

}

interface PeriodeModel extends Model<IPeriode, {}, IPeriodeMethods> {
}

const PeriodeSchema: Schema = new Schema<IPeriode, PeriodeModel, IPeriodeMethods>(
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

const Periode = mongoose.models.Periode || mongoose.model<IPeriode, PeriodeModel>('Periode', PeriodeSchema);

export default Periode;
