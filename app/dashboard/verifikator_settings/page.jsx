'use client';

import { Alert, Breadcrumb, Button, Card, Space, Typography, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { DataTable, CrudModal, FilterField, DataLoading } from '@/components';
import React, { useEffect, useState } from 'react';
import { dummyVerifikator } from '@/data/dummyData';
import { store, update, getAll as getAllVerifikasi } from '@/controller/VerifikasiController';
import { getAll } from '@/controller/IDSN/UnitController';
import { getAllPosjabByUnit } from '@/controller/IDSN/JabatanController';

import Link from 'next/link';
import useFetchData from '@/hooks/useFetchData';
import { getData } from '@/controller/AuthorizationController';

const { Title } = Typography;

const page = () => {
    const { data, setData, loading, msg, status } = useFetchData(getData);

    const [modal, setModal] = useState({ trigger: false, modalData: null, title: '' });
    const [alert, setAlert] = useState({ show: false, message: null, description: null, type: 'info' });
    const [unit, setUnit] = useState(null);
    const [selectedUnit, setSelectedUnit] = useState(null);
    const [selectedUnor, setSelectedUnor] = useState(null);
    const [Verifikasi, setVerifikasi] = useState([]);

    useEffect(() => {
        if (data) {
            fetchData();
        }
    }, [data]);

    const fetchData = async () => {
        try {
            const unit = await getAll(data.token);
            const verifikasi = await getAllVerifikasi(0, 0);
            setVerifikasi(verifikasi.data);
            setUnit(unit.mapData);
        } catch (error) {
            console.log(error);
        }
    };


    console.log(unit);


    const onSubmit = async (values, type, id) => {
        try {
            let response;
            console.log(values);
            console.log(id);
            const dt = {
                unit: selectedUnor,
                jabatan: values
            };

            switch (type) {
                case 'edit':
                    response = await update(selectedUnor.id_sapk, dt);
                    if ((response.status = 404)) {
                        response = await store(dt);
                    }
                    break;
                default:
                    throw new Error('Tipe operasi tidak valid');
            }

            if (response.ok) {
                const unit = await getAll(data.token);
                const verifikasi = await getAllVerifikasi(0, 0);
                setVerifikasi(verifikasi.data);
                setUnit(unit.mapData);
                setAlert({
                    show: true,
                    message: response.msg,
                    description: type === 'delete' ? 'Berhasil Menghapus Renstra' : type === 'edit' ? 'Berhasil Mengedit Renstra' : 'Berhasil Menambahkan Renstra',
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

        console.log('Operation completed');
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
            title: 'Unit',
            dataIndex: 'nama_unor',
            key: 'nama_unor',
            searchable: true
        },
        {
            title: 'Jabatan',
            dataIndex: 'jabatan',
            key: 'jabatan',
            render: (_, record) => {
                const matchingItem = Verifikasi?.find((item) => item.unit.id_sapk === record.id_sapk);

                if (matchingItem) {
                    return (
                        <Tag color="blue" className="capitalize">
                            {matchingItem.jabatan.role}
                        </Tag>
                    );
                } else {
                    return <Tag color="red">Belum Memilih Jabatan</Tag>;
                }
            },
            searchable: true
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="small">
                    <Button
                        color='primary'
                        variant='outlined'
                        onClick={async () => {
                            const jabatan = await getAllPosjabByUnit(data.token, record.id_sapk);
                            const jabatan_nama = jabatan.mapData.data
                                .map(({ nama_jabatan }) => ({
                                    label: nama_jabatan,
                                    value: nama_jabatan
                                }))
                                .filter((item, index, self) => index === self.findIndex((t) => t.value === item.value));
                            setSelectedUnor(record);
                            setSelectedUnit(jabatan_nama);
                            setModal({
                                trigger: true,
                                modalData: record,
                                title: `Edit Admin ${record._id}`,
                                type: 'edit'
                            });
                        }}
                        size="middle"
                        icon={<EditOutlined />}
                    />
                </Space>
            )
        }
    ];

    const formFields = [
        {
            label: 'Nama Unor',
            name: 'name',
            type: 'text',
            rules: [
                {
                    required: true,
                    message: 'Field name wajib di isi'
                }
            ],
        },
        {
            label: 'Jabatan',
            name: 'role',
            type: 'select',
            rules: [
                {
                    required: true,
                    message: 'Field role wajib di isi'
                }
            ],
            options: [
                {
                    label: "texas",
                    value: 'texas'
                },
                {
                    label: "manhattan",
                    value: 'manhattan'
                }
            ],
            mode: 'multiple',
        },

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
                            <DataTable columns={Column} data={unit} loading={loading} />
                        </div>
                        <CrudModal title={modal.title} isModalOpen={modal.trigger} data={modal.modalData} onSubmit={onSubmit} onClose={handleClose} formFields={formFields} type={modal.type} />
                    </div>
                </Card>
            )}
        </div>
    );
};

export default page;
