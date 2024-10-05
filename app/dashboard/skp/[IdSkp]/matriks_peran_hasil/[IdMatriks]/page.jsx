'use client';

import { Breadcrumb, Button, Card, Collapse, Space, Tag, Typography } from 'antd';
import { ReloadOutlined, PlusOutlined, PrinterOutlined, EditOutlined, DeleteOutlined} from '@ant-design/icons';
import Link from 'next/link';
import React, { useState } from 'react';
import { DataTable, SearchPegawai, TambahPegawai, TruncateText } from '@/components';
import { dummyIntervensiRhk } from '@/data';

const { Title } = Typography;

const page = () => {

    const loading = false;

    const [pegawaiModal, setPegawaiModal] = useState(false)

    const Column = [
        {
            title: 'ID',
            dataIndex: '_id',
            key: '_id',
            sorter: (a, b) => a._id.length - b._id.length,
            width: '10%'
        },
        {
            title: 'Name',
            dataIndex: 'nama_rhk',
            key: 'nama_rhk',
            sorter: (a, b) => a.nama_rhk.length - b.nama_rhk.length,
            width: '30%'
        },
        {
            title: 'Name',
            dataIndex: 'intervensi',
            key: 'intervensi',
            sorter: (a, b) => a.intervensi.length - b.intervensi.length,
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
                        icon={<EditOutlined />}
                    />
                    

                    <Button
                        // type='primary'
                        size="middle"
                        color="danger"
                        icon={<DeleteOutlined />}
                    />

                 
                </Space>
            )
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
                <div className="flex items-center justify-between mb-6">
                    <Title className="mt-2" level={5}>
                        Data Matriks SKP
                    </Title>
                    <div className="flex items-center gap-x-2">
                        <Button type="primary" icon={<ReloadOutlined />}>
                            Sinkronisasi SKP Bawahan
                        </Button>
                        <Button type="default" icon={<PlusOutlined />} onClick={() => setPegawaiModal(true)}>
                            Tambah Pegawai
                        </Button>
                        <Button type="default" icon={<PrinterOutlined />}>
                            Cetak
                        </Button>
                    </div>
                </div>
                <div className="grid grid-flow-row divide-y text-xs mb-12">
                    <div className="flex items-center justify-between py-2">
                        <span className="uppercase font-semibold">unit kerja</span>
                        <p className="text-right uppercase">Tahun 2024</p>
                    </div>
                    <div className="flex items-center justify-between py-2">
                        <span className="uppercase font-semibold">status pegawai</span>
                        <p className="text-right uppercase">BIDANG PENGADAAN, PEMBERHENTIAN DAN INFORMASI KEPEGAWAIAN </p>
                    </div>
                </div>
                {/* <table className="normaltable">
                    <thead>
                        <tr>
                            <th className="uppercase">syaiful luma</th>
                            <th>
                                <TruncateText maxLength={50}>
                                    In the process of internal desktop applications development, many different design specs and implementations would be involved, which might cause designers and developers difficulties and duplication and reduce the
                                    efficiency of development.
                                </TruncateText>
                            </th>
                            <th>
                                <TruncateText maxLength={50}>
                                    In the process of internal desktop applications development, many different design specs and implementations would be involved, which might cause designers and developers difficulties and duplication and reduce the
                                    efficiency of development.
                                </TruncateText>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{ maxWidth: '12rem', padding: '12px', border: '1px solid black' }}>
                                <div className="flex flex-col gap-y-1">
                                    <b>YAHYA S MALABAR NOOR</b>
                                    <p>PRANATA KEARSIPAN</p>
                                    <small>197801012007011026</small>
                                    <Tag color="blue" className="w-fit mt-1">
                                        2024-01-01 s/d 2024-12-31
                                    </Tag>
                                    <Button className="w-fit" type="primary">
                                        Lihat SKP
                                    </Button>
                                    <Button className="w-fit" type="primary">
                                        Tambah RHK
                                    </Button>
                                    <Button danger className="w-fit" type="primary">
                                        Hapus
                                    </Button>
                                </div>
                            </td>
                            <td style={{ maxWidth: '12rem', padding: '12px', border: '1px solid black' }}>-</td>
                            <td style={{ maxWidth: '12rem', padding: '12px', border: '1px solid black' }}>
                                <div className="flex flex-col gap-y-1">
                                    <ul className='list-disc list-inside'>
                                        <li>Tersedianya Dokumen Perencanaan Pelaksanaan Program dan Kegiatan Pengolahan Data dan Informasi Kepegawaian</li>
                                        <li>Tersedianya Dokumen Perencanaan Pelaksanaan Program dan Kegiatan Pengolahan Data dan Informasi Kepegawaian</li>
                                        <li>Tersedianya Dokumen Perencanaan Pelaksanaan Program dan Kegiatan Pengolahan Data dan Informasi Kepegawaian</li>
                                    </ul>
                                    <Button className="w-fit" type="primary">
                                        Edit
                                    </Button>
                                    <Button danger className="w-fit" type="primary">
                                        Hapus
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table> */}
                <div className="w-full flex flex-col gap-y-4">
                    <Card type="inner" title="taruh title disini">
                        <div className="grid grid-flow-row divide-y text-xs ">
                            <div className="flex items-center justify-between py-2">
                                <span className="uppercase font-semibold">nama</span>
                                <p className="text-right uppercase">YAHYA S MALABAR NOOR</p>
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <span className="uppercase font-semibold">jabatan</span>
                                <div className="flex flex-col gap-y-2 text-right items-end">
                                    <p>PRANATA KEARSIPAN</p>
                                    <small>ID : 197801012007011026</small>
                                </div>
                            </div>
                            <div className="flex flex-col gap-y-4 py-2 pt-4">
                                <div className="flex items-center gap-x-2">
                                    <Button className="w-fit" type="primary">
                                        Buat SKP
                                    </Button>
                                </div>
                                <Collapse  bordered>
                                    <Collapse.Panel key="1" header="RHK Yang di Intervensi">
                                        <DataTable columns={Column} data={[]} loading={false} />
                                    </Collapse.Panel>
                                </Collapse>
                            </div>
                        </div>
                    </Card>
                    <Card type="inner" title="taruh title disini">
                        <div className="grid grid-flow-row divide-y text-xs ">
                            <div className="flex items-center justify-between py-2">
                                <span className="uppercase font-semibold">nama</span>
                                <p className="text-right uppercase">YAHYA S MALABAR NOOR</p>
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <span className="uppercase font-semibold">jabatan</span>
                                <div className="flex flex-col gap-y-2 text-right items-end">
                                    <p>PRANATA KEARSIPAN</p>
                                    <small>ID : 197801012007011026</small>
                                </div>
                            </div>
                            <div className="flex flex-col gap-y-4 py-2 pt-4">
                                <div className="flex items-center gap-x-2">
                                    <Button className="w-fit" type="primary">
                                        Lihat SKP
                                    </Button>
                                    <Button className="w-fit" type="primary">
                                        Tambah RHK
                                    </Button>
                                    <Button danger className="w-fit" type="primary">
                                        Hapus
                                    </Button>
                                </div>
                                <Collapse bordered>
                                    <Collapse.Panel key="1" header="RHK Yang di Intervensi">
                                        <DataTable columns={Column} data={dummyIntervensiRhk} loading={false} />
                                    </Collapse.Panel>
                                </Collapse>
                            </div>
                        </div>
                    </Card>
                </div>
            </Card>
            <TambahPegawai isModalOpen={pegawaiModal} onCancel={() => setPegawaiModal(false)} onClose={() => setPegawaiModal(false)}/>
        </div>
    );
};

export default page;
