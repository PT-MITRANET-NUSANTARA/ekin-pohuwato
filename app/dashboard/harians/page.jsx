'use client';

import { Alert, Breadcrumb, Button, Card, Space, Table, Tag, Typography } from 'antd';
import { PlusOutlined, EditOutlined, EyeOutlined, DeleteOutlined, DatabaseOutlined, ReloadOutlined } from '@ant-design/icons';
import { DataTable, CrudModal } from '@/components';
import React, { useState } from 'react';
import { destroy, getAll, store, update } from '@/controller/RenstraController';
import useFetchData from '@/hooks/useFetchData';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { dummyHarian } from '@/data/dummyData';

const { Title } = Typography;

const page = () => {
    const router = useRouter();
    const { data, setData, loading, msg, status } = useFetchData(getAll);
    const [modal, setModal] = useState({ trigger: false, modalData: null, title: '' });
    const [alert, setAlert] = useState({ show: false, message: null, description: null, type: 'info' });

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

    const Column = [
        {
            title: 'ID',
            dataIndex: '_id',
            key: '_id',
            sorter: (a, b) => a._id.length - b._id.length,
            width: '10%'
        },
        {
            title: 'Tanggal',
            dataIndex: 'tanggal',
            key: 'tanggal',
            sorter: (a, b) => a.tanggal.length - b.tanggal.length,
            width: '30%'
        },
        {
            title: 'Status Kehadiran',
            dataIndex: 'status',
            key: 'status',
            sorter: (a, b) => a.status.length - b.status.length,
            width: '30%',
            render: (_, { status }) => (
                <>
                    {(() => {
                        switch (status) {
                            case 'hadir':
                                return (
                                    <Tag color="blue" className="capitalize">
                                        {status}
                                    </Tag>
                                );
                            case 'alpa':
                                return (
                                    <Tag color="red" className="capitalize">
                                        {status}
                                    </Tag>
                                );
                            case 'izin':
                                return (
                                    <Tag color="yellow" className="capitalize">
                                        {status}
                                    </Tag>
                                );
                            default:
                                return (
                                    <Tag color="error" className="capitalize">
                                        {status}
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
            render: (_, record) => (
                <Space size="small">
                    <Button
                        onClick={() => router.push(`/dashboard/harians/${record._id}/aktivitas`)}
                        // type='primary'
                        size="middle"
                        color="primary"
                        variant="outlined"
                        icon={<DatabaseOutlined />}
                    />
                </Space>
            )
        }
    ];

    const formFields = [
        {
            label: 'Nama',
            name: 'name',
            type: 'text',
            rules: [
                {
                    required: true,
                    message: 'Field nama wajib di isi'
                }
            ]
        },
        {
            label: 'Periode Mulai',
            name: 'periode_start',
            type: 'number',
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
            type: 'number',
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
            label: 'Dummy Select Parent',
            name: 'dummy_select_parent',
            type: 'select',
            rules: [{ required: true, message: 'Field dummy select parent wajib di isi' }],
            options: [
                { label: '01', value: '01' },
                { label: '02', value: '02' }
            ],
            isParent: true // Menandakan ini adalah select parent
        },
        {
            label: 'Dummy Select Child',
            name: 'dummy_select_child',
            type: 'select',
            rules: [{ required: true, message: 'Field dummy select child wajib di isi' }],
            parentField: 'dummy_select_parent', // Ini adalah select child yang tergantung dari parent
            options: [
                { id: 'B1', id_option_parent: '01', label: 'Option dari 01', value: 'B1' },
                { id: 'B2', id_option_parent: '02', label: 'Option dari 02', value: 'B2' }
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
                            Data Harian
                        </Title>
                        <div className="flex items-center gap-x-2">
                            <Button type="default" icon={<ReloadOutlined />} onClick={() => setModal({trigger: true, title: 'create', type: 'create' })}>
                                Sinkronisasi Harian
                            </Button>
                        </div>
                    </div>
                    <DataTable columns={Column} data={dummyHarian} loading={loading} />
                    <CrudModal title={modal.title} isModalOpen={modal.trigger} data={modal.modalData} onSubmit={onSubmit} onClose={handleClose} formFields={formFields} type={modal.type}></CrudModal>
                </div>
            </Card>
        </div>
    );
};

export default page;
