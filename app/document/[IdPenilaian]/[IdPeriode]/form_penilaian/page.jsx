'use client';

import dayjs from 'dayjs';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { getById as getPenilaian } from '@/controller/periodePenilaianController';
import { getById } from '@/controller/SKPController';

const page = () => {
    const router = useRouter();
    dayjs.locale('id');
    const { IdPenilaian, IdPeriode } = useParams();
    const params = new URLSearchParams(window.location.search);
    const paramEntries = Object.fromEntries(params.entries());
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [atasan, setAtasan] = useState(null);
    const [bawahan, setBawahan] = useState(null);
    const [penilaian, setPenilaian] = useState(null);
    const [skp, setSkp] = useState(null);
    const [periode, setPeriode] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const skp = await getById(IdPenilaian);
            const penilaian = skp.data.penilaians.find((item) => item.periodePenilaian === IdPeriode);
            setPenilaian(penilaian);
            const periodePenilaian = await getPenilaian(IdPeriode);
            setPeriode(periodePenilaian.data);
            const skpAtasan = skp.data.skp[skp.data.skp.length - 1];
            const bawahan = skp.data.jabatan[skp.data.skp.length - 1];
            const jabatan = skpAtasan.jabatan;

            const atasan = jabatan.find((item) => {
                return item.unor.induk.id === bawahan.unor.induk.id;
            });

            setData(skp.data);
            setBawahan(bawahan);
            setAtasan(atasan);
        } catch (error) {
            console.log(error);
        }
    };

    const getRealisasi = (aspek, harian) => {
        if (aspek.jenis === 'kualitas') {
            const percentase = harian.reduce((max, item) => {
                return item.progress > max.progress ? item : max;
            }, harian[0]);
            if (percentase) {
                const percent = (percentase.progress / 100) * aspek.target_tahunan.target;
                return percent + '%';
            } else {
                return '0%';
            }
        } else if (aspek.jenis === 'kuantitas') {
            const percentase = harian.reduce((max, item) => {
                return item.progress > max.progress ? item : max;
            }, harian[0]);

            if (percentase) {
                const target = aspek.target_tahunan.target;
                const realisasi = percentase.progress;
                const percent = Math.floor((realisasi / 100) * target); // Round down the percentage

                return percent + ' ' + aspek.target_tahunan.satuan;
            } else {
                return '0%';
            }
        } else if (aspek.jenis === 'waktu') {
            return harian.length + ' ' + aspek.target_tahunan.satuan;
        } else {
            return '';
        }
    };

    const nana = {
        _id: '670d3d56465fa7b5e7c41926',
        periode_awal: '2024-09-28T16:00:00.000Z',
        periode_akhir: '2025-11-04T16:00:00.000Z',
        user_id: '980035363',
        skp: [
            {
                _id: '670d3ca7465fa7b5e7c418c6',
                periode_awal: '2024-09-28T16:00:00.000Z',
                periode_akhir: '2025-11-04T16:00:00.000Z',
                user_id: '980038195',
                skp: [],
                periodeRKT: '670d3af8465fa7b5e7c41842',
                renstra: '670d3a1a465fa7b5e7c417a9',
                jabatan: [
                    {
                        id_posjab: '35cb64b7-e4c1-46c3-baf6-4a664746efe8',
                        unor: {
                            id: '8ae482a75a4bd60d015a4d1931d72258',
                            nama: 'BADAN KEPEGAWAIAN DAN PENGEMBANGAN SUMBER DAYA MANUSIA',
                            atasan: {
                                unor_id: '8ae482a75a4bd60d015a4d1931ce222c',
                                unor_nama: 'PEMERINTAH KABUPATEN POHUWATO',
                                unor_jabatan: 'BUPATI POHUWATO',
                                asn: {
                                    idasn_atasan: null,
                                    nip_atasan: null,
                                    nama_atasan: null
                                }
                            },
                            induk: {
                                id: '8ae482a75a4bd60d015a4d1931d72258',
                                id_simpeg: 2171,
                                nama: 'BADAN KEPEGAWAIAN DAN PENGEMBANGAN SUMBER DAYA MANUSIA'
                            }
                        },
                        jenis_jabatan: {
                            id: '1',
                            nama: 'Jabatan Struktural'
                        },
                        jabatan_status: {
                            id: 5,
                            nama: 'Pimpinan Tinggi Pratama'
                        },
                        eselon: {
                            id: '22',
                            nama: 'II.b'
                        },
                        golongan_pns: {
                            id: '43',
                            nama: 'IV/c'
                        },
                        golongan_pppk: {
                            id: '',
                            nama: null
                        },
                        jabfung: {
                            id: '',
                            nama: null
                        },
                        jabfungum: {
                            id: '',
                            nama: null
                        },
                        id_asn: '980038195',
                        jenis_asn: 'PNS',
                        nama_jabatan: 'KEPALA BADAN KEPEGAWAIAN DAN PENGEMBANGAN SUMBER DAYA MANUSIA',
                        tmt_jabatan: '2023-01-06',
                        tunjangan: 4375000,
                        pejabat_sk: 'BUPATI POHUWATO',
                        nomor_sk: '1/Sk-Bup/BKPSDM/133/I',
                        tgl_sk: '2023-01-06',
                        doc: '35cb64b7-e4c1-46c3-baf6-4a664746efe8_196710281989021002_1726036226012.pdf',
                        userId: '980035363',
                        NCSISTIME: '2024-09-11 06:30:26.036'
                    }
                ],
                status: 'approved',
                pendekatan: 'kuantitatif',
                keterangan: '',
                createdAt: '2024-10-14T15:45:43.087Z',
                updatedAt: '2024-10-14T15:45:43.087Z',
                __v: 0,
                id: '670d3ca7465fa7b5e7c418c6'
            }
        ],
        periodeRKT: '670d3af8465fa7b5e7c41842',
        renstra: '670d3a1a465fa7b5e7c417a9',
        jabatan: [
            {
                id_posjab: 'fb13dd64-d12d-4bb4-bed9-55b3da71c282',
                unor: {
                    id: '8ae482855a71b686015a74eabbde7454',
                    nama: 'BIDANG PENGADAAN, PEMBERHENTIAN DAN INFORMASI KEPEGAWAIAN',
                    atasan: {
                        unor_id: '8ae482a75a4bd60d015a4d1931d72258',
                        unor_nama: 'BADAN KEPEGAWAIAN DAN PENGEMBANGAN SUMBER DAYA MANUSIA',
                        unor_jabatan: 'KEPALA BADAN KEPEGAWAIAN DAN PENGEMBANGAN SUMBER DAYA MANUSIA',
                        asn: {
                            idasn_atasan: '980038195',
                            nip_atasan: '196710281989021002',
                            nama_atasan: 'SUPRATMAN NENTO'
                        }
                    },
                    induk: {
                        id: '8ae482a75a4bd60d015a4d1931d72258',
                        id_simpeg: 2171,
                        nama: 'BADAN KEPEGAWAIAN DAN PENGEMBANGAN SUMBER DAYA MANUSIA'
                    }
                },
                jenis_jabatan: {
                    id: '1',
                    nama: 'Jabatan Struktural'
                },
                jabatan_status: {
                    id: 7,
                    nama: 'Administrator'
                },
                eselon: {
                    id: '32',
                    nama: 'III.b'
                },
                golongan_pns: {
                    id: '11',
                    nama: 'I/a'
                },
                golongan_pppk: {
                    id: '',
                    nama: null
                },
                jabfung: {
                    id: 'null',
                    nama: null
                },
                jabfungum: {
                    id: 'null',
                    nama: null
                },
                id_asn: '980035363',
                nama_asn: 'SYAIFUL SAFRIL LUMA',
                jenis_asn: 'PNS',
                nama_jabatan: 'KEPALA BIDANG PENGADAAN, PEMBERHENTIAN DAN INFORMASI KEPEGAWAIAN',
                tmt_jabatan: '2023-01-06',
                tunjangan: 100000,
                pejabat_sk: 'Tes',
                nomor_sk: 'ABC/123/1B',
                tgl_sk: '2024-06-10',
                doc: 'fb13dd64-d12d-4bb4-bed9-55b3da71c282_197904012005011015_1720154806098.pdf',
                userId: '980035363',
                NCSISTIME: '2024-07-05 04:46:46.113'
            }
        ],
        status: 'approved',
        pendekatan: 'kuantitatif',
        keterangan: '',
        createdAt: '2024-10-14T15:48:38.504Z',
        updatedAt: '2024-10-14T15:48:38.504Z',
        __v: 0,
        rhks: [
            {
                _id: '670d3dc9465fa7b5e7c4196c',
                skp: '670d3d56465fa7b5e7c41926',
                desc: 'Tersedianya Dokumen Pelaksanaan Program dan Kegiatan Bidang pengadaan, pemberhentian dan informasi kepegawaian',
                rhk: {
                    _id: '670d3ca9465fa7b5e7c418da',
                    skp: '670d3ca7465fa7b5e7c418c6',
                    desc: '',
                    rkt: {
                        _id: '670d3b1a465fa7b5e7c4184b',
                        periodeRKT: '670d3af8465fa7b5e7c41842',
                        subKegiatan: '670d3ae6465fa7b5e7c41829',
                        name: 'Meningkatnya kualitas pelayanan publik, akuntabilitas kinerja Pemerintah, Keuangan dan Aset',
                        input: [
                            {
                                name: '2',
                                target: 2,
                                satuan: '2',
                                _id: '670d3b1a465fa7b5e7c4184c'
                            }
                        ],
                        output: [
                            {
                                name: '2',
                                target: 2,
                                satuan: '2',
                                _id: '670d3b1a465fa7b5e7c4184d'
                            }
                        ],
                        outcome: [
                            {
                                name: '2',
                                target: 2,
                                satuan: '2',
                                _id: '670d3b1a465fa7b5e7c4184e'
                            }
                        ],
                        unit: {
                            id: '8ae482a75a4bd60d015a4d1931d72258',
                            id_simpeg: 2171,
                            nama: 'BADAN KEPEGAWAIAN DAN PENGEMBANGAN SUMBER DAYA MANUSIA'
                        },
                        total_anggaran: 222,
                        createdAt: '2024-10-14T15:39:06.470Z',
                        updatedAt: '2024-10-14T15:39:06.470Z',
                        __v: 0
                    },
                    jenis: 'utama',
                    klasifikasi: 'organisasi',
                    createdAt: '2024-10-14T15:45:45.125Z',
                    updatedAt: '2024-10-14T15:45:45.125Z',
                    __v: 0,
                    id: '670d3ca9465fa7b5e7c418da'
                },
                jenis: 'utama',
                klasifikasi: 'organisasi',
                createdAt: '2024-10-14T15:50:33.970Z',
                updatedAt: '2024-10-14T15:50:33.970Z',
                __v: 0,
                aspek: [
                    {
                        feedback: [],
                        _id: '670d3e05465fa7b5e7c419a2',
                        rhk: '670d3dc9465fa7b5e7c4196c',
                        jenis: 'kuantitas',
                        indikator: 'Jumlah Dokumen Pelaksanaan Program dan Kegiatan Bidang pengadaan, pemberhentian dan informasi kepegawaia',
                        target_tahunan: {
                            target: 3,
                            satuan: 'dokumen'
                        },
                        desc: '',
                        __v: 0
                    },
                    {
                        feedback: [],
                        _id: '670d3e20465fa7b5e7c419ad',
                        rhk: '670d3dc9465fa7b5e7c4196c',
                        jenis: 'kualitas',
                        indikator: 'Presentase Dokumen Pelaksanaan Program dan Kegiatan Bidang pengadaan, pemberhentian dan informasi kepegawaian yang tersedia',
                        target_tahunan: {
                            target: 100,
                            satuan: '%'
                        },
                        desc: '',
                        __v: 0
                    },
                    {
                        feedback: [],
                        _id: '670d3e49465fa7b5e7c419b8',
                        rhk: '670d3dc9465fa7b5e7c4196c',
                        jenis: 'waktu',
                        indikator: 'Rata-rata waktu yang digunakan untuk menyelesaikan Dokumen Pelaksanaan Program dan Kegiatan Bidang pengadaan, pemberhentian dan informasi kepegawaian',
                        target_tahunan: {
                            target: 14,
                            satuan: 'hari'
                        },
                        desc: '',
                        __v: 0
                    }
                ],
                harians: [
                    {
                        msg: {
                            status: 'Terima',
                            message: ''
                        },
                        _id: '670d447a91483b04808011d9',
                        absence: '1',
                        date: '2024-10-01T00:00:00.000Z',
                        isSKP: true,
                        startDateTime: '00:18:52',
                        endDateTime: '02:18:54',
                        progress: 45,
                        rhk: '670d3dc9465fa7b5e7c4196c',
                        namaKegiatan: 'asdasd',
                        deskripsiKegiatan: 'asdasd',
                        tautan: 'https://github.com/',
                        files: [],
                        user_id: '980035363',
                        createdAt: '2024-10-14T16:19:06.539Z',
                        updatedAt: '2024-10-14T16:21:31.226Z',
                        __v: 0
                    }
                ],
                id: '670d3dc9465fa7b5e7c4196c'
            }
        ],
        perilakus: [
            {
                _id: '670d3d56465fa7b5e7c41928',
                skp: '670d3d56465fa7b5e7c41926',
                name: 'Berorientasi Pelayanan',
                isi: ['Memahami dan memenuhi kebutuhan masyarakat', 'Ramah, cekatan, solutif, dan dapat diandalkan', 'Melakukan perbaikan tiada henti'],
                espektasi: '',
                feedback: '',
                like: null,
                __v: 0
            },
            {
                _id: '670d3d56465fa7b5e7c4192a',
                skp: '670d3d56465fa7b5e7c41926',
                name: 'Akuntabel',
                isi: ['Melaksanakan tugas dengan jujur, bertanggung jawab, cermat, disiplin, dan berintegritas tinggi', 'Menggunakan kekayaan dan BMN secara bertanggung jawab, efektif, dan efisien', 'Tidak menyalahgunakan kewenangan jabatan'],
                espektasi: '',
                feedback: '',
                like: null,
                __v: 0
            },
            {
                _id: '670d3d57465fa7b5e7c4192c',
                skp: '670d3d56465fa7b5e7c41926',
                name: 'Kompeten',
                isi: ['Meningkatkan kompetensi diri untuk menjawab tantangan yang selalu berubah', 'Membantu orang lain belajar', 'Melaksanakan tugas dengan kualitas terbaik'],
                espektasi: '',
                feedback: '',
                like: null,
                __v: 0
            },
            {
                _id: '670d3d57465fa7b5e7c4192e',
                skp: '670d3d56465fa7b5e7c41926',
                name: 'Harmonis',
                isi: ['Menghargai setiap orang apapun latar belakangnya', 'Suka menolong orang lain', 'Membangun lingkungan kerja yang kondusif'],
                espektasi: '',
                feedback: '',
                like: null,
                __v: 0
            },
            {
                _id: '670d3d57465fa7b5e7c41930',
                skp: '670d3d56465fa7b5e7c41926',
                name: 'Loyal',
                isi: [
                    'Memegang teguh ideologi Pancasila, Undang-Undang Dasar Negara Republik Indonesia Tahun 1945, setia pada NKRI serta pemerintahan yang sah',
                    'Menjaga nama baik sesama ASN, Pimpinan, Instansi dan Negara',
                    'Menjaga rahasia jabatan dan negara'
                ],
                espektasi: '',
                feedback: '',
                like: null,
                __v: 0
            },
            {
                _id: '670d3d57465fa7b5e7c41932',
                skp: '670d3d56465fa7b5e7c41926',
                name: 'Adaptif',
                isi: ['Cepat menyesuaikan diri menghadapi perubahan', 'Terus berinovasi dan mengembangkan kreativitas', 'Bertindak proaktif'],
                espektasi: '',
                feedback: '',
                like: null,
                __v: 0
            },
            {
                _id: '670d3d58465fa7b5e7c41934',
                skp: '670d3d56465fa7b5e7c41926',
                name: 'Kolaboratif',
                isi: ['Memberi kesempatan kepada berbagai pihak untuk berkontribusi', 'Terbuka dalam bekerja sama untuk menghasilkan nilai tambah', 'Menggerakkan pemanfaatan berbagai sumberdaya untuk tujuan bersama'],
                espektasi: '',
                feedback: '',
                like: null,
                __v: 0
            }
        ],
        penilaians: [
            {
                _id: '670d64c31cd3ef8351fa1242',
                ratingKinerja: 5,
                periodePenilaian: '670d4546611ffd5e062c2b24',
                skp: '670d3d56465fa7b5e7c41926',
                createdAt: '2024-10-14T18:36:51.895Z',
                updatedAt: '2024-10-14T18:36:51.895Z',
                __v: 0,
                id: '670d64c31cd3ef8351fa1242'
            }
        ],
        id: '670d3d56465fa7b5e7c41926'
    };

    return (
        <div className="p-6">
            <div className="header">
                <h1>evaluasi kinerja pegawai</h1>
                <p>pendekatan hasil kinerja kuantitatif</p>
                <p className="periode">periode : {dayjs(periode?.periodeStart).format('MMMM')}</p>
            </div>
            <table className="subheader">
                <tbody>
                    <tr>
                        <td>PEMERINTAH KAB. POHUWATO</td>
                        <td className="text-right">PERIODE PENILAIAN: {dayjs(periode?.periodeStart).format('DD MMMM YYYY') + '-' + dayjs(periode?.periodeEnd).format('DD MMMM YYYY')}</td>
                    </tr>
                </tbody>
            </table>
            <table className="detailpenilai">
                <tbody>
                    <tr className="tablehead">
                        <td style={{ maxWidth: '10%' }}>no</td>
                        <td colSpan={2}>pegawai yang dinilai</td>
                        <td style={{ maxWidth: '10%' }}>no</td>
                        <td colSpan={2}>pegawai penilai kinerja</td>
                    </tr>
                    <tr className="data">
                        <td>1</td>
                        <td>nama</td>
                        <td>{bawahan?.nama_asn}</td>
                        <td>1</td>
                        <td>nama</td>
                        <td>{atasan?.nama_asn}</td>
                    </tr>
                    <tr className="data">
                        <td>2</td>
                        <td>nip</td>
                        <td>{bawahan?.id_asn}</td>
                        <td>2</td>
                        <td>nip</td>
                        <td>{atasan?.id_asn}</td>
                    </tr>
                    {/* <tr className="data">
                        <td>3</td>
                        <td>PANGKAT/ GOL. RUANG</td>
                        <td>Penata Tingkat I / III/d</td>
                        <td>3</td>
                        <td>PANGKAT/ GOL. RUANG</td>
                        <td>Penata Tingkat I / III/d</td>
                    </tr> */}
                    <tr className="data">
                        <td>4</td>
                        <td>JABATAN</td>
                        <td>{bawahan?.nama_jabatan}</td>
                        <td>4</td>
                        <td>JABATAN</td>
                        <td>{atasan?.nama_jabatan}</td>
                    </tr>
                    <tr className="data">
                        <td>5</td>
                        <td>UNIT KERJA</td>
                        <td>{bawahan?.unor.nama}</td>
                        <td>5</td>
                        <td>UNIT KERJA</td>
                        <td>{atasan?.unor.nama}</td>
                    </tr>
                </tbody>
            </table>
            <div className="uppercase mt-2 p-2 bg-sky-300 font-semibold border border-black">
                <p>CAPAIAN KINERJA ORGANISASI</p>-
            </div>
            <div className="uppercase p-2 bg-sky-300 font-semibold border border-black">
                <p>pola distribusi</p>-
            </div>
            <table className="w-full border border-black mt-2">
                <tbody className="w-full border border-black">
                    <tr className="border border-black">
                        <td colSpan={8} className="border border-black font-semibold">
                            Hasil Kerja
                        </td>
                    </tr>
                    <tr className="font-bold">
                        <td className="border border-black p-2 text-center">NO</td>
                        <td className="border border-black p-2 text-center">RENCANA HASIL KERJA PIMPINAN YANG DIINTERVENSI</td>
                        <td className="border border-black p-2 text-center">RENCANA HASIL KERJA </td>
                        <td className="border border-black p-2 text-center">ASPEK</td>
                        <td className="border border-black p-2 text-center">INDKATOR KINERJA INDIVIDU</td>
                        <td className="border border-black p-2 text-center">TARGET/SESUAI EKSPEKTASI</td>
                        <td className="border border-black p-2 text-center">RELASI BERDASARKAN BUKTI DUKUNG</td>
                        <td className="border border-black p-2 text-center">UMPAN BALIK BERKELANJUTAN BERDASARKAN BUKTI DUKUNG</td>
                    </tr>
                    <tr>
                        <td colSpan={8} className="border border-black font-semibold">
                            Utama
                        </td>
                    </tr>

                    {data?.rhks.map((item, index) => (
                        <>
                            <tr>
                                <td className="border border-black p-2 text-center" rowSpan={item.aspek ? item.aspek.length + 1 : 1}>
                                    {index + 1}
                                </td>
                                <td className="border border-black p-2 text-center" rowSpan={item.aspek ? item.aspek.length + 1 : 1} style={{ maxWidth: '12rem', padding: '8px' }}>
                                    <div className="flex flex-col gap-y-2 text-left">
                                        <p>{item.desc}</p>
                                    </div>
                                </td>

                                <td className="border border-black p-2 text-center" rowSpan={item.aspek ? item.aspek.length + 1 : 1} style={{ maxWidth: '12rem', padding: '8px' }}>
                                    <div className="flex flex-col gap-y-2 text-left">
                                        <p>{item.desc}</p>
                                        <span>{item.klasifikasi ? item.klasifikasi : ''}</span>
                                    </div>
                                </td>
                            </tr>
                            {item.aspek?.map((aspek) => (
                                <>
                                    <tr>
                                        <td className="border border-black p-2 text-center">{aspek.jenis}</td>
                                        <td className="border border-black p-2 text-center" style={{ maxWidth: '12rem', padding: '8px' }}>
                                            <div className="flex flex-col gap-y-2 text-left">
                                                <p>{aspek.indikator}</p>
                                            </div>
                                        </td>
                                        <td className="border border-black p-2 text-center">{aspek.target_tahunan.target + aspek.target_tahunan.satuan} </td>

                                        <td className="border border-black p-2 text-center">
                                            {' '}
                                            {getRealisasi(
                                                aspek,
                                                item.harians?.filter((h) => {
                                                    const hDate = dayjs(h.date); // Convert h.date to Day.js object
                                                    const endDateTime = dayjs(periode.endDateTime); // Convert endDateTime to Day.js object
                                                    console.log(h);
                                                    // Check if h.date is less than or equal to endDateTime
                                                    return hDate.isBefore(endDateTime) || hDate.isSame(endDateTime);
                                                })
                                            )}
                                        </td>
                                        <td className="border border-black p-2 text-center"></td>
                                    </tr>
                                </>
                            ))}
                        </>
                    ))}
                    <tr>
                        <td colSpan={8} className="border border-black font-semibold">
                            Utama
                        </td>
                    </tr>
                </tbody>
            </table>
            <div className="uppercase mt-2 p-2 bg-sky-300 font-semibold border border-black">
                <p>RATING HASIL KERJA</p> {penilaian?.ratingKinerja} 
            </div>
            <table className="w-full border border-black mt-2">
                <tbody className="w-full border border-black">
                    <tr className="font-bold">
                        <td className="border border-black p-2 text-center">NO</td>
                        <td className="border border-black p-2 text-center">PERILAKU KERJA</td>
                        <td className="border border-black p-2 text-center">EKSPEKTASI KHUSU PIMPINAN</td>
                        <td className="border border-black p-2 text-center">UMPAN BALIK BERKELANJUTAN BERDASARKAN BUKTI DUKUNG</td>
                    </tr>
                    {data?.perilakus?.map((item, index) => (
                        <tr key={index}>
                            <td className="border border-black p-2 text-center">{index + 1}</td>
                            <td className="border border-black p-2 text-center" style={{ padding: '8px' }}>
                                <div className="flex flex-col gap-y-2 text-left">
                                    <b>{item.name}</b>
                                    <ol className="list-decimal list-inside">
                                        {item.isi.map((isiItem, isiIndex) => (
                                            <li key={isiIndex}>{isiItem}</li>
                                        ))}
                                    </ol>
                                </div>
                            </td>
                            <td className="border border-black p-2 text-center">
                                {/* {item.feedback || (
                                        <div className="flex items-center justify-center">
                                            <Button type="primary" onClick={() => setModal({ trigger: true, modalData: dummyFeedback, title: 'Tambah Feedback', formFields: formFields })}>
                                                Tambah
                                            </Button>
                                        </div>
                                    )} */}
                            </td>
                            <td className="border border-black p-2 text-center"></td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="uppercase mt-2 p-2 bg-sky-300 font-semibold border border-black">
                <p>RATING PERILAKU KINERJA</p> {penilaian?.ratingPerilaku}
            </div>
            <div className="uppercase mt-2 p-2 bg-sky-300 font-semibold border border-black">
                <p>PREDIKAT KINERJA PEGAWAI</p>-
            </div>
            <table className="w-full mt-6">
                <tbody className="w-full">
                    <tr className="text-center">
                        <td>Pegawai Yang di nilai</td>
                        <td>
                            <div className="">
                                <p>
                                    {paramEntries.lokasi}, {dayjs().format('DD MMMM YYYY')}
                                </p>
                                <p>Pejabat Penilai Kinerja</p>
                            </div>
                        </td>
                    </tr>
                    <tr className="text-center">
                        <td className="pt-24">{bawahan?.nama_asn}</td>
                        <td className="pt-24">{atasan?.nama_asn}</td>
                    </tr>
                    <tr className="text-center">
                        <td className="">{bawahan?.id_asn}</td>
                        <td className="">{atasan?.id_asn}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default page;
