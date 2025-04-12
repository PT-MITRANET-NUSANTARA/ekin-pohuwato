'use client';

import { Button, Card, List, Popconfirm, Skeleton, Space, Tag, Tooltip, Typography } from 'antd';
import { UserOutlined, DotChartOutlined, PrinterOutlined, ReloadOutlined, SearchOutlined, EditFilled, EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { getById, update } from '@/controller/SKPController';
import { formatDateToDayMonthYear } from '@/utils/util';
import { CrudModal, DataTable, InfoModal, ItemRow } from '@/components';
import useNotification from '@/app/hook/useNotification';
import { dummyMisi } from '@/data/dummyData';
const { Title } = Typography;
const page = () => {
    const { success, error } = useNotification();

    const { IdSkp } = useParams();
    const router = useRouter();
    const [jabatan, setJabatan] = useState(null);
    const [skp, setSkp] = useState(null);
    const [loadingData, setLoadingData] = useState(true);
    const [modal, setModal] = useState({ trigger: false, modalData: null, title: '', formFields: [], onSubmit: () => { } });
    const [infoModal, setInfoModal] = useState({ trigger: false, title: '', onClose: () => { }, data: null, type: '', isLoading: false, column: [] });
    const [utama, setUtama] = useState(null);
    const [tambahan, setTambahan] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const skp = await getById(IdSkp);
            setSkp(skp.data);
            setJabatan(skp.data.jabatan[skp.data.jabatan.length - 1]);
            setLoadingData(false);

            setUtama(skp.data.rhks.filter((item) => item.jenis === 'utama'));
            setTambahan(skp.data.rhks.filter((item) => item.jenis === 'tambahan'));
        } catch (error) {
            console.log(error);
        }
    };

    const cetakSkpSubmit = (values) => {
        const query = new URLSearchParams(values).toString();
        router.push(`/document/${IdSkp}/1/rencana_skp?${query}`);
    };

    const rktTambahanColumn = [
        {
            title: 'No',
            dataIndex: 'index',
            render: (text, record, index) => index + 1,
            width: '5%'
        },
        {
            title: 'Visi',
            dataIndex: 'visi',
            key: 'visi',
            render: (_, record) => (
                <>
                    <Button
                        onClick={() => {
                            setInfoModal({
                                title: 'Informasi Visi',
                                trigger: true,
                                type: 'desc',
                                data: [
                                    {
                                        key: 'visi',
                                        label: 'Visi',
                                        children: record.visi.name
                                    }
                                ],
                                isLoading: false,
                                onClose: () => setInfoModal({ ...infoModal, trigger: false, data: null })
                            });
                        }}
                        icon={<SearchOutlined />}
                    >
                        Info
                    </Button>
                </>
            )
        },
        {
            title: 'Misi',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.length - b.name.length
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="small">
                    <Popconfirm
                        title="Hapus"
                        description="Hapus data ini?"
                        onConfirm={() => {}}
                        onCancel={() => {}}
                        okText="Yakin"
                        cancelText="Batal"
                    >
                        <Button
                            size="middle"
                            danger
                            icon={<DeleteOutlined />}
                        />
                    </Popconfirm>

                </Space>
            )
        }
    ];


    const cetakSkpFields = [
        {
            label: 'Tanggal',
            name: 'tanggal',
            type: 'date',
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
        }
    ];

    const lampiranFields = [
        {
            label: 'Isi Lampiran',
            name: 'isi_lampiran',
            type: 'longtext',
            rules: [
                {
                    required: true,
                    message: 'Field Isi Lampiran wajib diisi'
                }
            ]
        }
    ];

    const addLampiran = async (key, values) => {
        const lampiran = skp.lampiran[key];
        lampiran.push(values);

        const dt = {
            ...skp,
            lampiran: {
                ...skp.lampiran,
                [key]: lampiran
            }
        };

        const res = await update(skp._id, skp);
        if (res.oke) {
            fetchData();
            success('Berhasil Menambahkan Lampiran');
        } else {
            error('Gagal', res.data);
        }

    };

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
                            <Button type="default" icon={<DotChartOutlined />} onClick={() => router.push(`/dashboard/skp/${IdSkp}/matriks_peran_hasil`)}>
                                Lihat Matriks
                            </Button>
                            <Button type="default" icon={<PrinterOutlined />} onClick={() => setModal({ trigger: true, modalData: null, title: `Cetak Rencana SKP`, type: 'create', formFields: cetakSkpFields, onSubmit: cetakSkpSubmit })}>
                                Cetak
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
                                    {formatDateToDayMonthYear(skp?.periode_awal)} - {formatDateToDayMonthYear(skp?.periode_akhir)}
                                </Tag>
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <span className="uppercase font-semibold">pendekatan</span>
                                <Tag color="blue" className="capitalize">
                                    {skp?.pendekatan}
                                </Tag>
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <span className="uppercase font-semibold">status</span>
                                <Tag color="green" className="capitalize">
                                    {skp?.status}
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
                                            <p>{jabatan?.unor.nama} </p>
                                            <small>ID : {jabatan?.unor.id}</small>
                                            {/* <Button type="primary" shape="circle" size="small" icon={<SearchOutlined />} /> */}
                                        </div>
                                    </div>
                                </div>
                            </Card>
                            <Card type="inner" title="Pegawai Yang Penilai" className="col-span-6 w-full">
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
                                {utama?.map((item, index) => (
                                    <ItemRow key={index} item={item} index={index} />
                                ))}
                                <tr>
                                    <td colSpan={6} className="text-left p-4">
                                        <div className='w-full flex items-center justify-between px-4'>
                                            Tambahan
                                            <div className='inline-flex gap-x-2'>
                                                <Button icon={<PlusOutlined />}>
                                                    Dari RKT
                                                </Button>
                                                <Button
                                                    icon={<DeleteOutlined />}
                                                    onClick={() => {
                                                        setInfoModal({
                                                            title: 'Informasi Harian',
                                                            trigger: true,
                                                            type: 'paragraf',
                                                            data: {

                                                                content: (
                                                                    <>
                                                                        <DataTable columns={rktTambahanColumn} data={dummyMisi} />
                                                                    </>
                                                                )
                                                            },
                                                            isLoading: false,
                                                            onClose: () => setInfoModal({ ...infoModal, trigger: false, data: null })
                                                        });
                                                    }}
                                                >
                                                    Dari RKT
                                                </Button>
                                            </div>

                                        </div>

                                    </td>
                                </tr>
                                {tambahan?.map((item, index) => (
                                    <ItemRow key={index} item={item} index={index} />
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
                                {skp?.perilakus?.map((item, index) => (
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
                                        <td>{item.espektasi || ''}</td>
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
                                        <div className="flex flex-col gap-y-2 p-4">
                                            <b>Dukungan Sumber Daya</b>
                                            <List
                                                className="px-4"
                                                dataSource={skp?.lampiran.sumber_daya}
                                                renderItem={
                                                    (item) =>
                                                        <List.Item
                                                            actions={[
                                                                <Button
                                                                    icon={<EditOutlined />}
                                                                    onClick={() =>
                                                                        setModal({
                                                                            formFields: lampiranFields,
                                                                            modalData: item,
                                                                            onSubmit: (values) => {
                                                                                console.log('seharusnya ini mengedit lampiran')
                                                                            },
                                                                            title: 'Edit Dukungan Sumber Daya',
                                                                            trigger: true,
                                                                            type: 'edit',
                                                                        })
                                                                    }
                                                                />,
                                                                <Button
                                                                    icon={<DeleteOutlined />}
                                                                    onClick={() =>
                                                                        setModal({
                                                                            formFields: lampiranFields,
                                                                            modalData: item,
                                                                            onSubmit: (values) => {
                                                                                console.log('seharusnya ini menghapus lampiran')
                                                                            },
                                                                            title: 'Delete Dukungan Sumber Daya',
                                                                            trigger: true,
                                                                            type: 'delete',
                                                                        })
                                                                    }
                                                                />
                                                            ]}
                                                        >
                                                            {item.isi_lampiran}
                                                        </List.Item>}
                                            />
                                            <Button
                                                className="w-fit"
                                                type="primary"
                                                onClick={() =>
                                                    setModal({
                                                        formFields: lampiranFields,
                                                        onSubmit: (values) => {
                                                            addLampiran('sumber_daya', values);
                                                        },
                                                        title: 'Tambah Dukungan Sumber Daya',
                                                        trigger: true,
                                                        type: 'create',
                                                        modalData: {}
                                                    })
                                                }
                                            >
                                                Tambah
                                            </Button>
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
                                                        <List.Item
                                                            actions={[
                                                                <Button
                                                                    icon={<EditOutlined />}
                                                                    onClick={() =>
                                                                        setModal({
                                                                            formFields: lampiranFields,
                                                                            modalData: item,
                                                                            onSubmit: (values) => {
                                                                                console.log('seharusnya ini mengedit lampiran')
                                                                            },
                                                                            title: 'Edit Dukungan Sumber Daya',
                                                                            trigger: true,
                                                                            type: 'edit',
                                                                        })
                                                                    }
                                                                />,
                                                                <Button
                                                                    icon={<DeleteOutlined />}
                                                                    onClick={() =>
                                                                        setModal({
                                                                            formFields: lampiranFields,
                                                                            modalData: item,
                                                                            onSubmit: (values) => {
                                                                                console.log('seharusnya ini menghapus lampiran')
                                                                            },
                                                                            title: 'Delete Dukungan Sumber Daya',
                                                                            trigger: true,
                                                                            type: 'delete',
                                                                        })
                                                                    }
                                                                />
                                                            ]}>
                                                            {item.isi_lampiran}
                                                        </List.Item>}
                                            />
                                            <Button
                                                className="w-fit"
                                                type="primary"
                                                onClick={() =>
                                                    setModal({
                                                        formFields: lampiranFields,
                                                        onSubmit: (values) => {
                                                            addLampiran('skema', values);
                                                        },
                                                        title: 'Edit Dukungan Sumber Daya',
                                                        trigger: true,
                                                        type: 'create',
                                                        modalData: {}
                                                    })
                                                }
                                            >
                                                Tambah
                                            </Button>
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
                                                        <List.Item
                                                            actions={[
                                                                <Button
                                                                    icon={<EditOutlined />}
                                                                    onClick={() =>
                                                                        setModal({
                                                                            formFields: lampiranFields,
                                                                            modalData: item,
                                                                            onSubmit: (values) => {
                                                                                console.log('seharusnya ini mengedit lampiran')
                                                                            },
                                                                            title: 'Edit Dukungan Sumber Daya',
                                                                            trigger: true,
                                                                            type: 'edit',
                                                                        })
                                                                    }
                                                                />,
                                                                <Button
                                                                    icon={<DeleteOutlined />}
                                                                    onClick={() =>
                                                                        setModal({
                                                                            formFields: lampiranFields,
                                                                            modalData: item,
                                                                            onSubmit: (values) => {
                                                                                console.log('seharusnya ini menghapus lampiran')
                                                                            },
                                                                            title: 'Delete Dukungan Sumber Daya',
                                                                            trigger: true,
                                                                            type: 'delete',
                                                                        })
                                                                    }
                                                                />
                                                            ]}>
                                                            {item.isi_lampiran}
                                                        </List.Item>}
                                            />
                                            <Button
                                                className="w-fit"
                                                type="primary"
                                                onClick={() =>
                                                    setModal({
                                                        formFields: lampiranFields,
                                                        onSubmit: (values) => {
                                                            addLampiran('konsekuensi', values);
                                                        },
                                                        title: 'Edit Dukungan Sumber Daya',
                                                        trigger: true,
                                                        type: 'edit',
                                                        modalData: {}
                                                    })
                                                }
                                            >
                                                Tambah
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </>
                )}
            </Card>
            <CrudModal title={modal.title} onSubmit={modal.onSubmit} isModalOpen={modal.trigger} onClose={() => setModal({ trigger: false, modalData: null })} data={modal.modalData} formFields={modal.formFields} type={modal.type} />
            <InfoModal close={infoModal.onClose} data={infoModal.data} isModalOpen={infoModal.trigger} title={infoModal.title} columns={infoModal.column} isLoading={infoModal.isLoading} type={infoModal.type} />
        </div>
    );
};

export default page;
