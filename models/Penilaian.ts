import buildFilterQuery from '@/utils/buildFilterQuery';
import mongoose, { Document, HydratedDocument, Schema } from 'mongoose';

interface IPenilaian extends Document {
    ratingKinerja?: number;
    ratingPerilaku?: number;
    ratingPredikat?: number;
    periodePenilaian: mongoose.Schema.Types.ObjectId;
    skp: mongoose.Schema.Types.ObjectId;
    penilai: mongoose.Schema.Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

interface IPenilaianMethods {
    cascadeDelete(): Promise<void>;
}

interface PenilaianModel extends mongoose.Model<IPenilaian, {}, IPenilaianMethods> {
    getAll(page: number, limit: number, filters: Object): Promise<HydratedDocument<IPenilaian, IPenilaianMethods>>;
}

const PenilaianSchema = new Schema<IPenilaian, PenilaianModel, IPenilaianMethods>(
    {
        ratingKinerja: {
            type: Number,
            min: 1,
            max: 5,
            default: null,
        },
        ratingPerilaku: {
            type: Number,
            min: 1,
            max: 5,
            default: null,

        },
        ratingPredikat: {
            type: Number,
            min: 1,
            max: 5,
            default: null,
        },
        periodePenilaian: {
            type: Schema.Types.ObjectId,
            ref: 'PeriodePenilaian',
            required: true
        },
        penilai: {
            type: Schema.Types.ObjectId,
            ref: 'SKP',
            required: true
        },
        skp: {
            type: Schema.Types.ObjectId,
            ref: 'SKP',
            required: true
        }
    },
    {
        timestamps: true,
        toObject: { virtuals: true },
        toJSON: { virtuals: true }
    }
);

PenilaianSchema.method('cascadeDelete', async function cascadeDelete() {
    await this.deleteOne();
});

PenilaianSchema.static('getAll', async function getAll(page: number = 1, limit: number = 10, filters: Object = {}) {
    const skip = (page - 1) * limit;
    const query = this.find(buildFilterQuery(filters));
    const [results, total] = await Promise.all([query.skip(skip).limit(limit).populate('periodePenilaian'), this.countDocuments(buildFilterQuery(filters))]);

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

const Penilaian : PenilaianModel = mongoose.models.Penilaian as PenilaianModel || mongoose.model<IPenilaian, PenilaianModel>('Penilaian', PenilaianSchema);

export default Penilaian;
