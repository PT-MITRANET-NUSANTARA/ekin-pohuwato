'use client';

import { Breadcrumb, Button, Card, Form, InputNumber, List, Modal, Select, Tag, Typography } from 'antd';
import { UserOutlined, DotChartOutlined, PrinterOutlined, ReloadOutlined, SearchOutlined, PlusOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { CrudModal, DataLoading, RealisasiRow, RhkRow } from '@/components';
import { dummyFeedback } from '@/data';
import { title } from 'process';
const { Title } = Typography;
const { Option } = Select;
import { store as storePenilaian, getBySKPAndPeriode } from '@/controller/penilaianController';
import { getById } from '@/controller/SKPController';
import { useParams, useRouter } from 'next/navigation';
import { getById as getPenilaian } from '@/controller/periodePenilaianController';
import dayjs from 'dayjs';
import { dateFormatter } from '@/utils';
import { getRealisasi } from '@/controller/RHKController';
import { getHasilSkp } from '@/controller/ReportController';
import { formatDateToDayMonthYear } from '@/utils/util';

const page = () => {
    const router = useRouter();
    const { IdSkp, IdNilai, IdPeriode } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [atasan, setAtasan] = useState(null);
    const [penilaian, setPenilaian] = useState(null);
    const [skp, setSkp] = useState(null);
    const [modal, setModal] = useState({ trigger: false, modalData: null, title: '', formFields: [], onSubmit: () => { } });
    const [periode, setPeriode] = useState(null);
    const [utama, setUtama] = useState(null);
    const [tambahan, setTambahan] = useState(null);
    const [jabatan, setJabatan] = useState(null);
    const [submitLoading, setSubmitLoading] = useState(false)

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const skp = await getById(IdSkp);
            setJabatan(skp.data.jabatan[skp.data.jabatan.length - 1]);
            setUtama(skp.data.rhks.filter((item) => item.jenis === 'utama'));
            setTambahan(skp.data.rhks.filter((item) => item.jenis === 'tambahan'));
            setData(skp.data);
            const nilai = await getBySKPAndPeriode(IdSkp, IdPeriode);
            console.log('nilai', nilai);

            setPenilaian(nilai.data);
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    const printFormPenilaian = (values, type, id, formData) => {
        const query = new URLSearchParams(values).toString();
        router.push(`/document/${IdSkp}/${IdNilai}/form_penilaian?${query}`);
    };

    const printHasilSkp = async (values) => {
        setSubmitLoading(true)
        const periode = await getPenilaian(IdPeriode);

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
                    const data = await getRealisasi(rhk._id, rhk.jenis, aspek._id, IdPeriode);
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
                    <Card>
                        <div className="flex flex-col gap-y-4 mb-6">
                            <div className="w-full flex items-center justify-between">
                                <Title className="mt-2" level={5}>
                                    Nilai
                                </Title>
                                <div className="flex items-center gap-x-2">
                                    <Button type="default" icon={<PrinterOutlined />} onClick={() => setModal({ trigger: true, title: `Cetak Form Penilaian`, type: 'edit', formFields: formPerjanjian, onSubmit: printFormPenilaian })}>
                                        Cetak Form Penilaian
                                    </Button>
                                    <Button type="default" icon={<PrinterOutlined />}>
                                        Cetak Dokumen Evaluasi Kinerja
                                    </Button>
                                    <Button
                                        type="primary"
                                        icon={<PrinterOutlined />}
                                        onClick={() =>
                                            setModal({
                                                trigger: true,
                                                title: `Cetak Hasil SKP`,
                                                type: 'create',
                                                formFields: formHasilSkp,
                                                onSubmit: printHasilSkp
                                            })
                                        }
                                    >
                                        Cetak Hasil SKP
                                    </Button>
                                </div>
                            </div>
                            <div className="grid grid-flow-row divide-y text-xs">
                                <div className="flex items-center justify-between py-2">
                                    <span className="uppercase font-semibold">periode</span>
                                    <Tag color="blue" className="capitalize">
                                        {data?.periode_awal && data?.periode_akhir ? formatDateToDayMonthYear(data?.periode_awal) + ' - ' + formatDateToDayMonthYear(data?.periode_akhir) : 'tanggal tidak tersedia'}
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
                                {/* <div className="flex items-center justify-between py-2">
                                    <span className="uppercase font-semibold">Model SKP</span>
                                    <p className="text-right capitalize">JAJF</p>
                                </div>
                                <div className="flex items-center justify-between py-2">
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
                                            {jabatan?.unor.atasan.asn.nama_atasan}
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-between py-2">
                                        <span className="uppercase font-semibold">nip</span>
                                        <p color="blue" className="capitalize">
                                            {jabatan?.unor.atasan.asn.nip_atasan}
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
                            <Card type="inner" title="Pegawai Yang Penilai Kinerja" className="col-span-6 w-full">
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
                                    {/* <div className="flex items-center justify-between py-2">
                                <span className="uppercase font-semibold">pangkat / golongan / ruang</span>
                                <p color="green" className="capitalize">
                                    Penata Tingkat I / III/d
                                </p>
                            </div> */}
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
                                {utama?.map((item, index) => (
                                    <>
                                        {console.log("utama", data)}
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
                                                    <List className="px-4" renderItem={(item) => <List.Item>{item.isi_lampiran}</List.Item>} />
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
                                                    <RealisasiRow item={item} aspek={aspek} IdPeriode={IdPeriode} isTambahan={false} />
                                                    <RhkRow item={aspek} IdSkp={IdSkp} IdPeriode={IdPeriode} />
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
                                            <td rowSpan={item.aspek ? item.aspek.length + 1 : 1} style={{ maxWidth: '12rem', padding: '8px' }}>
                                                <div className="flex flex-col gap-y-2 p-4">
                                                    <List className="px-4" renderItem={(item) => <List.Item>{item.isi_lampiran}</List.Item>} />
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
                                                    <RealisasiRow item={item} aspek={aspek} IdPeriode={IdPeriode} isTambahan={true} />
                                                    <RhkRow item={aspek} IdSkp={IdSkp} IdPeriode={IdPeriode} />
                                                </tr>
                                            </>
                                        ))}
                                    </>
                                ))}
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
                                        <td></td>
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
                                            <List className="px-4" dataSource={data?.lampiran.sumber_daya} renderItem={(item) => <List.Item>{item.isi_lampiran}</List.Item>} />
                                        </div>
                                        {/* looping through here */}
                                    </td>
                                </tr>
                                <tr>
                                    <td style={{ border: '1px solid black', padding: '8px' }}>
                                        <div className="flex flex-col gap-y-2 p-4">
                                            <b>Skema Pertanggung Jawaban</b>
                                            <List className="px-4" dataSource={data?.lampiran.skema} renderItem={(item) => <List.Item>{item.isi_lampiran}</List.Item>} />
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td style={{ border: '1px solid black', padding: '8px' }}>
                                        <div className="flex flex-col gap-y-2 p-4">
                                            <p>Konsekuensi</p>
                                            <List className="px-4" dataSource={data?.lampiran.konsekuensi} renderItem={(item) => <List.Item>{item.isi_lampiran}</List.Item>} />
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </Card>
                    <CrudModal title={modal.title} onSubmit={modal.onSubmit} isModalOpen={modal.trigger} onClose={handleClose} data={modal.modalData} formFields={modal.formFields} type={modal.type} isLoading={submitLoading}/>
                </>
            )}
        </div>
    );
};

export default page;
