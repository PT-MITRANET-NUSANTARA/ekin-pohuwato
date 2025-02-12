'use client';

import { Alert, Breadcrumb, Button, Card, Space, Typography, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, EyeOutlined } from '@ant-design/icons';
import { DataTable, CrudModal, FilterField, DataLoading } from '@/components';
import React, { useEffect, useState } from 'react';
import { dummyVerifikator } from '@/data/dummyData';
import { store, update, destroy, getAll as getAllVerifikasi } from '@/controller/VerifikasiController';
import { getAll } from '@/controller/IDSN/UnitController';
import { getAllPosjabByUnit } from '@/controller/IDSN/JabatanController';

import Link from 'next/link';
import useFetchData from '@/hooks/useFetchData';
import { getData } from '@/controller/AuthorizationController';
import { useRouter } from 'next/navigation';

const { Title } = Typography;

const page = () => {
    const router = useRouter();
    const [modal, setModal] = useState({ trigger: false, modalData: null, title: '' });
    const [alert, setAlert] = useState({ show: false, message: null, description: null, type: 'info' });
    const [unit, setUnit] = useState(null);
    const [selectedUnit, setSelectedUnit] = useState(null);
    const [selectedUnor, setSelectedUnor] = useState(null);
    const [loading, setLoading] = useState(true);

    const { data: user, setData: setUser } = useFetchData(getData);
    const [data, setData] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, filters: {}, total: 0 });
    const [submitLoading, setSubmitLoading] = useState(false);

    useEffect(() => {
        if (user) {
            fetchData();
        }
    }, [user, pagination.page, pagination.limit]);

    const fetchData = async () => {
        try {
            const data = await getAllVerifikasi(pagination.page, pagination.limit, pagination.filters);

            setData(data.data.data);
            const unit = await getAll(user.token);
            setPagination({ ...pagination, page: data.data.pagination.currentPage, limit: data.data.pagination.pageSize, total: data.data.pagination.totalItems });
            setUnit(unit.mapData);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };


    const onSubmit = async (values, type, id) => {
        try {
            setSubmitLoading(true);
            let response;
            const dt = {
                unit: unit.find((item) => item.id_sapk == values.unit)
            };
            switch (type) {
                case 'create':
                    response = await store({ ...dt, jabatan: [] });
                    break;

                case 'edit':
                    response = await update(id, dt);
                    break;

                case 'delete':
                    response = await destroy(id);
                    break;

                default:
                    throw new Error('Tipe operasi tidak valid');
            }

            if (response.ok) {
                fetchData();
                setAlert({
                    show: true,
                    message: response.msg,
                    description: type === 'delete' ? 'Berhasil Menghapus Misi' : type === 'edit' ? 'Berhasil Mengedit Misi' : 'Berhasil Menambahkan Misi',
                    type: 'success'
                });
            } else {
                setAlert({
                    show: true,
                    message: 'Gagal',
                    description: response.msg,
                    type: 'error'
                });
            }
        } catch (error) {
            setAlert({
                show: true,
                message: 'Error',
                description: error.message,
                type: 'error'
            });
        }
        setSubmitLoading(false);

        handleClose();
    };

    const Column = [
        {
            title: 'No',
            dataIndex: 'index',
            render: (text, record, index) => index + 1,
            width: '5%'
        },
        {
            title: 'ID Unit',
            dataIndex: 'id_unor',
            key: 'id_unor',
            searchable: true,
            render: (_, record) => record.unit.id_sapk
        },
        {
            title: 'Nama Unit',
            dataIndex: 'nama_unor',
            key: 'nama_unor',
            searchable: true,
            render: (_, record) => record.unit.nama_unor
        },

        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="small">
                    <Button
                        onClick={() =>
                            setModal({
                                trigger: true,
                                modalData: {
                                    ...record
                                },
                                title: `Edit verifikasi ${record._id}`,
                                type: 'delete'
                            })
                        }
                        // type='primary'
                        size="middle"
                        danger
                        icon={<DeleteOutlined />}
                    />

                    <Button onClick={() => router.push(window.location.pathname + `/${record._id}`)} size="middle" color="danger">
                        Detail
                    </Button>
                </Space>
            )
        }
    ];

    const formFields = [
        {
            label: 'Unit Organisasi',
            name: 'unit',
            type: 'select',
            rules: [
                {
                    required: true,
                    message: 'Field role wajib di isi'
                }
            ],
            options: unit?.map((item) => ({
                label: item.nama_unor,
                value: item.id_sapk
            }))
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
                    label: 'sample',
                    value: 'sample'
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
                                Data Admin Verifikator
                            </Title>
                            <div>
                                <Button loading={loading} type="primary" icon={<PlusOutlined />} onClick={() => setModal({ modalData: null, title: 'Tambah Data', trigger: true, type: 'create', formFields: formFields })}>
                                    Tambah
                                </Button>
                            </div>
                        </div>
                        <div className="w-full mb-4">
                            <FilterField fields={filterFileds} onSubmit={onFilter}></FilterField>
                        </div>
                        <div className="overflow-x-auto">
                            <DataTable columns={Column} data={data} loading={loading} />
                        </div>
                        <CrudModal title={modal.title} isModalOpen={modal.trigger} data={modal.modalData} onSubmit={onSubmit} onClose={handleClose} formFields={formFields} type={modal.type} />
                    </div>
                </Card>
            )}
        </div>
    );
};

export default page;
