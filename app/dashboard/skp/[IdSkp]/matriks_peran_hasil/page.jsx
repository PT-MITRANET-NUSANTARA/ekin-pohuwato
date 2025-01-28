'use client';

import { Breadcrumb, Button, Card, Space, Tooltip, Typography } from 'antd';
import { DatabaseOutlined, DeleteOutlined, DotChartOutlined, EditOutlined, EyeOutlined, PieChartOutlined } from '@ant-design/icons';
import { dummyTimKerja } from '@/data';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { DataTable } from '@/components';
import { useParams, useRouter } from 'next/navigation';
import useFetchData from '@/hooks/useFetchData';
import { getData } from '@/controller/AuthorizationController';
import { getAllPosjabByUnit, getByNIP } from '@/controller/IDSN/JabatanController';

const { Title } = Typography;

const page = () => {
    const router = useRouter();
    const { IdSkp } = useParams();
    const { data: user, setData: setUser } = useFetchData(getData);
    const [jabatan, setJabatan] = useState(null);
    const [unor, setUnor] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchData();
        }
    }, [user]);

    const fetchData = async () => {
        try {
            const selectedJabatan = user.jabatan;
            console.log(selectedJabatan);
            
            const unit = await getAllPosjabByUnit(user.token, selectedJabatan.unor.induk.id);
            const bawahan = unit.mapData.data.filter((item) => (item.unor.id == selectedJabatan.unor.id && item.nama_jabatan !== selectedJabatan.nama_jabatan) || item.unor.atasan?.unor_id === selectedJabatan.unor.id);

            setJabatan(selectedJabatan);
            setUnor(bawahan);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };
    console.log(unor);

    const Column = [
        {
            title: 'No',
            dataIndex: 'index',
            render: (text, record, index) => index + 1,
            width: '5%'
        },
        {
            title: 'Name',
            dataIndex: 'nama_asn',
            key: 'nama_asn',
            sorter: (a, b) => a.nama_asn.length - b.nama_asn.length
        },
        {
            title: 'Unit Kerja',
            dataIndex: 'unit',
            key: 'unit',
            render: (_, record) => (record.unor && record.unor.nama ? record.unor.nama : 'No Unit')
        },

        {
            title: 'Jabatan',
            dataIndex: 'nama_jabatan',
            key: 'nama_jabatan',
            sorter: (a, b) => a.nama_jabatan.length - b.nama_jabatan.length,
            width: '30%'
        }
        // {
        //     title: 'Action',
        //     key: 'action',
        //     render: (_, record) => (
        //         <Space size="small">
        //             <Button
        //                 // type='primary'
        //                 size="middle"
        //                 icon={<EditOutlined />}
        //             />
        //             <Button
        //                 // type='primary'
        //                 size="middle"
        //                 color="default"
        //                 icon={<EyeOutlined />}
        //             />

        //             <Button
        //                 // type='primary'
        //                 size="middle"
        //                 color="danger"
        //                 icon={<DeleteOutlined />}
        //             />

        //             <Button
        //                 // type='primary'
        //                 size="middle"
        //                 color="danger"
        //                 icon={<DatabaseOutlined />}
        //             />
        //         </Space>
        //     )
        // }
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
                                <Button type="primary" icon={<DotChartOutlined />} onClick={() => router.push(`/dashboard/skp/${IdSkp}/matriks_peran_hasil/${IdSkp}`)}>
                                    Matriks Unit Kerja
                                </Button>
                            </Tooltip>
                        </div>
                    </div>
                    <DataTable columns={Column} data={unor} loading={loading} />
                </div>
            </Card>
        </div>
    );
};

export default page;
