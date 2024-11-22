'use client';

import { CrudModal, DataTable } from '@/components';
import { dummyPeriodePenilaian } from '@/data/dummyData';
import { Alert, Breadcrumb, Button, Card, Space, Typography } from 'antd';
import { PlusOutlined, EditOutlined, EyeOutlined, DeleteOutlined, DatabaseOutline0, DatabaseOutlined } from '@ant-design/icons';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getAll, store, destroy, update } from '@/controller/periodePenilaianController';
import { getById } from '@/controller/SKPController';
import { dateFormatter } from '@/utils';

const { Title } = Typography;

const page = () => {
    const router = useRouter();
    const { IdSkp } = useParams();
    const [modal, setModal] = useState({ trigger: false, modalData: null, title: '' });
    const [data, setData] = useState(null);
    const [alert, setAlert] = useState({ show: false, message: null, description: null, type: 'info' });

    const [loading, setLoading] = useState(true);
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const skp = await getById(IdSkp);
            const skpAtasan = skp.data.skp;
            const data = await getAll(skpAtasan[skpAtasan.length - 1]._id);
            setData(data.data);
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    };

    const Column = [
        {
            title: 'No',
            dataIndex: 'index',
            render: (text, record, index) => index + 1,
            width: '5%'
        },
        {
            title: 'Periode Mulai',
            dataIndex: 'periodeStart',
            key: 'periodeStart',
            sorter: (a, b) => a.periodeStart.length - b.periodeStart.length,
            render: (record) => dateFormatter(record)
        },
        {
            title: 'Periode Selesai',
            dataIndex: 'periodeEnd',
            key: 'periodeEnd',
            sorter: (a, b) => a.periodeEnd.length - b.periodeEnd.length,
            render: (record) => dateFormatter(record)
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="small">
                    <Button
                        onClick={() => router.push(`/dashboard/skp/${IdSkp}/nilai/${record._id}`)}
                        // type='primary'
                        size="middle"
                        color="default"
                        icon={<DatabaseOutlined />}
                    />
                </Space>
            )
        }
    ];

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
                            Data Periode Penilaian
                        </Title>
                        <div></div>
                    </div>
                    <DataTable columns={Column} data={data} loading={loading} />
                </div>
            </Card>
        </div>
    );
};

export default page;
