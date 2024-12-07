'use client';

import { Alert, Breadcrumb, Button, Card, List, Modal, Progress, Space, Table, Tag, Typography } from 'antd';
import { PlusOutlined, EditOutlined, EyeOutlined, DeleteOutlined, DatabaseOutlined, SearchOutlined, CheckCircleFilled, CheckCircleOutlined, CloseCircleOutlined, ExclamationOutlined, DownloadOutlined, OrderedListOutlined } from '@ant-design/icons';
import { DataTable, CrudModal, InfoModal, DataLoading } from '@/components';
import { dateFormatter } from '@/utils';
import React, { useEffect, useState } from 'react';
import { destroy, getAll, store, update, getByUserId, getByUserIdAbsence } from '@/controller/HarianController';
import useFetchData from '@/hooks/useFetchData';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { dummyAktivitas, dummyfileList } from '@/data/dummyData';
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
    const [infoModal, setInfoModal] = useState({ trigger: false, title: '', onClose: () => {}, data: null, type: '', isLoading: false, column: [] });
    const [fileModal, setFileModal] = useState({ trigger: false, modalData: [] });
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

    const somthing = {
        msg: {
            status: 'Terima',
            message: ''
        },
        _id: '674c5037da4c0da45c146347',
        absence: '1',
        date: '2024-10-01T00:00:00.000Z',
        isSKP: false,
        startDateTime: '05:00:00',
        endDateTime: '07:00:00',
        progress: 23,
        rhk: {
            _id: '6749ad9fbce9981ab0384ce2',
            skp: {
                _id: '6749ad9ebce9981ab0384cd2',
                periode_awal: '2024-11-28T16:00:00.000Z',
                periode_akhir: '2024-11-29T16:00:00.000Z',
                user_id: '980035363',
                skp: ['6749ad76bce9981ab0384c83'],
                periodeRKT: '6749ad4cbce9981ab0384c64',
                renstra: '6749accabce9981ab0384bba',
                jabatan: [
                    {
                        id_posjab: 'fb13dd64-d12d-4bb4-bed9-55b3da71c282',
                        unor: {
                            id: '8ae482855a71b686015a74eabbde7454',
                            nama: 'BIDANG PENGADAAN, PEMBERHENTIAN DAN INFORMASI KEPEGAWAIAN',
                            atasan: {
                                unor_id: '8ae482a75a4bd60d015a4d1931d72258',
                                unor_nama: 'BADAN KEPEGAWAIAN DAN PENGEMBANGAN SUMBER DAYA MANUSIA',
                                unor_jabatan: 'KEPALA BADAN KEPEGAWAIAN DAN PENGEMBANGAN SUMBER DAYA MANUSIA',
                                asn: {
                                    idasn_atasan: '980038195',
                                    nip_atasan: '196710281989021002',
                                    nama_atasan: 'SUPRATMAN NENTO'
                                }
                            },
                            induk: {
                                id: '8ae482a75a4bd60d015a4d1931d72258',
                                id_simpeg: 2171,
                                nama: 'BADAN KEPEGAWAIAN DAN PENGEMBANGAN SUMBER DAYA MANUSIA'
                            }
                        },
                        jenis_jabatan: {
                            id: '1',
                            nama: 'Jabatan Struktural'
                        },
                        jabatan_status: {
                            id: 7,
                            nama: 'Administrator'
                        },
                        eselon: {
                            id: '32',
                            nama: 'III.b'
                        },
                        golongan_pns: {
                            id: '34',
                            nama: 'III/d'
                        },
                        golongan_pppk: {
                            id: '',
                            nama: null
                        },
                        jabfung: {
                            id: 'null',
                            nama: null
                        },
                        jabfungum: {
                            id: 'null',
                            nama: null
                        },
                        id_asn: '980035363',
                        nama_asn: 'SYAIFUL SAFRIL LUMA',
                        jenis_asn: 'PNS',
                        nama_jabatan: 'KEPALA BIDANG PENGADAAN, PEMBERHENTIAN DAN INFORMASI KEPEGAWAIAN',
                        tmt_jabatan: '2023-01-06',
                        tunjangan: 980000,
                        pejabat_sk: 'BUPATI POHUWATO',
                        nomor_sk: '1/SK-Bup/BKPSDM/133-I',
                        tgl_sk: '2023-01-06',
                        doc: 'fb13dd64-d12d-4bb4-bed9-55b3da71c282_197904012005011015_1731380829854.pdf',
                        userId: '980035363',
                        NCSISTIME: '2024-11-12 03:09:46.856'
                    }
                ],
                status: 'approved',
                pendekatan: 'kuantitatif',
                keterangan: '',
                createdAt: '2024-11-29T12:03:42.490Z',
                updatedAt: '2024-11-29T12:03:42.490Z',
                __v: 0,
                id: '6749ad9ebce9981ab0384cd2'
            },
            desc: 'lkasjd',
            rhk: '6749ad77bce9981ab0384c97',
            jenis: 'utama',
            klasifikasi: 'organisasi',
            createdAt: '2024-11-29T12:03:43.696Z',
            updatedAt: '2024-11-29T12:03:43.696Z',
            __v: 0,
            id: '6749ad9fbce9981ab0384ce2'
        },
        namaKegiatan: 'alksdjalksdj',
        deskripsiKegiatan: 'kajsdalkjsd',
        tautan: 'https://www.notion.so/Revisi-Hari-ini-1138d9a7c625800cb232fabe8dcc9178',
        files: [],
        user_id: '980035363',
        createdAt: '2024-12-01T12:01:59.476Z',
        updatedAt: '2024-12-01T12:03:08.535Z',
        __v: 0
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
            dataIndex: 'msg',
            key: 'msg',
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
            title: 'Bukti',
            dataIndex: 'file',
            key: 'file',
            render: (_, record) => (
                <>
                    <Button size="middle" color="default" onClick={() => setFileModal({ trigger: true, modalData: dummyfileList })} icon={<OrderedListOutlined />} />
                    <Modal open={fileModal.trigger} onCancel={() => setFileModal({ modalData: null, trigger: false })} footer={null}>
                        <List
                            className="my-6"
                            itemLayout="horizontal"
                            dataSource={fileModal.modalData}
                            renderItem={(item) => (
                                <List.Item>
                                    <div className="w-full flex justify-between items-center">
                                        <div>
                                            <p>{item.filename}</p>
                                            <small>{item.deskripsi}</small>
                                        </div>
                                        <div>
                                            <Button size="small" icon={<DownloadOutlined />} />
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
                            console.log(record);
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
                        <InfoModal close={infoModal.onClose} data={infoModal.data} isModalOpen={infoModal.trigger} title={infoModal.title} columns={infoModal.column} isLoading={infoModal.isLoading} type={infoModal.type} />
                    </div>
                </Card>
            )}
        </div>
    );
};

export default page;
