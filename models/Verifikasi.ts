import mongoose, { Model, Schema, model, HydratedDocument } from 'mongoose';

interface IVerifikasi {
  unit:Object;
  jabatan: Object;
}

interface IVerifikasiMethods {
  getUnitName(): string;
  getJabatanTitle(): string;
}

interface VerifikasiModel extends Model<IVerifikasi, {}, IVerifikasiMethods> {
    findByUnitId(unitId: number): Promise<HydratedDocument<IVerifikasi, IVerifikasiMethods>>;
    getAll(page: number , limit: number): Promise<HydratedDocument<IVerifikasi, IVerifikasiMethods>>;

  }

const VerifikasiSchema = new Schema<IVerifikasi, VerifikasiModel, IVerifikasiMethods>(
  {
    unit: {
      type: Object,
      required: true,
    },
    jabatan: {
      type: Object,
      required: true,
    },
  },
  { timestamps: true }
);


VerifikasiSchema.static('getAll', async function getAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [results, total] = await Promise.all([
        this.find({}).skip(skip).limit(limit),
        this.countDocuments(),
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

const Verifikasi = mongoose.models.Verifikasi || model<IVerifikasi, VerifikasiModel>('Verifikasi', VerifikasiSchema);
export default Verifikasi;
