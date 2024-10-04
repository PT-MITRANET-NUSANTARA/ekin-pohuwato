'use client';

import { Breadcrumb, Button, Card, Space, Tooltip, Typography } from 'antd';
import { DatabaseOutlined, DeleteOutlined, DotChartOutlined, EditOutlined, EyeOutlined, PieChartOutlined } from '@ant-design/icons';
import { dummyTimKerja } from '@/data';
import Link from 'next/link';
import React from 'react';
import { DataTable } from '@/components';
import { useParams, useRouter } from 'next/navigation';

const { Title } = Typography;

const page = () => {
    const loading = false;
    const router = useRouter();
    const { IdSkp } = useParams();

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
            dataIndex: 'tim_kerja',
            key: 'tim_kerja',
            sorter: (a, b) => a.tim_kerja.length - b.tim_kerja.length,
            width: '30%'
        },
        {
            title: 'Name',
            dataIndex: 'ketua_tim',
            key: 'ketua_tim',
            sorter: (a, b) => a.ketua_tim.length - b.ketua_tim.length,
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
                        color="default"
                        icon={<EyeOutlined />}
                    />

                    <Button
                        // type='primary'
                        size="middle"
                        color="danger"
                        icon={<DeleteOutlined />}
                    />

                    <Button
                        // type='primary'
                        size="middle"
                        color="danger"
                        icon={<DatabaseOutlined />}
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
                <div className="flex flex-col">
                    <div className="flex items-center justify-between mb-12">
                        <Title className="mt-2" level={5}>
                            Data Matriks Peran Hasil
                        </Title>
                        <div className="flex items-center gap-x-2">
                            <Tooltip title="BIDANG PENGADAAN, PEMBERHENTIAN DAN INFORMASI KEPEGAWAIAN">
                                <Button type="primary" icon={<DotChartOutlined />} onClick={() => router.push(`/dashboard/skp/${IdSkp}/matriks_peran_hasil/1`)}>
                                    Matriks Unit Kerja
                                </Button>
                            </Tooltip>
                            <Tooltip title="BADAN KEPEGAWAIAN DAN PENGEMBANGAN SUMBER DAYA MANUSIA">
                                <Button type="default" icon={<PieChartOutlined />}>
                                    Matriks Atasan
                                </Button>
                            </Tooltip>
                        </div>
                    </div>
                    <DataTable columns={Column} data={dummyTimKerja} loading={loading} />
                </div>
            </Card>
        </div>
    );
};

export default page;
