import mongoose, { Document, HydratedDocument, Model, Schema } from 'mongoose';
interface IPeriode extends Document {
    periode_start: Date; // Start date of the period
    periode_end: Date; // End date of the period
    createdAt?: Date;
    updatedAt?: Date;
}
import buildFilterQuery from '@/utils/buildFilterQuery';

interface IPeriodeMethods{
    cascadeDelete(): Promise<void>;
}

interface PeriodeModel extends Model<IPeriode, {}, IPeriodeMethods> {
    getAll(page: number, limit: number, filters:Object): Promise<HydratedDocument<IPeriode, IPeriodeMethods>>;
}

const PeriodeSchema = new Schema<IPeriode, PeriodeModel, IPeriodeMethods>(
    {
        periode_start: {
            type: Date,
            required: true
        },
        periode_end: {
            type: Date,
            required: true
        }
    },
    { timestamps: true }
);

PeriodeSchema.method('cascadeDelete', async function cascadeDelete() {
    const  visi = await mongoose.model('Visi').find({ periode: this._id });
    visi.forEach(async (v) => {
        await v.cascadeDelete();
    });
    await this.deleteOne();
});

PeriodeSchema.static('getAll', async function getAll(page: number = 1, limit: number = 10, filters: Object = {}) {
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

PeriodeSchema.virtual('Visis', {
    ref: 'Visi',
    localField: '_id',
    foreignField: 'periode',
    justOne: false
});

const Periode:PeriodeModel = mongoose.models.Periode as PeriodeModel || mongoose.model<IPeriode, PeriodeModel>('Periode', PeriodeSchema);

export default Periode;
