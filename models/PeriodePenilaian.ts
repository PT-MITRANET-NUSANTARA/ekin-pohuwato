import buildFilterQuery from '@/utils/buildFilterQuery';
import mongoose, { Document, HydratedDocument, Schema } from 'mongoose';

interface IPeriodePenilaian extends Document {
    name: string;
    periodeStart: Date;
    periodeEnd: Date;
    skp: mongoose.Schema.Types.ObjectId; 
    createdAt?: Date; 
    updatedAt?: Date;
}

interface IPeriodePenilaianMethods {
    cascadeDelete(): Promise<void>;
}

interface PeriodePenilaianModel extends mongoose.Model<IPeriodePenilaian, {} ,IPeriodePenilaianMethods> {
    getAll(page: number, limit: number, filters: Object): Promise<HydratedDocument<IPeriodePenilaian, IPeriodePenilaianMethods>>;
}

const PeriodePenilaianSchema = new Schema<IPeriodePenilaian, PeriodePenilaianModel, IPeriodePenilaianMethods>(
    {
        name: {
            type: String,
            require: true
        },
        periodeStart: {
            type: Date,
            required: true
        },
        periodeEnd: {
            type: Date,
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

PeriodePenilaianSchema.method('cascadeDelete', async function cascadeDelete() {
    const penilaian = await mongoose.model('Penilaian').find({ periodePenilaian: this._id });

    penilaian.forEach(async (p) => {
        await p.cascadeDelete();
    });

    await this.deleteOne();
});

PeriodePenilaianSchema.static('getAll', async function getAll(page: number = 1, limit: number = 10, filters: Object = {}) {
    const skip = (page - 1) * limit;
    const query = this.find(buildFilterQuery(filters));
    const [results, total] = await Promise.all([query.skip(skip).limit(limit).populate('skp'), this.countDocuments(buildFilterQuery(filters))]);

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

PeriodePenilaianSchema.virtual('penilaians', {
    ref: 'Penilaian',
    localField: '_id',
    foreignField: 'periodePenilaian',
    justOne: false
});

const PeriodePenilaian: PeriodePenilaianModel = mongoose.models.PeriodePenilaian as PeriodePenilaianModel || mongoose.model<IPeriodePenilaian, PeriodePenilaianModel>('PeriodePenilaian', PeriodePenilaianSchema);

export default PeriodePenilaian;
