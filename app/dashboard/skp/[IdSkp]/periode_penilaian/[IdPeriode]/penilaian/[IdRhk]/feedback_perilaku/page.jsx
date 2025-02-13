'use client';

import { Breadcrumb, Button, Card, Form, InputNumber, List, message, Modal, Progress, Select, Table, Tag, Tooltip, Typography } from 'antd';
import { UserOutlined, DotChartOutlined, PrinterOutlined, ReloadOutlined, SearchOutlined, PlusOutlined, EditOutlined, OrderedListOutlined, DownloadOutlined, ExclamationOutlined, ExclamationCircleFilled, WarningOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { CrudModal, DataLoading, FeedbackButton, InfoModal, RealisasiRow, RhkRow } from '@/components';
import { dummyFeedback } from '@/data';
import { title } from 'process';
import { useParams } from 'next/navigation';
import { getById, update } from '@/controller/SKPController';
import { store as storePenilaian } from '@/controller/penilaianController';
import { useRouter } from 'next/navigation';
import { getByPerilakuAndPeriode } from '@/controller/FeedbackPerilakuController';
import { getByAspekAndPeriode, store as storeRHKFeedback } from '@/controller/FeedbackRHKController';

const { Title } = Typography;
const { Option } = Select;
import { store, destroy, getBySKPAndPeriode } from '@/controller/penilaianController';
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
    const [utama, setUtama] = useState(null);
    const [tambahan, setTambahan] = useState(null);
    const [jabatan, setJabatan] = useState(null);


    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true)
        try {
            const skp = await getById(IdRhk);
            setJabatan(skp.data.jabatan[skp.data.jabatan.length - 1]);
            const nilai = await getBySKPAndPeriode(IdRhk, IdPeriode);
            console.log('nilai', nilai);

            setPenilaian(nilai.data);
            setData(skp.data);
            setUtama(skp.data.rhks.filter((item) => item.jenis === 'utama'));
            setTambahan(skp.data.rhks.filter((item) => item.jenis === 'tambahan'));
            const periode = await getPenilaian(IdPeriode);
            setPeriode(periode.data);

            setAtasan(atasan);
        } catch (error) {
            console.log(error);
        }
        setLoading(false)
    };


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

    const renderPerilakuTag = (ratingPredikat) => {
        switch (ratingPredikat) {
            case 2:
                return (
                    <Tag color='blue'>Sesuai Ekspektasi</Tag>
                );
            case 3:
                return (
                    <Tag color='green'>Diatas Ekspektasi</Tag>
                );
            case 1:
                return (
                    <Tag color='orange'>Dibawah Ekspektasi</Tag>
                );
            default:
                return <Tag color="error">Belum Dinilai</Tag>;
        }
    };

    return (
        <div className="w-full flex flex-col gap-y-4">

            {loading ? (
                <DataLoading loadingData={loading} />
            ) : (
                <>
                    {penilaian && penilaian.ratingPerilaku ? (
                        <Card>
                            <div className="flex gap-x-2">
                                <ExclamationCircleFilled className="text-blue-500 text-lg" />
                                <p>Perilaku kerja ini telah dilakukan penilaian, penilaian perilaku kerja hanya dapat dilakukan sekali, dan tidak dapat diubah.</p>
                            </div>
                        </Card>
                    ) : (
                        <></>
                    )}

                    <Card>
                        <div className="flex flex-col gap-y-4 mb-6">
                            <div className="w-full flex items-center justify-between">
                                <Title className="mt-2" level={5}>
                                    Pengisian Feedback Atasan
                                    {" "}
                                    {renderPerilakuTag(penilaian?.ratingPerilaku)}
                                </Title>
                                <div className="flex items-center gap-x-2">
                                    <Button
                                        disabled={penilaian && penilaian.ratingPerilaku}
                                        type="primary"
                                        icon={<PlusOutlined />}
                                        onClick={() =>
                                            setModal({
                                                trigger: true,
                                                isRating: true,
                                                modalData: {
                                                    rating: penilaian && penilaian?.ratingPerilaku ? penilaian?.ratingPerilaku : 1
                                                },
                                                title: 'Tambah Rating Perilaku Kerja',
                                                formFields: ratingFileds,
                                                onSubmit: async (value) => {

                                                    const dt = {
                                                        ...penilaian,
                                                        ratingPerilaku: value.rating,
                                                        penilai: IdSkp,
                                                        skp: IdRhk,
                                                        periodePenilaian: IdPeriode
                                                    };

                                                    const res = await storePenilaian(dt);

                                                    if (res.ok) {
                                                        // setModal({
                                                        //     trigger: false,
                                                        //     modalData: { rating: data.perilaku ? data.perilaku[IdPeriode] : 1 }
                                                        // });
                                                        fetchData();
                                                    }
                                                }
                                            })
                                        }
                                    >
                                        Buat Rating Perilaku Kerja
                                    </Button>
                                    <Tooltip title="Refresh Data">
                                        <Button icon={<ReloadOutlined />} onClick={() => fetchData()} />
                                    </Tooltip>
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
                                            {jabatan?.nama_asn}
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-between py-2">
                                        <span className="uppercase font-semibold">nip</span>
                                        <p color="blue" className="capitalize">
                                            {jabatan?.nip_asn}
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-between py-2">
                                        <span className="uppercase font-semibold">jabatan</span>
                                        <p className="text-right capitalize"> {jabatan?.nama_jabatan}</p>
                                    </div>
                                    <div className="flex justify-between py-2">
                                        <span className="uppercase font-semibold">unit kerja</span>
                                        <div className="flex flex-col gap-y-2 text-right items-end">
                                            <p>{jabatan?.unor.nama}</p>
                                            <small>ID : {jabatan?.unor.id}</small>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                            <Card type="inner" title="Pegawai Penilai Kinerja" className="col-span-6 w-full">
                                <div className="grid grid-flow-row divide-y text-xs">
                                    <div className="flex items-center justify-between py-2">
                                        <span className="uppercase font-semibold">nama</span>
                                        <p color="blue" className="capitalize">
                                            {jabatan?.unor.atasan.asn.nama_atasan}
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-between py-2">
                                        <span className="uppercase font-semibold">nip</span>
                                        <p color="blue" className="capitalize">
                                            {jabatan?.unor.atasan.asn.nip_atasan}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between py-2">
                                        <span className="uppercase font-semibold">jabatan</span>
                                        <p className="text-right capitalize"> {jabatan?.unor.atasan.unor_jabatan}</p>
                                    </div>
                                    <div className="flex justify-between py-2">
                                        <span className="uppercase font-semibold">unit kerja</span>
                                        <div className="flex flex-col gap-y-2 text-right items-end">
                                            <p>{jabatan?.unor.atasan.unor_nama} </p>
                                            <small>ID : {jabatan?.unor.atasan.unor_id}</small>
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
                                {utama?.map((item, index) => (
                                    <>
                                        <tr>
                                            <td rowSpan={item.aspek ? item.aspek.length + 1 : 1}>{index + 1}</td>
                                            <td rowSpan={item.aspek ? item.aspek.length + 1 : 1} style={{ maxWidth: '12rem', padding: '8px' }}>
                                                <div className="flex flex-col gap-y-2 text-left">
                                                    <p>{item.rkt ? item.rkt.name : item.desc}</p>

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
                                                    <RealisasiRow item={item} aspek={aspek} IdPeriode={IdPeriode} isTambahan={false} />
                                                    <RhkRow item={aspek} IdSkp={IdSkp} IdPeriode={IdPeriode} setModal={setModal} />
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
                                {tambahan?.map((item, index) => (
                                    <>
                                        <tr>
                                            <td rowSpan={item.aspek ? item.aspek.length + 1 : 1}>{index + 1}</td>
                                            <td rowSpan={item.aspek ? item.aspek.length + 1 : 1} style={{ maxWidth: '12rem', padding: '8px' }}>
                                                <div className="flex flex-col gap-y-2 text-left">
                                                    <p>{item.rkt ? item.rkt.name : item.desc}</p>

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
                                                    <RealisasiRow item={item} aspek={aspek} IdPeriode={IdPeriode} />
                                                    <RhkRow item={aspek} IdSkp={IdSkp} IdPeriode={IdPeriode} setModal={setModal} />
                                                    {/* <td></td> */}
                                                </tr>
                                            </>
                                        ))}
                                    </>
                                ))}

                                <tr>
                                    <td colSpan={6}>Rating Hasil Kinerja</td>
                                    <td colSpan={4}>
                                        {penilaian?.ratingKinerja
                                            ? (() => {
                                                const hasil = penilaian?.ratingKinerja
                                                switch (hasil) {
                                                    case 2:
                                                        return (
                                                            <div className="inline-flex gap-2">
                                                                <p>
                                                                    <s>Diatas ekspektasi</s>
                                                                </p>
                                                                <p>Sesuai ekspektasi</p>
                                                                <p>
                                                                    <s>Dibawah ekspektasi</s>
                                                                </p>
                                                            </div>
                                                        );
                                                    case 3:
                                                        return (
                                                            <div className="inline-flex gap-2">
                                                                <p>Diatas ekspektasi</p>
                                                                <p>
                                                                    <s>Sesuai ekspektasi</s>
                                                                </p>
                                                                <p>
                                                                    <s>Dibawah ekspektasi</s>
                                                                </p>
                                                            </div>
                                                        );
                                                    case 1:
                                                        return (
                                                            <div className="inline-flex gap-2">
                                                                <p>
                                                                    <s>Diatas ekspektasi</s>
                                                                </p>
                                                                <p>
                                                                    <s>Sesuai ekspektasi</s>
                                                                </p>
                                                                <p>Dibawah ekspektasi</p>
                                                            </div>
                                                        );
                                                    default:
                                                        return hasil || '';
                                                }
                                            })()
                                            : ''}
                                    </td>
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
                                        <PerilakuRow IdSKP={IdSkp} item={item} IdPeriode={IdPeriode} fetchData={fetchData} formFields={formFields} setModal={setModal} />
                                    </tr>
                                ))}
                                <tr>
                                    <td colSpan={3}>Rating Perilaku</td>
                                    <td colSpan={4}>
                                        {penilaian?.ratingPerilaku
                                            ? (() => {
                                                const perilaku = penilaian?.ratingPerilaku;
                                                switch (perilaku) {
                                                    case 2:
                                                        return (
                                                            <div className="inline-flex gap-2">
                                                                <p>
                                                                    <s>Diatas ekspektasi</s>
                                                                </p>
                                                                <p>Sesuai ekspektasi</p>
                                                                <p>
                                                                    <s>Dibawah ekspektasi</s>
                                                                </p>
                                                            </div>
                                                        );
                                                    case 3:
                                                        return (
                                                            <div className="inline-flex gap-2">
                                                                <p>Diatas ekspektasi</p>
                                                                <p>
                                                                    <s>Sesuai ekspektasi</s>
                                                                </p>
                                                                <p>
                                                                    <s>Dibawah ekspektasi</s>
                                                                </p>
                                                            </div>
                                                        );
                                                    case 1:
                                                        return (
                                                            <div className="inline-flex gap-2">
                                                                <p>
                                                                    <s>Diatas ekspektasi</s>
                                                                </p>
                                                                <p>
                                                                    <s>Sesuai ekspektasi</s>
                                                                </p>
                                                                <p>Dibawah ekspektasi</p>
                                                            </div>
                                                        );
                                                    default:
                                                        return perilaku || '';
                                                }
                                            })()
                                            : ''}
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan={3}>Peredikat Kinerja</td>
                                    <td colSpan={3}>
                                        {penilaian?.ratingPredikat
                                            ? (() => {
                                                const predikat = penilaian.ratingPredikat;
                                                switch (predikat) {
                                                    case 5:
                                                        return (
                                                            <div className="flex flex-col gap-2">
                                                                <p>
                                                                    <s>Sangat Kurang</s>
                                                                </p>
                                                                <p>
                                                                    <s>Kurang</s>
                                                                </p>
                                                                <p>
                                                                    <s>Butuh Perbaikan</s>
                                                                </p>
                                                                <p>
                                                                    <s>Baik</s>
                                                                </p>
                                                                <p>Istimewah</p>
                                                            </div>
                                                        );
                                                    case 4:
                                                        return (
                                                            <div className="flex flex-col gap-2">
                                                                <p>
                                                                    <s>Sangat Kurang</s>
                                                                </p>
                                                                <p>
                                                                    <s>Kurang</s>
                                                                </p>
                                                                <p>
                                                                    <s>Butuh Perbaikan</s>
                                                                </p>
                                                                <p>Baik</p>
                                                                <p>
                                                                    <s>Istimewah</s>
                                                                </p>
                                                            </div>
                                                        );
                                                    case 3:
                                                        return (
                                                            <div className="flex flex-col gap-2">
                                                                <p>
                                                                    <s>Sangat Kurang</s>
                                                                </p>
                                                                <p>
                                                                    <s>Kurang</s>
                                                                </p>
                                                                <p>Butuh Perbaikan</p>
                                                                <p>
                                                                    <s>Baik</s>
                                                                </p>
                                                                <p>
                                                                    <s>Istimewah</s>
                                                                </p>
                                                            </div>
                                                        );
                                                    case 2:
                                                        return (
                                                            <div className="flex flex-col gap-2">
                                                                <p>
                                                                    <s>Sangat Kurang</s>
                                                                </p>
                                                                <p>Kurang</p>
                                                                <p>
                                                                    <s>Butuh Perbaikan</s>
                                                                </p>
                                                                <p>
                                                                    <s>Baik</s>
                                                                </p>
                                                                <p>
                                                                    <s>Istimewah</s>
                                                                </p>
                                                            </div>
                                                        );
                                                    case 1:
                                                        return (
                                                            <div className="flex flex-col gap-2">
                                                                <p>Sangat Kurang</p>
                                                                <p>
                                                                    <s>Kurang</s>
                                                                </p>
                                                                <p>
                                                                    <s>Butuh Perbaikan</s>
                                                                </p>
                                                                <p>
                                                                    <s>Baik</s>
                                                                </p>
                                                                <p>
                                                                    <s>Istimewah</s>
                                                                </p>
                                                            </div>
                                                        );
                                                    default:
                                                        return predikat || '';
                                                }
                                            })()
                                            : ''}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <table className="normaltable">
                            <thead>
                                <tr>
                                    <th className="text-left px-4">Lampiran</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td style={{ border: '1px solid black', padding: '8px' }}>
                                        <div className="flex flex-col gap-y-2 p-4">
                                            <b>Dukungan Sumber Daya</b>
                                            <List dataSource={data?.lampiran.sumber_daya} className="px-4" renderItem={(item) => <List.Item>{item.isi_lampiran}</List.Item>} />
                                        </div>
                                        {/* looping through here */}
                                    </td>
                                </tr>
                                <tr>
                                    <td style={{ border: '1px solid black', padding: '8px' }}>
                                        <div className="flex flex-col gap-y-2 p-4">
                                            <b>Skema Pertanggung Jawaban</b>
                                            <List dataSource={data?.lampiran.skema} className="px-4" renderItem={(item) => <List.Item>{item.isi_lampiran}</List.Item>} />
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td style={{ border: '1px solid black', padding: '8px' }}>
                                        <div className="flex flex-col gap-y-2 p-4">
                                            <p>Konsekuensi</p>
                                            <List dataSource={data?.lampiran.konsekuensi} className="px-4" renderItem={(item) => <List.Item>{item.isi_lampiran}</List.Item>} />
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <CrudModal type="create" onClose={onClose} formFields={modal.formFields} data={modal.modalData} onSubmit={modal.onSubmit} isModalOpen={modal.trigger} title={modal.title}>
                            {modal.isRating && (
                                <CrudModal.Extra>
                                    <Card className="mt-6  mb-4">
                                        <div className="flex gap-x-6">
                                            <WarningOutlined className="text-yellow-500 text-lg" width={200} />
                                            <p className="text-xs">Penilaian perilaku kerja hanya bisa dilakukan sekali, setelah diberi nilai, nilai perilaku kerja tidak dapat berubah</p>
                                        </div>
                                    </Card>
                                </CrudModal.Extra>
                            )}
                        </CrudModal>
                        <InfoModal close={infoModal.onClose} data={infoModal.data} isModalOpen={infoModal.trigger} title={infoModal.title} columns={infoModal.column} isLoading={infoModal.isLoading} type={infoModal.type} />
                    </Card>
                </>
            )}

        </div>
    );
};

export default page;

const PerilakuRow = ({ item, IdPeriode, fetchData, formFields, setModal, IdSKP }) => {
    const [data, setData] = useState(null);
    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        try {

            const res = await getByPerilakuAndPeriode(item._id, IdPeriode);
            if (res.ok) {
                setData(res.data);
            }
        } catch (error) { }
    };

    return (
        <td>
            <div className="flex flex-col items-center justify-center gap-y-2">
                {data?.isi}
                {data?.like !== undefined ? (
                    <Tag className="m-0" color={data?.like ? 'green' : 'red'}>
                        {data?.like ? 'baik' : 'buruk'}
                    </Tag>
                ) : (
                    ''
                )}
                <div className="flex items-center justify-center">
                    <FeedbackButton IdSKP={IdSKP} item={item} IdPeriode={IdPeriode} fetchData={getData} formFields={formFields} setModal={setModal} />
                </div>
            </div>
        </td>
    );
};
