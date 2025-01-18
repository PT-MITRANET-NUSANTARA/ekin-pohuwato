import buildFilterQuery from '@/utils/buildFilterQuery';
import mongoose, { Document, HydratedDocument, Schema } from 'mongoose';

interface IMisi extends Document {
    name: string; // Name of the mission
    createdAt?: Date;
    updatedAt?: Date;
    visi: mongoose.Types.ObjectId;
}

interface IMisiMethods {
    cascadeDelete(): Promise<void>;
}

interface MisiModel extends mongoose.Model<IMisi, {}, IMisiMethods> {
    getAll(page: number, limit: number, filters: Object): Promise<HydratedDocument<IMisi, IMisiMethods>>;
}

const MisiSchema = new Schema<IMisi, MisiModel, IMisiMethods>(
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

MisiSchema.method('cascadeDelete', async function cascadeDelete() {
    const renstra = await mongoose.model('Renstra').find({ misi:  [this.id]  });
    renstra.forEach(async (r) => {
        await r.cascadeDelete();
    });
    await this.deleteOne();
});

MisiSchema.static('getAll', async function getAll(page: number = 1, limit: number = 10, filters: Object) {
    const skip = (page - 1) * limit;

    const [results, total] = await Promise.all([this.find(buildFilterQuery(filters)).skip(skip).limit(limit).populate('visi'), this.countDocuments(buildFilterQuery(filters))]);

    return {
        data: results,
        pagination: {
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalItems: total,
            pageSize: limit
        }
    };
});

MisiSchema.virtual('Renstras', {
    ref: 'Renstra',
    localField: '_id',
    foreignField: 'misi',
    justOne: false
});

const Misi: MisiModel = mongoose.models.Misi as MisiModel || mongoose.model<IMisi, MisiModel>('Misi', MisiSchema);
export default Misi;
