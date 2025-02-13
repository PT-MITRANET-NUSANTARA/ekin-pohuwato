'use client';

import { Alert, Breadcrumb, Button, Card, Space, Table, Tag, Tooltip, Typography } from 'antd';
import { PlusOutlined, EditOutlined, EyeOutlined, DeleteOutlined, DatabaseOutlined, ReloadOutlined } from '@ant-design/icons';
import { DataTable, CrudModal, DataLoading } from '@/components';
import React, { useEffect, useState } from 'react';
import useFetchData from '@/hooks/useFetchData';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { dummyBawahan } from '@/data/dummyData';
import { getBySKP, getBySKPId } from '@/controller/SKPController';
import { getData } from '@/controller/AuthorizationController';

const { Title } = Typography;

const page = () => {
    const router = useRouter();
    const { IdSkp, IdOrganisasi, IdTanggal } = useParams();
    const [modal, setModal] = useState({ trigger: false, modalData: null, title: '' });
    const [alert, setAlert] = useState({ show: false, message: null, description: null, type: 'info' });
    const [dataBawahan, setDataBawahan] = useState([]);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const { data: user, setData: setUser } = useFetchData(getData);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, filters: {}, total: 0 });
    useEffect(() => {
        if (user) {
            fetchData();
        }
    }, [user, pagination.page, pagination.limit]);

    const fetchData = async () => {
        try {
            const data = await getBySKPId(IdSkp, pagination.page, pagination.limit, {
                ...pagination.filters,
                status: { $in: ['approved',] }
            });
            setData(data.data.data);
            setPagination({ ...pagination, page: data.data.pagination.currentPage, limit: data.data.pagination.pageSize, total: data.data.pagination.totalItems });
            setLoading(false);
        } catch (error) {
            console.log(error);
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
            dataIndex: 'name',
            key: 'name',
            searchable: true,
            render: (_, record) => {
                const lastJabatan = record.jabatan?.[record.jabatan.length - 1];
                return lastJabatan ? lastJabatan.nip_asn : 'No Jabatan';
            }
        },
        {
            title: 'Nama',
            dataIndex: 'name',
            key: 'name',
            searchable: true,
            render: (_, record) => {
                const lastJabatan = record.jabatan?.[record.jabatan.length - 1];
                return lastJabatan ? lastJabatan.nama_asn : 'No Jabatan';
            }
        },
        {
            title: 'Unit',
            dataIndex: 'unor',
            key: 'unor',
            searchable: true,
            render: (_, record) => {
                const lastJabatan = record.jabatan?.[record.jabatan.length - 1];
                return lastJabatan ? lastJabatan.unor?.nama : 'No Organisasi';
            }
        },
        {
            title: 'Jabatan',
            dataIndex: 'jabatan',
            key: 'jabatan',
            searchable: true,
            render: (_, record) => {
                const lastJabatan = record.jabatan?.[record.jabatan.length - 1];
                return lastJabatan ? lastJabatan.nama_jabatan : 'No Jabatan';
            }
        },

        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="small">
                    <Button
                        onClick={() => router.push(`/dashboard/skp/${IdSkp}/monitoring_kinerja/${record._id}/harian`)}
                        // type='primary'
                        size="middle"
                    >
                        Detail
                    </Button>
                </Space>
            )
        }
    ];

    return (
        <div className="w-full flex flex-col gap-y-4">
            {alert.show !== false && <Alert message={alert.message} description={alert.description} type={alert.type} showIcon closable />}

            {loading ? (
                <DataLoading loadingData={loading} />
            ) : (
                <Card className="">
                    <div className="flex flex-col">
                        <div className="flex items-center justify-between mb-12">
                            <Title className="mt-2" level={5}>
                                Bawahan Monitoring Kinerja
                            </Title>
                            <div>
                                <Tooltip title="Refresh Data">
                                    <Button icon={<ReloadOutlined />} onClick={() => fetchData()} />
                                </Tooltip>
                            </div>
                        </div>
                        <DataTable columns={Column} data={data} loading={loading} />
                    </div>
                </Card>
            )}
        </div>
    );
};

export default page;
