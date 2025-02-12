'use client';

import { Alert, Breadcrumb, Button, Card, List, Modal, Progress, Space, Table, Tag, Typography } from 'antd';
import { PlusOutlined, EditOutlined, EyeOutlined, DeleteOutlined, DatabaseOutlined, OrderedListOutlined, ExclamationOutlined, DownloadOutlined, SearchOutlined, HistoryOutlined, SendOutlined, WarningOutlined, LinkOutlined } from '@ant-design/icons';
import { DataTable, CrudModal, DataLoading, InfoModal } from '@/components';
import React, { useEffect, useState } from 'react';
import { destroy, getAll, store, update, getById, getByAbsence } from '@/controller/HarianController';
import useFetchData from '@/hooks/useFetchData';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { dateFormatter, renderStatusTag } from '@/utils';
import { getData } from '@/controller/AuthorizationController';
import { getByUnitId } from '@/controller/PeriodeRKTController';
import { getByUserId as getSKPByUser } from '@/controller/SKPController';
import { getById as getAbsence } from '@/controller/AbsenceController';
import { getByNIP } from '@/controller/IDSN/JabatanController';
import dayjs from 'dayjs';
import { dummyfileList } from '@/data/dummyData';
import TextArea from 'antd/es/input/TextArea';
import useNotification from '@/app/hook/useNotification';

const { Title } = Typography;

