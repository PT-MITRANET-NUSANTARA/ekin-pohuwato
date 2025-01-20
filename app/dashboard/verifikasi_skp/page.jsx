'use client';

import { Alert, Breadcrumb, Button, Card, Space, Tag, Typography } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { DataTable, CrudModal, FilterField } from '@/components';
import React, { useState } from 'react';
import { dummySKPVerification } from '@/data/dummyData';
import Link from 'next/link';
import useFetchData from '@/hooks/useFetchData';

const { Title } = Typography;

const page = () => {
    const [modal, setModal] = useState({ trigger: false, modalData: null, title: '', formFields: [], onSubmit: () => {} });
    const [alert, setAlert] = useState({ show: false, message: null, description: null, type: 'info' });
    const { data: user, setData: setUser } = useFetchData(getData);

    const Column = [
        {
            title: 'No',
            dataIndex: 'index',
            render: (text, record, index) => index + 1,
            width: '5%'
        },
        {
            title: 'Nama SKP',
            dataIndex: 'nama_skp',
            key: 'nama_skp'
        },
        {
            title: 'Periode SKP',
            dataIndex: 'periode_skp',
            key: 'periode_skp'
        },
        {
            title: 'Data Diri',
            dataIndex: 'datadiri',
            key: 'datadiri'
        },
        {
            title: 'Atasan',
            dataIndex: 'atasan',
            key: 'atasan'
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (_, { status }) => (
                <>
                    {(() => {
                        switch (status) {
                            case 'terima':
                                return (
                                    <Tag color="blue" className="capitalize">
                                        {status}
                                    </Tag>
                                );
                            case 'tolak':
                                return (
                                    <Tag color="red" className="capitalize">
                                        {status}
                                    </Tag>
                                );
                            case 'periksa':
                                return (
                                    <Tag color="yellow" className="capitalize">
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
                        onClick={() => {
                            // verifiy logic goes here
                        }}
                        size="middle"
                        variant="outlined"
                        color="primary"
                        icon={<CheckOutlined />}
                    />

                    <Button
                        onClick={() =>
                            setModal({
                                trigger: true,
                                title: `Tolak Verifikasi SKP`,
                                type: 'create',
                                formFields: feedbackFields
                            })
                        }
                        size="middle"
                        danger
                        icon={<CloseOutlined />}
                    />
                </Space>
            )
        }
    ];

    const feedbackFields = [
        {
            label: 'Feedback',
            name: 'feedback',
            type: 'longtext',
            rules: [
                {
                    required: true,
                    message: 'Field feedback wajib di isi'
                }
            ]
        }
    ];

    const filterFileds = [
        {
            id: 1,
            name: 'periode skp',
            options: [
                {
                    label: 'sample',
                    value: 'sample'
                }
            ]
        },
        {
            id: 1,
            name: 'atasan',
            options: [
                {
                    label: 'sample',
                    value: 'sample'
                }
            ]
        },
        {
            id: 1,
            name: 'status skp',
            options: [
                {
                    label: 'sample',
                    value: 'sample'
                }
            ]
        },
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
                    <div className="flex items-center justify-between mb-4">
                        <Title className="mt-2" level={5}>
                            Data verifikasi SKP
                        </Title>
                        <div>
                            {/* <Button loading={loading} type="primary" icon={<PlusOutlined />} onClick={() => setModal({ modalData: null, title: 'Tambah Data', trigger: true, type: 'create', formFields: formFields })}>
                                    Tambah
                                </Button> */}
                        </div>
                    </div>
                    <div className="w-full">
                            <FilterField fields={filterFileds}></FilterField>
                        </div>
                    <div className="overflow-x-auto">
                        <DataTable columns={Column} data={dummySKPVerification} />
                    </div>
                    <CrudModal title={modal.title} isModalOpen={modal.trigger} data={modal.modalData} onSubmit={modal.onSubmit} onClose={handleClose} formFields={modal.formFields} type={modal.type} />
                </div>
            </Card>
            {/* )} */}
        </div>
    );
};

export default page;
