'use client';

import { Breadcrumb, Button, Card, List, Skeleton, Tag, Tooltip, Typography } from 'antd';
import { PlusOutlined, ExclamationCircleFilled, WarningOutlined, PrinterOutlined, ReloadOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { CrudModal, DataLoading, InfoModal, PerilakuRow, RealisasiRow, RhkRow } from '@/components';
import { getById, } from '@/controller/SKPController';
import { getById as getPenilaian } from '@/controller/periodePenilaianController';
import { store as storePenilaian } from '@/controller/penilaianController';
import { getRealisasi } from '@/controller/RHKController';
import { getBySKPAndPeriode } from '@/controller/penilaianController';
import { getByPerilakuAndPeriode } from '@/controller/FeedbackPerilakuController';
import { getByAspekAndPeriode, store as storeRHKFeedback } from '@/controller/FeedbackRHKController';
import { dateFormatter } from '@/utils';
import { getHasilSkp } from '@/controller/ReportController';
const { Title } = Typography;
const page = () => {
    const router = useRouter();

    const { id, idPeriode } = useParams();
    const [modal, setModal] = useState({ trigger: false, modalData: null, title: '', formFields: [], onSubmit: () => { }, isRating: false });
    const [infoModal, setInfoModal] = useState({ trigger: false, title: '', onClose: () => { }, data: null, type: '', isLoading: false, column: [] });

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [atasan, setAtasan] = useState(null);
    const [bawahan, setBawahan] = useState(null);
    const [penilaian, setPenilaian] = useState(null);
    const [periode, setPeriode] = useState(null);
    const [utama, setUtama] = useState(null);
    const [tambahan, setTambahan] = useState(null);
    const [submitLoading, setSubmitLoading] = useState(false)
    const [jabatan, setJabatan] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true)
        try {
            const skp = await getById(id);
            setJabatan(skp.data.jabatan[skp.data.jabatan.length - 1]);
            const nilai = await getBySKPAndPeriode(id, idPeriode);
            console.log('nilai', nilai);

            setPenilaian(nilai.data);
            setData(skp.data);
            setUtama(skp.data.rhks.filter((item) => item.jenis === 'utama'));
            setTambahan(skp.data.rhks.filter((item) => item.jenis === 'tambahan'));
            const periode = await getPenilaian(idPeriode);
            setPeriode(periode.data);

            setAtasan(atasan);
        } catch (error) {
            console.log(error);
        }
        setLoading(false)
    };

    const onClose = () => {
        setModal((prev) => ({ ...prev, trigger: false }));
    };

    const printHasilSkp = async (values) => {
        setSubmitLoading(true)
        const periode = await getPenilaian(idPeriode);

        if (data) {
            const index = data.jabatan.length - 1;
            const bawahan = data.jabatan[index];
            const atasan = bawahan.unor.atasan;

            const realisasi = {};

            data.rhks.forEach((rhk) => {
                if (!realisasi[rhk._id]) {
                    realisasi[rhk._id] = {};
                }

                rhk.aspek.forEach(async (aspek) => {
                    const data = await getRealisasi(rhk._id, rhk.jenis, aspek._id, idPeriode);
                    realisasi[rhk._id][aspek._id] = data.data;
                });
            });

            const query = {
                atasan: atasan,
                bawahan: bawahan,
                skp: data,
                utama: utama,
                tambahan: tambahan,
                realisasi: realisasi,
                penilaian: penilaian,
                periode: periode.data,
                periodeStart: dateFormatter(periode.data.periodeStart),
                periodeEnd: dateFormatter(periode.data.periodeEnd),
                lokasi_tertanda_dinilai: values.lokasi_dinilai,
                tanggal_tertanda_dinilai: values.tanggal_dinilai,
                tanggal_tertanda_penilai: values.tanggal_penilai,
                lokasi_tertanda_penilai: values.lokasi_penilai,

            };

            const pdfBlob = await getHasilSkp(query);

            const url = window.URL.createObjectURL(pdfBlob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'hasil-skp.pdf';
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);

            setSubmitLoading(false)
        }
    }


    const ratingFileds = [
        {
            label: 'Beri Rating',
            name: 'rating',
            type: 'select',
            options: [
                {
                    label: 'Diatas Ekspektasi',
                    value: 'Diatas Ekspektasi'
                },
                {
                    label: 'Sesuai Ekspektasi',
                    value: 'Sesuai Ekspektasi'
                },
                {
                    label: 'Dibawah Ekspektasi',
                    value: 'Dibawah Ekspektasi'
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

    const feedbackFields = [
        {
            label: 'Beri Feedback',
            name: 'feedback',
            type: 'longtext',
            rules: [
                {
                    required: true,
                    message: 'Field feedback wajib diisi'
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

    const predikatFields = [
        {
            label: 'Beri Rating',
            name: 'rating',
            type: 'select',
            options: [
                {
                    label: 'Istimewa',
                    value: 5
                },
                {
                    label: 'Baik',
                    value: 4
                },
                {
                    label: 'Butuh Perbaikan',
                    value: 3
                },
                {
                    label: 'Kurang (Misconduct)',
                    value: 2
                },
                {
                    label: 'Sangat Kurang',
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

    const renderPredikatTag = (ratingPredikat) => {
        switch (ratingPredikat) {
            case 5:
                return <Tag color="blue">Istimewa</Tag>;
            case 4:
                return <Tag color="green">Baik</Tag>;
            case 3:
                return <Tag color="yellow">Butuh Perbaikan</Tag>;
            case 2:
                return <Tag color="orange">Kurang</Tag>;
            case 1:
                return <Tag color="magenta">Sangat Kurang</Tag>;
            default:
                return <Tag color="error">Belum Dinilai</Tag>;
        }
    };

    const formHasilSkp = [
        {
            label: 'Lokasi Pegawai Dinilai',
            name: 'lokasi_dinilai',
            type: 'text',
            rules: [
                {
                    required: true,
                    message: 'Field lokasi wajib di isi'
                }
            ]
        },
        {
            label: 'Tanggal Tertanda Dinilai',
            name: 'tanggal_dinilai',
            type: 'date',
            rules: [
                {
                    required: true,
                    message: 'Field Tanggal wajib di isi'
                }
            ]
        },
        {
            label: 'Lokasi Pegawai Penilai',
            name: 'lokasi_penilai',
            type: 'text',
            rules: [
                {
                    required: true,
                    message: 'Field lokasi wajib di isi'
                }
            ]
        },
        {
            label: 'Tanggal Tertanda Penilai',
            name: 'tanggal_penilai',
            type: 'date',
            rules: [
                {
                    required: true,
                    message: 'Field Tanggal wajib di isi'
                }
            ]
        }
    ]


    return (
        <div className="w-full flex flex-col gap-y-4">

            {loading ? (
                <DataLoading loadingData={loading} />
            ) : (
                <>
                    {penilaian && penilaian.ratingPredikat ? (
                        <Card>
                            <div className="flex gap-x-2">
                                <ExclamationCircleFilled className="text-blue-500 text-lg" />
                                <p>Predikat Kinerja ini telah dilakukan penilaian, penilaian predikat kinerja hanya dapat dilakukan sekali, dan tidak dapat diubah.</p>
                            </div>
                        </Card>
                    ) : (
                        <></>
                    )}
                    <Card>
                        <div className="flex flex-col gap-y-4 mb-6">
                            <div className="w-full flex items-center justify-between">
                                <Title className="mt-2" level={5}>
                                    Sasaran Kinerja Pegawai
                                    {" "}
                                    {renderPredikatTag(penilaian?.ratingPredikat)}
                                </Title>
                                <div className="flex items-center gap-x-2">
                                    <Button
                                        type="default"
                                        icon={<PrinterOutlined />}
                                        onClick={() =>
                                            setModal({
                                                trigger: true,
                                                title: `Cetak Hasil SKP`,
                                                type: 'create',
                                                formFields: formHasilSkp,
                                                onSubmit: printHasilSkp
                                            })
                                        }>
                                        Cetak Hasil
                                    </Button>
                                    <Button
                                        type="primary"
                                        disabled={penilaian && penilaian.ratingPredikat}
                                        icon={<PlusOutlined />}
                                        onClick={() =>
                                            setModal({
                                                trigger: true,
                                                title: 'Tambah Predikat Kinerja Pegawai',
                                                isRating: true,
                                                formFields: predikatFields,
                                                modalData: { rating: penilaian && penilaian?.ratingPredikat ? penilaian?.ratingPredikat : 1 },
                                                onSubmit: async (value) => {
                                                    setSubmitLoading(true)
                                                    const dt = {
                                                        ...penilaian,
                                                        ratingPredikat: value.rating,
                                                        penilai: id,
                                                        skp: id,
                                                        periodePenilaian: idPeriode
                                                    };

                                                    const res = await storePenilaian(dt);

                                                    if (res.ok) {
                                                        setModal({ trigger: false })
                                                        fetchData();
                                                    }
                                                    setSubmitLoading(false)
                                                }
                                            })
                                        }
                                    >
                                        Buat Predikat Kinerja
                                    </Button>
                                    <Tooltip title="Refresh Data">
                                        <Button icon={<ReloadOutlined />} onClick={() => fetchData()} />
                                    </Tooltip>
                                </div>
                            </div>

                            <div className="grid grid-flow-row divide-y text-xs">
                                <div className="flex items-center justify-between py-2">
                                    <span className="uppercase font-semibold">periode</span>
                                    <Tag color="blue" className="capitalize">
                                        {data?.periode_awal && data?.periode_akhir ? dateFormatter(data.periode_awal) + '-' + dateFormatter(data.periode_akhir) : 'Tanggal tidak tersedia'}
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
                                <div className="flex items-center justify-between py-2">
                                    <span className="uppercase font-semibold">jenis pegawai</span>
                                    <p className="text-right capitalize">pemimpin</p>
                                </div>
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
                                    <th>RENCANA AKSI</th>
                                    <th>ASPEK</th>
                                    <th>INDIKATOR KINERJA</th>
                                    <th>TARGET TAHUNAN</th>
                                    <th>REALISASI</th>
                                    <th>FEEDBACK</th>
                                </tr>
                            </thead>
                            <tbody className="capitalize text-sm">
                                <tr>
                                    <td colSpan={9} className="text-left px-2">
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
                                            <td rowSpan={item.aspek ? item.aspek.length + 1 : 1}>
                                                <div className="flex flex-col gap-y-2 p-4">
                                                    <List className="px-4" renderItem={(item) => <List.Item>{item.isi_lampiran}</List.Item>} />
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
                                                    <RealisasiRow item={item} aspek={aspek} IdPeriode={idPeriode} isTambahan={false} />
                                                    <RhkRow item={aspek} IdSkp={id} IdPeriode={idPeriode} setModal={setModal} />
                                                    {/* <td></td> */}
                                                </tr>
                                            </>
                                        ))}
                                    </>
                                ))}
                                <tr>
                                    <td colSpan={9} className="text-left px-2">
                                        Tambahan
                                    </td>
                                </tr>
                                {tambahan?.map((item, index) => (
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
                                                <div className="flex flex-col gap-y-2 p-4">
                                                    <List className="px-4" renderItem={(item) => <List.Item>{item.isi_lampiran}</List.Item>} />
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
                                                    <RealisasiRow item={item} aspek={aspek} IdPeriode={idPeriode} />
                                                    <RhkRow item={aspek} IdSkp={id} IdPeriode={idPeriode} setModal={setModal} />
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
                                                const hasil = penilaian?.ratingKinerja;
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
                                        <PerilakuRow IdSKP={id} item={item} IdPeriode={idPeriode} fetchData={fetchData} setModal={setModal} />
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
                        <CrudModal isLoading={submitLoading} type="create" onClose={onClose} formFields={modal.formFields} data={modal.modalData} onSubmit={modal.onSubmit} isModalOpen={modal.trigger} title={modal.title}>
                            {modal.isRating && (
                                <CrudModal.Extra>
                                    <Card className="mt-6  mb-4">
                                        <div className="flex gap-x-6">
                                            <WarningOutlined className="text-yellow-500 text-lg" width={200} />
                                            <p className="text-xs">Penilaian predikat kinerja hanya bisa dilakukan sekali, setelah diberi nilai, nilai predikat kinerja tidak dapat berubah</p>
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





