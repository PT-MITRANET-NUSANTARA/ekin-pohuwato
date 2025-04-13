import mongoose, { Document, HydratedDocument, Schema } from 'mongoose';
import buildFilterQuery from '@/utils/buildFilterQuery';

interface IFileObject {
    fileId: string;
    name: string;
    type: string;
    uid: string;
}

interface IPerjanjianKinerja extends Document {
    periodeRKT: mongoose.Types.ObjectId;
    unit: Object;
    file_perjanjian: IFileObject[];
    createdAt?: Date;
    updatedAt?: Date;
}

interface IPerjanjianKinerjaMethods {
    cascadeDelete(): Promise<void>;
}

interface PerjanjianKinerjaModel extends mongoose.Model<IPerjanjianKinerja, {}, IPerjanjianKinerjaMethods> {
    getAll(page: number, limit: number, filters: Object): Promise<HydratedDocument<IPerjanjianKinerja, IPerjanjianKinerjaMethods>>;
}

// Define the file schema directly without using Schema constructor
const PerjanjianKinerjaSchema = new Schema<IPerjanjianKinerja, PerjanjianKinerjaModel, IPerjanjianKinerjaMethods>(
    {
        periodeRKT: {
            type: Schema.Types.ObjectId,
            ref: 'PeriodeRKT',
            required: true
        },
        unit: {
            type: Object,
            required: true
        },
        file_perjanjian: {
            type: [{
                fileId: { type: String, required: true },
                name: { type: String, required: true },
                type: { type: String, required: false },
                uid: { type: String, required: false }
            }],
            default: [],
            _id: false
        }
    },
    {
        timestamps: true,
        toObject: { virtuals: true },
        toJSON: { virtuals: true }
    }
);

PerjanjianKinerjaSchema.method('cascadeDelete', async function cascadeDelete() {
    // Add cascade delete functionality if needed
    await this.deleteOne();
});

PerjanjianKinerjaSchema.static('getAll', async function getAll(page: number = 1, limit: number = 10, filters: Object = {}) {
    const skip = (page - 1) * limit;
    const query = this.find(buildFilterQuery(filters));
    const [results, total] = await Promise.all([
        query.skip(skip).limit(limit).populate('periodeRKT'),
        this.countDocuments(buildFilterQuery(filters))
    ]);

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

const PerjanjianKinerja: PerjanjianKinerjaModel = (mongoose.models.PerjanjianKinerja as PerjanjianKinerjaModel) || 
    mongoose.model<IPerjanjianKinerja, PerjanjianKinerjaModel>('PerjanjianKinerja', PerjanjianKinerjaSchema);

export default PerjanjianKinerja; 