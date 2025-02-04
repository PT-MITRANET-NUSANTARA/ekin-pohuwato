import buildFilterQuery from '@/utils/buildFilterQuery';
import mongoose, { Document, HydratedDocument, Schema } from 'mongoose';

enum AbsenceStatus {
    HADIR = 'Hadir',
    SAKIT = 'Sakit',
    IZIN = 'Izin',
    ALPHA = 'Alpha',
    'TANPA KETERANGAN' = 'Tanpa Keterangan',
    DINAS = 'Dinas'
}

interface IAbsence extends Document {
    user_id: string;
    date: Date;
    jabatan: Object;
    status: AbsenceStatus;
    createdAt?: Date;
    unit: Object;
    updatedAt?: Date;
}

interface IAbsenceMethods {
    cascadeDelete(): Promise<void>;
}

interface AbsenceModel extends mongoose.Model<IAbsence, {}, IAbsenceMethods> {
    getAll(page: number, limit: number, filters: Object): Promise<HydratedDocument<IAbsence, IAbsenceMethods>>;
}

const AbsenceSchema = new Schema<IAbsence, AbsenceModel, IAbsenceMethods>(
    {
        user_id: {
            type: String,
            required: true
        },
        unit: {
            type: Object,
            required: true
        },
        jabatan: {
            type: Object,
            required: true
        },
        date: {
            type: Date,
            required: true,
            default: Date.now
        },
        status: {
            type: String,
            enum: Object.values(AbsenceStatus),
            required: true
        }
    },
    { timestamps: true }
);

AbsenceSchema.method('cascadeDelete', async function cascadeDelete() {
    await this.deleteOne();
});

AbsenceSchema.static('getAll', async function getAll(page: number = 1, limit: number = 10, filters: Object = {}) {
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

const Absence: AbsenceModel = (mongoose.models.Absence as AbsenceModel) || mongoose.model<IAbsence>('Absence', AbsenceSchema);

export default Absence;
