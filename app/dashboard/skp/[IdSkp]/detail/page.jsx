'use client';

import { Breadcrumb, Button, Card, Tag, Typography } from 'antd';
import { UserOutlined, DotChartOutlined, PrinterOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import React from 'react';
import Link from 'next/link';
const { Title } = Typography;
const page = () => {
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
                                1 JANUARI SD 31 DESEMBER TAHUN 2024
                            </Tag>
                        </div>
                        <div className="flex items-center justify-between py-2">
                            <span className="uppercase font-semibold">pendekatan</span>
                            <Tag color="blue" className="capitalize">
                                kuantitatif
                            </Tag>
                        </div>
                        <div className="flex items-center justify-between py-2">
                            <span className="uppercase font-semibold">status</span>
                            <Tag color="green" className="capitalize">
                                persetujuan
                            </Tag>
                        </div>
                        <div className="flex items-center justify-between py-2">
                            <span className="uppercase font-semibold">Model SKP</span>
                            <p className="text-right capitalize">JAJF</p>
                        </div>
                        <div className="flex items-center justify-between py-2">
                            <span className="uppercase font-semibold">jenis pegawai</span>
                            <p className="text-right capitalize">pemimpin</p>
                        </div>
                    </div>
                </div>
                <div className="w-full grid grid-cols-12 gap-4 mb-6">
                    <Card type="inner" title="Pegawai Yang Dinilai" extra={<Button type="primary" shape="circle" icon={<ReloadOutlined />} />} className="col-span-6 w-full">
                        <div className="grid grid-flow-row divide-y text-xs">
                            <div className="flex items-center justify-between py-2">
                                <span className="uppercase font-semibold">nama</span>
                                <p color="blue" className="capitalize">
                                    SYAIFUL SAFRIL LUMA, SE
                                </p>
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <span className="uppercase font-semibold">nip</span>
                                <p color="blue" className="capitalize">
                                    197904012005011015
                                </p>
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <span className="uppercase font-semibold">pangkat / golongan / ruang</span>
                                <p color="green" className="capitalize">
                                    Penata Tingkat I / III/d
                                </p>
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <span className="uppercase font-semibold">jabatan</span>
                                <p className="text-right capitalize"> KEPALA BIDANG PENGADAAN, PEMBERHENTIAN DAN INFORMASI KEPEGAWAIAN</p>
                            </div>
                            <div className="flex justify-between py-2">
                                <span className="uppercase font-semibold">unit kerja</span>
                                <div className="flex flex-col gap-y-2 text-right items-end">
                                    <p>BIDANG PENGADAAN, PEMBERHENTIAN DAN INFORMASI KEPEGAWAIAN </p>
                                    <small>ID : 8ae482855a71b686015a74eabbde7454</small>
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
                                    SYAIFUL SAFRIL LUMA, SE
                                </p>
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <span className="uppercase font-semibold">nip</span>
                                <p color="blue" className="capitalize">
                                    197904012005011015
                                </p>
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <span className="uppercase font-semibold">pangkat / golongan / ruang</span>
                                <p color="green" className="capitalize">
                                    Penata Tingkat I / III/d
                                </p>
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <span className="uppercase font-semibold">jabatan</span>
                                <p className="text-right capitalize"> KEPALA BIDANG PENGADAAN, PEMBERHENTIAN DAN INFORMASI KEPEGAWAIAN</p>
                            </div>
                            <div className="flex justify-between py-2">
                                <span className="uppercase font-semibold">unit kerja</span>
                                <div className="flex flex-col gap-y-2 text-right items-end">
                                    <p>BIDANG PENGADAAN, PEMBERHENTIAN DAN INFORMASI KEPEGAWAIAN </p>
                                    <small>ID : 8ae482855a71b686015a74eabbde7454</small>
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
                            <th colSpan={6} className="text-left px-2">
                                Utama
                            </th>
                        </tr>
                        <tr>
                            <th rowSpan={3}>1</th>
                            <th rowSpan={3} style={{ maxWidth: '12rem', padding: '8px' }}>
                                <div className="flex flex-col gap-y-2 text-left">
                                    <p>Meningkatnya kualitas pelayanan publik, akuntabilitas kinerja Pemerintah, Keuangan dan Aset</p>
                                    <p>Indikator: Presentase Nilai Capaian Kinerja Sasaran Strategi</p>
                                    <Button size="small" type="primary" className="w-fit" shape="circle" icon={<SearchOutlined />} />
                                </div>
                            </th>
                            <th rowSpan={3} style={{ maxWidth: '12rem', padding: '8px' }}>
                                <div className="flex flex-col gap-y-2 text-left">
                                    <p>Meningkatnya kualitas pelayanan publik, akuntabilitas kinerja Pemerintah, Keuangan dan Aset</p>
                                    <Tag color="blue" className="w-fit">
                                        ogranisasi
                                    </Tag>
                                    <Button size="small" type="primary" className="w-fit" shape="circle" icon={<SearchOutlined />} />
                                </div>
                            </th>
                            <th>kualitas</th>
                            <th style={{ maxWidth: '12rem', padding: '8px' }}>
                                <div className="flex flex-col gap-y-2 text-left">
                                    <p>
                                        Jumlah Dokumen Pelaksanaan Program dan Kegiatan Bidang, yang meilputi Dokumen perencanaan Pengadaan ASN, Dokumen perencanaan kegiatan pemberhentian ASN serta Dokumen Perencanaan Pengolahan Data dan informasi
                                        kepegawaian
                                    </p>
                                    <Button size="small" type="primary" className="w-fit" shape="circle" icon={<SearchOutlined />} />
                                </div>
                            </th>
                            <th>3 Dokument</th>
                        </tr>
                        <tr>
                            <th>kualitas</th>
                            <th style={{ maxWidth: '12rem', padding: '8px' }}>
                                <div className="flex flex-col gap-y-2 text-left">
                                    <p>
                                        Jumlah Dokumen Pelaksanaan Program dan Kegiatan Bidang, yang meilputi Dokumen perencanaan Pengadaan ASN, Dokumen perencanaan kegiatan pemberhentian ASN serta Dokumen Perencanaan Pengolahan Data dan informasi
                                        kepegawaian
                                    </p>
                                    <Button size="small" type="primary" className="w-fit" shape="circle" icon={<SearchOutlined />} />
                                </div>
                            </th>
                            <th>3 Dokument</th>
                        </tr>
                        <tr>
                            <th>kualitas</th>
                            <th style={{ maxWidth: '12rem', padding: '8px' }}>
                                <div className="flex flex-col gap-y-2 text-left">
                                    <p>
                                        Jumlah Dokumen Pelaksanaan Program dan Kegiatan Bidang, yang meilputi Dokumen perencanaan Pengadaan ASN, Dokumen perencanaan kegiatan pemberhentian ASN serta Dokumen Perencanaan Pengolahan Data dan informasi
                                        kepegawaian
                                    </p>
                                    <Button size="small" type="primary" className="w-fit" shape="circle" icon={<SearchOutlined />} />
                                </div>
                            </th>
                            <th>3 Dokument</th>
                        </tr>
                        <tr>
                            <th colSpan={6} className="text-left px-2">
                                Utama
                            </th>
                        </tr>
                        <tr>
                            <th rowSpan={3}>1</th>
                            <th rowSpan={3} style={{ maxWidth: '12rem', padding: '8px' }}>
                                <div className="flex flex-col gap-y-2 text-left">
                                    <p>Meningkatnya kualitas pelayanan publik, akuntabilitas kinerja Pemerintah, Keuangan dan Aset</p>
                                    <p>Indikator: Presentase Nilai Capaian Kinerja Sasaran Strategi</p>
                                    <Button size="small" type="primary" className="w-fit" shape="circle" icon={<SearchOutlined />} />
                                </div>
                            </th>
                            <th rowSpan={3} style={{ maxWidth: '12rem', padding: '8px' }}>
                                <div className="flex flex-col gap-y-2 text-left">
                                    <p>Meningkatnya kualitas pelayanan publik, akuntabilitas kinerja Pemerintah, Keuangan dan Aset</p>
                                    <Tag color="blue" className="w-fit">
                                        ogranisasi
                                    </Tag>
                                    <Button size="small" type="primary" className="w-fit" shape="circle" icon={<SearchOutlined />} />
                                </div>
                            </th>
                            <th>kualitas</th>
                            <th style={{ maxWidth: '12rem', padding: '8px' }}>
                                <div className="flex flex-col gap-y-2 text-left">
                                    <p>
                                        Jumlah Dokumen Pelaksanaan Program dan Kegiatan Bidang, yang meilputi Dokumen perencanaan Pengadaan ASN, Dokumen perencanaan kegiatan pemberhentian ASN serta Dokumen Perencanaan Pengolahan Data dan informasi
                                        kepegawaian
                                    </p>
                                    <Button size="small" type="primary" className="w-fit" shape="circle" icon={<SearchOutlined />} />
                                </div>
                            </th>
                            <th>3 Dokument</th>
                        </tr>
                        <tr>
                            <th>kualitas</th>
                            <th style={{ maxWidth: '12rem', padding: '8px' }}>
                                <div className="flex flex-col gap-y-2 text-left">
                                    <p>
                                        Jumlah Dokumen Pelaksanaan Program dan Kegiatan Bidang, yang meilputi Dokumen perencanaan Pengadaan ASN, Dokumen perencanaan kegiatan pemberhentian ASN serta Dokumen Perencanaan Pengolahan Data dan informasi
                                        kepegawaian
                                    </p>
                                    <Button size="small" type="primary" className="w-fit" shape="circle" icon={<SearchOutlined />} />
                                </div>
                            </th>
                            <th>3 Dokument</th>
                        </tr>
                        <tr>
                            <th>kualitas</th>
                            <th style={{ maxWidth: '12rem', padding: '8px' }}>
                                <div className="flex flex-col gap-y-2 text-left">
                                    <p>
                                        Jumlah Dokumen Pelaksanaan Program dan Kegiatan Bidang, yang meilputi Dokumen perencanaan Pengadaan ASN, Dokumen perencanaan kegiatan pemberhentian ASN serta Dokumen Perencanaan Pengolahan Data dan informasi
                                        kepegawaian
                                    </p>
                                    <Button size="small" type="primary" className="w-fit" shape="circle" icon={<SearchOutlined />} />
                                </div>
                            </th>
                            <th>3 Dokument</th>
                        </tr>
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
                            <th>1</th>
                            <th className="" style={{ padding: '8px' }}>
                                <div className="flex flex-col gap-y-2 text-left">
                                    <b>Berorientasi Pelayanan</b>
                                    <ol className="list-decimal list-inside">
                                        <li>Meningkatkan kompetensi diri untuk menjawab tantangan yang selalu berubah</li>
                                        <li>Meningkatkan kompetensi diri untuk menjawab tantangan yang selalu berubah</li>
                                        <li>Meningkatkan kompetensi diri untuk menjawab tantangan yang selalu berubah</li>
                                    </ol>
                                </div>
                            </th>
                            <th></th>
                        </tr>
                    </tbody>
                </table>
                <table className='normaltable'>
                    <thead>
                        <tr>
                            <th className='text-left px-4'>Lampiran</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{border: '1px solid black', padding: '8px'}}>
                                <div className='flex flex-col gap-y-2'>
                                    <p>Dukungan Sumber Daya</p>
                                    <Button className='w-fit' type='primary'>Edit</Button>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td style={{border: '1px solid black', padding: '8px'}}>
                                <div className='flex flex-col gap-y-2'>
                                    <p>Dukungan Sumber Daya</p>
                                    <Button className='w-fit' type='primary'>Edit</Button>
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
