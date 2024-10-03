'use client';

import { Alert, Button, Card, Space, Table, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { DataTable, CrudModal } from '@/components';
import React, { useState } from 'react';
import { dummyData } from '@/data';

const { Title } = Typography;

const page = () => {
    const loading = false;

    const [modal, setModal] = useState({ trigger: false, modalData: null, title: '' });
    const [alert, setAlert] = useState({ show: false, message: null, description: null, type: 'info' });

    const handleEdit = (record) => {
        setModal({ trigger: true, modalData: record, title: `Edit Renstra ${record.name}` });
    };

    const onSubmit = (values) => {
        setAlert({ show: true, message: 'Aksi Sukses', description: 'sukses', type: 'success' });
        handleClose();
    };

    const handleDelete = (key) => {
        console.log('Delete:', key);
        // Add your delete logic here
    };

    const dummyColumn = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.address.length - b.address.length,
            width: '30%'
        },
        {
            title: 'Age',
            dataIndex: 'age',
            key: 'age',
            sorter: (a, b) => a.address.length - b.address.length,
            width: '20%'
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
            sorter: (a, b) => a.address.length - b.address.length,
            sortDirections: ['descend', 'ascend'],
            searchable: true
        },
        {
            title: 'Gender',
            dataIndex: 'gender',
            key: 'gender',
            sorter: (a, b) => a.address.length - b.address.length,
            sortDirections: ['descend', 'ascend'],
            searchable: true
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <a onClick={() => handleEdit(record)}>Edit</a>
                    <a onClick={() => handleDelete(record.key)}>Delete</a>
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
            label: 'Age',
            name: 'age',
            type: 'number',
            rules: [
                {
                    required: true,
                    message: 'Field age wajib di isi'
                }
            ],
            min: 1,
            max: 12
        },
        {
            label: 'Address',
            name: 'address',
            type: 'longtext',
            rules: [
                {
                    required: true,
                    message: 'Field address wajib di isi'
                }
            ]
        },
        {
            label: 'Gender',
            name: 'gender',
            type: 'select',
            options: [
                {
                    label: 'female',
                    value: 'female'
                },
                {
                    label: 'male',
                    value: 'male'
                }
            ],
            rules: [
                {
                    required: true,
                    message: 'Field address wajib di isi'
                }
            ]
        },
        {
            label: 'Country',
            name: 'country',
            type: 'select',
            options: [
                {
                    label: 'indonesia',
                    value: 'indonesia'
                },
                {
                    label: 'belanda',
                    value: 'belanda'
                }
            ],
            rules: [
                {
                    required: true,
                    message: 'Field address wajib di isi'
                }
            ]
        },
        {
            label: 'Date Birth',
            name: 'date_birth',
            type: 'date'
        }
    ];

    const handleClose = () => {
        setModal({ trigger: false, modalData: null });
    };

    return (
        <div className="w-full flex flex-col gap-y-4">
            {alert.show !== false && <Alert message={alert.message} description={alert.description} type={alert.type} showIcon/>}
            <Card>
                <div className="flex flex-col">
                    <div className="flex items-center justify-between mb-12">
                        <Title className="mt-2" level={5}>
                            Data Renstra
                        </Title>
                        <div>
                            <Button type="primary" icon={<PlusOutlined />} onClick={() => setModal({ modalData: null, title: "Tambah Data", trigger: true })}>
                                Tambah
                            </Button>
                        </div>
                    </div>
                    <DataTable columns={dummyColumn} data={dummyData} loading={loading} />
                    <CrudModal title={modal.title} isModalOpen={modal.trigger} data={modal.modalData} onSubmit={onSubmit} onClose={handleClose} formFields={formFields} />
                </div>
            </Card>
        </div>
    );
};

export default page;
