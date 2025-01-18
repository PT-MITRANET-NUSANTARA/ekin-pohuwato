'use client';

import { Alert, Breadcrumb, Button, Card, List, Modal, Progress, Space, Table, Typography } from 'antd';
import { PlusOutlined, EditOutlined, EyeOutlined, DeleteOutlined, DatabaseOutlined, SearchOutlined } from '@ant-design/icons';
import { DataTable, CrudModal, DataLoading, FilterField, InfoModal } from '@/components';
import React, { useEffect, useState } from 'react';
import { destroy, getAll, store, update } from '@/controller/RenstraController';
import useFetchData from '@/hooks/useFetchData';
import { dummyRenstra } from '@/data';
import { useRouter } from 'next/navigation';
import { getAll as getAllMisi } from '@/controller/MisiController';
import { getAll as getAllPeriode } from '@/controller/PeriodeController';

import Link from 'next/link';
import { dateFormatter } from '@/utils';

const { Title } = Typography;
const page = () => {
    const router = useRouter();
    const [modal, setModal] = useState({ trigger: false, modalData: null, title: '' });
    const [infoModal, setInfoModal] = useState({ trigger: false, title: '', onClose: () => { }, data: null, type: '', isLoading: false, column: [] });
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);

    const [misiModal, setMisiModal] = useState({ trigger: false, modalData: [] });
    const [alert, setAlert] = useState({ show: false, message: null, description: null, type: 'info' });
    const [pagination, setPagination] = useState({ page: 1, limit: 10, filters: {}, total: 0 });

    const [misi, setMisi] = useState(null);
    const [periode, setPeriode] = useState(null);
    const [submitLoading, setSubmitLoading] = useState(false);

    useEffect(() => {
        fetchData();
    }, [pagination.page, pagination.limit]);

    const fetchData = async () => {
        try {
            const data = await getAll(pagination.page, pagination.limit, pagination.filters);
            setData(data.data.data);
            setPagination({ ...pagination, page: data.data.pagination.currentPage, limit: data.data.pagination.pageSize, total: data.data.pagination.totalItems });
            const periode = await getAllPeriode();
            const misi = await getAllMisi();
            setPeriode(periode.data);
            setMisi(misi.data);
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

            switch (type) {
                case 'create':
                    response = await store(values);
                    break;

                case 'edit':
                    response = await update(id, values);
                    break;

                case 'delete':
                    response = await destroy(id);
                    break;

                default:
                    throw new Error('Tipe operasi tidak valid');
            }

            console.log(response);

            if (response.ok) {
                fetchData()
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
            title: 'Misi',
            dataIndex: 'misi',
            key: 'misi',
            width: '30%',
            render: (_, record) => (
                <>
                    <Button icon={<SearchOutlined />} onClick={() => setMisiModal({ modalData: record.misi, trigger: true })}>
                        Info
                    </Button>
                    <Modal open={misiModal.trigger} onCancel={() => setMisiModal({ modalData: null, trigger: false })} footer={null}>
                        <Table
                            className="mt-8"
                            dataSource={misiModal.modalData?.map((item, index) => ({ ...item, key: index }))}
                            pagination={false}
                            bordered
                            columns={[
                                {
                                    title: 'Misi',
                                    dataIndex: 'name',
                                    key: 'name'
                                },
                                {
                                    title: 'Visi',
                                    dataIndex: ['visi', 'name'],
                                    key: 'visi'
                                }
                            ]}
                        />
                    </Modal>
                </>
            )
        },

        {
            title: 'Peroide Mulai',
            dataIndex: 'periode_start',
            key: 'periode_start',
            sorter: (a, b) => new Date(a.periode_start) - new Date(b.periode_start),

            render: (record) => dateFormatter(record)
        },
        {
            title: 'Periode Selesai',
            dataIndex: 'periode_end',
            key: 'periode_end',
            sorter: (a, b) => new Date(a.periode_end) - new Date(b.periode_end),
            render: (record) => dateFormatter(record)
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="small">
                    <Button
                        onClick={() => {
                            setInfoModal({
                                title: 'Informasi Renstra',
                                trigger: true,
                                type: 'desc',
                                data: [
                                    {
                                        key: 'periode_start',
                                        label: 'Periode Mulai',
                                        children: dateFormatter(record.periode_start)
                                    },
                                    {
                                        key: 'periode_end',
                                        label: 'Periode Akhir',
                                        children: dateFormatter(record.periode_end)
                                    },
                                    {
                                        key: 'misi',
                                        label: 'Misi',
                                        children: (
                                            <List
                                                dataSource={record.indikator_kinerja}
                                                renderItem={(item) => (
                                                    <List.Item>
                                                        <div className="flex flex-col">
                                                            <Typography.Title level={5} className="m-0">
                                                                Misi : {item.name}
                                                            </Typography.Title>
                                                            <Typography.Text>Visi : {item.visi.name}</Typography.Text>
                                                            <Typography.Text>Periode Mulai : {dateFormatter(item.visi.periode.periode_start)}</Typography.Text>
                                                            <Typography.Text>Periode Akhir : {dateFormatter(item.visi.periode.periode_end)}</Typography.Text>
                                                        </div>
                                                    </List.Item>
                                                )}
                                            />
                                        )
                                    }
                                ],
                                isLoading: false,
                                onClose: () => setInfoModal({ ...infoModal, trigger: false, data: null })
                            });
                        }}
                        // type='primary'
                        size="middle"
                        icon={<EyeOutlined />}
                    />
                    <Button
                        onClick={() =>
                            setModal({
                                trigger: true,
                                modalData: {
                                    ...record,
                                    misi: record.misi?.map((item) => ({ value: item._id, label: item.name })),
                                    periode: record.misi[0].visi.periode._id,
                                    periode_start: dateFormatter(record.periode_start),
                                    periode_end: dateFormatter(record.periode_end)
                                },
                                title: `Edit Renstra ${record._id}`,
                                type: 'edit'
                            })
                        }
                        // type='primary'
                        size="middle"
                        color="primary"
                        variant="outlined"
                        icon={<EditOutlined />}
                    />

                    <Button
                        onClick={() =>
                            setModal({
                                trigger: true,
                                modalData: {
                                    ...record,
                                    misi: record.misi?.map((item) => ({ value: item._id, label: item.name })),
                                    periode: record.misi[0].visi.periode._id,
                                    periode_start: dateFormatter(record.periode_start),
                                    periode_end: dateFormatter(record.periode_end)
                                },
                                title: `Edit Renstra ${record._id}`,
                                type: 'delete'
                            })
                        }
                        // type='primary'
                        size="middle"
                        danger
                        icon={<DeleteOutlined />}
                    />
                </Space>
            )
        }
    ];

    const formFields = [
        {
            label: 'Periode',
            name: 'periode',
            type: 'select',
            rules: [
                {
                    required: true,
                    message: 'Field periode wajib di isi'
                }
            ],
            options: periode?.map((item) => ({
                label: `${dateFormatter(item.periode_start)} - ${dateFormatter(item.periode_end)}`,
                value: item._id,
                id: item._id
            }))
        },
        {
            label: 'Misi',
            name: 'misi',
            type: 'select',
            rules: [
                {
                    required: true,
                    message: 'Field misi wajib di isi'
                }
            ],
            options: misi?.map((item) => ({
                label: item.name,
                value: item._id,
                id_option_parent: item.visi.periode,
                id: item._id
            })),
            mode: 'multiple',
            parentField: 'periode'
        },
        {
            label: 'Periode Mulai',
            name: 'periode_start',
            type: 'date',
            rules: [
                {
                    required: true,
                    message: 'Field periode mulai wajib di isi'
                }
            ],
            min: 1,
            max: 3000
        },
        {
            label: 'Periode Selesai',
            name: 'periode_end',
            type: 'date',
            rules: [
                {
                    required: true,
                    message: 'Field periode selesai wajib di isi'
                }
            ],
            min: 1,
            max: 3000
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
            label: 'Periode',
            name: 'periode',
            type: 'select',
            filter: 'eq',
            options: periode?.map((item) => ({
                label: `${dateFormatter(item.periode_start)} - ${dateFormatter(item.periode_end)}`,
                value: item._id,
                id: item._id
            }))
        },
        {
            label: 'Misi',
            name: 'misi',
            type: 'select',
            filter: 'eq',
            options: misi?.map((item) => ({
                label: item.name,
                value: item._id,
                id_option_parent: item.visi.periode,
                id: item._id
            })),
        },
        {
            label: 'Misi',
            name: 'misi',
            type: 'select',
            filter: 'eq',
            options: misi?.map((item) => ({
                label: item.name,
                value: item._id,
                id_option_parent: item.visi.periode,
                id: item._id
            })),
        },
        {
            label: 'Periode Mulai',
            name: 'periode_start',
            type: 'date',
            filter: 'gte',
        },
        {
            label: 'Periode Selesai',
            name: 'periode_end',
            type: 'date',
            filter: 'lte'
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
                        <div className="flex items-center justify-between mb-4">
                            <Title className="mt-2" level={5}>
                                Data Renstra
                            </Title>
                            <div>
                                <Button type="primary" icon={<PlusOutlined />} onClick={() => setModal({ modalData: null, title: 'Tambah Data', trigger: true, type: 'create' })}>
                                    Tambah
                                </Button>
                            </div>
                        </div>
                        <div className="w-full">
                            <FilterField fields={filterFileds} onSubmit={onFilter}></FilterField>
                        </div>
                        <div className="overflow-x-auto">
                            <DataTable columns={Column} data={data} setPagination={setPagination} pagination={pagination} />
                        </div>
                        <CrudModal isLoading={submitLoading} title={modal.title} isModalOpen={modal.trigger} data={modal.modalData} onSubmit={onSubmit} onClose={handleClose} formFields={formFields} type={modal.type} />
                        <InfoModal width={600} close={infoModal.onClose} data={infoModal.data} isModalOpen={infoModal.trigger} title={infoModal.title} columns={infoModal.column} isLoading={infoModal.isLoading} type={infoModal.type} />
                    </div>
                </Card>
            )}
        </div>
    );
};

export default page;
