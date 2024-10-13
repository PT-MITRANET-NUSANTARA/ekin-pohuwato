'use client';

import { CrudModal, DataTable } from '@/components';
import { dummyPeriodePenilaian } from '@/data/dummyData';
import { Breadcrumb, Button, Card, Space, Typography } from 'antd';
import { PlusOutlined, EditOutlined, EyeOutlined, DeleteOutlined, DatabaseOutline0, DatabaseOutlined } from '@ant-design/icons';
import Link from 'next/link';
import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

const { Title } = Typography;

const page = () => {

    const router = useRouter()
    const { IdSkp } = useParams();
    const [modal, setModal] = useState({ trigger: false, modalData: null, title: '' });

    const Column = [
        {
            title: 'ID',
            dataIndex: '_id',
            key: '_id',
            sorter: (a, b) => a._id.length - b._id.length,
            width: '10%'
        },
        {
            title: 'Periode Penilaian',
            dataIndex: 'content',
            key: 'content',
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
                        onClick={() => router.push(`/dashboard/skp/${IdSkp}/periode_penilaian/${record._id}/penilaian`)}
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
            label: 'Tipe',
            name: 'type',
            type: 'select',
            rules: [
                {
                    required: true,
                    message: 'Field nama wajib di isi'
                }
            ],
            options: [
                {
                    label: 'Visi',
                    value: 'visi'
                },
                {
                    label: 'Misi',
                    value: 'misi'
                }
            ]
        },
        {
            label: 'Content',
            name: 'content',
            type: 'text',
            rules: [
                {
                    required: true,
                    message: 'Field periode mulai wajib di isi'
                }
            ]
        }
    ];

    return (
        <div className="w-full flex flex-col gap-y-4">
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
                            Data Visi dan Misi
                        </Title>
                        <div>
                            <Button type="primary" icon={<PlusOutlined />} onClick={() => setModal({ modalData: null, title: 'Tambah Data', trigger: true, type: 'create' })}>
                                Tambah
                            </Button>
                        </div>
                    </div>
                    <DataTable columns={Column} data={dummyPeriodePenilaian} loading={false} />
                    <CrudModal title={modal.title} isModalOpen={modal.trigger} data={modal.modalData} formFields={formFields} type={modal.type} />
                </div>
            </Card>
        </div>
    );
};

export default page;
