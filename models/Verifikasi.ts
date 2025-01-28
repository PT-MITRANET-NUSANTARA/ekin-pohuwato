import buildFilterQuery from '@/utils/buildFilterQuery';
import mongoose, { Model, Schema, model, HydratedDocument } from 'mongoose';

interface IVerifikasi {
  unit:Object;
}

interface IVerifikasiMethods {

}

interface VerifikasiModel extends Model<IVerifikasi, {}, IVerifikasiMethods> {
    findByUnitId(unitId: number): Promise<HydratedDocument<IVerifikasi, IVerifikasiMethods>>;
    getAll(page: number , limit: number, filters: object): Promise<HydratedDocument<IVerifikasi, IVerifikasiMethods>>;

  }

const VerifikasiSchema = new Schema<IVerifikasi, VerifikasiModel, IVerifikasiMethods>(
  {
    unit: {
      type: Object,
      required: true,
    },
  },
  { timestamps: true }
);


VerifikasiSchema.static('getAll', async function getAll(page: number = 1, limit: number = 10, filters: Object = {}) {
    const skip = (page - 1) * limit;
    const query = this.find(buildFilterQuery(filters))
    const [results, total] = await Promise.all([
        query.skip(skip).limit(limit),  
        this.countDocuments(buildFilterQuery(filters)), 
    ]);

    return {
        data: results,
        pagination: {
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalItems: total,
            pageSize: limit,
        },
    };
});

VerifikasiSchema.static('findByUnitId', function findByUnit(unitId: number) {
    return this.findOne({ 'unit.id': unitId });
})

const Verifikasi: VerifikasiModel = mongoose.models.Verifikasi as VerifikasiModel || model<IVerifikasi, VerifikasiModel>('Verifikasi', VerifikasiSchema);
export default Verifikasi;
