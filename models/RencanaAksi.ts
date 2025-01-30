import mongoose, { Document, HydratedDocument, Model, Schema } from 'mongoose';
interface IRencanaAksi extends Document {
    isi: string;
    rhk: mongoose.Schema.Types.ObjectId;
    periodePenilaian: mongoose.Schema.Types.ObjectId;
    target: string;
    createdAt?: Date;
    updatedAt?: Date;
}
import buildFilterQuery from '@/utils/buildFilterQuery';

interface IRencanaAksiMethods {
    cascadeDelete(): Promise<void>;
}

interface RencanaAksiModel extends Model<IRencanaAksi, {}, IRencanaAksiMethods> {
    getAll(page: number, limit: number, filters: Object): Promise<HydratedDocument<IRencanaAksi, IRencanaAksiMethods>>;
}

const RencanaAksiSchema = new Schema<IRencanaAksi, RencanaAksiModel, IRencanaAksiMethods>(
    {
        isi: {
            type: String,
            required: true
        },
       
        rhk: {
            type: Schema.Types.ObjectId,
            ref: 'RHK',
            required: true
        },
        target: {
            type: String,
            required: true
        },
        periodePenilaian: {
            type: Schema.Types.ObjectId,
            ref: 'PeriodePenilaian',
            required: true
        }
    },
    { timestamps: true }
);

RencanaAksiSchema.method('cascadeDelete', async function cascadeDelete() {
    await this.deleteOne();
});

RencanaAksiSchema.static('getAll', async function getAll(page: number = 1, limit: number = 10, filters: Object = {}) {
    const skip = (page - 1) * limit;
    const query = this.find(buildFilterQuery(filters));
    const [results, total] = await Promise.all([query.skip(skip).limit(limit), this.countDocuments(buildFilterQuery(filters))]);

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

const RencanaAksi: RencanaAksiModel = (mongoose.models.Periode as RencanaAksiModel) || mongoose.model<IRencanaAksi, RencanaAksiModel>('RencanaAksi', RencanaAksiSchema);

export default RencanaAksi;
