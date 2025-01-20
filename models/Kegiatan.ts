import buildFilterQuery from '@/utils/buildFilterQuery';
import mongoose, { Document, HydratedDocument, Schema } from 'mongoose';

export interface IIndikatorKinerja {
    name: string;
    target: number;
    satuan: string;
}

interface IKegiatan extends Document {
    program: mongoose.Types.ObjectId;
    name: string;
    indikator_kinerja: IIndikatorKinerja[];
    total_anggaran: number;
    subKegiatans?: mongoose.Types.ObjectId[];
}

interface IKegiatanMethods {
    cascadeDelete(): Promise<void>;
}

interface KegiatanModel extends mongoose.Model<IKegiatan, {}, IKegiatanMethods> {
    getAll(page: number, limit: number, filters: Object): Promise<HydratedDocument<IKegiatan, IKegiatanMethods>>;
}

const KegiatanSchema = new Schema<IKegiatan, KegiatanModel, IKegiatanMethods>(
    {
        program: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Program',
            required: true
        },
        name: {
            type: String,
            required: true
        },
        indikator_kinerja: [
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
        total_anggaran: {
            type: Number,
            required: true
        }
    },
    { timestamps: true }
);

KegiatanSchema.method('cascadeDelete', async function cascadeDelete() {
    const subKegiatan = await mongoose.model('SubKegiatan').find({ kegiatan:  this.id });
    subKegiatan.forEach(async (t) => {
        await t.cascadeDelete();
    });
    await this.deleteOne();
});

KegiatanSchema.static('getAll', async function getAll(page: number = 1, limit: number = 10, filters: Object = {}) {
    const skip = (page - 1) * limit;
    const query = this.find(buildFilterQuery(filters));
    const [results, total] = await Promise.all([
        query
            .skip(skip)
            .limit(limit)
            .populate({
                path: 'program',
                populate: {
                    path: 'tujuan',
                    populate: {
                        path: 'renstra'
                    }
                }
            }),
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

KegiatanSchema.virtual('subKegiatans', {
    ref: 'SubKegiatan',
    localField: '_id',
    foreignField: 'kegiatan',
    justOne: false
});

const Kegiatan: KegiatanModel = (mongoose.models.Kegiatan as KegiatanModel) || mongoose.model<IKegiatan>('Kegiatan', KegiatanSchema);

export default Kegiatan;
