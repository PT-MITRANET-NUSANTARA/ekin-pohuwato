'use client';

import { CrudModal, DataLoading, DataTable, FilterField, InfoModal } from '@/components';
import { dateFormatter } from '@/utils';
import { Alert, Breadcrumb, Button, Card, Space, Typography } from 'antd';
import { PlusOutlined, EditOutlined, EyeOutlined, DeleteOutlined, DatabaseOutlined } from '@ant-design/icons';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import useFetchData from '@/hooks/useFetchData';
import { getAll, store, update, destroy } from '@/controller/PeriodeController';

const { Title } = Typography;

const page = () => {
    const [modal, setModal] = useState({ trigger: false, modalData: null, title: '' });
    const [infoModal, setInfoModal] = useState({ trigger: false, title: '', onClose: () => {}, data: null, type: '', isLoading: false, column: [] });
    const [alert, setAlert] = useState({ show: false, message: null, description: null, type: 'info' });
    const [data, setData] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, filters: {} });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
            fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const data = await getAll(pagination.page, pagination.limit, pagination.filters);
            
            setData(data.data.data);
            setPagination({ ...pagination, page: data.data.pagination.currentPage, limit: data.data.pagination.pageSize });
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const [submitLoading, setSubmitLoading] = useState(false);

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

            if (response.ok) {
                const data = await getAll(pagination.page, pagination.limit, pagination.filters);
                setData(data.data.data);
                setAlert({
                    show: true,
                    message: response.msg,
                    description: type === 'delete' ? 'Berhasil Menghapus Periode' : type === 'edit' ? 'Berhasil Mengedit Periode' : 'Berhasil Menambahkan Periode',
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
            title: 'Periode Mulai',
            dataIndex: 'periode_start',
            key: 'periode_start',
            sorter: (a, b) => new Date(a.periode_start) - new Date(b.periode_start),
            render: (record) => dateFormatter(record),
            searchable: true
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
                                title: 'Informasi Periode',
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
                        onClick={() => setModal({ trigger: true, modalData: { ...record, periode_start: dateFormatter(record.periode_start), periode_end: dateFormatter(record.periode_end) }, title: `Edit Periode ${record._id}`, type: 'edit' })}
                        // type='primary'
                        size="middle"
                        color="primary"
                        variant="outlined"
                        icon={<EditOutlined />}
                    />

                    <Button
                        onClick={() => setModal({ trigger: true, modalData: { ...record, periode_start: dateFormatter(record.periode_start), periode_end: dateFormatter(record.periode_end) }, title: `Delete Periode ${record._id}`, type: 'delete' })}
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
            label: 'Periode Mulai',
            name: 'periode_start',
            type: 'date',
            rules: [
                {
                    required: true,
                    message: 'Field periode mulai wajib di isi'
                }
            ]
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
            ]
        }
    ];

    const filterFileds = [
        {
            id: 1,
            name: 'Periode Mulai',
            options: [
                {
                    label: 'sample',
                    value: 'sample'
                }
            ]
        },
        {
            id: 2,
            name: 'Periode Selesai',
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
                                Data Periode
                            </Title>
                            <div>
                                <Button type="primary" icon={<PlusOutlined />} onClick={() => setModal({ modalData: null, title: 'Tambah Data', trigger: true, type: 'create' })}>
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
                        <CrudModal isLoading={submitLoading} title={modal.title} isModalOpen={modal.trigger} onClose={handleClose} data={modal.modalData} onSubmit={onSubmit} formFields={formFields} type={modal.type} />
                        <InfoModal close={infoModal.onClose} data={infoModal.data} isModalOpen={infoModal.trigger} title={infoModal.title} columns={infoModal.column} isLoading={infoModal.isLoading} type={infoModal.type} />
                    </div>
                </Card>
            )}
        </div>
    );
};

export default page;
