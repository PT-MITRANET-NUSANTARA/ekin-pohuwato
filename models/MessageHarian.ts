import mongoose, { Document, Schema, Model } from 'mongoose';

enum Status {
    TERIMA = 'terima',
    TOLAK = 'tolak',
}

export interface IMessageHarian extends Document {
    harian: mongoose.Schema.Types.ObjectId;
    messageHarian: mongoose.Schema.Types.ObjectId;
    status: Status;
    isi: string;
    jabatan: Object;
}

const MessageHarianSchema = new Schema<IMessageHarian>(
    {
        harian: {
            type: Schema.Types.ObjectId,
            ref: 'Harian',
            required: true,
        },
        messageHarian: {
            type: Schema.Types.ObjectId,
            ref: 'MessageHarian',
            required: true,
        },
        jabatan: {
            type: Object,
            required: true,
        },
        status: {
            required: true,
            enum: Object.values(Status),
            type: String,
        },
        isi: {
            required: true,
            type: String,
        },
    },
    { timestamps: true }
);

// Fix the model name here to 'MessageHarian' instead of 'MessageSKP'
const MessageHarian: Model<IMessageHarian> =
    mongoose.models.MessageHarian || mongoose.model<IMessageHarian>('MessageHarian', MessageHarianSchema);

export default MessageHarian;
