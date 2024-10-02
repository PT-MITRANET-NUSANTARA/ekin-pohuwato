'use client';

import { Button, Card, Space, Table, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { DataTable, CrudModal } from '@/components';

import React, { useState } from 'react';

const { Title } = Typography;

const page = () => {

    const loading = false;

    const [modal, setModal] = useState({ open: false, data: null})


    const handleEdit = (record) => {
        setModal({open: true, data: record})
    };

    const handleDelete = (key) => {
        console.log('Delete:', key);
        // Add your delete logic here
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.address.length - b.address.length,
            width: '30%',
        },
        {
            title: 'Age',
            dataIndex: 'age',
            key: 'age',
            sorter: (a, b) => a.address.length - b.address.length,
            width: '20%',
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
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <a onClick={() => handleEdit(record)}>Edit</a>
                    <a onClick={() => handleDelete(record.key)}>Delete</a>
                </Space>
            ),
        },
    ];

    const data = Array.from({ length: 100 }, (_, index) => ({
        key: (index + 1).toString(),
        name: 'John Brown',
        age: 32,
        address: `New York No. ${index + 1} Lake Park`
    }));

    return (
        <div className="w-full flex flex-col gap-y-4">
            <Card>
                <div className="flex flex-col">
                    <div className="flex items-center justify-between mb-12">
                        <Title className="mt-2" level={5}>
                            Data Renstra
                        </Title>
                        <div>
                            <Button type="primary" icon={<PlusOutlined />}>
                                Tambah
                            </Button>
                        </div>
                    </div>
                    <DataTable columns={columns} data={data} loading={loading} />
                    <CrudModal isModalOpen={modal.open} data={modal.data} />
                </div>
            </Card>
        </div>
    );
};

export default page;
