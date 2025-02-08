import buildFilterQuery from '@/utils/buildFilterQuery';
import mongoose, { Document, HydratedDocument, Schema } from 'mongoose';

enum Jenis {
  KUALITAS = 'kualitas',
  KUANTITAS = 'kuantitas',
  WAKTU = 'waktu',
  DESKRIPSI = 'deskripsi'
}

interface IAspek extends Document {
  rhk: mongoose.Schema.Types.ObjectId; 
  jenis: Jenis; 
  indikator: string; 
  realisasi: Object; 
  target_tahunan: Object; 
  desc? : string;
  feedback: Object;
}

interface IAspekMethods {
  cascadeDelete(): Promise<void>;
}

interface AspekModel extends mongoose.Model<IAspek, {},IAspekMethods> {
  getAll(page: number, limit: number, filters: Object): Promise<HydratedDocument<IAspek, IAspekMethods>>;
}

const AspekSchema = new Schema<IAspek, AspekModel, IAspekMethods>({
  rhk: {
    type: Schema.Types.ObjectId,
    ref: 'RHK',
    required: true
  },
  jenis: {
    type: String,
    enum: Object.values(Jenis),
    required: true
  },
  indikator: {
    type: String,
    required: false
  },
  realisasi: {
    type: Object,
    required: true,
    default: {},
  },
  target_tahunan: {
    type: Object,
    required: false,
    default: {}
  },
  desc: {
    type: String,
    required: false,
    default: ''
  }
});

AspekSchema.method('cascadeDelete', async function cascadeDelete() {
    await this.deleteOne();
});

AspekSchema.static('getAll', async function getAll(page: number = 1, limit: number = 10, filters: Object = {}) {
    const skip = (page - 1) * limit;
    const query = this.find(buildFilterQuery(filters));
    const [results, total] = await Promise.all([
        query
            .skip(skip)
            .limit(limit)
            .populate('rhk'),
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

const Aspek: AspekModel = mongoose.models.Aspek as AspekModel || mongoose.model<IAspek, AspekModel>('Aspek', AspekSchema);

export default Aspek;
