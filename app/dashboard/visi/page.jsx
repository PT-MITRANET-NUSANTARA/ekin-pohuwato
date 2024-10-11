'use client';

import { CrudModal, DataTable } from '@/components';
import { dummyVisi } from '@/data/dummyData';
import { Alert, Breadcrumb, Button, Card, Space, Typography } from 'antd';
import { PlusOutlined, EditOutlined, EyeOutlined, DeleteOutlined, DatabaseOutlined } from '@ant-design/icons';
import Link from 'next/link';
import useFetchData from '@/hooks/useFetchData';
import {getAll, store, update, destroy} from '@/controller/VisiController';
import React, { useEffect, useState } from 'react';
import { getAll as getAllPeriode } from '@/controller/PeriodeController';
const { Title } = Typography;

const page = () => {
    const [modal, setModal] = useState({ trigger: false, modalData: null, title: '' });
    const [alert, setAlert] = useState({ show: false, message: null, description: null, type: 'info' });
    const { data, setData, loading, msg, status } = useFetchData(getAll)

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

    console.log(data);
    
    const Column = [
        {
            title: 'ID',
            dataIndex: '_id',
            key: '_id',
            sorter: (a, b) => a._id.length - b._id.length,
            width: '10%'
        },
        {
            title: 'periode',
            dataIndex: 'periode',
            key: 'periode',
            sorter: (a, b) => a._id.length - b._id.length,
            width: '10%'
        },
        {
            title: 'Visi',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.content.length - b.content.length,
            width: '30%'
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="small">
                    <Button
                        onClick={() => setModal({ trigger: true, modalData: record, title: `Edit Renstra ${record._id}`, type: 'edit' })}
                        // type='primary'
                        size="middle"
                        icon={<EditOutlined />}
                    />
                    <Button
                        onClick={() => setModal({ trigger: true, modalData: record, title: `Renstra ${record._id}`, type: 'show' })}
                        // type='primary'
                        size="middle"
                        color="default"
                        icon={<EyeOutlined />}
                    />

                    <Button
                        onClick={() => setModal({ trigger: true, modalData: record, title: `Delete Renstra ${record._id}`, type: 'delete' })}
                        // type='primary'
                        size="middle"
                        color="danger"
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
                    message: 'Field periode mulai wajib di isi'
                }
            ],
            options: periode?.map((item) => ({  value: item._id, label: item.periode_start + ' - ' + item.periode_end }))
        },
        {
            label: 'Nama',
            name: 'name',
            type: 'longtext',
            rules: [
                {
                    required: true,
                    message: 'Field periode mulai wajib di isi'
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
            <Card className="">
                <div className="flex flex-col">
                    <div className="flex items-center justify-between mb-12">
                        <Title className="mt-2" level={5}>
                            Data Visi
                        </Title>
                        <div>
                            <Button type="primary" icon={<PlusOutlined />} onClick={() => setModal({ modalData: null, title: 'Tambah Data', trigger: true, type: 'create' })}>
                                Tambah
                            </Button>
                        </div>
                    </div>
                    <DataTable columns={Column} data={data} loading={loading} />
                    <CrudModal title={modal.title} isModalOpen={modal.trigger} data={modal.modalData} onSubmit={onSubmit} onClose={handleClose} formFields={formFields} type={modal.type} />
                </div>
            </Card>
        </div>
    );
};

export default page;
