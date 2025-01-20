import buildFilterQuery from '@/utils/buildFilterQuery';
import mongoose, { Document, HydratedDocument, Schema } from 'mongoose';

interface IPeriodeRKT extends Document {
    periode_start: Date;
    periode_end: Date;
    createdAt?: Date;
    perjanjianKinerja: [string];
    unit: Object;
    updatedAt?: Date;
}

interface IPeriodeRKTMethods {
    cascadeDelete(): Promise<void>;
}

interface PeriodeRKTModel extends mongoose.Model<IPeriodeRKT, {}, IPeriodeRKTMethods> {
    getAll(page: number, limit: number, filters: Object): Promise<HydratedDocument<IPeriodeRKT, IPeriodeRKTMethods>>;
}

const PeriodeRKTSchema = new Schema<IPeriodeRKT, PeriodeRKTModel, IPeriodeRKTMethods>(
    {
        periode_start: {
            type: Date,
            required: true
        },
        unit: {
            type: Object,
            required: true
        },
        periode_end: {
            type: Date,
            required: true
        },

        perjanjianKinerja: {
            type: [Object]
        }
    },
    {
        timestamps: true, // Automatically manage createdAt and updatedAt fields
        toObject: { virtuals: true }, // Include virtuals when converting to objects
        toJSON: { virtuals: true } // Include virtuals when converting to JSON
    }
);

PeriodeRKTSchema.method('cascadeDelete', async function cascadeDelete() {
   
    const rkt = await mongoose.model('RKT').find({ periodeRKT: this.id});
    const skp = await mongoose.model('SKP').find({ periodeRKT: this.id});
    const tpp = await mongoose.model('TPP').find({ periodeRKT: this.id});
    
    rkt.forEach(async (r) => {
        await r.cascadeDelete();
    });
    skp.forEach(async (s) => {
        await s.cascadeDelete();
    });
    tpp.forEach(async (t) => {
        await t.cascadeDelete();
    });

    await this.deleteOne();
});

PeriodeRKTSchema.static('getAll', async function getAll(page: number = 1, limit: number = 10, filters: Object = {}) {
    const skip = (page - 1) * limit;
    const query = this.find(buildFilterQuery(filters));
    const [results, total] = await Promise.all([
        query
            .skip(skip)
            .limit(limit)
            ,
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

PeriodeRKTSchema.virtual('RKTS', {
    ref: 'RKT',
    localField: '_id',
    foreignField: 'periodeRKT',
    justOne: false
});

PeriodeRKTSchema.virtual('SKPS', {
    ref: 'SKP',
    localField: '_id',
    foreignField: 'periodeRKT',
    justOne: false
});

PeriodeRKTSchema.virtual('TPPS', {
    ref: 'TPP',
    localField: '_id',
    foreignField: 'periodeRKT',
    justOne: false
});

const PeriodeRKT: PeriodeRKTModel = (mongoose.models.PeriodeRKT as PeriodeRKTModel) || mongoose.model<IPeriodeRKT, PeriodeRKTModel>('PeriodeRKT', PeriodeRKTSchema);

export default PeriodeRKT;
