import mongoose, { Document, Schema } from 'mongoose';

interface IPenilaian extends Document {
    ratingKinerja?: number;
    ratingPerilaku?: number;
    periodePenilaian: mongoose.Schema.Types.ObjectId;
    skp: mongoose.Schema.Types.ObjectId;
    createdAt?: Date; 
    updatedAt?: Date; 
}

interface IPenilaianMethods {}

interface PenilaianModel extends mongoose.Model<IPenilaian, IPenilaianMethods> {}

const PenilaianSchema = new Schema<IPenilaian, PenilaianModel, IPenilaianMethods>(
    {
        ratingKinerja: {
            type: Number,
            required: false,
            min: 1, 
            max: 5 
        },
        ratingPerilaku: {
            type: Number,
            required: false,
            min: 1,
            max: 5
        },
        periodePenilaian: {
            type: Schema.Types.ObjectId,
            ref: 'PeriodePenilaian',
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

const Penilaian = mongoose.models.Penilaian || mongoose.model<IPenilaian, PenilaianModel>('Penilaian', PenilaianSchema);

export default Penilaian;
