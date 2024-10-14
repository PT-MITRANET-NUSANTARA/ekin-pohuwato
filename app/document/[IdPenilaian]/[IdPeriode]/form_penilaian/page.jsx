"use client"

import dayjs from 'dayjs';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { getById as getPenilaian } from '@/controller/periodePenilaianController';
import { getById } from '@/controller/SKPController';


const page = () => {
    const router = useRouter();
    dayjs.locale('id');
    const {IdPenilaian, IdPeriode} = useParams();
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
                    <tr>
                        <td colSpan={8} className="border border-black font-semibold">
                            Utama
                        </td>
                    </tr>
                </tbody>
            </table>
            <div className="uppercase mt-2 p-2 bg-sky-300 font-semibold border border-black">
                <p>CAPAIAN KINERJA ORGANISASI</p>-
            </div>
            <table className="w-full border border-black mt-2">
                <tbody className="w-full border border-black">
                    <tr className="font-bold">
                        <td className="border border-black p-2 text-center">NO</td>
                        <td className="border border-black p-2 text-center">PERILAKU KERJA</td>
                        <td className="border border-black p-2 text-center">EKSPEKTASI KHUSU PIMPINAN</td>
                        <td className="border border-black p-2 text-center">UMPAN BALIK BERKELANJUTAN BERDASARKAN BUKTI DUKUNG</td>
                    </tr>
                    <tr className="">
                        <td className="border border-black p-2 ">1</td>
                        <td className="border border-black p-2 ">
                            <div className="">
                                <b>Berorientasi Pelayanan</b>
                                <ul className="list-disc list-inside">
                                    <li className="">Memahami dan memenuhi kebutuhan masyarakat</li>
                                    <li className="">Memahami dan memenuhi kebutuhan masyarakat</li>
                                    <li className="">Memahami dan memenuhi kebutuhan masyarakat</li>
                                </ul>
                            </div>
                        </td>
                        <td className="border border-black p-2 ">EKSPEKTASI KHUSU PIMPINAN</td>
                        <td className="border border-black p-2 ">UMPAN BALIK BERKELANJUTAN BERDASARKAN BUKTI DUKUNG</td>
                    </tr>
                </tbody>
            </table>
            <div className="uppercase mt-2 p-2 bg-sky-300 font-semibold border border-black">
                <p>CAPAIAN KINERJA ORGANISASI</p>-
            </div>
            <div className="uppercase mt-2 p-2 bg-sky-300 font-semibold border border-black">
                <p>CAPAIAN KINERJA ORGANISASI</p>-
            </div>
            <table className='w-full mt-6'>
                <tbody className='w-full'>
                    <tr className='text-center'>
                        <td>Pegawai Yang di nilai</td>
                        <td>
                            <div className="">
                                <p>{paramEntries.lokasi}, {dayjs().format('DD MMMM YYYY')}</p>
                                <p>Pejabat Penilai Kinerja</p>
                            </div>
                        </td>
                    </tr>
                    <tr className='text-center'>
                        <td className='pt-24'>Mohamad Rafiq Daud</td>
                        <td className='pt-24'>
                           Mohamad Rafiq Daud
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default page;
