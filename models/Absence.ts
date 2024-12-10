import mongoose, { Document, Schema } from 'mongoose';

// Enum untuk status absence
enum AbsenceStatus {
  HADIR = 'Hadir',
  SAKIT = 'Sakit',
  IZIN = 'Izin',
  ALPHA = 'Alpha',
}

// Interface untuk Absence
interface IAbsence extends Document {
  user_id: string;
  date: Date;
  status: AbsenceStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

// Define the Absence schema
const AbsenceSchema: Schema = new Schema(
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
      enum: Object.values(AbsenceStatus), // Menggunakan enum AbsenceStatus
      required: true,
    },
  },
  { timestamps: true }
);

// Create the Absence model
const Absence = mongoose.models.Absence || mongoose.model<IAbsence>('Absence', AbsenceSchema);

export default Absence;