const page = () => {
    const router = useRouter();
    const { IdHarian } = useParams();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [modal, setModal] = useState({ trigger: false, modalData: null, title: '' });
    const [infoModal, setInfoModal] = useState({ trigger: false, title: '', onClose: () => { }, data: null, type: '', isLoading: false, column: [] });
    const [feedBackModal, setFeedbackModal] = useState({ trigger: false, modalData: [] });
    const [fileModal, setFileModal] = useState({ trigger: false, modalData: [] });
    const [rhk, setRHK] = useState(null);
    const [skp, setSKP] = useState(null);
    const [absence, setAbsence] = useState(null);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [selectedFeedback, setSelectedFeedback] = useState(null);
    const { data: user, setData: setUser } = useFetchData(getData);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, filters: {}, total: 0 });
    const { success, error } = useNotification()

    useEffect(() => {
        if (user) {
            fetchData();
        }
    }, [user, pagination.page, pagination.limit]);


    const fetchData = async () => {
        try {
            const data = await getByAbsence(IdHarian, pagination.page, pagination.limit, pagination.filters);
            console.log(data);
            setPagination({ ...pagination, page: data.data.pagination.currentPage, limit: data.data.pagination.pageSize, total: data.data.pagination.totalItems });

            const skp = await getSKPByUser(user.user.nipBaru, 'undefined', 'undefined', {
                status: { $in: [ 'approved'] }
            });
            const absence = await getAbsence(IdHarian);
            setAbsence(absence.data);

            const rhks = skp?.data.flatMap((item) => item.rhks);
            setSKP(skp.data);
            setRHK(rhks);
            setData(data.data.data);
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    };

    const params = new URLSearchParams(window.location.search);
    const paramEntries = Object.fromEntries(params.entries());


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
                skp: values.skp,
                absence: IdHarian,
                date: absence.date,
                startDateTime: dayjs(values.startDateTime).format('HH:mm:ss').toString(),
                endDateTime: dayjs(values.endDateTime).format('HH:mm:ss').toString(),
                rhk: values.rhk,
                namaKegiatan: values.namaKegiatan,
                deskripsiKegiatan: values.deskripsiKegiatan,
                tautan: values.tautan,
                files: updatedListImage,
                progress: values.progress
            };


            switch (type) {
                case 'create':
                    response = await store(dt);
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

            if (response.ok) {
                fetchData();
                success('Berhasil', type === 'delete' ? 'Berhasil Menghapus Aktivitas' : type === 'edit' ? 'Berhasil Mengedit Aktivitas' : 'Berhasil Menambahkan Aktivitas')
            } else {
                if (Array.isArray(response.data)) {
                    response.data.forEach((err) => {
                        error('Gagal', err);
                    });
                } else {
                    error('Gagal', response.data);
                }
            }
        } catch (err) {
            error('Gagal', err.message);
        }
        setSubmitLoading(false);

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
            )
        },
        {
            title: 'Status',
            dataIndex: 'msg',
            key: 'msg',
            sorter: (a, b) => a.msg.length - b.msg.length,
            render: (_, record) => (
                <div className="inline-flex items-center">
                    {renderStatusTag(record.status)}
                    <Button
                        variant="link"
                        icon={<HistoryOutlined />}
                        color="primary"
                        onClick={() => {
                            setFeedbackModal({ trigger: true, modalData: record.messageHarian });
                        }}
                    />
                    <Modal open={feedBackModal.trigger} onCancel={() => setFeedbackModal({ modalData: null, trigger: false })} footer={null} width={800}>
                        <div className="w-full grid grid-cols-12 items-start gap-4">
                            <List
                                className="w-full col-span-6 mt-6"
                                itemLayout="horizontal"
                                dataSource={feedBackModal.modalData}
                                renderItem={(item) => (
                                    <List.Item>
                                        <button className="inline-flex items-center justify-between w-full hover:bg-gray-100 p-3 rounded-md" onClick={() => setSelectedFeedback(item)}>
                                            <div className="inline-flex gap-x-2 items-center">
                                                <HistoryOutlined />
                                                <b>{dateFormatter(item.createdAt)}</b>
                                            </div>
                                            {renderStatusTag(item.status)}
                                        </button>
                                    </List.Item>
                                )}
                            />
                            {/* Chat Bubble & Reply Input */}
                            <div className="col-span-6 w-full p-6 border border-gray-300 mt-6 h-80 rounded-lg flex flex-col justify-between">
                                <div className="flex flex-col gap-y-2">
                                    {selectedFeedback ? (
                                        <div className="p-3 rounded-md border border-gray-300 text-sm">{selectedFeedback.isi}</div>
                                    ) : (
                                        <Card className=" mb-4">
                                            <div className="flex gap-x-6">
                                                <WarningOutlined className="text-yellow-500 text-lg" width={200} />
                                                <p className="text-xs">Pilih salah satu item histori disamping untuk melakukan feedback</p>
                                            </div>
                                        </Card>
                                    )}
                                </div>
                                <div className="w-full grid grid-cols-12 gap-4">
                                    <TextArea disabled={!selectedFeedback} placeholder="Masukkan feedback" className="col-span-9 text-sm" />
                                    <Button onClick={async () => {
                                        
                                    }} disabled={!selectedFeedback} icon={<SendOutlined />} variant="solid" color="primary" className="col-span-3">
                                        Kirim
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Modal>
                </div>
            )
        },
        {
            title: 'Progress',
            dataIndex: 'progress',
            key: 'progress',
            render: (_, record) => <span>{record.progress} %</span>,
        },
        {
            title: 'Tautan',
            dataIndex: 'tautan',
            key: 'tautan',
            render: (_, record) => (
                <Button
                    variant='solid'
                    onClick={() => window.open(record.tautan, "_blank", "noopener,noreferrer")}
                    icon={<LinkOutlined />}
                />
            )
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
                                            <Button
                                                size="small"
                                                icon={<DownloadOutlined />}
                                                onClick={() => {
                                                    const a = document.createElement('a');
                                                    a.href = process.env.NEXT_PUBLIC_API_IMAGE_URL + '/' + item.fileId;
                                                    a.download = item.name;
                                                    a.click();
                                                }}
                                            />
                                        </div>
                                    </div>
                                </List.Item>
                            )}
                        />
                    </Modal>
                </>
            ),
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
                                formFields: formFields,
                                modalData: {
                                    ...record,
                                    skp: { label: `${dateFormatter(record.rhk.skp.periode_awal)} - ${dateFormatter(record.rhk.skp.periode_akhir)}`, value: record.rhk.skp._id },
                                    rhk: { label: record.rhk.desc, value: record.rhk._id },
                                    startDateTime: dayjs(`${dayjs().format("YYYY-MM-DD")} ${record.startDateTime}`, "YYYY-MM-DD HH:mm:ss"),
                                    endDateTime: dayjs(`${dayjs().format("YYYY-MM-DD")} ${record.endDateTime}`, "YYYY-MM-DD HH:mm:ss"),
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
                                formFields: formFields,
                                modalData: {
                                    ...record,
                                    skp: { label: `${dateFormatter(record.rhk.skp.periode_awal)} - ${dateFormatter(record.rhk.skp.periode_akhir)}`, value: record.rhk.skp._id },
                                    rhk: { label: record.rhk.desc, value: record.rhk._id },
                                    startDateTime: dayjs(`${dayjs().format("YYYY-MM-DD")} ${record.startDateTime}`, "YYYY-MM-DD HH:mm:ss"),
                                    endDateTime: dayjs(`${dayjs().format("YYYY-MM-DD")} ${record.endDateTime}`, "YYYY-MM-DD HH:mm:ss"),
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
        // {
        //     label: 'Periode',
        //     name: 'periodeRKT',
        //     type: 'select',

        //     options: periode?.map((item) => ({
        //         label: `${dateFormatter(item.periode_start)} - ${dateFormatter(item.periode_end)}`,
        //         value: item._id,
        //         id: item._id
        //     }))
        // },
        {
            label: 'SKP',
            name: 'skp',
            type: 'select',

            options: skp?.map((item) => ({
                label: `${dateFormatter(item.periode_awal)} - ${dateFormatter(item.periode_akhir)}`,
                value: item._id
                // id_option_parent: item.periodeRKT,
                // id: item._id
            }))
            // parentField: 'periodeRKT'
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
           
            {loading ? (
                <DataLoading loadingData={loading} />
            ) : (
                <>
                    <Card className="">
                        <div className="flex flex-col">
                            <div className="flex items-center justify-between mb-12">
                                <Title className="mt-2" level={5}>
                                    Detail Data Harian
                                </Title>
                                <div>
                                    <Button type="primary" icon={<PlusOutlined />} onClick={() => setModal({ formFields: formFieldas, modalData: null, title: 'Tambah Data', trigger: true, type: 'create' })}>
                                        Tambah
                                    </Button>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <DataTable columns={Column} data={data} loading={loading} />
                            </div>

                        </div>
                    </Card>
                    <CrudModal isLoading={submitLoading} title={modal.title} isModalOpen={modal.trigger} data={modal.modalData} onSubmit={onSubmit} onClose={handleClose} formFields={modal.formFields} type={modal.type}></CrudModal>
                    <InfoModal close={infoModal.onClose} data={infoModal.data} isModalOpen={infoModal.trigger} title={infoModal.title} columns={infoModal.column} isLoading={infoModal.isLoading} type={infoModal.type} />
                </>

            )}
        </div>
    );
};

export default page;
