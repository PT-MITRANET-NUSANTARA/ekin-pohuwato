import buildFilterQuery from '@/utils/buildFilterQuery';
import mongoose, { Document, HydratedDocument, Schema } from 'mongoose';

interface IVisi extends Document {
    name: string; // Name of the vision
    periode: mongoose.Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

interface IVisiMethods {
    cascadeDelete(): Promise<void>;
}

interface VisiModel extends mongoose.Model<IVisi, {},IVisiMethods> {
    getAll(page: number, limit: number, filters: Object): Promise<HydratedDocument<IVisi, IVisiMethods>>;
}

const VisiSchema = new Schema<IVisi, VisiModel, IVisiMethods>(
    {
        name: {
            type: String,
            required: true
        },
        periode: {
            type: Schema.Types.ObjectId,
            ref: 'Periode',
            required: true
        }
    },
    { timestamps: true }
);

VisiSchema.method('cascadeDelete', async function cascadeDelete() {
    const misi_id = await mongoose.model('Misi').find({ visi: this.id });
    await mongoose.model('Misi').deleteMany({ visi: this.id });
    const renstra_id = await mongoose.model('Renstra').find({ misi: { $in: misi_id } });
    await mongoose.model('Renstra').deleteMany({ misi: { $in: misi_id } });
    const tujuan_id = await mongoose.model('Tujuan').find({ renstra: { $in: renstra_id } });
    await mongoose.model('Tujuan').deleteMany({ renstra: { $in: renstra_id } });
    const program_id = await mongoose.model('Program').find({ tujuan: { $in: tujuan_id } });
    await mongoose.model('Program').deleteMany({ tujuan: { $in: tujuan_id } });
    const kegiatan_id = await mongoose.model('Kegiatan').find({ program: { $in: program_id } });
    await mongoose.model('Kegiatan').deleteMany({ program: { $in: program_id } });
    const subKegiatan_id = await mongoose.model('SubKegiatan').find({ kegiatan: { $in: kegiatan_id } });
    await mongoose.model('SubKegiatan').deleteMany({ kegiatan: { $in: kegiatan_id } });
    const periodeRKT_id = await mongoose.model('PeriodeRKT').find({ subKegiatan: { $in: subKegiatan_id } });
    await mongoose.model('PeriodeRKT').deleteMany({ subKegiatan: { $in: subKegiatan_id } });
    const tpp_id = await mongoose.model('TPP').find({ periodeRKT: { $in: periodeRKT_id } });
    await mongoose.model('TPP').deleteMany({ periodeRKT: { $in: periodeRKT_id } });
    const rkt_id = await mongoose.model('RKT').find({ periodeRKT: { $in: periodeRKT_id } });
    await mongoose.model('RKT').deleteMany({ periodeRKT: { $in: periodeRKT_id } });
    const rhk_id = await mongoose.model('RHK').find({ rkt: { $in: rkt_id } });
    await mongoose.model('RHK').deleteMany({ rkt: { $in: rkt_id } });
    await mongoose.model('Aspek').deleteMany({ rhk: { $in: rhk_id } });
    await mongoose.model('Harian').deleteMany({ rhk: { $in: rhk_id } });
    const skp_id = await mongoose.model('SKP').find({ periodeRKT: { $in: periodeRKT_id } });
    await mongoose.model('SKP').deleteMany({ periodeRKT: { $in: periodeRKT_id } });
    const rhk_skp = await mongoose.model('RHK').find({ skp: { $in: skp_id } });
    await mongoose.model('RHK').deleteMany({ skp: { $in: skp_id } });
    await mongoose.model('Aspek').deleteMany({ rhk: { $in: rhk_skp } });
    await mongoose.model('Harian').deleteMany({ rhk: { $in: rhk_skp } });
    await mongoose.model('Perilaku').deleteMany({ skp: { $in: skp_id } });
    const periodePenilaian_id = await mongoose.model('PeriodePenilaian').find({ skp: { $in: skp_id } });
    await mongoose.model('PeriodePenilaian').deleteMany({ skp: { $in: skp_id } });
    await mongoose.model('Penilaian').deleteMany({ periodePenilaian: { $in: periodePenilaian_id } });
    await this.deleteOne();
});

VisiSchema.static('getAll', async function getAll(page: number = 1, limit: number = 10, filters: Object = {}) {
    const skip = (page - 1) * limit;
    const query = this.find(buildFilterQuery(filters))
    const [results, total] = await Promise.all([
        query.skip(skip).limit(limit).populate('periode'),  
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

VisiSchema.virtual('Misis', {
    ref: 'Misi',
    localField: '_id',
    foreignField: 'visi',
    justOne: false
});

const Visi: VisiModel = mongoose.models.Visi as VisiModel || mongoose.model<IVisi, VisiModel>('Visi', VisiSchema);

export default Visi;