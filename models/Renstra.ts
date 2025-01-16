import mongoose, { Document, Schema } from 'mongoose';

interface IRenstra extends Document {
    name: string;
    periode_start: string;
    periode_end: string;
    misi: mongoose.Types.ObjectId[];
    programs: mongoose.Types.ObjectId[];
    createdAt?: Date;
    updatedAt?: Date;
}

interface IRenstraMethods {}

interface RenstraModel extends mongoose.Model<IRenstra, IRenstraMethods> {}

const RenstraSchema = new Schema<IRenstra, RenstraModel, IRenstraMethods>(
    {
        periode_start: {
            type: String,
            required: true
        },
        periode_end: {
            type: String,
            required: true
        },
        misi: {
            type: [Schema.Types.ObjectId],
            ref: 'Misi',
            required: true
        }
    },
    { timestamps: true }
);

RenstraSchema.virtual('Tujuans', {
    ref: 'Tujuan',
    localField: '_id',
    foreignField: 'renstra',
    justOne: false
});

const Renstra = mongoose.models.Renstra || mongoose.model<IRenstra, RenstraModel>('Renstra', RenstraSchema);

export default Renstra;
