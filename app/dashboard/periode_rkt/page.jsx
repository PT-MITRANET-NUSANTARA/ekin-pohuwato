'use client';

import { CrudModal, DataTable } from '@/components';
import { dummyPeriodePenilaian } from '@/data/dummyData';
import { Alert, Breadcrumb, Button, Card, Space, Typography } from 'antd';
import { PlusOutlined, EditOutlined, EyeOutlined, DeleteOutlined, DatabaseOutlined } from '@ant-design/icons';
import Link from 'next/link';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { destroy, getAll, store, update, getByUserId } from '@/controller/PeriodeRKTController';
import useFetchData from '@/hooks/useFetchData';
const { Title } = Typography;

const page = () => {
    const router = useRouter()
    const {data, setData, loading}  = useFetchData(getAll) 

    const [modal, setModal] = useState({ trigger: false, modalData: null, title: '' });
    const [alert, setAlert] = useState({ show: false, message: null, description: null, type: 'info' });


    const Column = [
        {
            title: 'ID',
            dataIndex: '_id',
            key: '_id',
            sorter: (a, b) => a._id.length - b._id.length,
            width: '10%'
        },
        {
            title: 'Periode Mulai',
            dataIndex: 'periode_start',
            key: 'periode_start',
            sorter: (a, b) => a.content.length - b.content.length,
            width: '30%'
        },
        {
            title: 'Periode Selesai',
            dataIndex: 'periode_end',
            key: 'periode_end',
            sorter: (a, b) => a.content.length - b.content.length,
            width: '30%'
        },
        {
            title: 'Perjanjian Kinerja',
            dataIndex: 'perjanjianKinerja',
            key: 'perjanjianKinerja',
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
                    <Button
                        onClick={() => router.push(`/dashboard/rkt/${record._id}/`)}
                        // type='primary'
                        size="middle"
                        color="danger"
                        icon={<DatabaseOutlined />}
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
        },
        {
            label: 'Perjanjian Kerja',
            name: 'perjanjianKinerja',
            type: 'upload',
        }

    ];

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
                            Data Periode RKT
                        </Title>
                        <div>
                            <Button type="primary" icon={<PlusOutlined />} onClick={() => setModal({ modalData: null, title: 'Tambah Data', trigger: true, type: 'create' })}>
                                Tambah
                            </Button>
                        </div>
                    </div>
                    <DataTable columns={Column} data={data} loading={loading} />
                    <CrudModal title={modal.title} isModalOpen={modal.trigger} onClose={() => setModal({ ...modal, trigger: false })} data={modal.modalData} formFields={formFields} type={modal.type} />
                </div>
            </Card>
        </div>
    );
};

export default page;
