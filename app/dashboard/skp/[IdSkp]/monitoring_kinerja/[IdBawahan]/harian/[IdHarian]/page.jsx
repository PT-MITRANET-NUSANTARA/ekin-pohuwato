'use client';

import { Alert, Breadcrumb, Button, Card, Space, Table, Tag, Typography } from 'antd';
import { PlusOutlined, EditOutlined, EyeOutlined, DeleteOutlined, DatabaseOutlined } from '@ant-design/icons';
import { DataTable, CrudModal } from '@/components';
import React, { useEffect, useState } from 'react';
import { destroy, getAll, store, update, getByUserId, getByUserIdAbsence } from '@/controller/HarianController';
import useFetchData from '@/hooks/useFetchData';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { dummyAktivitas } from '@/data/dummyData';
import { getData } from '@/controller/AuthorizationController';
import { getByUserId as getRHKByUserId } from '@/controller/RHKController';
import { getByUnitId } from '@/controller/PeriodeRKTController';
import { getByUserId as getSKPByUser } from '@/controller/SKPController';
import { getByNIP } from '@/controller/IDSN/JabatanController';
import dayjs from 'dayjs';

const { Title } = Typography;

const page = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const { data, setData } = useFetchData(getData);
    const [modal, setModal] = useState({ trigger: false, modalData: null, title: '' });
    const [alert, setAlert] = useState({ show: false, message: null, description: null, type: 'info' });
    const [harian, setHarian] = useState(null);
    const [rhk, setRHK] = useState(null);
    const [periode, setPeriode] = useState(null);
    const [skp, setSKP] = useState(null);

    useEffect(() => {
        if (data) {
            fetchData();
        }
    }, [data]);

    const fetchData = async () => {
        try {
            const harian = await getByUserIdAbsence(data.user.idASN, paramEntries._id);
            const jabatan = await getByNIP(data.token, data.user.nipBaru);
            const selectedJabatan = jabatan.mapData.data[0];
            const periode = await getByUnitId(selectedJabatan.unor.induk.id);
            console.log('HERE', data.user.idASN);

            const skp = await getSKPByUser(data.user.idASN);
            const rhks = skp?.data.flatMap((item) => item.rhks);
            setSKP(skp.data);
            setPeriode(periode.data);
            setRHK(rhks);
            setHarian(harian.data);
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    };

    console.log('harian', harian);

    const params = new URLSearchParams(window.location.search);
    const paramEntries = Object.fromEntries(params.entries());

    console.log(paramEntries);

    const onSubmit = async (values, type, id, listImage, fileList) => {
        try {
            let response;
            let dt = {};
            const updatedListImage = listImage.map((img) => {
                const matchingFile = fileList.find((file) => file.uid === img.uid);

                if (matchingFile) {
                    return {
                        ...img,
                        name: matchingFile.name,
                        type: matchingFile.type
                    };
                }

                return img;
            });

            dt = {
                absence: paramEntries._id,
                date: new Date(paramEntries.tanggal),
                startDateTime: dayjs(values.startDateTime).format('HH:mm:ss').toString(),
                endDateTime: dayjs(values.endDateTime).format('HH:mm:ss').toString(),
                rhk: values.rhk,
                namaKegiatan: values.namaKegiatan,
                deskripsiKegiatan: values.deskripsiKegiatan,
                tautan: values.tautan,
                files: updatedListImage,
                user_id: data.user.idASN,
                progress: values.progress
            };
            switch (type) {
                case 'create':
                    response = await store(data.user.idASN, dt);
                    break;

                case 'edit':
                    response = await update(id, dt);
                    break;

                case 'delete':
                    response = await destroy(id);
                    break;

                default:
                    throw new Error('Tipe operasi tidak valid');
            }
            console.log(response);

            if (response.ok) {
                const data = await getByUserIdAbsence(data.user.idASN, paramEntries._id);
                setData(data.data);
                setAlert({
                    show: true,
                    message: response.msg,
                    description: type === 'delete' ? 'Berhasil Menghapus Renstra' : type === 'edit' ? 'Berhasil Mengedit Renstra' : 'Berhasil Menambahkan Renstra',
                    type: 'success'
                });
            } else {
                setAlert({
                    show: true,
                    message: 'Gagal',
                    description: response.msg,
                    type: 'error'
                });
            }
        } catch (error) {
            setAlert({
                show: true,
                message: 'Error',
                description: error.message,
                type: 'error'
            });
        }

        console.log('Operation completed');
        handleClose();
    };

    const nana = {
        msg: {
            status: 'Tolak',
            message: 'asdasdasdasd'
        },
        _id: '670c09659010d31cd776c6b1',
        absence: '1',
        date: '2024-10-01T00:00:00.000Z',
        startDateTime: '01:54:34',
        endDateTime: '02:00:00',
        progress: 13,
        rhk: '670bab4f840afac78955f60a',
        namaKegiatan: '2',
        deskripsiKegiatan: '22',
        tautan: 'https://github.com/',
        files: [
            {
                uid: 'rc-upload-1728842054437-5',
                fileId: '55ffbbfb-dbf9-420b-adcf-dddc215980fb',
                name: 'fox.jpg',
                type: 'image/jpeg'
            },
            {
                uid: 'rc-upload-1728842054437-6',
                fileId: 'ce99e970-a377-46a6-a794-533916464a74',
                name: 'Frame 5 (2).png',
                type: 'image/png'
            }
        ],
        user_id: '980035363',
        createdAt: '2024-10-13T17:54:45.144Z',
        updatedAt: '2024-10-14T12:33:53.576Z',
        __v: 0
    };

    const Column = [
        {
            title: 'ID',
            dataIndex: '_id',
            key: '_id',
            sorter: (a, b) => a._id.length - b._id.length,
            width: '10%'
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
                                    <Tag color="red" className="capitalize w-fit">
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
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="small">
                    <Button
                        // type='primary'
                        size="middle"
                        icon={<PlusOutlined />}
                    >
                      Tambah Kedalam SKP
                    </Button>
                    
                </Space>
            )
        }
    ];

    const formFields = [
        {
            label: 'Periode',
            name: 'periodeRKT',
            type: 'select',

            options: periode?.map((item) => ({
                label: `${item.periode_start} - ${item.periode_end}`,
                value: item._id,
                id: item._id
            }))
        },
        {
            label: 'SKP',
            name: 'skp',
            type: 'select',

            options: skp?.map((item) => ({
                label: `${item.periode_awal} - ${item.periode_akhir}`,
                value: item._id,
                id_option_parent: item.periodeRKT,
                id: item._id
            })),
            parentField: 'periodeRKT'
        },
        {
            label: 'RHK',
            name: 'rhk',
            type: 'select',
            rules: [
                {
                    required: true,
                    message: 'Field RHK wajib diisi'
                }
            ],
            options: rhk?.map((item) => ({
                label: item.desc,
                value: item._id,
                id_option_parent: item.skp,
                id: item._id
            })),
            parentField: 'skp'
        },
        {
            label: 'Nama Kegiatan',
            name: 'namaKegiatan',
            type: 'text',
            rules: [
                {
                    required: true,
                    message: 'Field nama kegiatan wajib diisi'
                }
            ]
        },
        {
            label: 'Waktu Mulai',
            name: 'startDateTime',
            type: 'time',
            rules: [
                {
                    required: true,
                    message: 'Field waktu mulai wajib diisi'
                }
            ]
        },
        {
            label: 'Waktu Selesai',
            name: 'endDateTime',
            type: 'time',
            rules: [
                {
                    required: true,
                    message: 'Field waktu selesai wajib diisi'
                }
            ]
        },
        {
            label: 'Deskripsi Kegiatan',
            name: 'deskripsiKegiatan',
            type: 'longtext',
            rules: [
                {
                    required: true,
                    message: 'Field deskripsi wajib diisi'
                }
            ]
        },
        {
            label: 'Tautan Kegiatan',
            name: 'tautan',
            type: 'text'
        },
        {
            label: 'Bukti Aktivitas',
            name: 'files',
            type: 'upload'
        },
        {
            label: 'Progress',
            name: 'progress',
            type: 'slider',
            rules: [
                {
                    required: true,
                    message: 'Field progress wajib diisi'
                }
            ],
            min: 1,
            max: 100
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
                        <div>
                            <Button type="primary" icon={<PlusOutlined />} onClick={() => setModal({ modalData: null, title: 'Tambah Data', trigger: true, type: 'create' })}>
                                Tambah
                            </Button>
                        </div>
                    </div>
                    <div>
                        <Card type="inner" title="Status" className="mb-6">
                            <div className="grid grid-flow-row divide-y text-xs">
                              
                                <div className="flex items-center justify-between py-2">
                                    <span className="uppercase font-semibold">Status</span>
                                    <p className="text-right uppercase">Status</p>
                                </div>
                                
                            </div>
                        </Card>
                    </div>
                    <div className="overflow-x-auto">
                        <DataTable columns={Column} data={harian} loading={loading} />
                    </div>
                    <CrudModal title={modal.title} isModalOpen={modal.trigger} data={modal.modalData} onSubmit={onSubmit} onClose={handleClose} formFields={formFields} type={modal.type}></CrudModal>
                </div>
            </Card>
        </div>
    );
};

export default page;
