'use client';

import { Alert, Breadcrumb, Button, Card, Space, Typography, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { DataTable, CrudModal, FilterField, DataLoading } from '@/components';
import React, { useEffect, useState } from 'react';
import { dummyVerifikator } from '@/data/dummyData';
import { store, update, destroy, getAll as getAllVerifikasi, getById } from '@/controller/VerifikasiController';
import { getAll } from '@/controller/IDSN/UnitController';
import { getAllPosjabByUnit } from '@/controller/IDSN/JabatanController';

import Link from 'next/link';
import useFetchData from '@/hooks/useFetchData';
import { getData } from '@/controller/AuthorizationController';
import { useParams } from 'next/navigation';

const { Title } = Typography;

const page = () => {
    const { Id } = useParams();
    const [modal, setModal] = useState({ trigger: false, modalData: null, title: '' });
    const [alert, setAlert] = useState({ show: false, message: null, description: null, type: 'info' });
    const [unit, setUnit] = useState(null);
    const [jabatan, setJabatan] = useState(null);
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
            const data = await getById(Id);
            console.log(data);
            setData(data.data);
            const unit = await getAll(user.token);
            const jabatan = await getAllPosjabByUnit(user.token, data.data.unit.id_sapk);
            const jabatan_nama = jabatan.mapData.data
                .map(({ nama_jabatan }) => ({
                    label: nama_jabatan,
                    value: nama_jabatan
                }))
                .filter((item, index, self) => index === self.findIndex((t) => t.value === item.value));
            setJabatan(jabatan_nama);
            console.log(jabatan_nama);

            setUnit(unit.mapData);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    console.log(data);

    const onSubmit = async (values, type, id, _, _i, dt) => {
        try {
            setSubmitLoading(true);
            let response;
            switch (type) {
                case 'create':
                    const isDuplicate = (data.jabatan || []).some((j) => j.name === values.jabatan);
                    if (isDuplicate) {
                        setAlert({
                            show: true,
                            message: 'Gagal',
                            description: 'Jabatan Sudah Ada',
                            type: 'error'
                        });
                        handleClose();
                        return;
                    }
                    response = await update(data._id, {
                        ...data,
                        jabatan: [
                            ...(data.jabatan || []),
                            {
                                name: values.jabatan,
                                unit: []
                            }
                        ]
                    });
                    break;

                case 'edit':
                    const result = values.unit.map((item) => {
                        // Cari unit yang memiliki id_sapk yang sama dengan item
                        return unit.find((unit) => unit.id_sapk === item);
                    });
                    

                    console.log(result);
                    

                    const tmp = {
                        ...data,
                        jabatan: data.jabatan.map(
                            (j) =>
                                j.name === dt.name
                                    ? { ...j, name: dt.name, unit: result } // Overwrite name dan unit jika cocok
                                    : j // Biarkan data lama jika tidak cocok
                        )
                    };
                    console.log(tmp);

                    response = await update(data._id, tmp);

                    break;

                case 'delete':
                    response = await destroy(id);
                    break;

                default:
                    throw new Error('Tipe operasi tidak valid');
            }
            console.log(response);

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
            title: 'Jabatan',
            dataIndex: 'nama_unor',
            key: 'nama_unor',
            searchable: true,
            render: (_, record) => record.name
        },

        {
            title: 'Unit',
            dataIndex: 'nama_unor',
            key: 'nama_unor',
            searchable: true,
            render: (_, record) => {
                return record.unit?.map((item) => (
                    <Tag key={item.id_sapk} color="blue">
                        {item.nama_unor}
                    </Tag>
                ));
            }
        },

        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="small">
                    <Button
                        color="primary"
                        variant="outlined"
                        onClick={async () => {
                            setModal({
                                trigger: true,
                                modalData: {
                                    ...record,
                                    unit: record.unit.map((item) => item.id_sapk)
                                },
                                title: `Edit Admin ${record.name}`,
                                formFields: editField,
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
            label: 'Jabatan',
            name: 'jabatan',
            type: 'select',
            rules: [
                {
                    required: true,
                    message: 'Field role wajib di isi'
                }
            ],
            options: jabatan
        }
    ];

    const editField = [
        {
            label: 'Unit',
            name: 'unit',
            type: 'select',
            rules: [
                {
                    required: true,
                    message: 'Field misi wajib di isi'
                }
            ],
            options: unit?.map((item) => ({
                label: item.nama_unor,
                value: item.id_sapk
            })),
            mode: 'multiple'
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
                                Data Admin Verifikator {data?.unit.nama_unor}
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
                            <DataTable columns={Column} data={data.jabatan} loading={loading} />
                        </div>
                        <CrudModal title={modal.title} isModalOpen={modal.trigger} data={modal.modalData} onSubmit={onSubmit} onClose={handleClose} formFields={modal.formFields} type={modal.type} />
                    </div>
                </Card>
            )}
        </div>
    );
};

export default page;
