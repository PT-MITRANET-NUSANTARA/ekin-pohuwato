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
            title: 'No',
            dataIndex: 'index',
            render: (text, record, index) => index + 1,
            width: '5%'
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
            render: (_, record) => {
                const query = new URLSearchParams(record).toString();
                return (
                    <Space size="small">
                        <Button
                            onClick={() => router.push(`/dashboard/harians/${record._id}/aktivitas?${query}`)}
                            // type='primary'
                            size="middle"
                            color="primary"
                            variant="outlined"
                            icon={<DatabaseOutlined />}
                        />
                    </Space>
                );
            }
        }
    ];

    const formFields = [
        {
            label: 'Parent Select',
            name: 'parent_select',
            type: 'select',
            options: [
                { id: 'P1', value: '01', label: 'Option 01' },
                { id: 'P2', value: '02', label: 'Option 02' }
            ]
        },
        {
            label: 'Child Select',
            name: 'child_select',
            type: 'select',
            parentField: 'parent_select',
            options: [
                { id: 'C1', id_option_parent: '01', value: 'C1', label: 'Child 1 of 01' },
                { id: 'C2', id_option_parent: '02', value: 'C2', label: 'Child 2 of 02' }
            ]
        },
        {
            label: 'Grandchild Select',
            name: 'grandchild_select',
            type: 'select',
            parentField: 'child_select',
            options: [
                { id: 'G1', id_option_parent: 'C1', value: 'G1', label: 'Grandchild 1 of C1' },
                { id: 'G2', id_option_parent: 'C2', value: 'G2', label: 'Grandchild 2 of C2' }
            ]
        },
        {
            label: 'somthing',
            name: 'something',
            type: 'slider',
            min: 10,
            max: 200
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
                            <Button type="default" icon={<ReloadOutlined />} onClick={() => setModal({ trigger: true, title: 'create', type: 'create' })}>
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
