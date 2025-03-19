'use client';

import { Alert, Breadcrumb, Button, Card, Space, Table, Tag, Typography } from 'antd';
import { PlusOutlined, EditOutlined, EyeOutlined, DeleteOutlined, DatabaseOutlined, SearchOutlined } from '@ant-design/icons';
import { DataTable, CrudModal } from '@/components';
import React, { useEffect, useState } from 'react';
import { destroy, getAll, store, update } from '@/controller/RenstraController';
import useFetchData from '@/hooks/useFetchData';
import { dummyRenstra } from '@/data';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { dummyAktivitas, dummyBuktiDukung } from '@/data/dummyData';
import { getById } from '@/controller/RHKController';
import { getById as getPenilaian } from '@/controller/periodePenilaianController';
import dayjs from 'dayjs';

const { Title } = Typography;

const page = () => {
    const router = useRouter();
    const {IdPenilaian, IdPeriode} = useParams();
    const [data, setData] = useState(null);

    const [loading, setLoading] = useState(false);
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const data = await getById(IdPenilaian);
            
            const periode = await getPenilaian(IdPeriode);
            const harian = data.data.harians?.filter((h) => {
                // Convert item.date and periode.endDateTime to Day.js objects
                const hDate = dayjs(h.date); // Convert h.date to Day.js object
                const endDateTime = dayjs(periode.data.endDateTime); // Convert endDateTime to Day.js object

                // Check if h.date is less than or equal to endDateTime
                return (hDate.isBefore(endDateTime) || hDate.isSame(endDateTime) ) && h.isSKP === true;
            })
            
            setData(harian);
        } catch (error) {
            console.log(error);
        }
    };

    

    const [modal, setModal] = useState({ trigger: false, modalData: null, title: '', formFields: [] });

    const Column = [
        {
            title: 'No',
            dataIndex: 'index',
            render: (text, record, index) => index + 1,
            width: '5%'
        },
        {
            title: 'RHK',
            dataIndex: 'rhk',
            key: 'rhk',
            render: (_, record) => (
                <Button onClick={() => setModal({ formFields: rhkFields, modalData:record.rhk, trigger: true, title: `Lihat Visi `, type: 'show' })} icon={<SearchOutlined />}>
                    {}
                </Button>
            ),
            width: '30%'
        },
        {
            title: 'Tanggal',
            dataIndex: 'date',
            key: 'date',
            sorter: (a, b) => a.date.length - b.date.length,
            width: '30%'
        },
        {
            title: 'Deskripsi Kegiatan',
            dataIndex: 'deskripsiKegiatan',
            key: 'deskripsiKegiatan',
            sorter: (a, b) => a.deskripsiKegiatan.length - b.deskripsiKegiatan.length,
            width: '30%'
        },
        {
            title: 'Nama Kegiatan',
            dataIndex: 'namaKegiatan',
            key: 'namaKegiatan',
            sorter: (a, b) => a.namaKegiatan.length - b.namaKegiatan.length,
            width: '30%'
        },
        {
            title: 'Waktu Mulai',
            dataIndex: 'startDateTime',
            key: 'startDateTime',
            sorter: (a, b) => a.startDateTime.length - b.startDateTime.length,
            width: '30%'
        },
        {
            title: 'Waktu Selesai',
            dataIndex: 'endDateTime',
            key: 'endDateTime',
            sorter: (a, b) => a.endDateTime.length - b.endDateTime.length,
            width: '30%'
        },
        {
            title: 'Status',
            dataIndex: 'msg',
            key: 'msg',
            sorter: (a, b) => a.msg.length - b.msg.length,
            render: (_, record) => (
                <>
                    {(() => {
                        switch (record.msg?.status) {
                            case 'Periksa':
                                return (
                                    <Tag color="blue" className="capitalize w-fit">
                                        {record.msg.status}
                                    </Tag>
                                );
                            case 'Terima':
                                return (
                                    <Tag color="green" className="capitalize w-fit">
                                        {record.msg.status}
                                    </Tag>
                                );
                            case 'Tolak':
                                return (
                                    <div className="flex flex-col gap-y-2">
                                        <Tag color="yellow" className="capitalize w-fit">
                                            {record.msg.status}
                                        </Tag>
                                        <span className="text-red-500">{record.msg.message}</span>
                                    </div>
                                );
                            default:
                                return <div></div>;
                        }
                    })()}
                </>
            )
        },
        {
            title: 'Tautan',
            dataIndex: 'tautan',
            key: 'tautan',
            render: (_, record) => (
                <Button variant="link" color="primary" onClick={() => window.open(`${record.tautan}`, '_blank')}>
                    {record.tautan}
                </Button>
            ),
            width: '240px'
        },
        {
            title: 'Progress',
            dataIndex: 'progress',
            key: 'progress',
            render: (_, record) => <span>{record.progress} %</span>,
            width: '240px'
        },
        {
            title: 'Bukti',
            dataIndex: 'file',
            key: 'file',
            render: (_, record) => (
                <li className="flex flex-col gap-y-1 w-full">
                    {record.files.map((item) => (
                        <li>
                            <Button
                                variant="link"
                                color="primary"
                                onClick={() => {
                                    if (item.type === 'image/jpeg' || item.type === 'image/png') {
                                        window.open(`/document/fileViewer/${item.fileId}`, '_blank');
                                    } else {
                                        window.open(`/document/fileViewer/${item.fileId}`, '_blank');
                                    }
                                }}
                            >
                                {item.name}
                            </Button>
                        </li>
                    ))}
                </li>
            ),
            width: '240px'
        }
    ];

    const rhkFields = [
        {
            label: 'Deksripsi',
            name: 'desc',
            type: 'longtext'
        },
        {
            label: 'Jenis',
            name: 'jenis',
            type: 'text'
        },
        {
            label: 'Klasisfikasi',
            name: 'klasifikasi',
            type: 'text'
        }
    ];


    return (
        <div className="w-full flex flex-col gap-y-4">
         
            <Card className="">
                <div className="flex flex-col">
                    <div className="flex items-center justify-between mb-12">
                        <Title className="mt-2" level={5}>
                            Data Bukti Dukung
                        </Title>
                        <div>
                            <Button type="primary" icon={<PlusOutlined />} onClick={() => setModal({ modalData: null, title: 'Tambah Data', trigger: true, type: 'create' })}>
                                Tambah
                            </Button>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <DataTable columns={Column} data={data} loading={loading} />
                    </div>
                    <CrudModal title={modal.title} isModalOpen={modal.trigger} data={modal.modalData} onSubmit={() => {}} onClose={() => {}} formFields={modal.formFields} type={modal.type}></CrudModal>
                </div>
            </Card>
        </div>
    );
};

export default page;
