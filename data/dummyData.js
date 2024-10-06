import dayjs from "dayjs";

export const  dummyRenstra = Array.from({ length: 100 }, (_, index) => ({
    _id: (index + 1).toString(),
    name: 'dummy name',
    periode_start: (index + 1),
    periode_end: 12,
    programs: 'Dummy Program',
}));

export const dummyAtasan = Array.from({ length: 10 }, (_, index) => ({
    nip: (index + 197904012005011015),
    name: `atasan no ${index}`,
    jabatan: 'pendamping',
    golru: '3/C'
}));

export const dummyBawahan = Array.from({ length: 10 }, (_, index) => ({
    nip: (index + 197904012005011015),
    name: `atasan no ${index}`,
    jabatan: 'pendamping',
    golru: '3/C'
}));

export const dummySkp = Array.from({ length: 10}, (_, index) => ({
    _id: (index + 1), 
    periode_awal: 1,
    periode_akhir: 1,
    pendekatan: 'kuantitatif',
    keterangan: 'dummy',
    skp: 'contoh',
    unit: 'BIDANG PENGADAAN, PEMBERHENTIAN DAN INFORMASI KEPEGAWAIAN',
    jabatan: 'pimpinan',
    atasan: 'Mohamad Rafiq Daud',
    status: 'persetujuan',    
}))

export const dummyTimKerja = Array.from({ length: 10}, (_, index) => ({
    _id: (index + 1), 
    tim_kerja: 'tim 1',
    ketua_tim: 'Mohamad Rafiq Daud'
}))

export const dummyIntervensiRhk = Array.from({ length: 2}, (_, index) => ({
    _id: (index + 1), 
    nama_rhk: 'Terlaksananya Pengembangan',
    intervensi: 'Tersedianya Dokumen Perencanaan Pelaksanaan Program dan Kegiatan Pengolahan Data dan Informasi Kepegawaian'
}))

export const dummySkpBawahan = Array.from({ length: 10}, (_, index) => ({
    _id: (index + 1), 
    unit_kerja: 'BIDANG PENGADAAN, PEMBERHENTIAN DAN INFORMASI KEPEGAWAIAN',
    nip: '198208102010011004',
    nama: 'SHAK HUSA',
    jabatan: 'Analis Sumber Daya Manusia Aparatur Ahli Muda',
    status: (index === 6 ? 'draft' : index === 1 ? "belum" : "pengajuan"),
}))

export const dummyHarian = Array.from({ length: 10}, (_, index) => ({
    _id: (index + 1), 
    tanggal: '1',
    status: (index === 6 ? 'hadir' : index === 1 ? "alpa" : "izin"),
}))

export const dummyUnit = Array.from({ length: 10}, (_, index) => ({
    _id: (index + 1), 
    name: 'Mohamad Rafiq Daud',
    role: (index === 6 ? 'Admin UMPEG' : index === 1 ? "Petugas" : "User"),
}))

export const dummyFeedback = Array.from({ length: 10}, (_, index) => ({
    _id: (index + 1), 
    content: 'Perilaku dalam skp baik',
    category: 'good',
}))

export const dummyRekapPenilaian = Array.from({ length: 10}, (_, index) => ({
    _id: (index + 1), 
    nip: 198608302011012001,
    nama: 'Mohamad Rafiq Daud',
    jabatan: 'kepala suku',
    rating_hasil_kinerja: '-',
    rating_perilaku_kerja: '-',
    predikat_kinerja_periodik: '-',
}))