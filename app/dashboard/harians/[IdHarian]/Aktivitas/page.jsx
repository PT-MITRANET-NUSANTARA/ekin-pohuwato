'use client';

import { Alert, Breadcrumb, Button, Card, List, Modal, Progress, Space, Table, Tag, Typography } from 'antd';
import { PlusOutlined, EditOutlined, EyeOutlined, DeleteOutlined, DatabaseOutlined, OrderedListOutlined, ExclamationOutlined, DownloadOutlined, SearchOutlined } from '@ant-design/icons';
import { DataTable, CrudModal, DataLoading, InfoModal } from '@/components';
import React, { useEffect, useState } from 'react';
import { destroy, getAll, store, update, getByUserId, getByUserIdAbsence } from '@/controller/HarianController';
import useFetchData from '@/hooks/useFetchData';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { dateFormatter } from '@/utils';
import { getData } from '@/controller/AuthorizationController';
import { getByUnitId } from '@/controller/PeriodeRKTController';
import { getByUserId as getSKPByUser } from '@/controller/SKPController';
import { getByNIP } from '@/controller/IDSN/JabatanController';
import dayjs from 'dayjs';
import { dummyfileList } from '@/data/dummyData';

const { Title } = Typography;

const page = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const { data, setData } = useFetchData(getData);
    const [modal, setModal] = useState({ trigger: false, modalData: null, title: '' });
    const [infoModal, setInfoModal] = useState({ trigger: false, title: '', onClose: () => {}, data: null, type: '', isLoading: false, column: [] });
    const [fileModal, setFileModal] = useState({ trigger: false, modalData: [] });
    const [alert, setAlert] = useState({ show: false, message: null, description: null, type: 'info' });
    const [harian, setHarian] = useState(null);
    const [rhk, setRHK] = useState(null);
    const [periode, setPeriode] = useState(null);
    const [skp, setSKP] = useState(null);
    const [submitLoading, setSubmitLoading] = useState(false);

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
            setSubmitLoading(true);
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
                date: new Date(paramEntries.date),
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

            console.log(dt);
            
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
                const res = await getByUserIdAbsence(data.user.idASN, paramEntries._id);
                setHarian(res.data);
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
        setSubmitLoading(false);

        console.log('Operation completed');
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
            title: 'Tanggal',
            dataIndex: 'date',
            key: 'date',
            sorter: (a, b) => a.date.length - b.date.length,
            width: '30%',
            render: (record) => dateFormatter(record)
        },
        {
            title: 'RHK',
            dataIndex: 'rhk',
            key: 'rhk',
            render: (_, record) => (
                <>
                    <Button onClick={() => setModal({ formFields: rhkFields, trigger: true, modalData: record.rhk, title: `Lihat RHK ${record.rhk._id}`, type: 'show' })} icon={<SearchOutlined />}>
                        Info
                    </Button>
                </>
                // console.log(record)
            )
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
            title: 'Progress',
            dataIndex: 'progress',
            key: 'progress',
            render: (_, record) => <span>{record.progress} %</span>,
            width: '240px'
        },
        {
            title: 'Tautan',
            dataIndex: 'tautan',
            key: 'tautan',
            render: (_, record) => (
                <a href={record.tautan} target="_blank" rel="noopener noreferrer">
                    Lihat Tautan
                </a>
            ),
        },
        {
            title: 'Bukti',
            dataIndex: 'file',
            key: 'file',
            render: (_, record) => (
                <>
                    <Button size="middle" color="default" onClick={() => setFileModal({ trigger: true, modalData: record.files })} icon={<OrderedListOutlined />} />
                    <Modal open={fileModal.trigger} onCancel={() => setFileModal({ modalData: null, trigger: false })} footer={null}>
                        <List
                            className="my-6"
                            itemLayout="horizontal"
                            dataSource={fileModal.modalData}
                            renderItem={(item) => (
                                <List.Item>
                                    <div className="w-full flex justify-between items-center">
                                        <div>
                                            <p>{item.name}</p>
                                            <small>{item.fileId}</small>
                                        </div>
                                        <div>
                                        <Button size='small' icon={<DownloadOutlined />} onClick={() => {
                                                    const a = document.createElement('a');
                                                    a.href = process.env.NEXT_PUBLIC_API_IMAGE_URL + '/' + item.fileId;
                                                    a.download = item.name;
                                                    a.click();
                                                }} />
                                        </div>
                                    </div>
                                </List.Item>
                            )}
                        />
                    </Modal>
                </>
            ),
            width: '240px'
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="small">
                    <Button
                        onClick={() =>
                            setModal({
                                trigger: true,
                                modalData: {
                                    ...record,
                                    skp: { label: `${dateFormatter(record.rhk.skp.periode_awal)} - ${dateFormatter(record.rhk.skp.periode_akhir)}`, value: record.rhk.skp._id },
                                    rhk: { label: record.rhk.desc, value: record.rhk._id }
                                },
                                title: `Renstra ${record._id}`,
                                type: 'show'
                            })
                        }
                        // type='primary'
                        size="middle"
                        color="default"
                        icon={<EyeOutlined />}
                    />
                    <Button
                        onClick={() =>
                            setModal({
                                trigger: true,
                                formFields: formFields,
                                modalData: {
                                    ...record,
                                    skp: { label: `${dateFormatter(record.rhk.skp.periode_awal)} - ${dateFormatter(record.rhk.skp.periode_akhir)}`, value: record.rhk.skp._id },
                                    rhk: { label: record.rhk.desc, value: record.rhk._id }
                                },
                                title: `Renstra ${record._id}`,
                                type: 'edit'
                            })
                        }
                        // type='primary'
                        size="middle"
                        icon={<EditOutlined />}
                    />

                    <Button
                        onClick={() =>
                            setModal({
                                trigger: true,
                                modalData: {
                                    formFields: formFields,
                                    ...record,
                                    skp: { label: `${dateFormatter(record.rhk.skp.periode_awal)} - ${dateFormatter(record.rhk.skp.periode_akhir)}`, value: record.rhk.skp._id },
                                    rhk: { label: record.rhk.desc, value: record.rhk._id }
                                },
                                title: `Delete Renstra ${record._id}`,
                                type: 'delete'
                            })
                        }
                        // type='primary'
                        size="middle"
                        color="danger"
                        icon={<DeleteOutlined />}
                    />
                    <Button
                        icon={<ExclamationOutlined />}
                        type="default"
                        onClick={() => {
                            setInfoModal({
                                title: 'Informasi Harian',
                                trigger: true,
                                type: 'desc',
                                data: [
                                    {
                                        key: 'title',
                                        label: 'Nama Kegiatan',
                                        children: record.namaKegiatan
                                    },
                                    {
                                        key: 'desc',
                                        label: 'Deskripsi',
                                        children: record.deskripsiKegiatan
                                    },
                                    {
                                        key: 'start_time',
                                        label: 'Waktu Mulai',
                                        children: record.startDateTime
                                    },
                                    {
                                        key: 'end_time',
                                        label: 'Waktu Selesai',
                                        children: record.endDateTime
                                    },
                                    // {
                                    //     key: 'skp',
                                    //     label: 'SKP',
                                    //     children: record.isSKP ? 'SKP' : 'Bukan SKP'
                                    // },
                                    {
                                        key: 'progress',
                                        label: 'Progress',
                                        children: <Progress type="circle" percent={record.progress} size={80} />
                                    }
                                ],
                                isLoading: false,
                                onClose: () => setInfoModal({ ...infoModal, trigger: false, data: null })
                            });
                        }}
                    />
                </Space>
            )
        }
    ];

    console.log(rhk)

    const rhkFields = [
        {
            label: 'Jenis',
            name: 'jenis',
            type: 'text'
        },
        {
            label: 'Klasifikasi',
            name: 'klasifikasi',
            type: 'text'
        },
        {
            label: 'RHK',
            name: 'desc',
            type: 'longtext'
        }
        
    ];


    const formFields = [
        {
            label: 'Periode',
            name: 'periodeRKT',
            type: 'select',

            options: periode?.map((item) => ({
                label: `${dateFormatter(item.periode_start)} - ${dateFormatter(item.periode_end)}`,
                value: item._id,
                id: item._id
            }))
        },
        {
            label: 'SKP',
            name: 'skp',
            type: 'select',

            options: skp?.map((item) => ({
                label: `${dateFormatter(item.periode_awal)} - ${dateFormatter(item.periode_akhir)}`,
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
            {loading ? (
                <DataLoading loadingData={loading} />
            ) : (
                <Card className="">
                    <div className="flex flex-col">
                        <div className="flex items-center justify-between mb-12">
                            <Title className="mt-2" level={5}>
                                Detail Data Harian
                            </Title>
                            <div>
                                <Button type="primary" icon={<PlusOutlined />} onClick={() => setModal({  formFields: formFields,modalData: null, title: 'Tambah Data', trigger: true, type: 'create' })}>
                                    Tambah
                                </Button>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <DataTable columns={Column} data={harian} loading={loading} />
                        </div>
                        <CrudModal title={modal.title} isModalOpen={modal.trigger} data={modal.modalData} onSubmit={onSubmit} onClose={handleClose} formFields={modal.formFields} type={modal.type}></CrudModal>
                        <InfoModal close={infoModal.onClose} data={infoModal.data} isModalOpen={infoModal.trigger} title={infoModal.title} columns={infoModal.column} isLoading={infoModal.isLoading} type={infoModal.type} />
                    </div>
                </Card>
            )}
        </div>
    );
};

export default page;
