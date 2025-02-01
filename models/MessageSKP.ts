import mongoose, { Document, Schema, Model } from 'mongoose';

enum Status {
    TERIMA = 'terima',
    TOLAK = 'tolak'
}

export interface IMessageSKP extends Document {
    skp: mongoose.Schema.Types.ObjectId;
    status: Status;
    isi: string;
    atasan: mongoose.Schema.Types.ObjectId;
    jabatan: Object;
}

const MessageSKPSchema = new Schema<IMessageSKP>(
    {
        skp: {
            type: Schema.Types.ObjectId,
            ref: 'SKP',
            required: true
        },
        atasan: {
            type: Schema.Types.ObjectId,
            ref: 'SKP',
            required: true
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
        }
    },
    { timestamps: true }
);

const MessageSKP: Model<IMessageSKP> = mongoose.models.MessageSKP || mongoose.model<IMessageSKP>('MessageSKP', MessageSKPSchema);

export default MessageSKP;
