"use client"

import React, { useState } from 'react'
import { dummyOrganisasi } from '@/data/dummyData';
import { Card, Typography, Space, Button } from 'antd';
import { CrudModal, DataTable } from '@/components';
import { useRouter } from 'next/navigation';
const { Title } = Typography;

const page = () => {
    const [modal, setModal] = useState({ trigger: false, modalData: null, title: '', formFields: [] });
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const Column = [
        {
            title: 'No',
            dataIndex: 'index',
            render: (text, record, index) => index + 1,
            width: '5%'
        },
        {
            title: 'Nama SKP',
            dataIndex: 'name',
            key: 'name',
            searchable: true,

        },
        {
            title: 'Periode SKP',
            dataIndex: 'periode',
            key: 'periode',
            searchable: true,
        },
        {
            title: 'Pendekatan SKP',
            dataIndex: 'pendekatan',
            key: 'pendekatan',
            searchable: true,
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="small">
                    <Button
                        onClick={() => router.push(window.location.pathname + `/${record.id}`)}
                        // type='primary'
                        size="middle"
                    >
                        Detail
                    </Button>
                </Space>
            )
        }
    ];

    const formFields = []
    
    const handleClose = () => {
        setModal({ trigger: false, modalData: null });
    };


    return (
        <div className="w-full flex flex-col gap-y-4">
            <Card className="">
                <div className="flex flex-col">
                    <div className="flex items-center justify-between mb-12">
                        <Title className="mt-2" level={5}>
                            List SKP
                        </Title>
                    </div>
                    <DataTable columns={Column} data={dummyOrganisasi} loading={loading} />
                    <CrudModal title={modal.title} isModalOpen={modal.trigger} data={modal.modalData} onSubmit={() => {}} onClose={handleClose} formFields={formFields} type={modal.type}></CrudModal>
                </div>
            </Card>
        </div>
    )
}

export default page