'use client';

import dayjs from 'dayjs';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { getById as getPenilaian } from '@/controller/periodePenilaianController';
import { getById } from '@/controller/SKPController';
import { Line } from 'react-chartjs-2';
import { Data } from '@/data/dummyData';
import { CategoryScale, LinearScale, PointElement, LineElement, Title as ChartTitle, Tooltip, Legend, Chart } from 'chart.js';
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, ChartTitle, Tooltip, Legend);

const page = () => {
    const router = useRouter();
    dayjs.locale('id');
    const { IdPenilaian } = useParams();
    const params = new URLSearchParams(window.location.search);
    const paramEntries = Object.fromEntries(params.entries());
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [atasan, setAtasan] = useState(null);
    const [bawahan, setBawahan] = useState(null);
    const [penilaian, setPenilaian] = useState(null);
    const [skp, setSkp] = useState(null);
    const [periode, setPeriode] = useState(null);

    const [penilaianChart, setPenilaianChart] = useState({
        labels: [],
        datasets: []
    });

    useEffect(() => {
        // Prepare data for the chart
        const labels = Data.map((item) => item.year);
        const userGains = Data.map((item) => item.userGain);
        const userLosses = Data.map((item) => item.userLost);

        setPenilaianChart({
            labels: labels,
            datasets: [
                {
                    label: 'User Gain',
                    data: userGains,
                    borderColor: '#93c5fd',
                    backgroundColor: 'rgba(147, 197, 253, 0.2)',
                    fill: true
                },
                {
                    label: 'User Lost',
                    data: userLosses,
                    borderColor: '#fca5a5',
                    backgroundColor: 'rgba(252, 165, 165, 0.2)',
                    fill: true
                }
            ]
        });
    }, []);

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

    console.log('atasan', atasan);

    return (
        <div className="p-6">
            <div className="header">
                <h1>sasaran kinerja pegawai</h1>
                <p>pendekatan hasil kinerja kuantitatif</p>
                <p>bagi pejabat administrasi dan pejabat fungsional</p>
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
                        <td className="border border-black p-2 text-center">TARGET</td>
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
            <table className="w-full border border-black mt-2">
                <tbody className="w-full border border-black">
                    <tr className="border border-black">
                        <td colSpan={4} className="border border-black font-semibold">
                            Perilaku Kerja
                        </td>
                    </tr>
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
            <table className="w-full mt-6">
                <tbody className="w-full">
                    <tr className="text-center">
                        <td>Pegawai Yang dinilai</td>
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

            <div>
                <p className="italic text-sm">
                    * Dalam hal rencana hasil kerja Pimpinan yang diintervensi adalah hasil kerja pejabat pimpinan tinggi dan Pimpinan unit kerja mandiri/ organisasi maka dituliskan rencana hasil kerja beserta indikator kinerja individu pejabat
                    pimpinan tinggi dan Pimpinan unit kerja mandiri atau sasaran dan indikator kinerja organisasi yang diintervensi
                </p>
                <p className="italic text-sm">** Pimpinan dapat memberikan Ekspektasi khusus terhadap satu atau lebih aspek perilaku kerja Pegawai</p>
            </div>

            <div className="header mt-12">
                <h1>sasaran kinerja pegawai</h1>
                <p>pendekatan hasil kinerja kuantitatif</p>
                <p>bagi pejabat administrasi dan pejabat fungsional</p>
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
            <table className="w-full border border-black mt-2">
                <tbody className="w-full border border-black">
                    <tr className="border border-black">
                        <td colSpan={8} className="border border-black font-semibold">
                            Capaian Kinerja Organisasi: Baik
                        </td>
                    </tr>
                    <tr className="border border-black">
                        <td colSpan={8} className="border border-black font-semibold">
                            <div className="flex flex-col gap-y-2 p-4">
                                <div>Pola Distribusi :</div>
                                <div className="w-full flex items-center justify-center ">
                                    <div className="max-w-sm">
                                        <Line data={penilaianChart} />
                                    </div>
                                </div>
                            </div>
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
                            Tambahan
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={8} className="border border-black font-semibold">
                            Rating Hasil Kerja : Sesuai Ekspektasi
                        </td>
                    </tr>
                </tbody>
            </table>
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
                    <tr>
                        <td colSpan={4} className="border border-black font-semibold">
                            Rating Perilaku Kerja : Sesuai Ekspektasi
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={4} className="border border-black font-semibold">
                            Predikat Kinerja Pegawai : Baik
                        </td>
                    </tr>
                </tbody>
            </table>
            <table className="w-full mt-6">
                <tbody className="w-full">
                    <tr className="text-right">
                        <td>
                            <div className="">
                                <p>
                                    {paramEntries.lokasi}, {dayjs().format('DD MMMM YYYY')}
                                </p>
                                <p>Pejabat Penilai Kinerja</p>
                            </div>
                        </td>
                    </tr>
                    <tr className="text-right">
                        <td className="pt-24">{atasan?.nama_asn}</td>
                    </tr>
                    <tr className="text-right">
                        <td className="">{atasan?.id_asn}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default page;
