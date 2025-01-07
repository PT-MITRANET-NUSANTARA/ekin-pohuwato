'use client';

import { Alert, Breadcrumb, Button, Card, Space, Typography } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { DataTable, CrudModal } from '@/components';
import React, { useState } from 'react';
import { dummyVerifikator } from '@/data/dummyData';

import Link from 'next/link';

const { Title } = Typography;

const page = () => {
    const [modal, setModal] = useState({ trigger: false, modalData: null, title: '', formFields: [], onSubmit: () => {} });
    const [alert, setAlert] = useState({ show: false, message: null, description: null, type: 'info' });

    const Column = [
        {
            title: 'No',
            dataIndex: 'index',
            render: (text, record, index) => index + 1,
            width: '5%'
        },
        {
            title: 'Unit',
            dataIndex: 'unit',
            key: 'unit'
        },
        {
            title: 'Jabatan',
            dataIndex: 'jabatan',
            key: 'jabatan'
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="small">
                    <Button
                        onClick={() =>
                            setModal({
                                trigger: true,
                                modalData: record,
                                title: `Edit Admin Verifikator`,
                                type: 'edit',
                                formFields: formFields
                            })
                        }
                        size="middle"
                        variant="outlined"
                        color="primary"
                        icon={<EditOutlined />}
                    />
                </Space>
            )
        }
    ];

    const formFields = [
        {
            label: 'Jabatan',
            name: 'role',
            type: 'select',
            options: [
                {
                    label: 'sample',
                    value: 'sample'
                }
            ],
            rules: [
                {
                    required: true,
                    message: 'Field nama lengkap wajib di isi'
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
            {/* {loading ? (
                <DataLoading loadingData={loading} />
            ) : ( */}
            <Card className="">
                <div className="flex flex-col">
                    <div className="flex items-center justify-between mb-12">
                        <Title className="mt-2" level={5}>
                            Data Admin Verifikator
                        </Title>
                        <div>
                            {/* <Button loading={loading} type="primary" icon={<PlusOutlined />} onClick={() => setModal({ modalData: null, title: 'Tambah Data', trigger: true, type: 'create', formFields: formFields })}>
                                    Tambah
                                </Button> */}
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <DataTable columns={Column} data={dummyVerifikator} />
                    </div>
                    <CrudModal title={modal.title} isModalOpen={modal.trigger} data={modal.modalData} onSubmit={modal.onSubmit} onClose={handleClose} formFields={modal.formFields} type={modal.type} />
                </div>
            </Card>
            {/* )} */}
        </div>
    );
};

export default page;
