import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IDokumen extends Document {
    url: string; 
    title?: string; 
    description?: string; 
}

interface IDokumenMethods {}

interface DokumenModel extends Model<IDokumen, IDokumenMethods> {}

const DokumenSchema = new Schema<IDokumen, DokumenModel,IDokumenMethods>({
    url: {
        type: String,
        required: true, 
    },
    title: {
        type: String, 
    },
    description: {
        type: String, 
    },
}, { timestamps: true }); 

const Dokumen: Model<IDokumen> = mongoose.models.Dokumen || mongoose.model<IDokumen>('Dokumen', DokumenSchema);

export default Dokumen;
