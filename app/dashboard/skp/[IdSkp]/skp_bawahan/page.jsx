'use client';

import { DataTable } from '@/components';
import { Breadcrumb, Button, Card, Skeleton, Space, Tag, Typography } from 'antd';
import { EditOutlined, EyeOutlined } from '@ant-design/icons';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { dummySkpBawahan } from '@/data/dummyData';
import { useParams, useRouter } from 'next/navigation';
import useFetchData from '@/hooks/useFetchData';
import { getData } from '@/controller/AuthorizationController';
import { getAllPosjabByUnit, getByNIP } from '@/controller/IDSN/JabatanController';
import { getBySKP } from '@/controller/SKPController';

const { Title } = Typography;

const page = () => {
    const router = useRouter();
    const { IdSkp } = useParams();
    const { data, setData, loading } = useFetchData(getData);
    const [jabatan, setJabatan] = useState(null);
    const [unor, setUnor] = useState(null);
    const [loadingData, setLoadingData] = useState(true);

    useEffect(() => {
        if (data) {
            fetchData();
        }
    }, [data]);

    const fetchData = async () => {
        try {
            const response = await getBySKP(IdSkp);
            console.log(response.data);
            
            setUnor(response.data);
            setLoadingData(false);
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
            title: 'Nama',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.length - b.name.length,
            render: (_, record) => {
                const lastJabatan = record.jabatan?.[record.jabatan.length - 1];
                return lastJabatan ? lastJabatan.nama_asn : 'No Jabatan';
            }
        },
        {
            title: 'Nama Organisasi',
            dataIndex: 'unor',
            key: 'unor',
            sorter: (a, b) => a.jabatan.length - b.jabatan.length,
            render: (_, record) => {
                const lastJabatan = record.jabatan?.[record.jabatan.length - 1];
                return lastJabatan ? lastJabatan.unor?.nama : 'No Organisasi';
            }
        },
        {
            title: 'Jabatan',
            dataIndex: 'jabatan',
            key: 'jabatan',
            sorter: (a, b) => a.jabatan.length - b.jabatan.length,
            render: (_, record) => {
                const lastJabatan = record.jabatan?.[record.jabatan.length - 1];
                return lastJabatan ? lastJabatan.nama_jabatan : 'No Jabatan';
            }
        },
        
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="small">
                    
                    <Button
                        onClick={() => router.push(`/dashboard/skp/${IdSkp}/monitoring_kinerja/${record.user_id}/harian`)}
                        // type='primary'
                        size="middle"
                        icon={<EyeOutlined />}
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
                <div className="flex items-center justify-between mb-6">
                    <Title className="mt-2" level={5}>
                        Data SKP Bawahan
                    </Title>
                </div>
                {loadingData ? (
                    <Skeleton active />
                ) : (
                    <>
                        <div className="grid grid-flow-row divide-y text-xs mb-12">
                            <div className="flex items-center justify-between py-2">
                                <span className="uppercase font-semibold">unit kerja</span>
                                <p className="text-right uppercase">{jabatan?.unor.nama}</p>
                            </div>
                            {/* <div className="flex items-center justify-between py-2">
                        <span className="uppercase font-semibold">status pegawai</span>
                        <p className="text-right uppercase"> </p>
                    </div> */}
                        </div>

                        <DataTable columns={Column} data={unor} loading={false}></DataTable>
                    </>
                )}
            </Card>
        </div>
    );
};

export default page;
