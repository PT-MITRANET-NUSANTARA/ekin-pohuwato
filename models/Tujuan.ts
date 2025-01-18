import buildFilterQuery from '@/utils/buildFilterQuery';
import mongoose, { Document, HydratedDocument, Schema } from 'mongoose';

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

interface ITujuanMethods {
    cascadeDelete(): Promise<void>;
}

interface TujuanModel extends mongoose.Model<ITujuan,{} ,ITujuanMethods> {
        getAll(page: number, limit: number, filters:Object): Promise<HydratedDocument<ITujuan, ITujuanMethods>>;
    
}

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

TujuanSchema.method('cascadeDelete', async function cascadeDelete() {
    const program = await mongoose.model('Program').find({ tujuan:  this.id });
    program.forEach(async (p) => {
        await p.cascadeDelete();
    });
    await this.deleteOne();
});

TujuanSchema.static('getAll', async function getAll(page: number = 1, limit: number = 10, filters: Object = {}) {
    const skip = (page - 1) * limit;
    const query = this.find(buildFilterQuery(filters))
    const [results, total] = await Promise.all([
        query.skip(skip).limit(limit).populate('renstra'),  
        this.countDocuments(buildFilterQuery(filters)), 
    ]);

    return {
        data: results,
        pagination: {
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalItems: total,
            pageSize: limit,
        },
    };
});

TujuanSchema.virtual('Programs', {
    ref: 'Program',
    localField: '_id',
    foreignField: 'tujuan',
    justOne: false,
});

const Tujuan: TujuanModel = mongoose.models.Tujuan as TujuanModel || mongoose.model<ITujuan, TujuanModel>('Tujuan', TujuanSchema);

export default Tujuan;
