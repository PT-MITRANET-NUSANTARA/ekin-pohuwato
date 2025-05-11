import buildFilterQuery from '@/utils/buildFilterQuery';
import mongoose, { Document, HydratedDocument, Schema } from 'mongoose';

interface IRHK extends Document {
    userRHK: mongoose.Schema.Types.ObjectId; // Reference to the higher-level UserRHK (required now)
    periodePenilaian: mongoose.Schema.Types.ObjectId; // Reference to evaluation period (required now)
    skp: mongoose.Schema.Types.ObjectId; // Reference to the SKP (required now)
    aspek?: mongoose.Schema.Types.ObjectId[];
    desc: string;
    createdAt?: Date; 
    updatedAt?: Date;
}

interface IRHKMethods {
    cascadeDelete(): Promise<void>;
}

interface RHKModel extends mongoose.Model<IRHK,{}, IRHKMethods> {
    getAll(page: number, limit: number, filters: Object): Promise<HydratedDocument<IRHK, IRHKMethods>>;
}

const RHKSchema = new Schema<IRHK,  RHKModel, IRHKMethods>(
    {
        userRHK: {
            type: Schema.Types.ObjectId,
            ref: 'UserRHK',
            required: true
        },
        periodePenilaian: {
            type: Schema.Types.ObjectId,
            ref: 'PeriodePenilaian',
            required: true
        },
        skp: {
            type: Schema.Types.ObjectId,
            ref: 'SKP',
            required: true
        },
        desc: {
            type: String,
            required: false,
            default: ''
        }
    },
    {
        timestamps: true,
        toObject: { virtuals: true }, // This ensures virtuals are included when you convert to Object
        toJSON: { virtuals: true }
    }
);

RHKSchema.method('cascadeDelete', async function cascadeDelete() {
    const aspek = await mongoose.model('Aspek').find({ rhk: this._id });
    aspek.forEach(async (a) => {
        await a.cascadeDelete();
    });
    await this.deleteOne();
});

RHKSchema.static('getAll', async function getAll(page: number = 1, limit: number = 10, filters: Object = {}) {
    const skip = (page - 1) * limit;
    const query = this.find(buildFilterQuery(filters));
    const [results, total] = await Promise.all([
        query
            .skip(skip)
            .limit(limit)
            .populate('aspek')
            .populate({
                path: 'userRHK',
                populate: [
                    { path: 'rkts' },
                    { path: 'skp' }
                ]
            })
            .populate('periodePenilaian')
            .populate('skp'),
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


RHKSchema.virtual('aspek', {
    ref: 'Aspek',
    localField: '_id',
    foreignField: 'rhk',
    justOne: false
});

RHKSchema.virtual('harians', {
    ref: 'Harian',
    localField: '_id',
    foreignField: 'rhk',
    justOne: false
});

RHKSchema.virtual('FeedbackRHKs', {
    ref: 'FeedbackRHK',
    localField: '_id',
    foreignField: 'rhk',
    justOne: false
});

const RHK: RHKModel = mongoose.models.RHK as RHKModel || mongoose.model<IRHK, RHKModel>('RHK', RHKSchema);

export default RHK;
