'use client';

import { CrudModal, DataTable } from '@/components';
import { dateFormatter } from '@/utils';
import { dummyVisi } from '@/data/dummyData';
import { Alert, Breadcrumb, Button, Card, Space, Typography } from 'antd';
import { PlusOutlined, EditOutlined, EyeOutlined, DeleteOutlined, DatabaseOutlined, SearchOutlined } from '@ant-design/icons';
import Link from 'next/link';
import useFetchData from '@/hooks/useFetchData';
import { getAll, store, update, destroy } from '@/controller/VisiController';
import React, { useEffect, useState } from 'react';
import { getAll as getAllPeriode } from '@/controller/PeriodeController';
const { Title } = Typography;

const page = () => {
    const [modal, setModal] = useState({ trigger: false, modalData: null, title: '', formFields: [] });
    const [alert, setAlert] = useState({ show: false, message: null, description: null, type: 'info' });
    const { data, setData, loading, msg, status } = useFetchData(getAll);

    const [periode, setPeriode] = useState(null);

    useEffect(() => {
        if (data) {
            fetchData();
        }
    }, [data]);

    const fetchData = async () => {
        try {
            const data = await getAllPeriode();
            setPeriode(data.data);
        } catch (error) {
            console.log(error);
        }
    };

    const onSubmit = async (values, type, id) => {
        try {
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
                const data = await getAll();
                setData(data.data);
                setAlert({
                    show: true,
                    message: response.msg,
                    description: type === 'delete' ? 'Berhasil Menghapus Visi' : type === 'edit' ? 'Berhasil Mengedit Visi' : 'Berhasil Menambahkan Visi',
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
            title: 'Periode',
            dataIndex: 'periode',
            key: 'periode',
            render: (_, record) => (
                <>
                    <Button onClick={() => setModal({ formFields: periodeFields, trigger: true, modalData: record.periode, title: `Lihat Periode ${record.periode._id}`, type: 'show' })} icon={<SearchOutlined />}>
                        Info
                    </Button>
                </>
                // console.log(record)
            )
        },
        {
            title: 'Visi',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.length - b.name.length,
            searchable: true
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="small">
                    <Button
                        onClick={() => setModal({ formFields: visiFields, trigger: true, modalData: {...record, periode: record.periode._id}, title: `Visi ${record._id}`, type: 'show' })}
                        // type='primary'
                        size="middle"
                        variant="outlined"
                        icon={<EyeOutlined />}
                    />
                    <Button
                        onClick={() => setModal({ formFields: visiFields, trigger: true, modalData: {...record, periode: record.periode._id}, title: `Edit Visi ${record._id}`, type: 'edit' })}
                        // type='primary'
                        size="middle"
                        variant="outlined"
                        color="primary"
                        icon={<EditOutlined />}
                    />

                    <Button
                        onClick={() => setModal({ formFields: visiFields, trigger: true, modalData: {...record, periode: record.periode._id}, title: `Delete Visi ${record._id}`, type: 'delete' })}
                        // type='primary'
                        size="middle"
                        danger
                        icon={<DeleteOutlined />}
                    />
                </Space>
            )
        }
    ];

    const visiFields = [
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
            options: periode?.map((item) => ({ value: item._id, label: dateFormatter(item.periode_start) + ' - ' + dateFormatter(item.periode_end) }))
        },
        {
            label: 'Visi',
            name: 'name',
            type: 'longtext',
            rules: [
                {
                    required: true,
                    message: 'Field visi wajib di isi'
                }
            ]
        }
    ];

    const periodeFields = [
        {
            label: 'Periode Start',
            name: 'periode_start',
            type: 'date'
        },
        {
            label: 'Periode End',
            name: 'periode_end',
            type: 'date'
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
            <Card className="">
                <div className="flex flex-col">
                    <div className="flex items-center justify-between mb-12">
                        <Title className="mt-2" level={5}>
                            Data Visi
                        </Title>
                        <div>
                            <Button type="primary" icon={<PlusOutlined />} onClick={() => setModal({ modalData: null, title: 'Tambah Data', trigger: true, type: 'create', formFields: visiFields })}>
                                Tambah
                            </Button>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <DataTable columns={Column} data={data} loading={loading} />
                    </div>
                    <CrudModal title={modal.title} isModalOpen={modal.trigger} data={modal.modalData} onSubmit={onSubmit} onClose={handleClose} formFields={modal.formFields} type={modal.type} />
                </div>
            </Card>
        </div>
    );
};

export default page;
