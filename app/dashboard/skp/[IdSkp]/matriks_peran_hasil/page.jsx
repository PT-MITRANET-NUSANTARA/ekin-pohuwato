'use client';

import { Breadcrumb, Button, Card, Space, Tooltip, Typography } from 'antd';
import { DatabaseOutlined, DeleteOutlined, DotChartOutlined, EditOutlined, EyeOutlined, PieChartOutlined } from '@ant-design/icons';
import { dummyTimKerja } from '@/data';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { DataTable } from '@/components';
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

            const bawahan = unit.mapData.data.filter((item) => (item.unor.id == selectedJabatan.unor.id && item.nama_jabatan !== selectedJabatan.nama_jabatan) || item.unor.atasan?.unor_id === selectedJabatan.unor.id);
            
            setJabatan(selectedJabatan);

            setUnor(bawahan);
        } catch (error) {
            console.log(error);
        }
    };
    console.log(unor);
    
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
            render: (_, record) => (
                record.unor && record.unor.nama ? record.unor.nama : 'No Unit'
            ),
        },
        
        {
            title: 'Jabatan',
            dataIndex: 'nama_jabatan',
            key: 'nama_jabatan',
            sorter: (a, b) => a.ketua_tim.length - b.ketua_tim.length,
            width: '30%'
        },
        // {
        //     title: 'Action',
        //     key: 'action',
        //     render: (_, record) => (
        //         <Space size="small">
        //             <Button
        //                 // type='primary'
        //                 size="middle"
        //                 icon={<EditOutlined />}
        //             />
        //             <Button
        //                 // type='primary'
        //                 size="middle"
        //                 color="default"
        //                 icon={<EyeOutlined />}
        //             />

        //             <Button
        //                 // type='primary'
        //                 size="middle"
        //                 color="danger"
        //                 icon={<DeleteOutlined />}
        //             />

        //             <Button
        //                 // type='primary'
        //                 size="middle"
        //                 color="danger"
        //                 icon={<DatabaseOutlined />}
        //             />
        //         </Space>
        //     )
        // }
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
                            Data Matriks Peran Hasil
                        </Title>
                        <div className="flex items-center gap-x-2">
                            <Tooltip title="BIDANG PENGADAAN, PEMBERHENTIAN DAN INFORMASI KEPEGAWAIAN">
                                <Button type="primary" icon={<DotChartOutlined />} onClick={() => router.push(`/dashboard/skp/${IdSkp}/matriks_peran_hasil/${IdSkp}`)}>
                                    Matriks Unit Kerja
                                </Button>
                            </Tooltip>
                            <Tooltip title="BADAN KEPEGAWAIAN DAN PENGEMBANGAN SUMBER DAYA MANUSIA">
                                <Button type="default" icon={<PieChartOutlined />}>
                                    Matriks Atasan
                                </Button>
                            </Tooltip>
                        </div>
                    </div>
                    <DataTable columns={Column} data={unor} loading={loading} />
                </div>
            </Card>
        </div>
    );
};

export default page;
