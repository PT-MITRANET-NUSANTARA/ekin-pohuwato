'use client';

import { Breadcrumb, Button, Card, Space, Tabs, Tag, Typography } from 'antd';
import { EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import Link from 'next/link';
import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { DataTable } from '@/components';
import { dummyBawahan } from '@/data';

const { Title } = Typography;

const page = () => {
    const router = useRouter();
    const { IdSkp, IdPeriode } = useParams();

    const Column = [
        {
            title: 'NIP',
            dataIndex: 'nip',
            key: 'nip',
            sorter: (a, b) => a.nip.length - b.nip.length,
            width: '10%'
        },
        {
            title: 'RHK Yang di Intervensi',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.length - b.name.length,
            width: '30%'
        },
        {
            title: 'Hasil RHK',
            dataIndex: 'jabatan',
            key: 'jabatan',
            sorter: (a, b) => a.jabatan.length - b.jabatan.length,
            width: '30%'
        },
        {
            title: 'Hasil RHK',
            dataIndex: 'golru',
            key: 'golru',
            sorter: (a, b) => a.golru.length - b.golru.length,
            width: '30%'
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="small">
                    <Button
                        // type='primary'
                        size="middle"
                        onClick={() => router.push(`/dashboard/skp/${IdSkp}/periode_penilaian/${IdPeriode}/penilaian/${record.nip}/penilaian_rhk`)}
                    >
                        Penilaian
                    </Button>

                    <Button
                        // type='primary'
                        size="middle"
                        color="danger"
                        onClick={() => router.push(`/dashboard/skp/${IdSkp}/periode_penilaian/${IdPeriode}/penilaian/${record.nip}/feedback_perilaku`)}
                    >
                        Feedback Perilaku
                    </Button>
                </Space>
            )
        }
    ];

    return (
        <div className="flex flex-col gap-y-4">
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
                <div className="flex items-center justify-between mb-6">
                    <Title className="mt-2" level={5}>
                        Penilaian SKP
                    </Title>
                </div>
                <div className="grid grid-flow-row divide-y text-xs mb-12">
                    <div className="flex items-center justify-between py-2">
                        <span className="uppercase font-semibold">periode skp</span>
                        <p className="text-right capitalize">1 Januari 2024 - 31 Desember 2024</p>
                    </div>
                    <div className="flex items-center justify-between py-2">
                        <span className="uppercase font-semibold">jabatan</span>
                        <p className="text-right uppercase">KEPALA BIDANG PENGADAAN, PEMBERHENTIAN DAN INFORMASI KEPEGAWAIAN </p>
                    </div>
                    <div className="flex items-start justify-between py-2">
                        <span className="uppercase font-semibold">unit kerja</span>
                        <div className="flex flex-col gap-y-2 text-right items-end">
                            <p>BIDANG PENGADAAN, PEMBERHENTIAN DAN INFORMASI KEPEGAWAIAN</p>
                            <small>ID : 8ae482855a71b686015a74eabbde7454</small>
                            <Button type="primary" shape="circle" size="small" icon={<SearchOutlined />} />
                        </div>
                    </div>
                    <div className="flex items-start justify-between py-2">
                        <span className="uppercase font-semibold">unit kerja induk</span>
                        <div className="flex flex-col gap-y-2 text-right items-end">
                            <p>BIDANG PENGADAAN, PEMBERHENTIAN DAN INFORMASI KEPEGAWAIAN</p>
                            <small>ID : 8ae482855a71b686015a74eabbde7454</small>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-x-2 mb-4">
                    <Button type="default" onClick={() => router.push(`/dashboard/skp/${IdSkp}/periode_penilaian/${IdPeriode}/penilaian/1/rekap_penilaian`)}>
                        Rekap Penilaian Bawahan
                    </Button>
                    <Button type="primary">Lihat Kurva</Button>
                    <Button type="primary">Pembinaan Bawahan</Button>
                </div>
                <DataTable columns={Column} data={dummyBawahan} loading={false} />
                {/* <Tabs defaultActiveKey="1" type="card">
                    <Tabs.Items tab="Pelaksanaan Kinerja" key="1">
                        <table className="normaltable">
                            <thead>
                                <tr>
                                    <th>Hasil Kerja</th>
                                    <th>Perilaku Kerja</th>
                                    <th>Nilai SKP</th>
                                    <th>Capaian Organisasi</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td colSpan={5}>
                                        <div className="grid grid-flow-row divide-y text-xs mb-12 p-2">
                                            <div className="flex items-center justify-between py-2">
                                                <span className="uppercase font-semibold">periode penilaian</span>
                                                <div className="flex flex-col gap-y-1 items-end">
                                                    <b className="text-right capitalize">Januari</b>
                                                    <Tag color="blue">1 Januari 2024 s/d 31 Januari 2024</Tag>
                                                    <span>
                                                        <b>Batas:</b>5 Februari 2024
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between py-2">
                                                <span className="uppercase font-semibold">atasan</span>
                                                <p className="text-right uppercase">SUPRATMAN NENTO </p>
                                            </div>
                                            <div className="flex items-center justify-between py-2">
                                                <span className="uppercase font-semibold">jabatan</span>
                                                <p className="text-right uppercase">Kepala BADAN KEPEGAWAIAN DAN PENGEMBANGAN SUMBER DAYA MANUSIA</p>
                                            </div>
                                            <div className="flex items-center justify-between py-2">
                                                <span className="uppercase font-semibold">unit kerja</span>
                                                <p className="text-right uppercase"> BADAN KEPEGAWAIAN DAN PENGEMBANGAN SUMBER DAYA MANUSIA</p>
                                            </div>
                                            <div className="flex items-center gap-x-2 py-2">
                                                <Button type="primary">Cetak Form Penilaian</Button>
                                                <Button type="primary">Cetak Dokumen Evaluasi Kinerja</Button>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>-</td>
                                    <td>-</td>
                                    <td>-</td>
                                    <td>-</td>
                                    <td>
                                        <div className="flex flex-col p-4 gap-y-2">
                                            <Button type="default" className="w-fit" onClick={() => router.push(`/dashboard/skp/${IdSkp}/penilaian/1/penilaian_rhk`)}>
                                                Penilaian SKP
                                            </Button>
                                            <Button type="default" className="w-fit" onClick={() => router.push(`/dashboard/skp/${IdSkp}/penilaian/1/feedback_perilaku`)}>
                                                Feedback Perilaku
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </Tabs.Items>
                  
                </Tabs> */}
            </Card>
        </div>
    );
};

export default page;
