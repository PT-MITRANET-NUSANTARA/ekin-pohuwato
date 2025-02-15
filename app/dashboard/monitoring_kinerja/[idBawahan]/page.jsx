'use client';

import React, { useEffect, useState } from 'react';
import { dummyOrganisasi } from '@/data/dummyData';
import { Card, Typography, Space, Button } from 'antd';
import { CrudModal, DataTable } from '@/components';
import { useParams, useRouter } from 'next/navigation';
import useFetchData from '@/hooks/useFetchData';
import { getData } from '@/controller/AuthorizationController';
import { getByUserId } from '@/controller/SKPController';
import { formatDateToDayMonthYear } from '@/utils/util';
const { Title } = Typography;

const page = () => {
    const [modal, setModal] = useState({ trigger: false, modalData: null, title: '', formFields: [] });
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { data: user, setData: setUser } = useFetchData(getData);
    const [data, setData] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, filters: {}, total: 0 });
    const { idBawahan } = useParams();

    useEffect(() => {
        if (user) {
            fetchData();
        }
    }, [user, pagination.page, pagination.limit]);

    const fetchData = async () => {
        try {
            const data = await getByUserId(idBawahan, pagination.page, pagination.limit, pagination.filters);
            setData(data.data.data);
            setPagination({ ...pagination, page: data.data.pagination.currentPage, limit: data.data.pagination.pageSize, total: data.data.pagination.totalItems });
        } catch (error) {
            setErrorData({ show: true, message: error.message });
        }
    };

    const Column = [
        {
            title: 'No',
            dataIndex: 'index',
            render: (text, record, index) => index + 1,
            width: '5%'
        },
        // {
        //     title: 'Nama SKP',
        //     dataIndex: 'name',
        //     key: 'name',
        //     searchable: true
        // },
        {
            title: 'Periode SKP',
            dataIndex: 'periode',
            key: 'periode',
            render: (_, record) => formatDateToDayMonthYear(record.periode_awal) + '-' + formatDateToDayMonthYear(record.periode_akhir)
        },
        {
            title: 'Pendekatan SKP',
            dataIndex: 'pendekatan',
            key: 'pendekatan',
            searchable: true
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

    const formFields = [];

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
                    <DataTable columns={Column} data={data} loading={loading} />
                    <CrudModal title={modal.title} isModalOpen={modal.trigger} data={modal.modalData} onSubmit={() => {}} onClose={handleClose} formFields={formFields} type={modal.type}></CrudModal>
                </div>
            </Card>
        </div>
    );
};

export default page;
