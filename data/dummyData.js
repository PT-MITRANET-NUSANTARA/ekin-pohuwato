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
    intervensi: 'Tersedianya Dokumen Perencanaan Pelaksanaan Program dan Kegiatan Pengolahan Data dan Informasi Kepegawaian',
    rencana_aksi: [
        {
            content: 'dummy content'
        },
        {
            content: 'dummy content'
        },
        {
            content: 'dummy content'
        }
    ],
    jenis_rhk: 'ogranisasi',
}))

export const dummyAspeks = Array.from({ length: 2}, (_, index) => ({
    _id: (index + 1), 
    jenis: 'organisasi',
    indikator: 'Tersedianya Dokumen Perencanaan Pelaksanaan Program dan Kegiatan Pengolahan Data dan Informasi Kepegawaian',
}))

export const dummyRencanaAksi = Array.from({ length: 2}, (_, index) => ({
    _id: (index + 1), 
    content: 'organisasi',
}))

export const dummySkpBawahan = Array.from({ length: 10}, (_, index) => ({
    _id: (index + 1), 
    unit_kerja: 'BIDANG PENGADAAN, PEMBERHENTIAN DAN INFORMASI KEPEGAWAIAN',
    nip: '198208102010011004',
    nama: 'SHAK HUSA',
    jabatan: 'Analis Sumber Daya Manusia Aparatur Ahli Muda',
    status: (index === 6 ? 'draft' : index === 1 ? "belum" : "pengajuan"),
}))



export const dummyHarian = [
    {
      "_id": 1,
      "tanggal": "2024-10-01T00:00:00.000Z",
      "status": "hadir"
    },
    {
      "_id": 2,
      "tanggal": "2024-10-02T00:00:00.000Z",
      "status": "hadir"
    },
    {
      "_id": 3,
      "tanggal": "2024-10-03T00:00:00.000Z",
      "status": "hadir"
    },
    {
      "_id": 4,
      "tanggal": "2024-10-04T00:00:00.000Z",
      "status": "hadir"
    },
    {
      "_id": 5,
      "tanggal": "2024-10-05T00:00:00.000Z",
      "status": "hadir"
    },
    {
      "_id": 6,
      "tanggal": "2024-10-06T00:00:00.000Z",
      "status": "hadir"
    },
    {
      "_id": 7,
      "tanggal": "2024-10-07T00:00:00.000Z",
      "status": "hadir"
    },
    {
      "_id": 8,
      "tanggal": "2024-10-08T00:00:00.000Z",
      "status": "hadir"
    },
    {
      "_id": 9,
      "tanggal": "2024-10-09T00:00:00.000Z",
      "status": "hadir"
    },
    {
      "_id": 10,
      "tanggal": "2024-10-10T00:00:00.000Z",
      "status": "hadir"
    }
  ]
  
  
  

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

export const dummyBuktiDukung = Array.from({ length: 10}, (_, index) => ({
    _id: (index + 1), 
    content: 'dummy'
}))

export const dummyAktivitas = Array.from({ length: 10}, (_, index) => ({
    _id: (index + 1), 
    content: 'dummy',
    bukti: 'http'
}))

export const dummyOrganisasi = Array.from({ length: 10}, (_, index) => ({
    _id: (index + 1), 
    nama: "Kelompok Studi Linux",
    anggota: 12
}))

export const dummyTanggal = Array.from({ length: 10}, (_, index) => ({
    _id: (index + 1), 
    tanggal: "12-12-2022",
}))

export const dummyVisi = Array.from({ length: 10}, (_, index) => ({
    _id: (index + 1), 
    content: "lorem ipsum dolor sit amet",
}))
export const dummyMisi = Array.from({ length: 10}, (_, index) => ({
    _id: (index + 1), 
    content: "lorem ipsum dolor sit amet",
}))

export const dummyTujuan = Array.from({ length: 10}, (_, index) => ({
    _id: (index + 1), 
    content: "lorem ipsum dolor sit amet",
}))

export const dummyPeriodePenilaian = Array.from({ length: 10}, (_, index) => ({
    _id: (index + 1), 
    content: "1",
}))

export const Data = [
    {
      id: 1,
      year: 2016,
      userGain: 80000,
      userLost: 823
    },
    {
      id: 2,
      year: 2017,
      userGain: 45677,
      userLost: 345
    },
    {
      id: 3,
      year: 2018,
      userGain: 78888,
      userLost: 555
    },
    {
      id: 4,
      year: 2019,
      userGain: 90000,
      userLost: 4555
    },
    {
      id: 5,
      year: 2020,
      userGain: 4300,
      userLost: 234
    }
  ];

export const dummyHasilPenilaian = [
    {
        nip: 123123123,
        name: "Mohamad Rafiq Daud",
        penilaian: ""
    }
]

export const dummyTpp = Array.from({ length: 10}, (_, index) => ({
  _id: (index + 1), 
  unit_organisasi: "unit",
  idasn: 123123123,
  nama: 'Test'+ index + 1,
  jabatan: 'Petinggi',
  status: (index === 6 ? 'menerima' : index === 1 ? "tidak menerima" : "undifined"),
}))

export const dummyfileList = Array.from({ length: 10}, (_, index) => ({
  _id: (index + 1), 
  filename: 'file' + index,
  deskripsi: 'ini adalah file nomor' + index,
}))


