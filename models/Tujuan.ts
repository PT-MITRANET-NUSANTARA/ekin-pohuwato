import mongoose, { Document, Schema } from 'mongoose';

interface IIndikatorKinerja {
    name: string; 
    target: number; 
    satuan: string;
}

interface ITujuan extends Document {
    sasaran_strategis: string; 
    indikator_kinerja: IIndikatorKinerja[]; 
    createdAt?: Date;
    updatedAt?: Date;
    name: string;
    renstra: mongoose.Types.ObjectId 
}

interface ITujuanMethods {}

interface TujuanModel extends mongoose.Model<ITujuan, ITujuanMethods> {}

const TujuanSchema = new Schema<ITujuan, TujuanModel, ITujuanMethods>(
    {
        name: {
            type: String,
            required: true,
        },
        sasaran_strategis: {
            type: String,
            required: true,
        },
        indikator_kinerja: [
            {
                name: {
                    type: String,
                    required: true,
                },
                target: {
                    type: Number,
                    required: true,
                },
                satuan: {
                    type: String,
                    required: true,
                },
            },
        ],
        renstra: {
            type: Schema.Types.ObjectId,
            ref: 'Renstra',
            required: true,
        },
    },
    { timestamps: true }
);

TujuanSchema.virtual('Programs', {
    ref: 'Program',
    localField: '_id',
    foreignField: 'tujuan',
    justOne: false,
});

const Tujuan = mongoose.models.Tujuan || mongoose.model<ITujuan, TujuanModel>('Tujuan', TujuanSchema);

export default Tujuan;
