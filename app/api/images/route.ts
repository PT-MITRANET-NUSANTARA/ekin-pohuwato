import fs from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';
import Dokumen from '../../../models/Dokumen' // Model Dokumen (PDF, DOC, Image)
import dbConnect from '@/utils/db';
import { createResponse } from '@/utils/api';
import multer from 'multer';
import nextConnect from 'next-connect';

// Konfigurasi multer untuk menyimpan file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), 'public/uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir); // Menyimpan file ke direktori 'public/uploads'
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Nama file yang disimpan
  },
});

// Filter tipe file: PDF, DOC, DOCX, JPEG, PNG, dan GIF
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf', // PDF
      'application/msword', // DOC
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX
      'image/jpeg', // JPEG
      'image/png', // PNG
      'image/gif' // GIF
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true); // File diizinkan
    } else {
      cb(new Error('Invalid file type')); // File tidak diizinkan
    }
  },
});

// Buat handler API dengan nextConnect dan tambahkan multer sebagai middleware
const handler = nextConnect({
  onError(err, req, res) {
    console.error('Error:', err);
    res.status(500).json({ success: false, error: err.message });
  },
  onNoMatch(req, res) {
    res.status(405).json({ success: false, message: 'Method not allowed' });
  },
});

handler.use(upload.array('files')); // Menggunakan multer untuk menangani multiple file upload

// Handle POST request untuk upload file
handler.post(async (req, res) => {
  await dbConnect();

  try {
    const dokumenIds = [];
    const files = req.files as Express.Multer.File[];

    if (files && files.length > 0) {
      for (const file of files) {
        // Simpan URL file di database
        const newDokumen = await Dokumen.create({ url: `/uploads/${file.filename}` });
        dokumenIds.push(newDokumen._id);
      }
    }

    return res.status(201).json(createResponse(201, 'Files uploaded successfully', { dokumenIds }, true));
  } catch (error) {
    console.error('POST error:', error);
    return res.status(500).json({ success: false, error: 'Failed to upload files' });
  }
});

// Handle GET request untuk mengambil file
handler.get(async (req, res) => {
  await dbConnect();

  try {
    const id = req.query.id as string;
    let dokumen;

    if (id) {
      dokumen = await Dokumen.findById(id);
      if (!dokumen) {
        return res.status(404).json({ success: false, message: 'Document not found' });
      }
    } else {
      dokumen = await Dokumen.find({});
    }

    return res.status(200).json(createResponse(200, 'Success', dokumen, true));
  } catch (error) {
    console.error('GET error:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch documents' });
  }
});

// Handle PUT request untuk mengupdate file
// Handle PUT request untuk mengupdate file, termasuk penggantian file
handler.put(upload.single('file'), async (req, res) => {
  await dbConnect();

  try {
    const id = req.query.id as string;
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ success: false, message: 'Invalid or missing ID' });
    }

    const dokumen = await Dokumen.findById(id);
    if (!dokumen) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    // Jika ada file baru yang diunggah
    if (req.file) {
      // Hapus file lama dari server
      const oldFilePath = path.join(process.cwd(), 'public', dokumen.url);
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }

      // Update URL file dengan file baru
      dokumen.url = `/uploads/${req.file.filename}`;
    }

    // Update properti lainnya jika ada
    const body = req.body;
    if (body.title) dokumen.title = body.title;
    if (body.description) dokumen.description = body.description;

    // Simpan perubahan
    await dokumen.save();

    return res.status(200).json(createResponse(200, 'Document updated successfully', dokumen, true));
  } catch (error) {
    console.error('PUT error:', error);
    return res.status(500).json({ success: false, error: 'Failed to update document' });
  }
});


// Handle DELETE request untuk menghapus file
handler.delete(async (req, res) => {
  await dbConnect();

  try {
    const id = req.query.id as string;
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ success: false, message: 'Invalid or missing ID' });
    }

    const deletedDokumen = await Dokumen.findByIdAndDelete(id);
    if (!deletedDokumen) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    // Hapus file fisik dari server
    const filePath = path.join(process.cwd(), 'public', deletedDokumen.url);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return res.status(200).json(createResponse(200, 'Document deleted successfully', deletedDokumen, true));
  } catch (error) {
    console.error('DELETE error:', error);
    return res.status(500).json({ success: false, error: 'Failed to delete document' });
  }
});

export const config = {
  api: {
    bodyParser: false, // Disable default body parser agar multer dapat digunakan
  },
};

export default handler;
