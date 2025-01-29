import buildFilterQuery from '@/utils/buildFilterQuery';
import mongoose, { Document, HydratedDocument, Schema } from 'mongoose';

interface IFeedbackPerilaku extends Document {
    penilai: mongoose.Schema.Types.ObjectId;
    perilaku: mongoose.Schema.Types.ObjectId;
    periodePenilaian: mongoose.Types.ObjectId;
    isi: string;
    like?: Boolean;
}

interface IFeedbackPerilakuMethods {}

interface FeedbackPerilakuModel extends mongoose.Model<IFeedbackPerilaku, {}, IFeedbackPerilakuMethods> {}

const FeedbackPerilakuScheme = new Schema<IFeedbackPerilaku, FeedbackPerilakuModel, IFeedbackPerilakuMethods>({
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
    perilaku: {
        type: Schema.Types.ObjectId,
        ref: 'Perilaku',
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

const FeedbackPerilaku: FeedbackPerilakuModel = mongoose.models.FeedbackPerilaku as FeedbackPerilakuModel || mongoose.model<IFeedbackPerilaku, FeedbackPerilakuModel>('FeedbackPerilaku', FeedbackPerilakuScheme);

export default FeedbackPerilaku;
