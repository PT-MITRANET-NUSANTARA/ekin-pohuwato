'use client';

import { Breadcrumb, Button, Card, Form, Input, InputNumber, Modal, Tag, Typography } from 'antd';
import { UserOutlined, DotChartOutlined, PrinterOutlined, ReloadOutlined, SearchOutlined, PlusOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
const { Title } = Typography;
const page = () => {
    const router = useRouter();
    const {IdSkp, IdPeriode} = useParams();
    const [ratingModal, setRatingModal] = useState(false);
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
                            <Button type="default" icon={<PrinterOutlined />}>
                                Cetak Form Penilaian
                            </Button>
                            <Button type="default" icon={<PrinterOutlined />}>
                                Cetak Dokumen Evaluasi Kinerja
                            </Button>
                            <Button type="primary" icon={<PlusOutlined />} onClick={() => setRatingModal(true)}>
                                Buat Rating Hasil Kinerja
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
                            <th>BUKTI DUKUNG</th>
                            <th>RELASI</th>
                            <th>FEEDBACK</th>
                        </tr>
                    </thead>
                    <tbody className="capitalize text-sm">
                        <tr>
                            <td colSpan={6} className="text-left px-2">
                                Utama
                            </td>
                        </tr>
                        <tr>
                            <td rowSpan={3}>1</td>
                            <td rowSpan={3} style={{ maxWidth: '12rem', padding: '8px' }}>
                                <div className="flex flex-col gap-y-2 text-left">
                                    <p>Meningkatnya kualitas pelayanan publik, akuntabilitas kinerja Pemerintah, Keuangan dan Aset</p>
                                    <p>Indikator: Presentase Nilai Capaian Kinerja Sasaran Strategi</p>
                                </div>
                            </td>
                            <td rowSpan={3} style={{ maxWidth: '12rem', padding: '8px' }}>
                                <div className="flex flex-col gap-y-2 text-left">
                                    <p>Meningkatnya kualitas pelayanan publik, akuntabilitas kinerja Pemerintah, Keuangan dan Aset</p>
                                    <Tag color="blue" className="w-fit">
                                        ogranisasi
                                    </Tag>
                                </div>
                            </td>
                            <td>kualitas</td>
                            <td style={{ maxWidth: '12rem', padding: '8px' }}>
                                <div className="flex flex-col gap-y-2 text-left">
                                    <p>
                                        Jumlah Dokumen Pelaksanaan Program dan Kegiatan Bidang, yang meilputi Dokumen perencanaan Pengadaan ASN, Dokumen perencanaan kegiatan pemberhentian ASN serta Dokumen Perencanaan Pengolahan Data dan informasi
                                        kepegawaian
                                    </p>
                                </div>
                            </td>
                            <td>3 Dokument</td>
                            <td>
                                <div className="flex items-center justify-center">
                                    <Button type="primary" onClick={() => router.push(`/dashboard/skp/${IdSkp}/periode_penilaian/${IdPeriode}/penilaian/1/penilaian_rhk/1/bukti_dukung`)}>Lihat</Button>
                                </div>
                            </td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>kualitas</td>
                            <td style={{ maxWidth: '12rem', padding: '8px' }}>
                                <div className="flex flex-col gap-y-2 text-left">
                                    <p>
                                        Jumlah Dokumen Pelaksanaan Program dan Kegiatan Bidang, yang meilputi Dokumen perencanaan Pengadaan ASN, Dokumen perencanaan kegiatan pemberhentian ASN serta Dokumen Perencanaan Pengolahan Data dan informasi
                                        kepegawaian
                                    </p>
                                </div>
                            </td>
                            <td>3 Dokument</td>
                            <td>
                                <div className="flex items-center justify-center">
                                    <Button type="primary">Lihat</Button>
                                </div>
                            </td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>kualitas</td>
                            <td style={{ maxWidth: '12rem', padding: '8px' }}>
                                <div className="flex flex-col gap-y-2 text-left">
                                    <p>
                                        Jumlah Dokumen Pelaksanaan Program dan Kegiatan Bidang, yang meilputi Dokumen perencanaan Pengadaan ASN, Dokumen perencanaan kegiatan pemberhentian ASN serta Dokumen Perencanaan Pengolahan Data dan informasi
                                        kepegawaian
                                    </p>
                                </div>
                            </td>
                            <td>3 Dokument</td>
                            <td>
                                <div className="flex items-center justify-center">
                                    <Button type="primary">Lihat</Button>
                                </div>
                            </td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td colSpan={6} className="text-left px-2">
                                Utama
                            </td>
                        </tr>
                        <tr>
                            <td rowSpan={3}>1</td>
                            <td rowSpan={3} style={{ maxWidth: '12rem', padding: '8px' }}>
                                <div className="flex flex-col gap-y-2 text-left">
                                    <p>Meningkatnya kualitas pelayanan publik, akuntabilitas kinerja Pemerintah, Keuangan dan Aset</p>
                                    <p>Indikator: Presentase Nilai Capaian Kinerja Sasaran Strategi</p>
                                </div>
                            </td>
                            <td rowSpan={3} style={{ maxWidth: '12rem', padding: '8px' }}>
                                <div className="flex flex-col gap-y-2 text-left">
                                    <p>Meningkatnya kualitas pelayanan publik, akuntabilitas kinerja Pemerintah, Keuangan dan Aset</p>
                                    <Tag color="blue" className="w-fit">
                                        ogranisasi
                                    </Tag>
                                </div>
                            </td>
                            <td>kualitas</td>
                            <td style={{ maxWidth: '12rem', padding: '8px' }}>
                                <div className="flex flex-col gap-y-2 text-left">
                                    <p>
                                        Jumlah Dokumen Pelaksanaan Program dan Kegiatan Bidang, yang meilputi Dokumen perencanaan Pengadaan ASN, Dokumen perencanaan kegiatan pemberhentian ASN serta Dokumen Perencanaan Pengolahan Data dan informasi
                                        kepegawaian
                                    </p>
                                </div>
                            </td>
                            <td>3 Dokument</td>
                            <td>
                                <div className="flex items-center justify-center">
                                    <Button type="primary">Lihat</Button>
                                </div>
                            </td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>kualitas</td>
                            <td style={{ maxWidth: '12rem', padding: '8px' }}>
                                <div className="flex flex-col gap-y-2 text-left">
                                    <p>
                                        Jumlah Dokumen Pelaksanaan Program dan Kegiatan Bidang, yang meilputi Dokumen perencanaan Pengadaan ASN, Dokumen perencanaan kegiatan pemberhentian ASN serta Dokumen Perencanaan Pengolahan Data dan informasi
                                        kepegawaian
                                    </p>
                                </div>
                            </td>
                            <td>3 Dokument</td>
                            <td>
                                <div className="flex items-center justify-center">
                                    <Button type="primary">Lihat</Button>
                                </div>
                            </td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>kualitas</td>
                            <td style={{ maxWidth: '12rem', padding: '8px' }}>
                                <div className="flex flex-col gap-y-2 text-left">
                                    <p>
                                        Jumlah Dokumen Pelaksanaan Program dan Kegiatan Bidang, yang meilputi Dokumen perencanaan Pengadaan ASN, Dokumen perencanaan kegiatan pemberhentian ASN serta Dokumen Perencanaan Pengolahan Data dan informasi
                                        kepegawaian
                                    </p>
                                </div>
                            </td>
                            <td>3 Dokument</td>
                            <td>
                                <div className="flex items-center justify-center">
                                    <Button type="primary">Lihat</Button>
                                </div>
                            </td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td colSpan={5}>Rating Hasil Kinerja</td>
                            <td colSpan={4}></td>
                        </tr>
                    </tbody>
                </table>
                <table className="normaltable mb-6">
                    <thead>
                        <tr className="uppercase">
                            <th>no</th>
                            <th>perilaku kinerja</th>
                            <th>ekspektasi khusus pimpinan</th>
                            <th>feedback</th>
                        </tr>
                    </thead>
                    <tbody className="capitalize">
                        <tr>
                            <td style={{ maxWidth: '12px' }}>1</td>
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
                            <td></td>
                        </tr>
                        <tr>
                            <td colSpan={2}>Rating Perilaku Kerja :</td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td colSpan={2}>Predikat Kinerja :</td>
                            <td></td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
                <Modal open={ratingModal} onClose={() => setRatingModal(false)} onCancel={() => setRatingModal(false)}>
                    <Form className="mt-6 " layout="vertical">
                        <Form.Item name="jenis_rhk" label="Masukan Rating Hasil Kinerja">
                            <div className="flex flex-col gap-y-1 w-full">
                                <InputNumber className="w-full" min={1} max={50} />
                                <small>Rating dari skala 1-50</small>
                            </div>
                        </Form.Item>
                    </Form>
                </Modal>
            </Card>
        </div>
    );
};

export default page;
