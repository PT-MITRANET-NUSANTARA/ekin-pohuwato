import mongoose, { Document, Schema, Model } from 'mongoose';

enum Status {
    SUBMITTED = 'submitted',
    APPROVED = 'approved',
    REJECTED = 'rejected'
}

export interface IMessageSKP extends Document {
    skp: mongoose.Schema.Types.ObjectId;
    status: Status;
    isi: string;
    atasan: mongoose.Schema.Types.ObjectId;
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
        status: {
            required: true,
            enum: Object.values(Status),
            type: String
        },
        isi: {
            required: true,
            type: String,
            default: ''
        }
    },
    { timestamps: true }
);

const MessageSKP: Model<IMessageSKP> = mongoose.models.MessageSKP || mongoose.model<IMessageSKP>('MessageSKP', MessageSKPSchema);

export default MessageSKP;
