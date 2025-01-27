import buildFilterQuery from '@/utils/buildFilterQuery';
import mongoose, { Document, HydratedDocument, Schema } from 'mongoose';

interface IVisi extends Document {
    name: string; // Name of the vision
    // periode: mongoose.Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

interface IVisiMethods {
    cascadeDelete(): Promise<void>;
}

interface VisiModel extends mongoose.Model<IVisi, {},IVisiMethods> {
    getAll(page: number, limit: number, filters: Object): Promise<HydratedDocument<IVisi, IVisiMethods>>;
}

const VisiSchema = new Schema<IVisi, VisiModel, IVisiMethods>(
    {
        name: {
            type: String,
            required: true
        },
        // periode: {
        //     type: Schema.Types.ObjectId,
        //     ref: 'Periode',
        //     required: true
        // }
    },
    { timestamps: true }
);

VisiSchema.method('cascadeDelete', async function cascadeDelete() {
    const misi = await mongoose.model('Misi').find({ visi: this.id });
    misi.forEach(async (m) => {
        await m.cascadeDelete();
    });
    await this.deleteOne();
});

VisiSchema.static('getAll', async function getAll(page: number = 1, limit: number = 10, filters: Object = {}) {
    const skip = (page - 1) * limit;
    const query = this.find(buildFilterQuery(filters))
    const [results, total] = await Promise.all([
        query.skip(skip).limit(limit),  
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

VisiSchema.virtual('Misis', {
    ref: 'Misi',
    localField: '_id',
    foreignField: 'visi',
    justOne: false
});

const Visi: VisiModel = mongoose.models.Visi as VisiModel || mongoose.model<IVisi, VisiModel>('Visi', VisiSchema);

export default Visi;