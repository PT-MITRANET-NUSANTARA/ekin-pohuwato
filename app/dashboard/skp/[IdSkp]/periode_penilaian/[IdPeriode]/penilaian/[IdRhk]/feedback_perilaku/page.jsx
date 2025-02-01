'use client';

import { Breadcrumb, Button, Card, Form, InputNumber, List, message, Modal, Progress, Select, Table, Tag, Typography } from 'antd';
import { UserOutlined, DotChartOutlined, PrinterOutlined, ReloadOutlined, SearchOutlined, PlusOutlined, EditOutlined, OrderedListOutlined, DownloadOutlined, ExclamationOutlined, ExclamationCircleFilled, WarningOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { CrudModal, InfoModal } from '@/components';
import { dummyFeedback } from '@/data';
import { title } from 'process';
import { useParams } from 'next/navigation';
import { getById, update } from '@/controller/SKPController';
import { update as updatePerilaku } from '@/controller/PerilakuController';
import { useRouter } from 'next/navigation';
import { getById as getPenilaian } from '@/controller/periodePenilaianController';

const { Title } = Typography;
const { Option } = Select;

import { store, destroy } from '@/controller/penilaianController';
import dayjs from 'dayjs';
import { dateFormatter } from '@/utils';

const page = () => {
    const router = useRouter();
    const { IdRhk, IdSkp, IdPeriode, IdPenilaian } = useParams();
    const [modal, setModal] = useState({ trigger: false, modalData: null, title: '', formFields: [], isRating: false });
    const [infoModal, setInfoModal] = useState({ trigger: false, title: '', onClose: () => { }, data: null, type: '', isLoading: false, column: [] });

    const [data, setData] = useState(null);
    const [buktiModal, setBuktiModal] = useState({ trigger: false, modalData: [] });
    const [fileModal, setFileModal] = useState({ trigger: false, modalData: [] });

    const [loading, setLoading] = useState(true);
    const [atasan, setAtasan] = useState(null);
    const [bawahan, setBawahan] = useState(null);
    const [penilaian, setPenilaian] = useState(null);
    const [periode, setPeriode] = useState(null);
    const [index, setIndex] = useState(0);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const skp = await getById(IdRhk);
            const index = skp.data.skp.findIndex((item) => item._id === IdSkp);
            const bawahan = skp.data.jabatan[index];


            const skpAtasan = await getById(IdSkp);
            if (skpAtasan) {
                const jabatan = skpAtasan.data.jabatan;
                const atasan = jabatan.find((item) => {
                    return item.id_posjab === skp.data.posjab[index];
                });
                setAtasan(atasan);
            }   
            else
            {
                setAtasan(bawahan.unor.atasan)
            }
          

            setData(skp.data);
            setBawahan(bawahan);
            setIndex(bawahan.id_posjab)
        } catch (error) {
            console.log(error);
        }
    };
    console.log(data);
    console.log(atasan);
    console.log(bawahan);

    const formFields = [
        {
            label: 'Isi Feedback',
            name: 'content',
            type: 'longtext',
            rules: [
                {
                    required: true,
                    message: 'Field content wajib di isi'
                }
            ]
        },
        {
            label: 'Kategori',
            name: 'category',
            type: 'select',
            rules: [
                {
                    required: true,
                    message: 'Field periode mulai wajib di isi'
                }
            ],
            options: [
                {
                    label: 'baik',
                    value: true
                },
                {
                    label: 'buruk',
                    value: false
                }
            ]
        }
    ];

    const ratingFileds = [
        {
            label: 'Beri Rating',
            name: 'rating',
            type: 'select',
            options: [
                {
                    label: 'Diatas Ekspektasi',
                    value: 3
                },
                {
                    label: 'Sesuai Ekspektasi',
                    value: 2
                },
                {
                    label: 'Dibawah Ekspektasi',
                    value: 1
                }
            ],
            rules: [
                {
                    required: true,
                    message: 'Field rating wajib di isi'
                }
            ]
        }
    ];

    // const predikatFields = [
    //     {
    //         label: 'Beri Rating',
    //         name: 'rating',
    //         type: 'select',
    //         options: [
    //             {
    //                 label: 'Istimewa',
    //                 value: 'Istimewa'
    //             },
    //             {
    //                 label: 'Baik',
    //                 value: 'Baik'
    //             },
    //             {
    //                 label: 'Butuh Perbaikan',
    //                 value: 'Butuh Perbaikan'
    //             },
    //             {
    //                 label: 'Kurang (Misconduct)',
    //                 value: 'Kurang (Misconduct)'
    //             }
    //             ,
    //             {
    //                 label: 'Sangat Kurang',
    //                 value: 'Sangat Kurang'
    //             }
    //         ],
    //         rules: [
    //             {
    //                 required: true,
    //                 message: 'Field rating wajib di isi'
    //             }
    //         ]
    //     }
    // ];

    // const onSubmit = async (value) => {
    //     try {
    //         let data;

    //         if (penilaian) {
    //             data = {
    //                 ...penilaian,
    //                 ratingPerilaku: value.rating
    //             };

    //             console.log(data);

    //             // Call the update function and handle response
    //             const res = await update(penilaian._id, data);
    //             console.log(res);
    //         } else {
    //             data = {
    //                 ratingPerilaku: value.rating,
    //                 periodePenilaian: IdPeriode,
    //                 skp: IdRhk
    //             };

    //             const res = await store(data);
    //             console.log(res);
    //         }

    //         // Close modal on success
    //         setModal((prev) => ({ ...prev, trigger: false }));
    //     } catch (err) {
    //         console.error(err); // Log the error
    //     }
    // };

    const onClose = () => {
        setModal((prev) => ({ ...prev, trigger: false }));
    };

    const getRealisasi = (aspek, harian) => {
        if (aspek.jenis === 'kualitas') {
            const percentase = harian.reduce((max, item) => {
                return item.progress > max.progress ? item : max;
            }, harian[0]);
            if (percentase) {
                const percent = (percentase.progress / 100) * aspek.target_tahunan.target;
                return percent + '%';
            } else {
                return '0%';
            }
        } else if (aspek.jenis === 'kuantitas') {
            const percentase = harian.reduce((max, item) => {
                return item.progress > max.progress ? item : max;
            }, harian[0]);

            if (percentase) {
                const target = aspek.target_tahunan.target;
                const realisasi = percentase.progress;
                const percent = Math.floor((realisasi / 100) * target); // Round down the percentage

                return percent + ' ' + aspek.target_tahunan.satuan;
            } else {
                return '0%';
            }
        } else if (aspek.jenis === 'waktu') {
            return harian.length + ' ' + aspek.target_tahunan.satuan;
        } else {
            return '';
        }
    };

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
                <div className='flex gap-x-2'>
                    <ExclamationCircleFilled className='text-blue-500 text-lg' />
                    <p>
                        Perilaku kerja ini telah dilakukan penilaian, penilaian perilaku kerja hanya dapat dilakukan sekali, dan tidak dapat diubah.
                    </p>
                </div>
            </Card>
            <Card>
                <div className="flex flex-col gap-y-4 mb-6">
                    <div className="w-full flex items-center justify-between">
                        <Title className="mt-2" level={5}>
                            Pengisian Feedback Atasan
                        </Title>
                        <div className="flex items-center gap-x-2">
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() =>
                                    setModal({
                                        trigger: true,
                                        isRating: true,
                                        modalData: {
                                            rating: data.perilaku ? data.perilaku[IdPeriode] : 1
                                        },
                                        title: 'Tambah Rating Perilaku Kerja',
                                        formFields: ratingFileds,
                                        onSubmit: async (value) => {
                                            console.log(data);

                                            const dt = {
                                                ...data,
                                                perilaku: {
                                                    ...data.perilaku,
                                                    [IdPeriode]: value.rating
                                                }
                                            };

                                            const res = await update(data._id, dt);
                                            console.log(res);

                                            if (res.ok) {
                                                setModal({
                                                    trigger: false,
                                                    modalData: { rating: data.perilaku ? data.perilaku[IdPeriode] : 1 }
                                                });
                                                fetchData();
                                            }
                                        }
                                    })
                                }
                            >
                                Buat Rating Perilaku Kerja
                            </Button>
                            {/* <Button type="primary" icon={<PlusOutlined />} onClick={() => setModal({ trigger: true, modalData: dummyFeedback, title: 'Tambah Predikat Kinerja Pegawai', formFields: predikatFields })}>
                                Buat Predikat Kinerja
                            </Button> */}
                        </div>
                    </div>

                    <div className="grid grid-flow-row divide-y text-xs">
                        <div className="flex items-center justify-between py-2">
                            <span className="uppercase font-semibold">periode</span>
                            <Tag color="blue" className="capitalize">
                                {data?.periode_awal && data?.periode_akhir ? dateFormatter(data?.periode_awal) + ' - ' + dateFormatter(data?.periode_akhir) : 'tanggal tinggal tersedia'}
                            </Tag>
                        </div>
                        <div className="flex items-center justify-between py-2">
                            <span className="uppercase font-semibold">pendekatan</span>
                            <Tag color="blue" className="capitalize">
                                {data?.pendekatan}
                            </Tag>
                        </div>
                        <div className="flex items-center justify-between py-2">
                            <span className="uppercase font-semibold">status</span>
                            <Tag color="green" className="capitalize">
                                {data?.status}
                            </Tag>
                        </div>
                        <div className="flex items-center justify-between py-2">
                            <span className="uppercase font-semibold">Model SKP</span>
                            <p className="text-right capitalize">JAJF</p>
                        </div>
                        {/* <div className="flex items-center justify-between py-2">
                            <span className="uppercase font-semibold">jenis pegawai</span>
                            <p className="text-right capitalize">pemimpin</p>
                        </div> */}
                    </div>
                </div>
                <div className="w-full grid grid-cols-12 gap-4 mb-6">
                    <Card type="inner" title="Pegawai Yang Dinilai" className="col-span-6 w-full">
                        <div className="grid grid-flow-row divide-y text-xs">
                            <div className="flex items-center justify-between py-2">
                                <span className="uppercase font-semibold">nama</span>
                                <p color="blue" className="capitalize">
                                    {bawahan?.nama_asn}
                                </p>
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <span className="uppercase font-semibold">nip</span>
                                <p color="blue" className="capitalize">
                                    {bawahan?.id_asn}
                                </p>
                            </div>
                            {/* <div className="flex items-center justify-between py-2">
                                <span className="uppercase font-semibold">pangkat / golongan / ruang</span>
                                <p color="green" className="capitalize">
                                    Penata Tingkat I / III/d
                                </p>
                            </div> */}
                            <div className="flex items-center justify-between py-2">
                                <span className="uppercase font-semibold">jabatan</span>
                                <p className="text-right capitalize"> {bawahan?.nama_jabatan}</p>
                            </div>
                            <div className="flex justify-between py-2">
                                <span className="uppercase font-semibold">unit kerja</span>
                                <div className="flex flex-col gap-y-2 text-right items-end">
                                    <p>{bawahan?.unor.nama} </p>
                                    <small>ID : {bawahan?.unor.id}</small>
                                </div>
                            </div>
                        </div>
                    </Card>
                    <Card type="inner" title="Pegawai Yang Penilai Kinerja" className="col-span-6 w-full">
                        <div className="grid grid-flow-row divide-y text-xs">
                            <div className="flex items-center justify-between py-2">
                                <span className="uppercase font-semibold">nama</span>
                                <p color="blue" className="capitalize">
                                    {bawahan?.unor?.atasan?.asn?.nama_atasan}
                                </p>
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <span className="uppercase font-semibold">nip</span>
                                <p color="blue" className="capitalize">
                                    {bawahan?.unor?.atasan?.asn?.nip_atasan}
                                </p>
                            </div>
                            {/* <div className="flex items-center justify-between py-2">
                                                    <span className="uppercase font-semibold">pangkat / golongan / ruang</span>
                                                    <p color="green" className="capitalize">
                                                        Penata Tingkat I / III/d
                                                    </p>
                                                </div> */}
                            <div className="flex items-center justify-between py-2">
                                <span className="uppercase font-semibold">jabatan</span>
                                <p className="text-right capitalize"> {bawahan?.unor?.atasan?.unor_jabatan}</p>
                            </div>
                            <div className="flex justify-between py-2">
                                <span className="uppercase font-semibold">unit kerja</span>
                                <div className="flex flex-col gap-y-2 text-right items-end">
                                    <p>{bawahan?.unor?.atasan?.unor_nama}</p>
                                    <small>ID : {bawahan?.unor?.atasan?.unor_id}</small>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
                <table className="normaltable mb-6">
                    <thead>
                        <tr>
                            <th>NO</th>
                            <th style={{ maxWidth: '12rem' }}>RENCANA HASIL KERJA PIMPINAN YANG DIINTERVENSI</th>
                            <th>RENCANA HASIL KERJA</th>
                            <th>BUKTI DUKUNG</th>
                            <th>ASPEK</th>
                            <th>INDIKATOR KINERJA</th>
                            <th>TARGET TAHUNAN</th>
                            <th>REALISASI</th>
                            <th>FEEDBACK</th>
                        </tr>
                    </thead>
                    <tbody className="capitalize text-sm">
                        <tr>
                            <td colSpan={6} className="text-left px-2">
                                Utama
                            </td>
                        </tr>
                        {data?.rhks.filter((item) => item.posjab == index).map((item, index) => (
                            <>
                                <tr>
                                    <td rowSpan={item.aspek ? item.aspek.length + 1 : 1}>{index + 1}</td>
                                    <td rowSpan={item.aspek ? item.aspek.length + 1 : 1} style={{ maxWidth: '12rem', padding: '8px' }}>
                                        <div className="flex flex-col gap-y-2 text-left">
                                            <p>{item.rhk.rkt ? item.rhk.rkt.name : item.rhk.desc}</p>

                                            {/* <Button size="small" type="primary" className="w-fit" shape="circle" icon={<SearchOutlined />} /> */}
                                        </div>
                                    </td>
                                    <td rowSpan={item.aspek ? item.aspek.length + 1 : 1} style={{ maxWidth: '12rem', padding: '8px' }}>
                                        <div className="flex flex-col gap-y-2 text-left">
                                            <p>{item.desc}</p>
                                            <Tag color="blue" className="w-fit">
                                                {item.klasifikasi ? item.klasifikasi : ''}
                                            </Tag>
                                            {/* <Button size="small" type="primary" className="w-fit" shape="circle" icon={<SearchOutlined />} /> */}
                                        </div>
                                    </td>
                                    <td rowSpan={item.aspek ? item.aspek.length + 1 : 1}>
                                        <div className="flex items-center justify-center">
                                            <Button type="primary" onClick={() => setBuktiModal({ modalData: null, trigger: true })}>
                                                Lihat
                                            </Button>
                                            <Modal open={buktiModal.trigger} onCancel={() => setBuktiModal({ modalData: null, trigger: false })} footer={null}>
                                                <Table
                                                    className="mt-8"
                                                    dataSource={item.harians}
                                                    pagination={false}
                                                    bordered
                                                    columns={[
                                                        {
                                                            title: 'Tanggal',
                                                            dataIndex: 'date',
                                                            key: 'date',
                                                            render: (record) => (record ? dateFormatter(record) : null)
                                                        },
                                                        {
                                                            title: 'Tautan',
                                                            dataIndex: 'tautan',
                                                            key: 'tautan',
                                                            render: (_, record) => (
                                                                <a href={record.tautan} target="_blank" rel="noopener noreferrer">
                                                                    Lihat Tautan
                                                                </a>
                                                            )
                                                        },
                                                        {
                                                            title: 'Bukti',
                                                            dataIndex: 'files',
                                                            key: 'files',
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
                                                            )
                                                        },
                                                        {
                                                            title: 'action',
                                                            key: 'action',
                                                            render: (record) => (
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
                                                            )
                                                        }
                                                    ]}
                                                />
                                            </Modal>
                                        </div>
                                    </td>
                                </tr>
                                {item.aspek?.map((aspek) => (
                                    <>
                                        <tr>
                                            <td>{aspek.jenis}</td>
                                            <td style={{ maxWidth: '12rem', padding: '8px' }}>
                                                <div className="flex flex-col gap-y-2 text-left">
                                                    <p>{aspek.indikator}</p>
                                                </div>
                                            </td>
                                            <td>{aspek.target_tahunan.target + aspek.target_tahunan.satuan} </td>
                                            <td>
                                                {getRealisasi(
                                                    aspek,
                                                    item.harians?.filter((h) => {
                                                        // Convert item.date and periode.endDateTime to Day.js objects
                                                        const hDate = dayjs(h.date); // Convert h.date to Day.js object
                                                        const endDateTime = dayjs(periode.endDateTime); // Convert endDateTime to Day.js object

                                                        // Check if h.date is less than or equal to endDateTime
                                                        return (hDate.isBefore(endDateTime) || hDate.isSame(endDateTime)) && h.isSKP === true;
                                                    })
                                                )}
                                            </td>

                                            <td>{aspek.feedback?.feedback}</td>
                                            {/* <td></td> */}
                                        </tr>
                                    </>
                                ))}
                            </>
                        ))}
                        <tr>
                            <td colSpan={6} className="text-left px-2">
                                Tambahan
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={6}>Rating Hasil Kinerja</td>
                            <td colSpan={4}>{data?.hasil ? (() => {
                                const hasil = data.hasil[IdPeriode];
                                switch (hasil) {
                                    case 2:
                                        return (
                                            <div className='inline-flex gap-2'>
                                                <p><s>Diatas ekspektasi</s></p>
                                                <p>Sesuai ekspektasi</p>
                                                <p><s>Dibawah ekspektasi</s></p>
                                            </div>
                                        );
                                    case 3:
                                        return (
                                            <div className='inline-flex gap-2'>
                                                <p>Diatas ekspektasi</p>
                                                <p><s>Sesuai ekspektasi</s></p>
                                                <p><s>Dibawah ekspektasi</s></p>
                                            </div>
                                        );
                                    case 1:
                                        return (
                                            <div className='inline-flex gap-2'>
                                                <p><s>Diatas ekspektasi</s></p>
                                                <p><s>Sesuai ekspektasi</s></p>
                                                <p>Dibawah ekspektasi</p>
                                            </div>
                                        );
                                    default:
                                        return hasil || '';
                                }
                            })() : ''}</td>
                        </tr>
                    </tbody>
                </table>
                <table className="normaltable mb-6">
                    <thead>
                        <tr className="uppercase">
                            <th>no</th>
                            <th>perilaku kinerja</th>
                            <th>ekspektasi khusus pimpinan</th>
                            <th>feedback</th>
                        </tr>
                    </thead>
                    <tbody className="capitalize">
                        {data?.perilakus?.map((item, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td style={{ padding: '8px' }}>
                                    <div className="flex flex-col gap-y-2 text-left">
                                        <b>{item.name}</b>
                                        <ol className="list-decimal list-inside">
                                            {item.isi.map((isiItem, isiIndex) => (
                                                <li key={isiIndex}>{isiItem}</li>
                                            ))}
                                        </ol>
                                    </div>
                                </td>
                                <td>
                                    <div className="flex items-center justify-center">{item.espektasi}</div>
                                </td>
                                <td>
                                    <div className="flex flex-col items-center justify-center gap-y-2">
                                        {item.feedback[IdPeriode]?.isi}
                                        {item.feedback[IdPeriode]?.like !== undefined ? (
                                            <Tag className="m-0" color={item.feedback[IdPeriode].like ? 'green' : 'red'}>
                                                {item.feedback[IdPeriode].like ? 'baik' : 'buruk'}
                                            </Tag>
                                        ) : (
                                            ''
                                        )}
                                        <div className="flex items-center justify-center">
                                            <Button
                                                icon={<EditOutlined />}
                                                size="small"
                                                onClick={() =>
                                                    setModal({
                                                        trigger: true,
                                                        modalData: { content: item.feedback.isi, category: item.feedback.like },
                                                        title: 'Edit Feedback',
                                                        formFields: formFields,
                                                        onSubmit: async (values) => {
                                                            console.log('HERE');

                                                            const dt = {
                                                                ...item,
                                                                feedback: {
                                                                    ...item.feedback,
                                                                    [IdPeriode]: {
                                                                        isi: values.content,
                                                                        like: values.category
                                                                    }
                                                                }
                                                            };
                                                            console.log('PERILAKU', dt);
                                                            const res = await updatePerilaku(item._id, dt);
                                                            console.log(res);
                                                            if (res.ok) {
                                                                fetchData();
                                                                setModal({ trigger: false, modalData: {} });
                                                                message.success('Data Berhsil Di Ubah');
                                                            }
                                                        }
                                                    })
                                                }
                                            >
                                                Edit
                                            </Button>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        <tr>
                            <td colSpan={3}>Rating Perilaku</td>
                            <td colSpan={4}>{data?.perilaku ? (() => {
                                const perilaku = data.perilaku[IdPeriode];
                                switch (perilaku) {
                                    case 2:
                                        return (
                                            <div className='inline-flex gap-2'>
                                                <p><s>Diatas ekspektasi</s></p>
                                                <p>Sesuai ekspektasi</p>
                                                <p><s>Dibawah ekspektasi</s></p>
                                            </div>
                                        );
                                    case 3:
                                        return (
                                            <div className='inline-flex gap-2'>
                                                <p>Diatas ekspektasi</p>
                                                <p><s>Sesuai ekspektasi</s></p>
                                                <p><s>Dibawah ekspektasi</s></p>
                                            </div>
                                        );
                                    case 1:
                                        return (
                                            <div className='inline-flex gap-2'>
                                                <p><s>Diatas ekspektasi</s></p>
                                                <p><s>Sesuai ekspektasi</s></p>
                                                <p>Dibawah ekspektasi</p>
                                            </div>
                                        );
                                    default:
                                        return perilaku || '';
                                }
                            })() : ''}</td>
                        </tr>
                        <tr>
                            <td colSpan={3}>Peredikat Kinerja</td>
                            <td colSpan={3}>{data?.predikat ? (() => {
                                const predikat = data.predikat[IdPeriode];
                                switch (predikat) {
                                    case 5:
                                        return (
                                            <div className='flex flex-col gap-2'>
                                                <p><s>Sangat Kurang</s></p>
                                                <p><s>Kurang</s></p>
                                                <p><s>Butuh Perbaikan</s></p>
                                                <p><s>Baik</s></p>
                                                <p>Istimewah</p>
                                            </div>
                                        );
                                    case 4:
                                        return (
                                            <div className='flex flex-col gap-2'>
                                                <p><s>Sangat Kurang</s></p>
                                                <p><s>Kurang</s></p>
                                                <p><s>Butuh Perbaikan</s></p>
                                                <p>Baik</p>
                                                <p><s>Istimewah</s></p>
                                            </div>
                                        );
                                    case 3:
                                        return (
                                            <div className='flex flex-col gap-2'>
                                                <p><s>Sangat Kurang</s></p>
                                                <p><s>Kurang</s></p>
                                                <p>Butuh Perbaikan</p>
                                                <p><s>Baik</s></p>
                                                <p><s>Istimewah</s></p>
                                            </div>
                                        );
                                    case 2:
                                        return (
                                            <div className='flex flex-col gap-2'>
                                                <p><s>Sangat Kurang</s></p>
                                                <p>Kurang</p>
                                                <p><s>Butuh Perbaikan</s></p>
                                                <p><s>Baik</s></p>
                                                <p><s>Istimewah</s></p>
                                            </div>
                                        );
                                    case 1:
                                        return (
                                            <div className='flex flex-col gap-2'>
                                                <p>Sangat Kurang</p>
                                                <p><s>Kurang</s></p>
                                                <p><s>Butuh Perbaikan</s></p>
                                                <p><s>Baik</s></p>
                                                <p><s>Istimewah</s></p>
                                            </div>
                                        );
                                    default:
                                        return predikat || '';
                                }
                            })() : ''}</td>
                        </tr>
                    </tbody>
                </table>
                <CrudModal type="create" onClose={onClose} formFields={modal.formFields} data={modal.modalData} onSubmit={modal.onSubmit} isModalOpen={modal.trigger} title={modal.title}>
                    {modal.isRating && (
                        <CrudModal.Extra>
                            <Card className="mt-6  mb-4">
                                <div className='flex gap-x-6'>
                                    <WarningOutlined className='text-yellow-500 text-lg' width={200} />
                                    <p className="text-xs">
                                        Penilaian perilaku kerja hanya bisa dilakukan sekali, setelah diberi nilai, nilai perilaku kerja tidak dapat berubah
                                    </p>
                                </div>
                            </Card>
                        </CrudModal.Extra>
                    )}
                </CrudModal>
                <InfoModal close={infoModal.onClose} data={infoModal.data} isModalOpen={infoModal.trigger} title={infoModal.title} columns={infoModal.column} isLoading={infoModal.isLoading} type={infoModal.type} />
            </Card>
        </div>
    );
};

export default page;
