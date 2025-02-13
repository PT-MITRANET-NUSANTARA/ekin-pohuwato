'use client';

import { Breadcrumb, Button, Card, message, Skeleton, Tag, Tooltip, Typography } from 'antd';
import { UserOutlined, DotChartOutlined, PrinterOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import useFetchData from '@/hooks/useFetchData';
import { getData } from '@/controller/AuthorizationController';
import { getById } from '@/controller/SKPController';
import { getByNIP } from '@/controller/IDSN/JabatanController';
import { update } from '@/controller/PerilakuController';
import { formatDateToDayMonthYear } from '@/utils/util';
import { CrudModal } from '@/components';
import dayjs from 'dayjs';
import { dateFormatter } from '@/utils';
const { Title } = Typography;
const page = () => {
    const { IdSkp, IdBawahan } = useParams();
    const router = useRouter();
    const [data, setData] = useState(null);
    const [atasan, setAtasan] = useState(null);
    const [bawahan, setBawahan] = useState(null);
    const [jabatan, setJabatan] = useState(null);
    const [loadingData, setLoadingData] = useState(true);
    const [modal, setModal] = useState({ trigger: false, modalData: null, title: '', formFields: [], onSubmit: () => { } });
    const [index, setIndex] = useState(0);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const skp = await getById(IdBawahan);
            const skpAtasan = await getById(IdSkp);

            const index = skp.data.skp.findIndex((item) => item._id === IdSkp);
            const bawahan = skp.data.jabatan[index];
            const jabatan = skpAtasan.data.jabatan;

            const atasan = jabatan.find((item) => {
                return item.id_posjab === skp.data.posjab[index];
            });

            setData(skp.data);
            setBawahan(bawahan);
            setAtasan(atasan);
            setIndex(bawahan.id_posjab);
            setLoadingData(false);
        } catch (error) {
            console.log(error);
        }
    };

    const cetakSkpSubmit = (values) => {
        const query = new URLSearchParams(values).toString();
        router.push(`/document/1/1/rencana_skp?${query}`);
    };

    const cetakSkpFields = [
        {
            label: 'Tanggal',
            name: 'tanggal',
            type: 'date',
            extra: { minDate: dayjs(), maxDate: dayjs() },
            rules: [
                {
                    required: true,
                    message: 'Field tanggal wajib diisi'
                }
            ]
        },
        {
            label: 'Lokasi',
            name: 'lokasi',
            type: 'text',
            rules: [
                {
                    required: true,
                    message: 'Field lokasi wajib diisi'
                }
            ]
        },
        {
            label: 'Anchor Pegawai Yang Dinilai (Opsional)',
            name: 'anchor_dinilai',
            type: 'text'
        },
        {
            label: 'Anchor Pejabat Yang Menilai (Opsional)',
            name: 'anchor_penilai',
            type: 'text'
        }
    ];

    const ekspektasiPimpinanFields = [
        {
            label: 'Ekspektasi',
            name: 'ekspektasi',
            type: 'longtext',
            rules: [
                {
                    required: true,
                    message: 'Field ekspektasi harus di isi'
                }
            ]
        }
    ];

    const statusSkpFields = [
        {
            label: 'Status',
            name: 'status',
            type: 'select',
            options: [
                {
                    label: 'Pengajuan',
                    value: 'pengajuan'
                },
                {
                    label: 'Draft',
                    value: 'draft'
                },
                {
                    label: 'persetujuan',
                    value: 'persetujuan'
                }
            ]
        }
    ];

    return (
        <div className="w-full flex flex-col gap-y-4">

            <Card>
                <div className="flex flex-col gap-y-4 mb-6">
                    <div className="w-full flex items-center justify-between">
                        <Title className="mt-2" level={5}>
                            Sasaran Kinerja Pegawai
                        </Title>
                        <div className="flex items-center gap-x-2">
                            <Button type="primary" icon={<UserOutlined />} onClick={() => router.push('/dashboard/profil')}>
                                Lihat Data Profil
                            </Button>
                            <Button type="default" icon={<PrinterOutlined />} onClick={() => setModal({ trigger: true, modalData: null, title: `Cetak Rencana SKP`, type: 'create', formFields: cetakSkpFields, onSubmit: cetakSkpSubmit })}>
                                Cetak
                            </Button>
                            <Button type="primary" icon={<UserOutlined />} onClick={() => setModal({ trigger: true, modalData: null, title: 'Edit Status SKP', type: 'edit', formFields: statusSkpFields })}>
                                Edit Status
                            </Button>
                            <Tooltip title="Refresh Data">
                                <Button icon={<ReloadOutlined />} onClick={() => fetchData()} />
                            </Tooltip>
                        </div>
                    </div>
                </div>
                {loadingData ? (
                    <Skeleton active />
                ) : (
                    <>
                        <div className="grid grid-flow-row divide-y text-xs mb-6">
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
                            {/* <div className="flex items-center justify-between py-2">
                            <span className="uppercase font-semibold">Model SKP</span>
                            <p className="text-right capitalize">JAJF</p>
                        </div> */}
                            {/* <div className="flex items-center justify-between py-2">
                            <span className="uppercase font-semibold">jenis pegawai</span>
                            <p className="text-right capitalize">pemimpin</p>
                        </div> */}
                        </div>
                        <div className="w-full grid grid-cols-12 gap-4 mb-6">
                            <Card type="inner" title="Pegawai Yang Menilai" className="col-span-6 w-full">
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
                                        <p className="text-right capitalize">{bawahan?.nama_jabatan}</p>
                                    </div>
                                    <div className="flex justify-between py-2">
                                        <span className="uppercase font-semibold">unit kerja</span>
                                        <div className="flex flex-col gap-y-2 text-right items-end">
                                            <p>{bawahan?.unor.nama} </p>
                                            <small>ID : {bawahan?.unor.id}</small>
                                            {/* <Button type="primary" shape="circle" size="small" icon={<SearchOutlined />} /> */}
                                        </div>
                                    </div>
                                </div>
                            </Card>
                            <Card type="inner" title="Pegawai Yang Dinilai" className="col-span-6 w-full">
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
                                        <p className="text-right capitalize"> {jabatan?.nama_jabatan}</p>
                                    </div>
                                    <div className="flex justify-between py-2">
                                        <span className="uppercase font-semibold">unit kerja</span>
                                        <div className="flex flex-col gap-y-2 text-right items-end">
                                            <p>{bawahan?.unor?.atasan?.unor_nama}</p>
                                            <small>ID : {bawahan?.unor?.atasan?.unor_id}</small>
                                            {/* <Button type="primary" shape="circle" size="small" icon={<SearchOutlined />} /> */}
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
                                    <th>INDIKATOR KINERJA INDIVIDU</th>
                                    <th>TARGET TAHUNAN</th>
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
                                                    <p>{item.rkt ? item.rkt.name : item.rhk.desc}</p>
                                                    {/* <Button size="small" type="primary" className="w-fit" shape="circle" icon={<SearchOutlined />} /> */}
                                                </div>
                                            </td>
                                            <td rowSpan={item.aspek ? item.aspek.length + 1 : 1} style={{ maxWidth: '12rem', padding: '8px' }}>
                                                <div className="flex flex-col gap-y-2 text-left">
                                                    <p>{item.rkt ? item.rkt.name : item.desc}</p>
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
                                                </tr>
                                            </>
                                        ))}
                                    </>
                                ))}
                            </tbody>
                        </table>
                        <table className="normaltable mb-6">
                            <thead>
                                <tr className="uppercase">
                                    <th>no</th>
                                    <th>perilaku kinerja</th>
                                    <th>ekspektasi khusus pimpinan</th>
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
                                            <div className="flex flex-col gap-y-2 items-center">
                                                {item.espektasi || ''}
                                                <Button
                                                    size="small"
                                                    onClick={() =>
                                                        setModal({
                                                            trigger: true,
                                                            modalData: null,
                                                            title: 'Edit ekspektasi khusus pimpinan',
                                                            type: 'edit',
                                                            formFields: ekspektasiPimpinanFields,
                                                            onSubmit: async (values) => {
                                                                const dt = { ...item, espektasi: values.ekspektasi };

                                                                const res = await update(item._id, dt);

                                                                if (res.ok) {
                                                                    fetchData();
                                                                    message.success('Data berhasil diubah');
                                                                    setModal({ trigger: false, modalData: null });
                                                                }
                                                            }
                                                        })
                                                    }
                                                >
                                                    Edit
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
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
                                        <div className="flex flex-col gap-y-2">
                                            <b>Dukungan Sumber Daya</b>
                                            {/* <ul className='list-decimal list-inside'>
                                                <li>
                                                    Sumber Daya Manusia
                                                </li>
                                                <li>
                                                    Perangkat kera: komputer, dan Sarana Prasarana pendukung lainnya
                                                </li>
                                            </ul> */}
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td style={{ border: '1px solid black', padding: '8px' }}>
                                        <div className="flex flex-col gap-y-2">
                                            <b>Skema Pertanggungjawaban</b>
                                            <ul>
                                                <li></li>
                                            </ul>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </>
                )}
            </Card>
            <CrudModal title={modal.title} onSubmit={modal.onSubmit} isModalOpen={modal.trigger} onClose={() => setModal({ trigger: false, modalData: null })} data={modal.modalData} formFields={modal.formFields} type={modal.type} />
        </div>
    );
};

export default page;
