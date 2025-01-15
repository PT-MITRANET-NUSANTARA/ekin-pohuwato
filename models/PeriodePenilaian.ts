import mongoose, { Document, Schema } from 'mongoose';

interface IPeriodePenilaian extends Document {
    name: string;
    periodeStart: Date;
    periodeEnd: Date;
    skp: mongoose.Schema.Types.ObjectId; 
    createdAt?: Date; 
    updatedAt?: Date;
}

interface IPeriodePenilaianMethods {}

interface PeriodePenilaianModel extends mongoose.Model<IPeriodePenilaian, IPeriodePenilaianMethods> {}

const PeriodePenilaianSchema = new Schema<IPeriodePenilaian, PeriodePenilaianModel, IPeriodePenilaianMethods>(
    {
        name: {
            type: String,
            require: true
        },
        periodeStart: {
            type: Date,
            required: true
        },
        periodeEnd: {
            type: Date,
            required: true
        },
        skp: {
            type: Schema.Types.ObjectId,
            ref: 'SKP',
            required: true
        }
    },
    {
        timestamps: true, 
        toObject: { virtuals: true }, 
        toJSON: { virtuals: true } 
    }
);

PeriodePenilaianSchema.virtual('penilaians', {
    ref: 'Penilaian',
    localField: '_id',
    foreignField: 'periodePenilaian',
    justOne: false
});

const PeriodePenilaian = mongoose.models.PeriodePenilaian || mongoose.model<IPeriodePenilaian, PeriodePenilaianModel>('PeriodePenilaian', PeriodePenilaianSchema);

export default PeriodePenilaian;
