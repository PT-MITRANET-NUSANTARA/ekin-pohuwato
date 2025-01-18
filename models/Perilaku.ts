import buildFilterQuery from '@/utils/buildFilterQuery';
import mongoose, { Document, HydratedDocument, Schema } from 'mongoose';

interface IPerilaku extends Document {
  skp: mongoose.Schema.Types.ObjectId; 
  name: string;
  isi: string[];
  espektasi: string;
  feedback?: object;
}

interface IPerilakuMethods {
  cascadeDelete(): Promise<void>;
}

interface PerilakuModel extends mongoose.Model<IPerilaku, {},IPerilakuMethods> {
  getAll(page: number, limit: number, filters: Object): Promise<HydratedDocument<IPerilaku, IPerilakuMethods>>;
}

const PerilakuSchema = new Schema<IPerilaku, PerilakuModel, IPerilakuMethods>({
  skp: {
    type: Schema.Types.ObjectId,
    ref: 'SKP',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  isi: {
    type: [String],
    required: true
  },
  espektasi: {
    type: String,
    required: false
  },
  feedback: {
    type: Object,
    required: false,
    default: null
  },

});

PerilakuSchema.method('cascadeDelete', async function cascadeDelete() {
    await this.deleteOne();
});

PerilakuSchema.static('getAll', async function getAll(page: number = 1, limit: number = 10, filters: Object = {}) {
    const skip = (page - 1) * limit;
    const query = this.find(buildFilterQuery(filters));
    const [results, total] = await Promise.all([query.skip(skip).limit(limit), this.countDocuments(buildFilterQuery(filters))]);

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

const Perilaku: PerilakuModel = mongoose.models.Perilaku as PerilakuModel || mongoose.model<IPerilaku, PerilakuModel>('Perilaku', PerilakuSchema);

export default Perilaku;
