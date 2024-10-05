'use client';

import { DataTable } from '@/components';
import { Breadcrumb, Button, Card, Space, Tag, Typography } from 'antd';
import { EditOutlined, EyeOutlined } from '@ant-design/icons';
import Link from 'next/link';
import React from 'react';
import { dummySkpBawahan } from '@/data/dummyData';

const { Title } = Typography;

const page = () => {
    const Column = [
        {
            title: 'ID',
            dataIndex: '_id',
            key: '_id',
            sorter: (a, b) => a._id.length - b._id.length,
            width: '5%'
        },
        {
            title: 'Unit Kerja',
            dataIndex: 'unit_kerja',
            key: 'unit_kerja',
            sorter: (a, b) => a.unit_kerja.length - b.unit_kerja.length,
            width: '20%'
        },
        {
            title: 'NIP',
            dataIndex: 'nip',
            key: 'nip',
            sorter: (a, b) => a.nip.length - b.nip.length,
            width: '20%'
        },
        {
            title: 'Name',
            dataIndex: 'nama',
            key: 'nama',
            sorter: (a, b) => a.nama.length - b.nama.length,
            width: '20%',
            searchable: true
        },
        {
            title: 'Jabatan',
            dataIndex: 'jabatan',
            key: 'jabatan',
            sorter: (a, b) => a.jabatan.length - b.jabatan.length,
            width: '30%'
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            sorter: (a, b) => a.status.length - b.status.length,
            width: '30%',
            render: (_, { status }) => (
                <>
                    {(() => {
                        switch (status) {
                            case 'draft':
                                return <Tag color="blue" className='capitalize'>{status}</Tag>;
                            case 'belum':
                                return <Tag color="red" className='capitalize'>{status}</Tag>;
                            case 'pengajuan':
                                return <Tag color="yellow" className='capitalize'>{status}</Tag>;
                            default:
                                return <Tag color="error" className='capitalize'>{status}</Tag>;
                        }
                    })()}
                </>
            ),
            searchable: true,
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="small">
                    <Button
                        // type='primary'
                        size="middle"
                        icon={<EyeOutlined />}
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
                <DataTable columns={Column} data={dummySkpBawahan} loading={false}></DataTable>
            </Card>
        </div>
    );
};

export default page;
