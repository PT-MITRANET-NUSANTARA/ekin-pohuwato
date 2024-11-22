'use client';

import { Alert, Breadcrumb, Button, Card, Modal, Space, Table, Tag, Typography } from 'antd';
import { PlusOutlined, EditOutlined, EyeOutlined, DeleteOutlined, DatabaseOutlined, SearchOutlined, CheckCircleFilled, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { DataTable, CrudModal } from '@/components';
import { dateFormatter } from '@/utils';
import React, { useEffect, useState } from 'react';
import { destroy, getAll, store, update, getByUserId, getByUserIdAbsence } from '@/controller/HarianController';
import useFetchData from '@/hooks/useFetchData';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { dummyAktivitas } from '@/data/dummyData';
import { getData } from '@/controller/AuthorizationController';
import { getByUserId as getRHKByUserId } from '@/controller/RHKController';
import { getByUnitId } from '@/controller/PeriodeRKTController';
import { getByUserId as getSKPByUser } from '@/controller/SKPController';
import { getByNIP } from '@/controller/IDSN/JabatanController';
import dayjs from 'dayjs';

const { Title } = Typography;
const { confirm } = Modal;

const page = () => {
    const router = useRouter();
    const { IdBawahan, IdHarian } = useParams();
    const [loading, setLoading] = useState(true);
    const { data, setData } = useFetchData(getData);
    const [modal, setModal] = useState({ trigger: false, modalData: null, title: '', formFields: [] });
    const [alert, setAlert] = useState({ show: false, message: null, description: null, type: 'info' });
    const [harian, setHarian] = useState(null);
    const [dt, setDT] = useState(null);
    const MENIT = process.env.NEXT_PUBLIC_TIME;
    useEffect(() => {
        if (data) {
            fetchData();
        }
    }, [data]);

    const fetchData = async () => {
        try {
            const harian = await getByUserIdAbsence(IdBawahan, IdHarian);
            console.log(harian);

            const harian_terima = harian.data.filter((item) => item.msg.status === 'Terima');
            setDT(calculateTotalMinutes(harian_terima));
            setHarian(harian_terima);
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    };

    console.log('harian', dt);

    const calculateTotalMinutes = (data) => {
        let menit = 0;
        let date = '';
        data.forEach((item) => {
            const currentDate = dayjs(item.date).format('YYYY-MM-DD'); // Mengambil tanggal dalam format YYYY-MM-DD
            date = currentDate;
            const start = dayjs(`${currentDate} ${item.startDateTime}`, 'YYYY-MM-DD HH:mm:ss');
            const end = dayjs(`${currentDate} ${item.endDateTime}`, 'YYYY-MM-DD HH:mm:ss');

            const minutes = end.diff(start, 'minute');
            menit += minutes;
        });

        return { menit, date };
    };

    const params = new URLSearchParams(window.location.search);
    const paramEntries = Object.fromEntries(params.entries());

    console.log(paramEntries);

    const onSubmit = async (values, type, id, listImage, fileList) => {
        handleClose();
    };

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
                <Button onClick={() => setModal({ formFields: rhkFields, trigger: true, modalData: record.rhk, title: `Lihat Visi ${record.rhk._id}`, type: 'show' })} icon={<SearchOutlined />}>
                    Info
                </Button>
            )
        },
        {
            title: 'Tanggal',
            dataIndex: 'date',
            key: 'date',
            sorter: (a, b) => a.date.length - b.date.length,
            render: (record) => dateFormatter(record)
        },
        {
            title: 'Deskripsi Kegiatan',
            dataIndex: 'deskripsiKegiatan',
            key: 'deskripsiKegiatan',
            sorter: (a, b) => a.deskripsiKegiatan.length - b.deskripsiKegiatan.length,
        },
        {
            title: 'Nama Kegiatan',
            dataIndex: 'namaKegiatan',
            key: 'namaKegiatan',
            sorter: (a, b) => a.namaKegiatan.length - b.namaKegiatan.length,
        },
        {
            title: 'Waktu Mulai',
            dataIndex: 'startDateTime',
            key: 'startDateTime',
            sorter: (a, b) => a.startDateTime.length - b.startDateTime.length,
        },
        {
            title: 'Waktu Selesai',
            dataIndex: 'endDateTime',
            key: 'endDateTime',
            sorter: (a, b) => a.endDateTime.length - b.endDateTime.length,
        },
        {
            title: 'Status',
            dataIndex: 'msg',
            key: 'msg',
            render: (_, record) => (
                <>
                    {console.log(record)}
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
            title: 'SKP',
            dataIndex: 'skp',
            key: 'skp',
            render: (_, record) => (record.isSKP ? <CheckCircleOutlined /> : <CloseCircleOutlined />),

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
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="small">
                    <Button
                        // type='primary'
                        onClick={() => {
                            confirm({
                                title: `Tambahkan ke dalam SKP?`,
                                icon: <CheckCircleFilled style={{ color: '#3b82f6' }} />,
                                content: <span>Klik ok untuk menambahkan kedalam SKP</span>,
                                async onOk() {
                                    const dt = {
                                        ...record,
                                        isSKP: true,
                                        rhk: record.rhk._id,
                                        user_id: String(record.user_id)
                                    };
                                    const res = await update(record._id, dt);
                                    if (res.ok) {
                                        fetchData();
                                    }
                                },
                                onCancel() {
                                    console.log('Cancel');
                                }
                            });
                        }}
                        size="middle"
                        icon={<PlusOutlined />}
                    >
                        Tambah Kedalam SKP
                    </Button>
                </Space>
            )
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

    const handleClose = () => {
        setModal({ trigger: false, modalData: null });
    };

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
                            Detail Data Harian
                        </Title>
                        <div></div>
                    </div>
                    <div>
                        <Card type="inner" title="Status" className="mb-6">
                            <div className="grid grid-flow-row divide-y text-xs">
                                <div className="flex items-center justify-between py-2">
                                    <span className="uppercase font-semibold">Tanggal</span>
                                    <p className="text-right uppercase">{dt?.date}</p>
                                </div>
                                <div className="flex items-center justify-between py-2">
                                    <span className="uppercase font-semibold">Total Menit</span>
                                    <p className="text-right uppercase">{dt?.menit} menit</p>
                                </div>
                                <div className="flex items-center justify-between py-2">
                                    <span className="uppercase font-semibold">Sisa Menit Yang Harus DIcapai</span>
                                    <p className="text-right uppercase">{dt?.menit - MENIT} Menit</p>
                                </div>
                            </div>
                        </Card>
                    </div>
                    <div className="overflow-x-auto">
                        <DataTable columns={Column} data={harian} loading={loading} />
                    </div>
                    <CrudModal title={modal.title} isModalOpen={modal.trigger} data={modal.modalData} onSubmit={onSubmit} onClose={handleClose} formFields={modal.formFields} type={modal.type}></CrudModal>
                </div>
            </Card>
        </div>
    );
};

export default page;
