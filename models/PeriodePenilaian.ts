import mongoose, { Document, Schema } from 'mongoose';

// Define the interface for the PeriodePenilaian document
export interface IPeriodePenilaian extends Document {
    name: string;
    periodeStart: Date;
    periodeEnd: Date;
    skp: mongoose.Schema.Types.ObjectId; // Reference to SKP document
    createdAt?: Date; // Optional since it will be auto-managed by Mongoose
    updatedAt?: Date; // Optional for the same reason
}

// Define the schema for PeriodePenilaian
const PeriodePenilaianSchema: Schema = new Schema(
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
        timestamps: true, // Automatically manage createdAt and updatedAt fields
        toObject: { virtuals: true }, // Ensure virtuals are included when converting to objects
        toJSON: { virtuals: true } // Ensure virtuals are included when converting to JSON
    }
);

PeriodePenilaianSchema.virtual('penilaians', {
    ref: 'Penilaian',
    localField: '_id',
    foreignField: 'periodePenilaian',
    justOne: false
});
// Create the PeriodePenilaian model if it doesn't already exist
const PeriodePenilaian = mongoose.models.PeriodePenilaian || mongoose.model<IPeriodePenilaian>('PeriodePenilaian', PeriodePenilaianSchema);

export default PeriodePenilaian;
