'use client';

import { Breadcrumb, Button, Card, Tag, Typography } from 'antd';
import { UserOutlined, DotChartOutlined, PrinterOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import useFetchData from '@/hooks/useFetchData';
import { getData } from '@/controller/AuthorizationController';
import { getById } from '@/controller/SKPController';
import { getByNIP } from '@/controller/IDSN/JabatanController';
import { formatDateToDayMonthYear } from '@/utils/util';
const { Title } = Typography;
const page = () => {
    const { IdSkp } = useParams();
    const { data, setData, loading } = useFetchData(getData);
    const [jabatan, setJabatan] = useState(null);
    const [skp, setSkp] = useState(null);
    console.log(jabatan);

    console.log(data);

    useEffect(() => {
        if (data) {
            fetchData();
        }
    }, [data]);

    const fetchData = async () => {
        try {
            const jabatan = await getByNIP(data.token, data.user.nipBaru);
            const skp = await getById(IdSkp);
            const selectedJabatan = jabatan.mapData.data[0];
            setSkp(skp.data);
            setJabatan(selectedJabatan);
        } catch (error) {
            console.log(error);
        }
    };

    console.log(skp);

    const dummyData = [
        {
            desc: '',
            id: '6704ca2f21f169ef46e32595',
            jenis: 'utama',
            klasifikasi: null,
            rencana: null,
            rhk: null,
            skp: '6704c93545a7ac9af02e6855',
            _id: '6704ca2f21f169ef46e32595',
            aspeks: [
                {
                    _id: '6704cf7021f169ef46eab9e5',
                    rhk: '6704cd0621f169ef46e75c73',
                    jenis: 'kuantitas',
                    indikator:
                        'Jumlah Dokumen Pelaksanaan Program dan Kegiatan Bidang, yang meilputi Dokumen perencanaan Pengadaan ASN, Dokumen perencanaan kegiatan pemberhentian ASN serta Dokumen Perencanaan Pengolahan Data dan informasi kepegawaian',
                    target_tahunan: '3 Dokumen',
                    desc: 'Tersedianya Dokumen Pelaksanaan Program dan Kegiatan Bidang pengadaan'
                },
                {
                    _id: '6704cf7021f169ef46eab9e6',
                    rhk: '6704cd0621f169ef46e75c73',
                    jenis: 'kualitas',
                    indikator: 'Presentase Setiap dokumen Perencanaan pelaksanaan Program dan Kegiatan Bidang pengadaan, pemberhentian dan informasi kepegawaian yang tersedia',
                    target_tahunan: '100%',
                    desc: 'Tersedianya dokumen berkualitas untuk pelaksanaan program'
                },
                {
                    _id: '6704cf7021f169ef46eab9e7',
                    rhk: '6704cd0621f169ef46e75c73',
                    jenis: 'waktu',
                    indikator: 'Rata-rata waktu yang digunakan untuk menyelesaikan 1 (satu) Dokumen perencanaan pelaksanaan Program dan Kegiatan Bidang pengadaan, pemberhentian dan informasi kepegawaian',
                    target_tahunan: '1 Bulan',
                    desc: 'Perencanaan tepat waktu'
                }
            ]
        },
        {
            desc: '',
            id: '6704ca2f21f169ef46e32596',
            jenis: 'utama',
            klasifikasi: null,
            rencana: null,
            rhk: null,
            skp: '6704c93545a7ac9af02e6856',
            _id: '6704ca2f21f169ef46e32596',
            aspeks: [
                {
                    _id: '6704cf7021f169ef46eab9e8',
                    rhk: '6704cd0621f169ef46e75c74',
                    jenis: 'kuantitas',
                    indikator: 'Jumlah layanan pengembangan kompetensi bagi pegawai yang tersedia',
                    target_tahunan: '5 Layanan',
                    desc: 'Penyediaan layanan pengembangan kompetensi bagi pegawai'
                },
                {
                    _id: '6704cf7021f169ef46eab9e9',
                    rhk: '6704cd0621f169ef46e75c74',
                    jenis: 'kualitas',
                    indikator: 'Presentase keberhasilan pengembangan kompetensi pegawai',
                    target_tahunan: '90%',
                    desc: 'Pengembangan kompetensi pegawai secara berkualitas'
                },
                {
                    _id: '6704cf7021f169ef46eab9ea',
                    rhk: '6704cd0621f169ef46e75c74',
                    jenis: 'waktu',
                    indikator: 'Rata-rata waktu untuk pelaksanaan program pengembangan kompetensi pegawai',
                    target_tahunan: '6 Bulan',
                    desc: 'Pengembangan kompetensi tepat waktu'
                }
            ]
        },
        {
            desc: '',
            id: '6704ca2f21f169ef46e32597',
            jenis: 'utama',
            klasifikasi: null,
            rencana: null,
            rhk: null,
            skp: '6704c93545a7ac9af02e6857',
            _id: '6704ca2f21f169ef46e32597',
            aspeks: [
                {
                    _id: '6704cf7021f169ef46eab9eb',
                    rhk: '6704cd0621f169ef46e75c75',
                    jenis: 'kuantitas',
                    indikator: 'Jumlah anggaran yang direncanakan dan diawasi',
                    target_tahunan: '100%',
                    desc: 'Perencanaan dan pengawasan penyusunan anggaran belanja tahunan'
                },
                {
                    _id: '6704cf7021f169ef46eab9ec',
                    rhk: '6704cd0621f169ef46e75c75',
                    jenis: 'kualitas',
                    indikator: 'Presentase akurasi dalam penyusunan anggaran',
                    target_tahunan: '100%',
                    desc: 'Akurasi tinggi dalam perencanaan anggaran'
                },
                {
                    _id: '6704cf7021f169ef46eab9ed',
                    rhk: '6704cd0621f169ef46e75c75',
                    jenis: 'waktu',
                    indikator: 'Rata-rata waktu untuk menyusun anggaran tahunan',
                    target_tahunan: '3 Bulan',
                    desc: 'Penyusunan anggaran tepat waktu'
                }
            ]
        }
    ];

    return (
        <div className="w-full flex flex-col gap-y-4">
            <Breadcrumb
                items={[
                    {
                        title: 'Dashboard'
                    },
                    {
                        title: <Link href="/dashboard/renstra">Renstra</Link>
                    }
                ]}
            />
            <Card>
                <div className="flex flex-col gap-y-4 mb-6">
                    <div className="w-full flex items-center justify-between">
                        <Title className="mt-2" level={5}>
                            Sasaran Kinerja Pegawai
                        </Title>
                        <div className="flex items-center gap-x-2">
                            <Button type="primary" icon={<UserOutlined />}>
                                Lihat Data Profil
                            </Button>
                            <Button type="default" icon={<DotChartOutlined />}>
                                Lihat Matriks
                            </Button>
                            <Button type="default" icon={<PrinterOutlined />}>
                                Cetak
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-flow-row divide-y text-xs">
                        <div className="flex items-center justify-between py-2">
                            <span className="uppercase font-semibold">periode</span>
                            <Tag color="blue" className="capitalize">
                                {formatDateToDayMonthYear(skp?.periode_awal)} - {formatDateToDayMonthYear(skp?.periode_akhir)}
                            </Tag>
                        </div>
                        <div className="flex items-center justify-between py-2">
                            <span className="uppercase font-semibold">pendekatan</span>
                            <Tag color="blue" className="capitalize">
                                {skp?.pendekatan}
                            </Tag>
                        </div>
                        <div className="flex items-center justify-between py-2">
                            <span className="uppercase font-semibold">status</span>
                            <Tag color="green" className="capitalize">
                                {skp?.status}
                            </Tag>
                        </div>
                        {/* <div className="flex items-center justify-between py-2">
                            <span className="uppercase font-semibold">Model SKP</span>
                            <p className="text-right capitalize">JAJF</p>
                        </div> */}
                        {/* <div className="flex items-center justify-between py-2">
                            <span className="uppercase font-semibold">jenis pegawai</span>
                            <p className="text-right capitalize">pemimpin</p>
                        </div> */}
                    </div>
                </div>
                <div className="w-full grid grid-cols-12 gap-4 mb-6">
                    <Card type="inner" title="Pegawai Yang Dinilai" extra={<Button type="primary" shape="circle" icon={<ReloadOutlined />} />} className="col-span-6 w-full">
                        <div className="grid grid-flow-row divide-y text-xs">
                            <div className="flex items-center justify-between py-2">
                                <span className="uppercase font-semibold">nama</span>
                                <p color="blue" className="capitalize">
                                    {jabatan?.unor.atasan.asn.nama_atasan}
                                </p>
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <span className="uppercase font-semibold">nip</span>
                                <p color="blue" className="capitalize">
                                    {jabatan?.unor.atasan.asn.nip_atasan}
                                </p>
                            </div>
                            {/* <div className="flex items-center justify-between py-2">
                                <span className="uppercase font-semibold">pangkat / golongan / ruang</span>
                                <p color="green" className="capitalize">
                                    Penata Tingkat I / III/d
                                </p>
                            </div> */}
                            <div className="flex items-center justify-between py-2">
                                <span className="uppercase font-semibold">jabatan</span>
                                <p className="text-right capitalize"> {jabatan?.unor.atasan.unor_jabatan}</p>
                            </div>
                            <div className="flex justify-between py-2">
                                <span className="uppercase font-semibold">unit kerja</span>
                                <div className="flex flex-col gap-y-2 text-right items-end">
                                    <p>{jabatan?.unor.atasan.unor_nama} </p>
                                    <small>ID : {jabatan?.unor.atasan.unor_id}</small>
                                    <Button type="primary" shape="circle" size="small" icon={<SearchOutlined />} />
                                </div>
                            </div>
                        </div>
                    </Card>
                    <Card type="inner" title="Pegawai Yang Dinilai" extra={<Button type="primary" shape="circle" icon={<ReloadOutlined />} />} className="col-span-6 w-full">
                        <div className="grid grid-flow-row divide-y text-xs">
                            <div className="flex items-center justify-between py-2">
                                <span className="uppercase font-semibold">nama</span>
                                <p color="blue" className="capitalize">
                                    {data?.user.nama}
                                </p>
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <span className="uppercase font-semibold">nip</span>
                                <p color="blue" className="capitalize">
                                    {data?.user.nipBaru}
                                </p>
                            </div>
                            {/* <div className="flex items-center justify-between py-2">
                                <span className="uppercase font-semibold">pangkat / golongan / ruang</span>
                                <p color="green" className="capitalize">
                                    Penata Tingkat I / III/d
                                </p>
                            </div> */}
                            <div className="flex items-center justify-between py-2">
                                <span className="uppercase font-semibold">jabatan</span>
                                <p className="text-right capitalize"> {jabatan?.nama_jabatan}</p>
                            </div>
                            <div className="flex justify-between py-2">
                                <span className="uppercase font-semibold">unit kerja</span>
                                <div className="flex flex-col gap-y-2 text-right items-end">
                                    <p>{jabatan?.unor.nama} </p>
                                    <small>ID : {jabatan?.unor.id}</small>
                                    <Button type="primary" shape="circle" size="small" icon={<SearchOutlined />} />
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
                <table className="normaltable mb-6">
                    <thead>
                        <tr>
                            <th>NO</th>
                            <th style={{ maxWidth: '12rem' }}>RENCANA HASIL KERJA PIMPINAN YANG DIINTERVENSI</th>
                            <th>RENCANA HASIL KERJA</th>
                            <th>ASPEK</th>
                            <th>INDIKATOR KINERJA INDIVIDU</th>
                            <th>TARGET TAHUNAN</th>
                        </tr>
                    </thead>
                    <tbody className="capitalize text-sm">
                        <tr>
                            <td colSpan={6} className="text-left px-2">
                                Utama
                            </td>
                        </tr>
                        {dummyData.map((item, index) => (
                            <>
                                <tr>
                                    <td rowSpan={item.aspeks.length + 1}>{index+1}</td>
                                    <td rowSpan={item.aspeks.length + 1} style={{ maxWidth: '12rem', padding: '8px' }}>
                                        <div className="flex flex-col gap-y-2 text-left">
                                            <p>{item.desc}</p>
                                            <p>Indikator: {item.desc}</p>
                                            <Button size="small" type="primary" className="w-fit" shape="circle" icon={<SearchOutlined />} />
                                        </div>
                                    </td>
                                    <td rowSpan={item.aspeks.length + 1} style={{ maxWidth: '12rem', padding: '8px' }}>
                                        <div className="flex flex-col gap-y-2 text-left">
                                            <p>{item.desc}</p>
                                            <Tag color="blue" className="w-fit">
                                                {item.desc}
                                            </Tag>
                                            <Button size="small" type="primary" className="w-fit" shape="circle" icon={<SearchOutlined />} />
                                        </div>
                                    </td>
                                </tr>
                                {item.aspeks.map((aspek) => (
                                    <>
                                        <tr>
                                            <td>{aspek.jenis}</td>
                                            <td style={{ maxWidth: '12rem', padding: '8px' }}>
                                                <div className="flex flex-col gap-y-2 text-left">
                                                    <p>
                                                        Jumlah Dokumen Pelaksanaan Program dan Kegiatan Bidang, yang meilputi Dokumen perencanaan Pengadaan ASN, Dokumen perencanaan kegiatan pemberhentian ASN serta Dokumen Perencanaan Pengolahan Data
                                                        dan informasi kepegawaian
                                                    </p>
                                                    <Button size="small" type="primary" className="w-fit" shape="circle" icon={<SearchOutlined />} />
                                                </div>
                                            </td>
                                            <td>3 Dokument</td>
                                        </tr>
                                    </>
                                ))}
                            </>
                        ))}
                    </tbody>
                </table>
                <table className="normaltable mb-6">
                    <thead>
                        <tr className="uppercase">
                            <th>no</th>
                            <th>perilaku kinerja</th>
                            <th>ekspektasi khusus pimpinan</th>
                        </tr>
                    </thead>
                    <tbody className="capitalize">
                        <tr>
                            <td>1</td>
                            <td className="" style={{ padding: '8px' }}>
                                <div className="flex flex-col gap-y-2 text-left">
                                    <b>Berorientasi Pelayanan</b>
                                    <ol className="list-decimal list-inside">
                                        <li>Meningkatkan kompetensi diri untuk menjawab tantangan yang selalu berubah</li>
                                        <li>Meningkatkan kompetensi diri untuk menjawab tantangan yang selalu berubah</li>
                                        <li>Meningkatkan kompetensi diri untuk menjawab tantangan yang selalu berubah</li>
                                    </ol>
                                </div>
                            </td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
                <table className="normaltable">
                    <thead>
                        <tr>
                            <th className="text-left px-4">Lampiran</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{ border: '1px solid black', padding: '8px' }}>
                                <div className="flex flex-col gap-y-2">
                                    <p>Dukungan Sumber Daya</p>
                                    <Button className="w-fit" type="primary">
                                        Edit
                                    </Button>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td style={{ border: '1px solid black', padding: '8px' }}>
                                <div className="flex flex-col gap-y-2">
                                    <p>Dukungan Sumber Daya</p>
                                    <Button className="w-fit" type="primary">
                                        Edit
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </Card>
        </div>
    );
};

export default page;
