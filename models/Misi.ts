import mongoose, { Document, Schema } from 'mongoose';

interface IMisi extends Document {
    name: string; // Name of the mission
    createdAt?: Date;
    updatedAt?: Date;
    visi: mongoose.Types.ObjectId;
}

interface IMisiMethods {}

interface MisiModel extends mongoose.Model<IMisi, IMisiMethods> {}

const MisiSchema  = new Schema<IMisi, MisiModel, IMisiMethods>(
    {
        name: {
            type: String,
            required: true
        },
        visi: {
            type: Schema.Types.ObjectId,
            ref: 'Visi',
            required: true
        }
    },
    { timestamps: true }
);

MisiSchema.virtual('Renstras', {
    ref: 'Renstra',
    localField: '_id',
    foreignField: 'misi',
    justOne: false
});


const Misi = mongoose.models.Misi || mongoose.model<IMisi, MisiModel>('Misi', MisiSchema);

export default Misi;
