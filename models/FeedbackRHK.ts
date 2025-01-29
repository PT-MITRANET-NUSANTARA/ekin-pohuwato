import buildFilterQuery from '@/utils/buildFilterQuery';
import mongoose, { Document, HydratedDocument, Schema } from 'mongoose';

interface IFeedbackRHK extends Document {
    penilai: mongoose.Schema.Types.ObjectId;
    rhk: mongoose.Schema.Types.ObjectId;
    periodePenilaian: mongoose.Types.ObjectId;
    isi: string;
    like?: Boolean;
}

interface IFeedbackRHKMethods {}

interface FeedbackRHKModel extends mongoose.Model<IFeedbackRHK, {}, IFeedbackRHKMethods> {}

const FeedbackRHKScheme = new Schema<IFeedbackRHK, FeedbackRHKModel, IFeedbackRHKMethods>({
    penilai: {
        type: Schema.Types.ObjectId,
        ref: 'SKP',
        required: true
    },
    periodePenilaian: {
        type: Schema.Types.ObjectId,
        ref: 'PeriodePenilaian',
        required: false
    },
    rhk: {
        type: Schema.Types.ObjectId,
        ref: 'RHK',
        required: true
    },
    isi: {
        type: String,
        required: true
    },
    like: {
        type: Boolean,
        required: false
    }
});

const FeedbackRHK: FeedbackRHKModel = mongoose.models.FeedbackRHK as FeedbackRHKModel || mongoose.model<IFeedbackRHK, FeedbackRHKModel>('FeedbackRHK', FeedbackRHKScheme);

export default FeedbackRHK;
