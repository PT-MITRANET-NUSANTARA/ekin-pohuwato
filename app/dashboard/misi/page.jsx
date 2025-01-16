'use client';

import { CrudModal, DataLoading, DataTable, FilterField, InfoModal } from '@/components';
import { dummyMisi } from '@/data/dummyData';
import { Alert, Breadcrumb, Button, Card, Space, Typography } from 'antd';
import { PlusOutlined, EditOutlined, EyeOutlined, DeleteOutlined, DatabaseOutlined, SearchOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { dateFormatter } from '@/utils';
import { getAll, store, update, destroy } from '@/controller/MisiController';
import React, { useEffect, useState } from 'react';
import { getAll as getAllVisi } from '@/controller/VisiController';
import { getAll as getAllPeriode } from '@/controller/PeriodeController';

const { Title } = Typography;

const page = () => {
    const [modal, setModal] = useState({ trigger: false, modalData: null, title: '', formFields: [] });
    const [infoModal, setInfoModal] = useState({ trigger: false, title: '', onClose: () => {}, data: null, type: '', isLoading: false, column: [] });
    const [alert, setAlert] = useState({ show: false, message: null, description: null, type: 'info' });
    const [submitLoading, setSubmitLoading] = useState(false);
    const [visi, setVisi] = useState(null);
    const [periode, setPeriode] = useState(null);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, filters: {} });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const data = await getAll(pagination.page, pagination.limit, pagination.filters);
            const periode = await getAllPeriode();
            const visi = await getAllVisi();
            setData(data.data.data)
            setPeriode(periode.data);
            setVisi(visi.data);
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
                const data = await getAll(pagination.page, pagination.limit, pagination.filters);
                setData(data.data.data);
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
            title: 'Visi',
            dataIndex: 'visi',
            key: 'visi',
            render: (_, record) => (
                <>
                    <Button
                        onClick={() => {
                            setInfoModal({
                                title: 'Informasi Visi',
                                trigger: true,
                                type: 'desc',
                                data: [
                                    {
                                        key: 'visi',
                                        label: 'Visi',
                                        children: record.visi.name
                                    }
                                ],
                                isLoading: false,
                                onClose: () => setInfoModal({ ...infoModal, trigger: false, data: null })
                            });
                        }}
                        icon={<SearchOutlined />}
                    >
                        Info
                    </Button>
                </>
            )
        },
        {
            title: 'Misi',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.length - b.name.length
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="small">
                    <Button
                        onClick={() => {
                            setInfoModal({
                                title: 'Informasi Misi',
                                trigger: true,
                                type: 'desc',
                                data: [
                                    {
                                        key: 'visi',
                                        label: 'Visi',
                                        children: record.visi.name
                                    },
                                    {
                                        key: 'misi',
                                        label: 'Misi',
                                        children: record.name
                                    }
                                ],
                                isLoading: false,
                                onClose: () => setInfoModal({ ...infoModal, trigger: false, data: null })
                            });
                        }}
                        // type='primary'
                        size="middle"
                        variant="outlined"
                        icon={<EyeOutlined />}
                    />
                    <Button
                        onClick={() => setModal({ formFields: misiFields, trigger: true, modalData: { ...record, visi: record.visi._id, periode: record.visi.periode }, title: `Edit Misi ${record._id}`, type: 'edit' })}
                        // type='primary'
                        size="middle"
                        variant="outlined"
                        color="primary"
                        icon={<EditOutlined />}
                    />

                    <Button
                        onClick={() => setModal({ formFields: misiFields, trigger: true, modalData: { ...record, visi: record.visi._id, periode: record.visi.periode }, title: `Edit Misi ${record._id}`, type: 'delete' })}
                        // type='primary'
                        size="middle"
                        danger
                        icon={<DeleteOutlined />}
                    />
                </Space>
            )
        }
    ];

    const misiFields = [
        {
            label: 'Periode',
            name: 'periode',
            type: 'select',
            rules: [
                {
                    required: true,
                    message: 'Field Periode wajib di isi'
                }
            ],
            options: periode?.map((item) => ({
                label: `${dateFormatter(item.periode_start)} - ${dateFormatter(item.periode_end)}`,
                value: item._id,
                id: item._id
            }))
        },
        {
            label: 'Visi',
            name: 'visi',
            type: 'select',
            rules: [
                {
                    required: true,
                    message: 'Field visi wajib di isi'
                }
            ],
            options: visi?.map((item) => ({
                label: item.name,
                value: item._id,
                id_option_parent: item.periode._id,
                id: item._id
            })),
            parentField: 'periode'
        },
        {
            label: 'Misi',
            name: 'name',
            type: 'longtext',
            rules: [
                {
                    required: true,
                    message: 'Field misi mulai wajib di isi'
                }
            ]
        }
    ];

    const visiFields = [
        {
            label: 'Visi',
            name: 'name',
            type: 'longtext'
        }
    ];

    const filterFileds = [
        {
            id: 1,
            name: 'periode',
            options: [
                {
                    label: 'sample',
                    value: 'sample'
                }
            ]
        },
        {
            id: 1,
            name: 'visi',
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
                        <div className="flex items-center justify-between mb-4">
                            <Title className="mt-2" level={5}>
                                Data Misi
                            </Title>
                            <div>
                                <Button type="primary" icon={<PlusOutlined />} onClick={() => setModal({ modalData: null, title: 'Tambah Data', trigger: true, type: 'create', formFields: misiFields })}>
                                    Tambah
                                </Button>
                            </div>
                        </div>
                        <div className="w-full">
                            <FilterField fields={filterFileds}></FilterField>
                        </div>
                        <div className="overflow-x-auto">
                            <DataTable columns={Column} data={data} />
                        </div>
                        <CrudModal isLoading={submitLoading} title={modal.title} isModalOpen={modal.trigger} data={modal.modalData} onSubmit={onSubmit} onClose={handleClose} formFields={modal.formFields} type={modal.type} />
                        <InfoModal close={infoModal.onClose} data={infoModal.data} isModalOpen={infoModal.trigger} title={infoModal.title} columns={infoModal.column} isLoading={infoModal.isLoading} type={infoModal.type} />
                    </div>
                </Card>
            )}
        </div>
    );
};

export default page;
