'use client';

import { Breadcrumb, Button, Card, Form, InputNumber, List, Modal, Select, Tag, Typography } from 'antd';
import { UserOutlined, DotChartOutlined, PrinterOutlined, ReloadOutlined, SearchOutlined, PlusOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { CrudModal } from '@/components';
import { dummyFeedback } from '@/data';
import { title } from 'process';
const { Title } = Typography;
const { Option } = Select;
import { getById } from '@/controller/SKPController';
import { useParams, useRouter } from 'next/navigation';
import { getById as getPenilaian } from '@/controller/periodePenilaianController';
import dayjs from 'dayjs';
import { dateFormatter } from '@/utils';
import { getHasilSkp } from '@/controller/ReportController';

const page = () => {
    const router = useRouter();
    const { IdSkp, IdNilai } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [atasan, setAtasan] = useState(null);
    const [bawahan, setBawahan] = useState(null);
    const [penilaian, setPenilaian] = useState(null);
    const [skp, setSkp] = useState(null);
    const [modal, setModal] = useState({ trigger: false, modalData: null, title: '', formFields: [], onSubmit: () => { } });
    const [periode, setPeriode] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const skp = await getById(IdSkp);
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
            else {
                setAtasan(bawahan.unor.atasan)
            }


            setData(skp.data);
            setBawahan(bawahan);
        } catch (error) {
            console.log(error);
        }
    };


    const customSubmit = (values, type, id, formData) => {
        console.log(values);
        const query = new URLSearchParams(values).toString();
        router.push(`/document/${IdSkp}/${IdNilai}/form_penilaian?${query}`);
    };

    const handleClose = () => {
        setModal({ trigger: false, modalData: null });
    };

    const formPerjanjian = [
        {
            label: 'Lokasi',
            name: 'lokasi',
            type: 'text',
            rules: [
                {
                    required: true,
                    message: 'Field lokasi wajib di isi'
                }
            ]
        }
    ];

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
                <div className="flex flex-col gap-y-4 mb-6">
                    <div className="w-full flex items-center justify-between">
                        <Title className="mt-2" level={5}>
                            Nilai
                        </Title>
                        <div className="flex items-center gap-x-2">
                            <Button type="default" icon={<PrinterOutlined />} onClick={() => setModal({ trigger: true, title: `Upload`, type: 'edit', formFields: formPerjanjian, onSubmit: customSubmit })}>
                                Cetak Form Penilaian
                            </Button>
                            <Button type="default" icon={<PrinterOutlined />}>
                                Cetak Dokumen Evaluasi Kinerja
                            </Button>
                            <Button
                                type="primary"
                                icon={<PrinterOutlined />}
                                onClick={async () => {
                                    const res = await getById(record._id);
                                    const periode = await getPenilaian(IdPeriode);
                                    // console.log(periode);
                                    // console.log(res);
                                    if (res.ok) {
                                        console.log(res.data);
                                        const skpAtasan = res.data.skp.find((item) => item._id === IdSkp);

                                        const index = res.data.skp.findIndex((item) => item._id === IdSkp);
                                        const bawahan = res.data.jabatan[index];
                                        const jabatan = skpAtasan.jabatan;

                                        // console.log(data);

                                        const atasan = jabatan.find((item) => {
                                            return item.unor.induk.id === bawahan.unor.induk.id;
                                        });

                                        // const realisasi = {};
                                        console.log(res.data.rhks);

                                        // res.data.rhks.forEach(item, (index) => {
                                        //     item.aspek.forEach((aspek) => {
                                        //         {
                                        //             getRealisasi(
                                        //                 aspek,
                                        //                 item.harians?.filter((h) => {
                                        //                     const hDate = dayjs(h.date); // Convert h.date to Day.js object
                                        //                     const endDateTime = dayjs(periode.data.periodeEnd); // Convert endDateTime to Day.js object
                                        //                     return (hDate.isBefore(endDateTime) || hDate.isSame(endDateTime)) && h.isSKP === true;
                                        //                 })
                                        //             );
                                        //         }
                                        //     });
                                        // });
                                        const realisasi = {};

                                        res.data.rhks.forEach((rhk) => {
                                            if (!realisasi[rhk._id]) {
                                                realisasi[rhk._id] = {}; // Inisialisasi objek untuk rhk._id jika belum ada
                                            }

                                            rhk.aspek.forEach((aspek) => {
                                                // Filter data harian sesuai kondisi
                                                const filteredHarians = rhk.harians?.filter((h) => {
                                                    const hDate = dayjs(h.date); // Konversi h.date ke Day.js object
                                                    const endDateTime = dayjs(periode.data.periodeEnd); // Konversi periodeEnd ke Day.js object

                                                    return hDate.isBefore(endDateTime) || (hDate.isSame(endDateTime) && h.isSKP === true);
                                                });

                                                // Hitung realisasi untuk aspek
                                                realisasi[rhk._id][aspek._id] = getRealisasi(aspek, filteredHarians);
                                            });
                                        });

                                        console.log(atasan);

                                        const query = {
                                            atasan: atasan,
                                            bawahan: bawahan,
                                            skp: res.data,
                                            realisasi: realisasi,
                                            periode: periode.data,
                                            periodeStart: dateFormatter(periode.data.periodeStart),
                                            periodeEnd: dateFormatter(periode.data.periodeEnd)
                                        };

                                        console.log(query);

                                        const pdfBlob = await getHasilSkp(query);
                                        console.log(pdfBlob);

                                        const url = window.URL.createObjectURL(pdfBlob);
                                        const a = document.createElement('a');
                                        a.href = url;
                                        a.download = 'hasil-skp.pdf'; // Filename
                                        document.body.appendChild(a);
                                        a.click();
                                        a.remove();
                                        window.URL.revokeObjectURL(url);

                                        console.log(realisasi);
                                    }
                                }}
                            >
                                Cetak Hasil SKP
                            </Button>
                        </div>
                    </div>
                    <div className="grid grid-flow-row divide-y text-xs">
                        <div className="flex items-center justify-between py-2">
                            <span className="uppercase font-semibold">periode</span>
                            <Tag color="blue" className="capitalize">
                                {data?.periode_awal && data?.periode_akhir ? dateFormatter(data?.periode_awal) + ' - ' + dateFormatter(data?.periode_akhir) : 'tanggal tidak tersedia'}
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
                                    {atasan?.nama_asn}
                                </p>
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <span className="uppercase font-semibold">nip</span>
                                <p color="blue" className="capitalize">
                                    {atasan?.id_asn}
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
                                <p className="text-right capitalize"> {atasan?.nama_jabatan}</p>
                            </div>
                            <div className="flex justify-between py-2">
                                <span className="uppercase font-semibold">unit kerja</span>
                                <div className="flex flex-col gap-y-2 text-right items-end">
                                    <p>{atasan?.unor.nama}</p>
                                    <small>ID : {atasan?.unor.id}</small>
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
                        {data?.rhks.map((item, index) => (
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
                                    <td rowSpan={item.aspek ? item.aspek.length + 1 : 1} style={{ maxWidth: '12rem', padding: '8px' }}>
                                        <div className="flex flex-col gap-y-2 p-4">
                                            <List
                                                className="px-4"
                                                renderItem={
                                                    (item) =>
                                                        <List.Item>
                                                            {item.isi_lampiran}
                                                        </List.Item>}
                                            />

                                        </div>
                                    </td>
                                    <td rowSpan={item.aspek ? item.aspek.length + 1 : 1}>
                                        <div className="flex items-center justify-center">
                                            <Button type="primary" onClick={() => router.push(`/dashboard/skp/${IdSkp}/periode_penilaian/${IdNilai}/penilaian/${IdSkp}/${item.id}/bukti_dukung`)}>
                                                Lihat
                                            </Button>
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
                                                {' '}
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
                                            <td></td>
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
                            <td colSpan={4}>{penilaian?.ratingKinerja}</td>
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

                                </td>
                                <td></td>
                            </tr>
                        ))}
                        <tr>
                            <td colSpan={3}>Rating Perilaku</td>
                            <td colSpan={4}>{penilaian?.ratingPerilaku}</td>
                        </tr>
                        <tr>
                            <td colSpan={3}>Peredikat Kinerja</td>
                            <td colSpan={4}></td>
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
                                    <List
                                        className="px-4"
                                        dataSource={skp?.lampiran.sumber_daya}
                                        renderItem={
                                            (item) =>
                                                <List.Item>
                                                    {item.isi_lampiran}
                                                </List.Item>}
                                    />

                                </div>
                                {/* looping through here */}
                            </td>
                        </tr>
                        <tr>
                            <td style={{ border: '1px solid black', padding: '8px' }}>
                                <div className="flex flex-col gap-y-2 p-4">
                                    <b>Skema Pertanggung Jawaban</b>
                                    <List
                                        className="px-4"
                                        dataSource={skp?.lampiran.skema}
                                        renderItem={
                                            (item) =>
                                                <List.Item>
                                                    {item.isi_lampiran}
                                                </List.Item>}
                                    />

                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td style={{ border: '1px solid black', padding: '8px' }}>
                                <div className="flex flex-col gap-y-2 p-4">
                                    <p>Konsekuensi</p>
                                    <List
                                        className="px-4"
                                        dataSource={skp?.lampiran.konsekuensi}
                                        renderItem={
                                            (item) =>
                                                <List.Item>
                                                    {item.isi_lampiran}
                                                </List.Item>}
                                    />
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </Card>
            <CrudModal title={modal.title} onSubmit={modal.onSubmit} isModalOpen={modal.trigger} onClose={handleClose} data={modal.modalData} formFields={modal.formFields} type={modal.type} />
        </div>
    );
};

export default page;
