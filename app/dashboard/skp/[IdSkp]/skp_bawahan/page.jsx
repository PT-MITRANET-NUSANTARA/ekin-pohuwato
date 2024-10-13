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
            const jabatan = await getByNIP(data.token, data.user.nipBaru);

            const selectedJabatan = jabatan.mapData.data[0];
            console.log(selectedJabatan.unor.id);

            const unit = await getAllPosjabByUnit(data.token, selectedJabatan.unor.induk.id);
            console.log(unit);

            const bawahan = unit.mapData.data.filter((item) => (item.unor.id === selectedJabatan.unor.id && item.nama_jabatan !== selectedJabatan.nama_jabatan) || item.unor.atasan?.unor_id === selectedJabatan.unor.id);

            setJabatan(selectedJabatan);

            setUnor(bawahan);
            setLoadingData(false);
        } catch (error) {
            console.log(error);
        }
    };
    const Column = [
        {
            title: 'ID',
            dataIndex: 'userId',
            key: 'userId',
            sorter: (a, b) => a._id.length - b._id.length,
            width: '10%'
        },
        {
            title: 'Name',
            dataIndex: 'nama_asn',
            key: 'nama_asn',
            sorter: (a, b) => a.tim_kerja.length - b.tim_kerja.length,
            width: '30%'
        },
        {
            title: 'Unit Kerja',
            dataIndex: 'unit',
            key: 'unit',
            sorter: (a, b) => a.tim_kerja.length - b.tim_kerja.length,
            width: '30%',
            render: (_, record) => (record.unor && record.unor.nama ? record.unor.nama : 'No Unit')
        },

        {
            title: 'Jabatan',
            dataIndex: 'nama_jabatan',
            key: 'nama_jabatan',
            sorter: (a, b) => a.ketua_tim.length - b.ketua_tim.length,
            width: '30%'
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            sorter: (a, b) => a.status.length - b.status.length,
            width: '30%',
            render: (_, { status }) => (
                <>
                    {(() => {
                        switch (status) {
                            case 'draft':
                                return (
                                    <Tag color="blue" className="capitalize">
                                        {status}
                                    </Tag>
                                );
                            case 'belum':
                                return (
                                    <Tag color="red" className="capitalize">
                                        {status}
                                    </Tag>
                                );
                            case 'pengajuan':
                                return (
                                    <Tag color="yellow" className="capitalize">
                                        {status}
                                    </Tag>
                                );
                            default:
                                return (
                                    <Tag color="error" className="capitalize">
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
