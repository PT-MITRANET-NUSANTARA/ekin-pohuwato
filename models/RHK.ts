import buildFilterQuery from '@/utils/buildFilterQuery';
import mongoose, { Document, HydratedDocument, Schema } from 'mongoose';

enum Jenis {
    UTAMA = 'utama',
    TAMBAHAN = 'tambahan'
}

enum Klasifikasi {
    ORGANISASI = 'organisasi',
    INDIVIDU = 'individu'
}

interface IRHK extends Document {
    skp: mongoose.Schema.Types.ObjectId;
    rhk?: mongoose.Schema.Types.ObjectId; 
    rkt?: mongoose.Schema.Types.ObjectId; 
    aspek?: mongoose.Schema.Types.ObjectId[];
    jenis: Jenis;
    rencana: Object;
    klasifikasi?: Klasifikasi;
    createdAt?: Date; 
    updatedAt?: Date;
    desc: string;
}

interface IRHKMethods {
    cascadeDelete(): Promise<void>;
}

interface RHKModel extends mongoose.Model<IRHK,{}, IRHKMethods> {
    getAll(page: number, limit: number, filters: Object): Promise<HydratedDocument<IRHK, IRHKMethods>>;
}

const RHKSchema = new Schema<IRHK,  RHKModel, IRHKMethods>(
    {
        skp: {
            type: Schema.Types.ObjectId,
            ref: 'SKP',
            required: true
        },
        desc: {
            type: String,
            required: false,
        default: ''
        },
        rhk: {
            type: Schema.Types.ObjectId,
            ref: 'RHK',
            required: false
        },
        rkt: {
            type: Schema.Types.ObjectId,
            ref: 'RKT',
            required: false
        },
        jenis: {
            type: String,
            enum: Object.values(Jenis),
            required: true
        },
        klasifikasi: {
            type: String,
            enum: Object.values(Klasifikasi),
            required: false
        },
        rencana: {
            type: Object,
            required: false
        }
    },
    {
        timestamps: true,
        toObject: { virtuals: true }, // This ensures virtuals are included when you convert to Object
        toJSON: { virtuals: true }
    }
);

RHKSchema.method('cascadeDelete', async function cascadeDelete() {
    const aspek = await mongoose.model('Aspek').find({ rhk: this._id });
    aspek.forEach(async (a) => {
        await a.cascadeDelete();
    });
    await this.deleteOne();
});

RHKSchema.static('getAll', async function getAll(page: number = 1, limit: number = 10, filters: Object = {}) {
    const skip = (page - 1) * limit;
    const query = this.find(buildFilterQuery(filters));
    const [results, total] = await Promise.all([
        query
            .skip(skip)
            .limit(limit)
            .populate('aspek'),
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


RHKSchema.virtual('aspek', {
    ref: 'Aspek',
    localField: '_id',
    foreignField: 'rhk',
    justOne: false
});

RHKSchema.virtual('harians', {
    ref: 'Harian',
    localField: '_id',
    foreignField: 'rhk',
    justOne: false
});

const RHK: RHKModel = mongoose.models.RHK as RHKModel || mongoose.model<IRHK, RHKModel>('RHK', RHKSchema);

export default RHK;
