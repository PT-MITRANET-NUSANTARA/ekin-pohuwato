import mongoose, { Document, Schema } from 'mongoose';
import SubKegiatan, { ISubKegiatan } from './SubKegiatan'; // Assuming the SubKegiatan model is in a separate file
import { IPeriodeRKT } from './PeriodeRKT';

export interface IRKT extends Document {
  periodeRKT: mongoose.Types.ObjectId | IPeriodeRKT; // Reference to the associated SubKegiatan
  name: string; // Name of the RKT
  input: {
    name : string, 
    target_capaian: string; // Target achievement for input
    satuan: string; // Unit of measurement for input
  };
  subKegiatan: mongoose.Schema.Types.ObjectId; // Single reference to a SubKegiatan document

  output: {
    name: string, 
    target_capaian: string; // Target achievement for output
    satuan: string; // Unit of measurement for output
  };
  outcome: {
    name: string,
    target_capaian: string; // Target achievement for outcome
    satuan: string; // Unit of measurement for outcome
  };
  unit: Object
  total_anggaran: number; // Total budget for the RKT
}

const RKTSchema: Schema = new Schema({
  periodeRKT: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PeriodeRKT',
    required: true
  },
  subKegiatan: {
    type: Schema.Types.ObjectId,
    ref: 'SubKegiatan', // Single reference to SubKegiatan model
    required: true
},
  name: {
    type: String,
    required: true
  },
  input: {
    name: {
        type: String,
        required: true
    },
    target_capaian: {
      type: String,
      required: true
    },
    satuan: {
      type: String,
      required: true
    }
  },
  output: {
    name: {
        type: String,
        required: true
    },
    target_capaian: {
      type: String,
      required: true
    },
    satuan: {
      type: String,
      required: true
    }
  },
  outcome: {
    name: {
        type: String,
        required: true
    },
    target_capaian: {
      type: String,
      required: true
    },
    satuan: {
      type: String,
      required: true
    }
  },
  unit: {
    type: Object,
    required: true
  },
  total_anggaran: {
    type: Number,
    required: true
  }
}, { timestamps: true });

const RKT = mongoose.models.RKT || mongoose.model<IRKT>('RKT', RKTSchema);

export default RKT;
