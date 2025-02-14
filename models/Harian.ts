import buildFilterQuery from '@/utils/buildFilterQuery';
import mongoose, { Document, HydratedDocument, Schema } from 'mongoose';

enum MsgStatus {
    PERIKSA = 'Periksa',
    TERIMA = 'Terima',
    TOLAK = 'Tolak'
}

enum Status {
    SUBMITTED = 'submitted',
    APPROVED = 'approved',
    REJECTED = 'rejected'
}

interface IHarian extends Document {
    absence: mongoose.Schema.Types.ObjectId;
    skp: mongoose.Schema.Types.ObjectId;
    date: Date;
    startDateTime: string;
    endDateTime: string;
    rhk: mongoose.Schema.Types.ObjectId;
    isSKP: boolean;
    namaKegiatan: string;
    deskripsiKegiatan: string;
    progress: number;
    tautan?: string;
    status: Status;
    files?: [object];
    createdAt?: Date;
    updatedAt?: Date;
}

interface IHarianMethods {
    cascadeDelete(): Promise<void>;
}

interface HarianModel extends mongoose.Model<IHarian, {}, IHarianMethods> {
    getAll(page: number, limit: number, filters: Object): Promise<HydratedDocument<IHarian, IHarianMethods>>;
}

const HarianSchema = new Schema<IHarian, HarianModel, IHarianMethods>(
    {
        absence: {
            type: String,
            required: true,
            ref: 'Absence'
        },
        skp: {
            type: Schema.Types.ObjectId,
            ref: 'SKP',
            required: true
        },
        date: {
            type: Date,
            default: Date.now,
            required: true
        },
        isSKP: {
            type: Boolean,
            required: true,
            default: false
        },
        startDateTime: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: Object.values(Status),
            required: false,
            default: Status.SUBMITTED
        },
        endDateTime: {
            type: String,
            required: true
        },
        progress: {
            type: Number,
            required: true
        },
        rhk: {
            type: Schema.Types.ObjectId,
            ref: 'RHK',
            required: true
        },
        namaKegiatan: {
            type: String,
            required: true
        },
        deskripsiKegiatan: {
            type: String,
            required: true
        },
        tautan: {
            type: String,
            required: false
        },
        files: {
            type: [Object],
            required: false
        }
    },
    { timestamps: true, toObject: { virtuals: true }, toJSON: { virtuals: true } }
);

HarianSchema.method('cascadeDelete', async function cascadeDelete() {
    // const  visi = await mongoose.model('Visi').find({ periode: this._id });
    // visi.forEach(async (v) => {
    //     await v.cascadeDelete();
    // });
    // await mongoose.model('Visi').deleteMany({ periode: this._id });
    // const misi_id = await mongoose.model('Misi').find({ visi: { $in: visi_id } });
    // await mongoose.model('Misi').deleteMany({ visi: { $in: visi_id } });
    // const renstra_id = await mongoose.model('Renstra').find({ misi: { $in: misi_id } });
    // await mongoose.model('Renstra').deleteMany({ misi: { $in: misi_id } });
    // const  tujuan_id = await mongoose.model('Tujuan').find({ renstra: { $in: renstra_id } });
    // await mongoose.model('Tujuan').deleteMany({ renstra: { $in: renstra_id } });
    // const program_id = await mongoose.model('Program').find({ tujuan: { $in: tujuan_id } });
    // await mongoose.model('Program').deleteMany({ tujuan: { $in: tujuan_id } });
    // const kegiatan_id = await mongoose.model('Kegiatan').find({ program: { $in: program_id } });
    // await mongoose.model('Kegiatan').deleteMany({ program: { $in: program_id } });
    // const subKegiatan_id = await mongoose.model('SubKegiatan').find({ kegiatan: { $in: kegiatan_id } });
    // await mongoose.model('SubKegiatan').deleteMany({ kegiatan: { $in: kegiatan_id } });
    // const periodeRKT_id = await mongoose.model('PeriodeRKT').find({ subKegiatan: { $in: subKegiatan_id } });
    // await mongoose.model('PeriodeRKT').deleteMany({ subKegiatan: { $in: subKegiatan_id } });
    // const tpp_id = await mongoose.model('TPP').find({ periodeRKT: { $in: periodeRKT_id } });
    // await mongoose.model('TPP').deleteMany({ periodeRKT: { $in: periodeRKT_id } });
    // const rkt_id = await mongoose.model('RKT').find({ periodeRKT: { $in: periodeRKT_id } });
    // await mongoose.model('RKT').deleteMany({ periodeRKT: { $in: periodeRKT_id } });
    // const rhk_id = await mongoose.model('RHK').find({ rkt: { $in: rkt_id } });
    // await mongoose.model('RHK').deleteMany({ rkt: { $in: rkt_id } });
    // await mongoose.model('Aspek').deleteMany({ rhk: { $in: rhk_id } });
    // await mongoose.model('Harian').deleteMany({ rhk: { $in: rhk_id } });
    // const skp_id = await mongoose.model('SKP').find({ periodeRKT: { $in: periodeRKT_id } });
    // await mongoose.model('SKP').deleteMany({ periodeRKT: { $in: periodeRKT_id } });
    // const rhk_skp = await mongoose.model('RHK').find({ skp: { $in: skp_id } });
    // await mongoose.model('RHK').deleteMany({ skp: { $in: skp_id } });
    // await mongoose.model('Aspek').deleteMany({ rhk: { $in: rhk_skp } });
    // await mongoose.model('Harian').deleteMany({ rhk: { $in: rhk_skp } });
    // await mongoose.model('Perilaku').deleteMany({ skp: { $in: skp_id } });
    // const periodePenilaian_id = await mongoose.model('PeriodePenilaian').find({ skp: { $in: skp_id } });
    // await mongoose.model('PeriodePenilaian').deleteMany({ skp: { $in: skp_id } });
    // await mongoose.model('Penilaian').deleteMany({ periodePenilaian: { $in: periodePenilaian_id } });
    await this.deleteOne();
});

HarianSchema.virtual('messageHarian', {
    ref: 'MessageHarian',
    localField: '_id',
    foreignField: 'harian',
    justOne: false
});

HarianSchema.static('getAll', async function getAll(page: number = 1, limit: number = 10, filters: Object = {}) {
    const skip = (page - 1) * limit;
    const query = this.find(buildFilterQuery(filters));
    const [results, total] = await Promise.all([
        query
            .skip(skip)
            .limit(limit)
            .populate('messageHarian')
            .populate({
                path: 'rhk',
                populate: {
                    path: 'skp'
                }
            })
            .populate({
                path: 'skp',
                populate: {
                    path: 'skp'
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

const Harian: HarianModel = (mongoose.models.Harian as HarianModel) || mongoose.model<IHarian>('Harian', HarianSchema);

export default Harian;
