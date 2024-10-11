import mongoose, { Document, Schema } from 'mongoose';

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

interface ISKP extends Document {
    user_id: String;
    periode_awal: Date;
    periode_akhir: Date;
    skp?: mongoose.Schema.Types.ObjectId[]; // Menjadi array of ObjectId
    periodeRKT: mongoose.Schema.Types.ObjectId; // Reference to Renstra
    rhks?: mongoose.Schema.Types.ObjectId[]; // Menjadi array of ObjectId
    perilakus?: mongoose.Schema.Types.ObjectId[]; // Menjadi array of ObjectId
    pendekatan: Pendekatan;
    status?: Status; // Opsional
    keterangan?: String; // Opsional
    jabatan: Object[]; // Menjadi array of Object
    createdAt?: Date; // Otomatis oleh Mongoose
    updatedAt?: Date; // Otomatis oleh Mongoose
}

const SKPSchema: Schema = new Schema(
    {
        periode_awal: { type: Date, required: true },
        periode_akhir: { type: Date, required: true },
        user_id: { type: String, required: true },
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
        jabatan: {
            type: [Object], // Array of Object
            required: true
        },
        status: {
            type: String,
            enum: Object.values(Status),
            required: false,
            default: Status.APPROVED
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
    { timestamps: true,
      toObject: { virtuals: true },   // This ensures virtuals are included when you convert to Object
      toJSON: { virtuals: true }      // This ensures virtuals are included when you convert to JSON
     }
);

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

const SKP = mongoose.models.SKP || mongoose.model<ISKP>('SKP', SKPSchema);

export default SKP;
