'use client';

import { Alert, Breadcrumb, Button, Card, message, Space, Table, Tag, Typography } from 'antd';
import { PlusOutlined, EditOutlined, EyeOutlined, DeleteOutlined, DatabaseOutlined, ReloadOutlined } from '@ant-design/icons';
import { DataTable, CrudModal, FilterField, DataLoading } from '@/components';
import React, { useEffect, useState } from 'react';
import { destroy, getAll, store, update, getByUserId } from '@/controller/AbsenceController';
import useFetchData from '@/hooks/useFetchData';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { dummyHarian } from '@/data/dummyData';
import { dateFormatter } from '@/utils';
import { getData } from '@/controller/AuthorizationController';
import dayjs from 'dayjs';

const { Title } = Typography;

const page = () => {
    const router = useRouter();
    const [modal, setModal] = useState({ trigger: false, modalData: null, title: '' });
    const [alert, setAlert] = useState({ show: false, message: null, description: null, type: 'info' });
    const [absence, setAbsence] = useState(null);
    const [loading, setLoading] = useState(false);
    const { data: user, setData: setUser } = useFetchData(getData);
    const [data, setData] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, filters: {}, total: 0 });
    useEffect(() => {
        if (user) {
            fetchData();
        }
    }, [user, pagination.page, pagination.limit]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const data = await getByUserId(user.user.nipBaru, pagination.page, pagination.limit, pagination.filters);
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
            title: 'Tanggal',
            dataIndex: 'date',
            key: 'date',
            render: (record) => dateFormatter(record)
        },
        {
            title: 'Status Kehadiran',
            dataIndex: 'status',
            key: 'status',
            render: (_, { status }) => (
                <>
                    {(() => {
                        switch (status) {
                            case 'Hadir':
                                return (
                                    <Tag color="blue" className="capitalize">
                                        {status}
                                    </Tag>
                                );
                            case 'Dinas diluar':
                                return (
                                    <Tag color="green" className="capitalize">
                                        {status}
                                    </Tag>
                                );
                            case 'Izin':
                                return (
                                    <Tag color="yellow" className="capitalize">
                                        {status}
                                    </Tag>
                                );

                            case 'Sakit':
                                return (
                                    <Tag color="orange" className="capitalize">
                                        {status}
                                    </Tag>
                                );
                            case 'Tanpa Keterangan':
                                return (
                                    <Tag color="red" className="capitalize">
                                        {status}
                                    </Tag>
                                );
                            default:
                                return (
                                    <Tag color="error" className="capitalize">
                                        undefined
                                    </Tag>
                                );
                        }
                    })()}
                </>
            ),
            searchable: true
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => {
                const query = new URLSearchParams(record).toString();
                return (
                    <Space size="small">
                        <Button
                            // onClick={() => router.push(`/dashboard/harians/${record._id}/aktivitas?${query}`)}
                            onClick={() => router.push(`/dashboard/harians/${record._id}/aktivitas`)}

                            // type='primary'
                            size="middle"
                            variant="outlined"
                        >
                            Detail
                        </Button>
                    </Space>
                );
            }
        }
    ];

    const onFilter = async (values) => {
        filterFileds.forEach((field) => {
            let value = values[field.name];
            if (value !== undefined && value !== null) {
                switch (field.type) {
                    case 'date':
                        value = dateFormatter(value);
                        break;

                    default:
                        value = value;
                        break;
                }

                switch (field.filter) {
                    case 'gte':
                        pagination.filters[field.name] = { $gte: value };
                        break;
                    case 'lte':
                        pagination.filters[field.name] = { $lte: value };
                        break;
                    case 'gt':
                        pagination.filters[field.name] = { $gt: value };
                        break;
                    case 'lt':
                        pagination.filters[field.name] = { $lt: value };
                        break;
                    case 'eq':
                        pagination.filters[field.name] = value; // Equality
                        break;
                    case 'ne':
                        pagination.filters[field.name] = { $ne: value };
                        break;
                    case 'in':
                        pagination.filters[field.name] = { $in: Array.isArray(value) ? value : [value] };
                        break;
                    case 'nin':
                        pagination.filters[field.name] = { $nin: Array.isArray(value) ? value : [value] };
                        break;
                    case 'regex':
                        pagination.filters[field.name] = { $regex: value, $options: 'i' }; // Case-insensitive regex
                        break;
                    case 'exists':
                        pagination.filters[field.name] = { $exists: Boolean(value) };
                        break;
                    default:
                        console.warn(`Unsupported filter type: ${field.filter}`);
                }
            } else {
                if (pagination.filters.hasOwnProperty(field.name)) {
                    delete pagination.filters[field.name];
                }
            }
        });
        fetchData();
    };

    const filterFileds = [
        {
            label: 'Status',
            name: 'status',
            type: 'select',
            filter: 'eq',
            options: [
                {
                    label: 'Hadir',
                    value: 'Hadir'
                },
                {
                    label: 'Izin',
                    value: 'Sakit'
                },
                {
                    label: 'Sakit',
                    value: 'Izin'
                },
                {
                    label: 'Alpha',
                    value: 'Alpha'
                }
            ]
        }
    ];

    const handleClose = () => {
        setModal({ trigger: false, modalData: null });
    };

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
                                Data Harian
                            </Title>
                        </div>
                        <div className="w-full">
                            <FilterField fields={filterFileds} onSubmit={onFilter}></FilterField>
                        </div>
                        <div className="overflow-x-auto">
                            <DataTable columns={Column} data={data} loading={loading} />
                        </div>
                    </div>
                </Card>
            )}
        </div>
    );
};

export default page;
