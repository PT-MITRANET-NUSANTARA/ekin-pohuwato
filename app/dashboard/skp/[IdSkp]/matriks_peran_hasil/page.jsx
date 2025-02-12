'use client';

import { Breadcrumb, Button, Card, Space, Tag, Tooltip, Typography } from 'antd';
import { DatabaseOutlined, DeleteOutlined, DotChartOutlined, EditOutlined, EyeOutlined, PieChartOutlined, ReloadOutlined } from '@ant-design/icons';
import { dummyTimKerja } from '@/data';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { DataTable } from '@/components';
import { useParams, useRouter } from 'next/navigation';
import useFetchData from '@/hooks/useFetchData';
import { getData } from '@/controller/AuthorizationController';
import { getAllPosjabByUnit, getByNIP } from '@/controller/IDSN/JabatanController';
import { getBySKPId } from '@/controller/SKPController';
import { renderStatusTag } from '@/utils';

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
            title: 'NIP',
            dataIndex: 'user_id',
            key: 'name',
        },
        {
            title: 'Nama',
            dataIndex: 'name',
            key: 'name',
            render: (_, record) => {
                const lastJabatan = record.jabatan?.[record.jabatan.length - 1];
                return lastJabatan ? lastJabatan.nama_asn : 'No Jabatan';
            }
        },
        {
            title: 'Nama Unit Kerja',
            dataIndex: 'unor',
            key: 'unor',
            render: (_, record) => {
                const lastJabatan = record.jabatan?.[record.jabatan.length - 1];
                return lastJabatan ? lastJabatan.unor?.nama : 'No Organisasi';
            }
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (_, record) => (
                <>
                    {renderStatusTag(record.status)}
                </>
            )
        },
    ];

    return (
        <div className="w-full flex flex-col gap-y-4">

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
                            <Tooltip title="Refresh Data">
                                <Button icon={<ReloadOutlined />} onClick={() => fetchData()} />
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
