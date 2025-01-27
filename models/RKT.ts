import buildFilterQuery from '@/utils/buildFilterQuery';
import mongoose, { Document, HydratedDocument, Schema } from 'mongoose';

interface base {
    name: string;
    target_capaian: number;
    satuan: string;
}

interface IRKT extends Document {
    periodeRKT: mongoose.Types.ObjectId;
    name: string;
    input: base[];
    output: base[];
    outcome: base[];
    subKegiatan: mongoose.Schema.Types.ObjectId;
    unit: Object;
    total_anggaran: number;
}

interface IRKTMethods {
    cascadeDelete(): Promise<void>;
}

interface RKTModel extends mongoose.Model<IRKT, {}, IRKTMethods> {
    getAll(page: number, limit: number, filters: Object): Promise<HydratedDocument<IRKT, IRKTMethods>>;
}

const RKTSchema = new Schema<IRKT, RKTModel, IRKTMethods>(
    {
        periodeRKT: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'PeriodeRKT',
            required: true
        },
        subKegiatan: {
            type: Schema.Types.ObjectId,
            ref: 'SubKegiatan', // Single reference to SubKegiatan model
            required: true
        },
        name: {
            type: String,
            required: true
        },
        input: [
            {
                name: {
                    type: String,
                    required: true
                },
                target: {
                    type: Number,
                    required: true
                },
                satuan: {
                    type: String,
                    required: true
                }
            }
        ],
        output: [
            {
                name: {
                    type: String,
                    required: true
                },
                target: {
                    type: Number,
                    required: true
                },
                satuan: {
                    type: String,
                    required: true
                }
            }
        ],
        outcome: [
            {
                name: {
                    type: String,
                    required: true
                },
                target: {
                    type: Number,
                    required: true
                },
                satuan: {
                    type: String,
                    required: true
                }
            }
        ],
        unit: {
            type: Object,
            required: true
        },
        total_anggaran: {
            type: Number,
            required: true
        }
    },
    { timestamps: true }
);

RKTSchema.method('cascadeDelete', async function cascadeDelete() {
    const rhk = await mongoose.model('RHK').find({ rkt: this._id });
    rhk.forEach(async (r) => {
        await r.cascadeDelete();
    });

    await this.deleteOne();
});

RKTSchema.static('getAll', async function getAll(page: number = 1, limit: number = 10, filters: Object = {}) {
    const skip = (page - 1) * limit;
    const query = this.find(buildFilterQuery(filters));
    const [results, total] = await Promise.all([query.skip(skip).limit(limit).populate('periodeRKT').populate('subKegiatan'), this.countDocuments(buildFilterQuery(filters))]);

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

RKTSchema.virtual('rhks', {
    ref: 'RHK',
    localField: '_id',
    foreignField: 'rkt',
    justOne: false
});

const RKT: RKTModel = (mongoose.models.RKT as RKTModel) || mongoose.model<IRKT, RKTModel>('RKT', RKTSchema);

export default RKT;
