import mongoose, { Document, Schema } from 'mongoose';

enum AbsenceStatus {
  HADIR = 'Hadir',
  SAKIT = 'Sakit',
  IZIN = 'Izin',
  ALPHA = 'Alpha',
}

interface IAbsence extends Document {
  user_id: string;
  date: Date;
  status: AbsenceStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

interface IAbsenceMethods {}

interface AbsenceModel extends mongoose.Model<IAbsence, IAbsenceMethods> {}

const AbsenceSchema = new Schema<IAbsence, AbsenceModel, IAbsenceMethods>(
  {
    user_id: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    status: {
      type: String,
      enum: Object.values(AbsenceStatus), 
      required: true,
    },
  },
  { timestamps: true }
);

const Absence = mongoose.models.Absence || mongoose.model<IAbsence>('Absence', AbsenceSchema);

export default Absence;
