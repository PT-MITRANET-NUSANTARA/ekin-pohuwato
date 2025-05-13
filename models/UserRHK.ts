import mongoose, { Document, HydratedDocument, Schema } from 'mongoose';
import buildFilterQuery from '@/utils/buildFilterQuery';

export enum Status {
    DRAFT = 'draft',
    SUBMITTED = 'submitted',
    APPROVED = 'approved',
    REJECTED = 'rejected'
}

interface IUserRHK extends Document {
    user: string;
    description: string;
    status: Status;
    rkts?: mongoose.Schema.Types.ObjectId[];
    jenis: string;
    klasifikasi?: string;
    penugasan: string;
    posjab: string;
    skp: mongoose.Schema.Types.ObjectId;
    parentUserRHK?: mongoose.Schema.Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

interface IUserRHKMethods {
    cascadeDelete(): Promise<void>;
}

interface UserRHKModel extends mongoose.Model<IUserRHK, {}, IUserRHKMethods> {
    getAll(page: number, limit: number, filters: Object): Promise<HydratedDocument<IUserRHK, IUserRHKMethods>>;
}

const UserRHKSchema = new Schema<IUserRHK, UserRHKModel, IUserRHKMethods>(
    {
        user: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: false,
            default: ''
        },
        status: {
            type: String,
            enum: Object.values(Status),
            default: Status.DRAFT,
            required: true
        },
        rkts: {
            type: [Schema.Types.ObjectId],
            ref: 'RKT',
            required: false,
            default: []
        },
        jenis: {
            type: String,
            enum: ['utama', 'tambahan'],
            required: true
        },
        klasifikasi: {
            type: String,
            enum: ['organisasi', 'individu'],
            required: true
        },
        penugasan: {
            type: String,
            required: false,
            default: ''
        },
        posjab: {
            type: String,
            required: true
        },
        skp: {
            type: Schema.Types.ObjectId,
            ref: 'SKP',
            required: true
        },
        parentUserRHK: {
            type: Schema.Types.ObjectId,
            ref: 'UserRHK',
            required: false,
            default: null
        }
    },
    {
        timestamps: true,
        toObject: { virtuals: true },
        toJSON: { virtuals: true }
    }
);

UserRHKSchema.method('cascadeDelete', async function cascadeDelete() {
    // Find all RHKs that reference this UserRHK
    const rhks = await mongoose.model('RHK').find({ userRHK: this._id });
    
    // Delete each RHK (which will cascade delete its own dependencies)
    for (const rhk of rhks) {
        await rhk.cascadeDelete();
    }
    
    // Find all child UserRHKs that reference this UserRHK as parent
    const childUserRHKs = await mongoose.model('UserRHK').find({ parentUserRHK: this._id });
    
    // Delete each child UserRHK (which will cascade delete its own dependencies)
    for (const childUserRHK of childUserRHKs) {
        await childUserRHK.cascadeDelete();
    }
    
    // Delete this UserRHK
    await this.deleteOne();
});

UserRHKSchema.static('getAll', async function getAll(page: number = 1, limit: number = 10, filters: Object = {}) {
    const skip = (page - 1) * limit;
    const query = this.find(buildFilterQuery(filters));
    const [results, total] = await Promise.all([
        query
            .skip(skip)
            .limit(limit)
            .populate('aspects')
            
            .populate('rkts')
            .populate('skp')
            .populate('parentUserRHK')
            .populate('childUserRHKs'),
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

// Add a virtual for 'aspects' to access direct Aspek documents
UserRHKSchema.virtual('aspects', {
    ref: 'Aspek',
    localField: '_id',
    foreignField: 'userRHK',
    justOne: false
});



// Virtual for 'rhk' to allow nested population of 'rhks.rhk'
UserRHKSchema.virtual('rhk', {
    ref: 'RHK',
    localField: '_id',
    foreignField: 'userRHK',
    justOne: false
});

// Virtual for getting all child UserRHKs that reference this UserRHK as parent
UserRHKSchema.virtual('childUserRHKs', {
    ref: 'UserRHK',
    localField: '_id',
    foreignField: 'parentUserRHK',
    justOne: false
});

const UserRHK: UserRHKModel = mongoose.models.UserRHK as UserRHKModel || mongoose.model<IUserRHK, UserRHKModel>('UserRHK', UserRHKSchema);

export default UserRHK; 