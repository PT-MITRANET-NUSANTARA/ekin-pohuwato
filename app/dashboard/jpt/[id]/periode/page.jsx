'use client';

import { CrudModal, DataLoading, DataTable } from '@/components';
import { dummyPeriodePenilaian } from '@/data/dummyData';
import { dateFormatter } from '@/utils';
import { Alert, Breadcrumb, Button, Card, Space, Tooltip, Typography } from 'antd';
import { PlusOutlined, EditOutlined, EyeOutlined, DeleteOutlined, DatabaseOutline0, DatabaseOutlined, ReloadOutlined } from '@ant-design/icons';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getAll, store, destroy, update } from '@/controller/periodePenilaianController';
import useFetchData from '@/hooks/useFetchData';
import { getData } from '@/controller/AuthorizationController';
import { getById } from '@/controller/IDSN/UnitController';
import { getById as getSKP } from '@/controller/SKPController';
import { cekJT } from '@/utils/jabatanUtils';
import useNotification from '@/app/hook/useNotification';
import dayjs from 'dayjs';

const { Title } = Typography;

const page = () => {
    const router = useRouter();
    const { id } = useParams();
    const [data, setData] = useState(null);

    const { data: user, setData: setUser } = useFetchData(getData);
    const [isJT, setIsJT] = useState(false);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, filters: {}, total: 0 });
    const [periode, setPeriode] = useState([]);

    useEffect(() => {
        if (user) {
            fetchData();
        }
    }, [user]);


    const fetchData = async () => {
        try {
            const selectedJabatan = user.jabatan;
            const struktur = await getById(user.token, selectedJabatan.unor.induk.id);
            const data = await getAll(pagination.page, pagination.limit, { skp: id, ...pagination.filters });
            setPagination({ ...pagination, page: data.data.pagination.currentPage, limit: data.data.pagination.pageSize, total: data.data.pagination.totalItems });
            const isJT = cekJT(struktur.mapData[0], selectedJabatan.nama_jabatan);
            const skp = await getSKP(id);
            console.log(skp);
            console.log(skp);
            if (!isJT) {
                const periode = await getAll('undefined', 'undefined', { skp: skp.data.skp[skp.data.skp.length - 1]._id });
                setPeriode(periode.data);
            }

            setIsJT(isJT);

            setData(data.data.data);

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
            title: 'Nama Periode',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: 'Periode Mulai',
            dataIndex: 'periodeStart',
            key: 'periodeStart',
            sorter: (a, b) => new Date(a.periodeStart) - new Date(b.periodeStart),
            render: (record) => dateFormatter(record)
        },
        {
            title: 'Periode Selesai',
            dataIndex: 'periodeEnd',
            key: 'periodeEnd',
            sorter: (a, b) => new Date(a.periodeEnd) - new Date(b.periodeEnd),
            render: (record) => dateFormatter(record)
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="small">
                    <Button
                        // type='primary'
                        size="middle"
                        onClick={() => router.push(window.location.pathname + `/${record._id}/penilaian_rhk`)}
                    >
                        Hasil Kerja
                    </Button>
                    <Button
                        // type='primary'
                        size="middle"
                        onClick={() => router.push(window.location.pathname + `/${record._id}/penilaian_perilaku`)}
                    >
                        Perilaku
                    </Button>
                    <Button onClick={() => router.push(window.location.pathname + `/${record.id}/penilaian_predikat`)}>Predikat Kinerja</Button>

                </Space>
            )
        }
    ];

    return (
        <div className="w-full flex flex-col gap-y-4">

            {loading ? (
                <DataLoading loadingData={loading} />
            ) : (
                <Card className="">
                    <div className="flex flex-col">
                        <div className="flex items-center justify-between mb-12">
                            <Title className="mt-2" level={5}>
                                Data Periode Penilaian
                            </Title>
                        </div>
                        <DataTable columns={Column} data={data} loading={loading} />
                    </div>
                </Card>
            )}
        </div>
    );
};

export default page;
