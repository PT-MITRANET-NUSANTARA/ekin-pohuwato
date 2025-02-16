import buildFilterQuery from '@/utils/buildFilterQuery';
import mongoose, { Document, HydratedDocument, Schema } from 'mongoose';

interface ITPP extends Document {
    user_id: string;
    jabatan: Object;
    status: boolean;
    unit: Object;
    periodeRKT: mongoose.Schema.Types.ObjectId;
    date: Date; // Menambahkan field bulan
}

interface ITPPMethods {
    cascadeDelete(): Promise<void>;
}

interface TPPModel extends mongoose.Model<ITPP, {}, ITPPMethods> {
    getAll(
        page: number,
        limit: number,
        filters: Object
    ): Promise<{
        data: HydratedDocument<ITPP, ITPPMethods>[];
        pagination: {
            currentPage: number;
            totalPages: number;
            totalItems: number;
            pageSize: number;
        };
    }>;
}

const TPPSchema = new Schema<ITPP, TPPModel, ITPPMethods>({
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
    status: {
        type: Boolean,
        required: true
    },
    periodeRKT: {
        type: Schema.Types.ObjectId,
        ref: 'PeriodeRKT',
        required: true
    },
    date: {
        // Field bulan ditambahkan di sini
        type: Date,
        required: true
    }
});

TPPSchema.method('cascadeDelete', async function cascadeDelete() {
    await this.deleteOne();
});

TPPSchema.static('getAll', async function getAll(page: number = 1, limit: number = 10, filters: Object = {}) {
    const skip = (page - 1) * limit;
    const query = this.find(buildFilterQuery(filters));
    const [results, total] = await Promise.all([query.skip(skip).limit(limit).populate('periodeRKT'), this.countDocuments(buildFilterQuery(filters))]);

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

const TPP: TPPModel = (mongoose.models.TPP as TPPModel) || mongoose.model<ITPP, TPPModel>('TPP', TPPSchema);

export default TPP;
