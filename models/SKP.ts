import buildFilterQuery from '@/utils/buildFilterQuery';
import mongoose, { Schema, Document, Model, HydratedDocument } from 'mongoose';

enum Pendekatan {
    KUALITATIF = 'kualitatif',
    KUANTITATIF = 'kuantitatif'
}

enum Status {
    DRAFT = 'draft',
    SUBMITTED = 'submitted',
    APPROVED = 'approved',
    REJECTED = 'rejected'
}

interface ISKP {
    user_id: string;
    periode_awal: Date;
    periode_akhir: Date;
    skp?: mongoose.Schema.Types.ObjectId[]; // Array of ObjectId
    periodeRKT: mongoose.Schema.Types.ObjectId; // Reference to Renstra
    rhks?: mongoose.Schema.Types.ObjectId[]; // Array of ObjectId
    perilakus?: mongoose.Schema.Types.ObjectId[]; // Array of ObjectId
    pendekatan: Pendekatan;
    renstra: mongoose.Schema.Types.ObjectId; // Reference to Renstra
    status?: Status; // Optionalp
    keterangan?: string; // Optional
    jabatan: object[]; // Array of Object
    hasil: Object,
    predikat: Object,
    perilaku: Object,
    lampiran: Object;
    createdAt?: Date; // Automatically handled by Mongoose
    updatedAt?: Date; // Automatically handled by Mongoose
}

interface ISKPMethods {
    cascadeDelete(): Promise<void>;
}

interface SKPModel extends Model<ISKP, {}, ISKPMethods> {
    findByUserId(userId: string): Promise<HydratedDocument<ISKP, ISKPMethods>>;
    findBySKIPId(skpId: string): Promise<HydratedDocument<ISKP, ISKPMethods>>;
    getAll(page: number, limit: number, filters: Object): Promise<HydratedDocument<ISKP, ISKPMethods>>;
}

const SKPSchema = new Schema<ISKP, SKPModel, ISKPMethods>(
    {
        user_id: { type: String, required: true },
        periode_awal: { type: Date, required: true },
        periode_akhir: { type: Date, required: true },
        skp: {
            type: [Schema.Types.ObjectId], // Array of ObjectId
            ref: 'SKP',
            required: false
        },
        periodeRKT: {
            type: Schema.Types.ObjectId,
            ref: 'PeriodeRKT',
            required: true
        },
        renstra: {
            type: Schema.Types.ObjectId,
            ref: 'Renstra',
            required: true
        },
        jabatan: {
            type: [Object], // Array of Object
            required: true
        },
        status: {
            type: String,
            enum: Object.values(Status),
            required: false,
            default: Status.DRAFT
        },
        lampiran: {
            type: Object,
            required: false,
            default: {
                
            }
        },
        predikat: {
            type: Object,
            required:false,
            default:{

            }
        },
        perilaku: {
            type: Object,
            required:false,
            default:{

            }
        },
        hasil: {
            type:Object,
            required:false,
            default:{

            }
        },
        pendekatan: {
            type: String,
            enum: Object.values(Pendekatan),
            required: true
        },
        keterangan: {
            type: String,
            required: false,
            default: ''
        }
    },
    {
        timestamps: true,
        toObject: { virtuals: true },
        toJSON: { virtuals: true }
    }
);

// Virtual fields
SKPSchema.virtual('rhks', {
    ref: 'RHK',
    localField: '_id',
    foreignField: 'skp',
    justOne: false
});

SKPSchema.virtual('perilakus', {
    ref: 'Perilaku',
    localField: '_id',
    foreignField: 'skp',
    justOne: false
});

SKPSchema.virtual('penilaians', {
    ref: 'Penilaian',
    localField: '_id',
    foreignField: 'skp',
    justOne: false
});

SKPSchema.virtual('periodePenilaian', {
    ref: 'PeriodePenilaian',
    localField: '_id',
    foreignField: 'skp',
    justOne: true
});

// Static methods
SKPSchema.static('findByUserId', function (userId: string) {
    return this.findOne({ user_id: userId });
});

SKPSchema.static('findBySKPId', function (skpId: string) {
    return this.findOne({ skp: { $in: [skpId] } });
});

SKPSchema.method('cascadeDelete', async function cascadeDelete() {
    const rhks = await mongoose.model('RHK').find({ skp: this._id });
    const perilakus = await mongoose.model('Perilaku').find({ skp: this._id });
    const penilaian = await mongoose.model('Penilaian').find({ skp: this._id });
    const periodePenilaian = await mongoose.model('PeriodePenilaian').find({ skp: this._id });

    rhks.forEach(async (r) => {
        await r.cascadeDelete();
    });

    perilakus.forEach(async (p) => {
        await p.cascadeDelete();
    });

    periodePenilaian.forEach(async (p) => {
        await p.cascadeDelete();
    });

    penilaian.forEach(async (p) => {
        await p.cascadeDelete();
    });

   

    await this.deleteOne();
});

SKPSchema.static('getAll', async function getAll(page: number = 1, limit: number = 10, filters: Object = {}) {
    const skip = (page - 1) * limit;
    const query = this.find(buildFilterQuery(filters));
    const [results, total] = await Promise.all([query.skip(skip).limit(limit).populate('skp'), this.countDocuments(buildFilterQuery(filters))]);

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

const SKP: SKPModel = (mongoose.models.SKP as SKPModel) || mongoose.model<ISKP, SKPModel>('SKP', SKPSchema);

export default SKP;
