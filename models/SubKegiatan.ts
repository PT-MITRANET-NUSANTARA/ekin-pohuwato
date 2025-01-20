import buildFilterQuery from '@/utils/buildFilterQuery';
import mongoose, { Document, HydratedDocument, Schema } from 'mongoose';

interface IIndikatorKinerja {
    name: string;
    target: number;
    satuan: string;
}

interface ISubKegiatan extends Document {
    kegiatan: mongoose.Types.ObjectId;
    name: string;
    indikator_kinerja: IIndikatorKinerja[];
    total_anggaran: number;
}

interface ISubKegiatanMethods {
    cascadeDelete(): Promise<void>;
}

interface SubKegiatanModel extends mongoose.Model<ISubKegiatan, {}, ISubKegiatanMethods> {
    getAll(page: number, limit: number, filters: Object): Promise<HydratedDocument<ISubKegiatan, ISubKegiatanMethods>>;
}

const SubKegiatanSchema = new Schema<ISubKegiatan, SubKegiatanModel, ISubKegiatanMethods>(
    {
        kegiatan: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Kegiatan',
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

SubKegiatanSchema.method('cascadeDelete', async function cascadeDelete() {
    const periodeRKT = await mongoose.model('PeriodeRKT').find({ subKegiatan: this.id });
    periodeRKT.forEach(async (p) => {
        await p.cascadeDelete();
    });
    await this.deleteOne();
});

SubKegiatanSchema.static('getAll', async function getAll(page: number = 1, limit: number = 10, filters: Object = {}) {
    const skip = (page - 1) * limit;
    const query = this.find(buildFilterQuery(filters));
    const [results, total] = await Promise.all([
        query
            .skip(skip)
            .limit(limit)
            .populate({
                path: 'kegiatan',
                populate: {
                    path: 'program',
                    populate: {
                        path: 'tujuan',
                        populate: {
                            path: 'renstra'
                        }
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

SubKegiatanSchema.virtual('PeriodeRKTS', {
    ref: 'PeriodeRKT',
    localField: '_id',
    foreignField: 'subKegiatan',
    justOne: false
});

const SubKegiatan: SubKegiatanModel = (mongoose.models.SubKegiatan as SubKegiatanModel) || mongoose.model<ISubKegiatan, SubKegiatanModel>('SubKegiatan', SubKegiatanSchema);

export default SubKegiatan;
