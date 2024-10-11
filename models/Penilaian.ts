import mongoose, { Document, Schema } from 'mongoose';
import { IPeriodePenilaian } from './PeriodePenilaian';

export interface IPenilaian extends Document {
    ratingKinerja: number;
    ratingPerilaku: number;
    periodePenilaian: mongoose.Schema.Types.ObjectId | IPeriodePenilaian; // Reference to PeriodePenilaian document
    createdAt?: Date; // Optional since it will be auto-managed by Mongoose
    updatedAt?: Date; // Optional for the same reason
}

const PenilaianSchema: Schema = new Schema(
    {
        ratingKinerja: {
            type: Number,
            required: true,
            min: 1, // Minimum rating value (adjust as needed)
            max: 5 // Maximum rating value (adjust as needed)
        },
        ratingPerilaku: {
            type: Number,
            required: true,
            min: 1, // Minimum rating value (adjust as needed)
            max: 5 // Maximum rating value (adjust as needed)
        },
        periodePenilaian: {
            type: Schema.Types.ObjectId,
            ref: 'PeriodePenilaian', // Reference to PeriodePenilaian model
            required: true
        }
    },
    {
        timestamps: true, // Automatically manage createdAt and updatedAt fields
        toObject: { virtuals: true }, // Ensure virtuals are included when converting to objects
        toJSON: { virtuals: true } // Ensure virtuals are included when converting to JSON
    }
);

const Penilaian = mongoose.models.Penilaian || mongoose.model<IPenilaian>('Penilaian', PenilaianSchema);

export default Penilaian;
