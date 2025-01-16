import mongoose, { Document, Schema } from 'mongoose';

interface IVisi extends Document {
    name: string; // Name of the vision
    periode: mongoose.Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

interface IVisiMethods {}

interface VisiModel extends mongoose.Model<IVisi, IVisiMethods> {}

const VisiSchema = new Schema<IVisi, VisiModel, IVisiMethods>(
    {
        name: {
            type: String,
            required: true
        },
        periode: {
            type: Schema.Types.ObjectId,
            ref: 'Periode',
            required: true
        }
    },
    { timestamps: true }
);

VisiSchema.virtual('Misis', {
    ref: 'Misi',
    localField: '_id',
    foreignField: 'visi',
    justOne: false
});

const Visi = mongoose.models.Visi || mongoose.model<IVisi, VisiModel>('Visi', VisiSchema);

export default Visi;
