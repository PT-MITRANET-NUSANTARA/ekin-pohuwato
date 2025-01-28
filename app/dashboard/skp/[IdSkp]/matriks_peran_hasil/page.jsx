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
import { getBySKPId } from '@/controller/SKPController';

const { Title } = Typography;

const page = () => {
    const router = useRouter();
    const { IdSkp } = useParams();
    const { data: user, setData: setUser } = useFetchData(getData);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, filters: {}, total: 0 });
    const [data, setData] = useState([]);

    useEffect(() => {
        if (user) {
            fetchData();
        }
    }, [user]);

    const fetchData = async () => {
        try {
            const data = await getBySKPId(IdSkp, pagination.page, pagination.limit, pagination.filters);
            setData(data.data.data);
            setPagination({ ...pagination, page: data.data.pagination.currentPage, limit: data.data.pagination.pageSize, total: data.data.pagination.totalItems });
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

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
                    <DataTable columns={Column} data={data} loading={loading} />
                </div>
            </Card>
        </div>
    );
};

export default page;
