'use client';

import { Alert, Breadcrumb, Button, Card, List, Modal, Progress, Space, Table, Tag, Tooltip, Typography } from 'antd';
import { PlusOutlined, EditOutlined, EyeOutlined, DeleteOutlined, DatabaseOutlined, SearchOutlined, CheckCircleFilled, CheckCircleOutlined, CloseCircleOutlined, ExclamationOutlined, DownloadOutlined, OrderedListOutlined, HistoryOutlined, WarningOutlined, SendOutlined, LinkOutlined, ReloadOutlined } from '@ant-design/icons';
import { DataTable, CrudModal, InfoModal, DataLoading } from '@/components';
import { dateFormatter, renderStatusTag } from '@/utils';
import React, { useEffect, useState } from 'react';
import { destroy, getAll, store, update, getByUserId, getByUserIdAbsence, getByAbsence } from '@/controller/HarianController';
import useFetchData from '@/hooks/useFetchData';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { dummyAktivitas, dummyfileList } from '@/data/dummyData';
import { getData } from '@/controller/AuthorizationController';
import { getById as getAbsenceById } from '@/controller/AbsenceController';
import { getByUnitId } from '@/controller/PeriodeRKTController';
import { getByUserId as getSKPByUser } from '@/controller/SKPController';
import { getByNIP } from '@/controller/IDSN/JabatanController';
import dayjs from 'dayjs';
import { formatDateToDayMonthYear } from '@/utils/util';
import TextArea from 'antd/es/input/TextArea';

const { Title } = Typography;
const { confirm } = Modal;

const page = () => {
    const router = useRouter();
    const { IdBawahan, IdHarian } = useParams();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);

    const [modal, setModal] = useState({ trigger: false, modalData: null, title: '', formFields: [] });
    const [infoModal, setInfoModal] = useState({ trigger: false, title: '', onClose: () => { }, data: null, type: '', isLoading: false, column: [] });
    const [fileModal, setFileModal] = useState({ trigger: false, modalData: [] });
    const [feedBackModal, setFeedbackModal] = useState({ trigger: false, modalData: [] });
    const [selectedFeedback, setSelectedFeedback] = useState(null);
    const [alert, setAlert] = useState({ show: false, message: null, description: null, type: 'info' });
    const [harian, setHarian] = useState(null);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, filters: {}, total: 0 });

    const { data: user, setData: setUser } = useFetchData(getData);

    const MENIT = process.env.NEXT_PUBLIC_TIME;
    useEffect(() => {
        if (user) {
            fetchData();
        }
    }, [user, pagination.page, pagination.limit]);

    console.log(data);
    const fetchData = async () => {
        try {
            console.log(IdHarian);
            console.log(IdHarian);

            const data = await getByAbsence(IdHarian, pagination.page, pagination.limit, {
                ...pagination.filters,
                // status: { $in: ['approved', ] }
            });

            setData(data.data.data)
            setPagination({ ...pagination, page: data.data.pagination.currentPage, limit: data.data.pagination.pageSize, total: data.data.pagination.totalItems });
            const harian = getAbsenceById(IdHarian);
            setHarian(harian.data);
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    };


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
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
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
                                    <Button disabled={!selectedFeedback} icon={<SendOutlined />} variant="solid" color="primary" className="col-span-3">
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
                        // type='primary'
                        onClick={() => {
                            confirm({
                                title: `Tambahkan ke dalam SKP?`,
                                icon: <CheckCircleFilled style={{ color: '#3b82f6' }} />,
                                content: <span>Klik ok untuk menambahkan kedalam SKP</span>,
                                async onOk() {
                                    const dt = {
                                        ...record,
                                        isSKP: !record.isSKP,
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
                        {record.isSKP ? 'Keluarkan dari SKP' : 'Tambahkan ke SKP'}
                    </Button>
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
                                        key: 'skp',
                                        label: 'SKP',
                                        children: record.isSKP ? 'SKP' : 'Bukan SKP'
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
                                <Tooltip title="Refresh Data">
                                    <Button icon={<ReloadOutlined />} onClick={() => fetchData()} />
                                </Tooltip>
                            </div>
                        </div>
                        <div>
                            <Card type="inner" title="Status" className="mb-6">
                                <div className="grid grid-flow-row divide-y text-xs">
                                    <div className="flex items-center justify-between py-2">
                                        <span className="uppercase font-semibold">Nama ASN</span>
                                        <p className="text-right uppercase">{data[0]?.skp.skp[0].jabatan[0].nama_asn}</p>
                                    </div>
                                    <div className="flex items-center justify-between py-2">
                                        <span className="uppercase font-semibold">Jabatan ASN</span>
                                        <p className="text-right uppercase">{data[0]?.skp.skp[0].jabatan[0].nama_jabatan}</p>
                                    </div>
                                    <div className="flex items-center justify-between py-2">
                                        <span className="uppercase font-semibold">Jabatan ASN</span>
                                        <p className="text-right uppercase">{data[0]?.skp.skp[0].jabatan[0].nip_asn}</p>
                                    </div>
                                    <div className="flex items-center justify-between py-2">
                                        <span className="uppercase font-semibold">Jabatan ASN</span>
                                        <p className="text-right uppercase">{data[0]?.skp.skp[0].jabatan[0].unor.nama}</p>
                                    </div>
                                    <div className="flex items-center justify-between py-2">
                                        <span className="uppercase font-semibold">Status Kehadiran</span>
                                        <p className="text-right uppercase"></p>
                                    </div>
                                    <div className="flex items-center justify-between py-2">
                                        <span className="uppercase font-semibold">Tanggal</span>
                                        <p className="text-right uppercase">{formatDateToDayMonthYear(data?.date)}</p>
                                    </div>
                                    <div className="flex items-center justify-between py-2">
                                        <span className="uppercase font-semibold">Total Menit</span>
                                        <p className="text-right uppercase">{data?.menit} menit</p>
                                    </div>
                                    <div className="flex items-center justify-between py-2">
                                        <span className="uppercase font-semibold">Sisa Menit Yang Harus DIcapai</span>
                                        <p className="text-right uppercase">{data?.menit - MENIT} Menit</p>
                                    </div>
                                </div>
                            </Card>
                        </div>
                        <div className="overflow-x-auto">
                            <DataTable columns={Column} data={data} loading={loading} />
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
