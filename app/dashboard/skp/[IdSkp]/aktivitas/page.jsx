'use client';

import { DataTable } from '@/components';
import { Breadcrumb, Button, Card, Modal, Space, Typography } from 'antd';
import { EditOutlined, FileAddOutlined } from '@ant-design/icons';
import Link from 'next/link';
import React, { useState } from 'react';
import { dummyAktivitas } from '@/data/dummyData';

const { Title } = Typography;

const page = () => {
    const [skpModal, setSkpModal] = useState({ trigger: false, modalData: null });
    const Column = [
        {
            title: 'ID',
            dataIndex: '_id',
            key: '_id',
            sorter: (a, b) => a._id.length - b._id.length,
            width: '10%'
        },
        {
            title: 'Content',
            dataIndex: 'content',
            key: 'content',
            sorter: (a, b) => a.content.length - b.content.length,
            width: '30%'
        },
        {
            title: 'Bukti',
            dataIndex: 'bukti',
            key: 'bukti',
            sorter: (a, b) => a.bukti.length - b.bukti.length,
            width: '30%'
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="small">
                    <Button
                        onClick={() => setSkpModal({ trigger: true, modalData: record })}
                        // type='primary'
                        size="middle"
                        icon={<FileAddOutlined />}
                    />
                </Space>
            )
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
            <Card>
                <div className="flex flex-col">
                    <div className="flex items-center justify-between mb-12">
                        <Title className="mt-2" level={5}>
                            Data SKP
                        </Title>
                    </div>
                    <DataTable columns={Column} data={dummyAktivitas} loading={false} />
                    <Modal open={skpModal.trigger} onCancel={() => setSkpModal((prev) => ({ ...prev, trigger: false }))}>
                        <div className="mt-6">
                            Masukan data aktivitas harian <b>{skpModal.modalData?.content}</b> sebagai SKP?
                        </div>
                    </Modal>
                </div>
            </Card>
        </div>
    );
};

export default page;
