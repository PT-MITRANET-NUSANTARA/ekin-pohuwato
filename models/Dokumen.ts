import mongoose, { Document, Schema, Model } from 'mongoose';

// Interface untuk tipe dokumen Dokumen
export interface IDokumen extends Document {
    url: string; // URL file dokumen yang di-upload
    title?: string; // Judul dokumen (optional)
    description?: string; // Deskripsi dokumen (optional)
}

// Skema Mongoose untuk koleksi 'Dokumen'
const DokumenSchema: Schema<IDokumen> = new Schema({
    url: {
        type: String,
        required: true, // 'url' wajib ada
    },
    title: {
        type: String, // Opsional: title dokumen
    },
    description: {
        type: String, // Opsional: deskripsi dokumen
    },
}, { timestamps: true }); // Menambahkan createdAt dan updatedAt otomatis

// Ekspor model Dokumen, jika belum ada maka dibuat baru
const Dokumen: Model<IDokumen> = mongoose.models.Dokumen || mongoose.model<IDokumen>('Dokumen', DokumenSchema);

export default Dokumen;
