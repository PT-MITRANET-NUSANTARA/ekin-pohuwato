import mongoose, { Document, HydratedDocument, Schema } from 'mongoose';
import Kegiatan from './Kegiatan';
import buildFilterQuery from '@/utils/buildFilterQuery';

interface IIndikatorKinerja {
    name: string;
    target: number;
    satuan: string;
}

interface IProgram extends Document {
    name: string;
    indikator_kinerja: IIndikatorKinerja[];
    total_anggaran: number;
    tujuan: mongoose.Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
    unit: Object;
}

interface IProgramMethods {
    cascadeDelete(): Promise<void>;
}

interface ProgramModel extends mongoose.Model<IProgram, {}, IProgramMethods> {
    getAll(page: number, limit: number, filters: Object): Promise<HydratedDocument<IProgram, IProgramMethods>>;
}

const ProgramSchema = new Schema<IProgram, ProgramModel, IProgramMethods>(
    {
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
        unit: {
            type: Object,
            required: true
        },
        total_anggaran: {
            type: Number,
            required: true
        },
        tujuan: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Tujuan',
            required: true
        }
    },
    { timestamps: true }
);

ProgramSchema.method('cascadeDelete', async function cascadeDelete() {
    const kegiatan = await mongoose.model('Kegiatan').find({ program: this.id });
    kegiatan.forEach(async (k) => {
        await k.cascadeDelete();
    });
    await this.deleteOne();
});

ProgramSchema.static('getAll', async function getAll(page: number = 1, limit: number = 10, filters: Object = {}) {
    const skip = (page - 1) * limit;
    const query = this.find(buildFilterQuery(filters));
    const [results, total] = await Promise.all([
        query
            .skip(skip)
            .limit(limit)
            .populate({
                path: 'tujuan',
                populate: {
                    path: 'renstra'
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

ProgramSchema.virtual('kegiatans', {
    ref: 'Kegiatan',
    localField: '_id',
    foreignField: 'program',
    justOne: false
});

const Program: ProgramModel = (mongoose.models.Program as ProgramModel) || mongoose.model<IProgram, ProgramModel>('Program', ProgramSchema);

export default Program;
