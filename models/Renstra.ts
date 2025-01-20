import buildFilterQuery from '@/utils/buildFilterQuery';
import mongoose, { Document, HydratedDocument, Schema } from 'mongoose';

interface IRenstra extends Document {
    name: string;
    periode_start: string;
    periode_end: string;
    misi: mongoose.Types.ObjectId[];
    programs: mongoose.Types.ObjectId[];
    createdAt?: Date;
    updatedAt?: Date;
}

interface IRenstraMethods {
    cascadeDelete(): Promise<void>;
}

interface RenstraModel extends mongoose.Model<IRenstra, {},IRenstraMethods> {
    getAll(page: number, limit: number, filters:Object): Promise<HydratedDocument<IRenstra, IRenstraMethods>>;
}

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

RenstraSchema.method('cascadeDelete', async function cascadeDelete() {
    const  tujuan = await mongoose.model('Tujuan').find({ renstra: this.id });
    tujuan.forEach(async (t) => {
        await t.cascadeDelete();
    });
    await this.deleteOne();
});

RenstraSchema.static('getAll', async function getAll(page: number = 1, limit: number = 10, filters: Object = {}) {
    const skip = (page - 1) * limit;
    const query = this.find(buildFilterQuery(filters))
    const [results, total] = await Promise.all([
        query.skip(skip).limit(limit).populate({
            path: 'misi',
            populate: {
                path: 'visi',
                populate: {
                    path: 'periode'
                }
            }
        }),  
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

RenstraSchema.virtual('Tujuans', {
    ref: 'Tujuan',
    localField: '_id',
    foreignField: 'renstra',
    justOne: false
});

const Renstra: RenstraModel = mongoose.models.Renstra as RenstraModel || mongoose.model<IRenstra, RenstraModel>('Renstra', RenstraSchema);

export default Renstra;
