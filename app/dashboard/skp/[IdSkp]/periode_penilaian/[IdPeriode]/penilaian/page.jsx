'use client';

import { Breadcrumb, Button, Card, Space, Tabs, Tag, Typography } from 'antd';
import { EditOutlined, DeleteOutlined, SearchOutlined, PrinterOutlined, FileOutlined, PlusOutlined } from '@ant-design/icons';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CrudModal, DataTable } from '@/components';
import { dummyBawahan } from '@/data';
import { getData } from '@/controller/AuthorizationController';
import useFetchData from '@/hooks/useFetchData';
import { getById, getBySKP } from '@/controller/SKPController';
import { dateFormatter } from '@/utils';

const { Title } = Typography;

const page = () => {
    const router = useRouter();
    const { IdSkp, IdPeriode } = useParams();
    const [modal, setModal] = useState({ trigger: false, modalData: null, title: '', formFields: [], onSubmit: () => {} });

    const { data, setData } = useFetchData(getData);
    const [skp, setSKP] = useState(null);
    const [bawahan, setBawahan] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if (data) {
            fetchData();
        }
    }, [data]);

    const fetchData = async () => {
        try {
            const skp = await getById(IdSkp);
            const bawahan = await getBySKP(skp.data._id);
            setBawahan(bawahan.data);
            setSKP(skp.data);
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    };

    const Column = [
        {
            title: 'No',
            dataIndex: 'index',
            render: (text, record, index) => index + 1,
            width: '5%'
        },
        {
            title: 'Nama',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.length - b.name.length,
            render: (_, record) => {
                const lastJabatan = record.jabatan?.[record.jabatan.length - 1];
                return lastJabatan ? lastJabatan.nama_asn : 'No Jabatan';
            }
        },
        {
            title: 'Nama Organisasi',
            dataIndex: 'unor',
            key: 'unor',
            sorter: (a, b) => a.unor.length - b.unor.length,
            render: (_, record) => {
                const lastJabatan = record.jabatan?.[record.jabatan.length - 1];
                return lastJabatan ? lastJabatan.unor?.nama : 'No Organisasi';
            }
        },
        {
            title: 'Jabatan',
            dataIndex: 'jabatan',
            key: 'jabatan',
            sorter: (a, b) => a.jabatan.length - b.jabatan.length,
            render: (_, record) => {
                const lastJabatan = record.jabatan?.[record.jabatan.length - 1];
                return lastJabatan ? lastJabatan.nama_jabatan : 'No Jabatan';
            }
        },

        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="small">
                    <Button
                        // type='primary'
                        size="middle"
                        onClick={() => router.push(`/dashboard/skp/${IdSkp}/periode_penilaian/${IdPeriode}/penilaian/${record._id}/penilaian_rhk`)}
                    >
                        Hasil Kerja
                    </Button>

                    <Button
                        // type='primary'
                        size="middle"
                        onClick={() => router.push(`/dashboard/skp/${IdSkp}/periode_penilaian/${IdPeriode}/penilaian/${record._id}/feedback_perilaku`)}
                    >
                        Perilaku
                    </Button>
                    <Button icon={<PlusOutlined />} onClick={() => setModal({ trigger: true, title: 'Tambah Predikat Kinerja Pegawai', formFields: predikatFields })}>
                        Tambah Predikat
                    </Button>
                    <Button icon={<FileOutlined />} size="middle" onClick={() => router.push('/document/1/hasil_skp')}>
                        Cetak
                    </Button>
                </Space>
            )
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
                    value: 'Istimewa'
                },
                {
                    label: 'Baik',
                    value: 'Baik'
                },
                {
                    label: 'Butuh Perbaikan',
                    value: 'Butuh Perbaikan'
                },
                {
                    label: 'Kurang (Misconduct)',
                    value: 'Kurang (Misconduct)'
                },
                {
                    label: 'Sangat Kurang',
                    value: 'Sangat Kurang'
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
    return (
        <div className="flex flex-col gap-y-4">
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
                <div className="flex items-center justify-between mb-6">
                    <Title className="mt-2" level={5}>
                        Penilaian SKP
                    </Title>
                </div>
                <div className="grid grid-flow-row divide-y text-xs mb-12">
                    <div className="flex items-center justify-between py-2">
                        <span className="uppercase font-semibold">periode skp</span>
                        <p className="text-right capitalize">{skp?.periode_awal && skp?.periode_akhir ? dateFormatter(skp.periode_awal) + '-' + dateFormatter(skp.periode_akhir) : 'Tanggal tidak tersedia'}</p>
                    </div>
                    <div className="flex items-center justify-between py-2">
                        <span className="uppercase font-semibold">jabatan</span>
                        <p className="text-right uppercase">{skp?.jabatan[skp.jabatan.length - 1].nama_jabatan}</p>
                    </div>
                    <div className="flex items-start justify-between py-2">
                        <span className="uppercase font-semibold">unit kerja</span>
                        <div className="flex flex-col gap-y-2 text-right items-end">
                            <p>{skp?.jabatan[skp.jabatan.length - 1].unor.nama}</p>
                            <small>ID : {skp?.jabatan[skp.jabatan.length - 1].unor.id}</small>
                        </div>
                    </div>
                    <div className="flex items-start justify-between py-2">
                        <span className="uppercase font-semibold">unit kerja induk</span>
                        <div className="flex flex-col gap-y-2 text-right items-end">
                            <p>{skp?.jabatan[skp.jabatan.length - 1].unor.induk.nama}</p>
                            <small>ID : {skp?.jabatan[skp.jabatan.length - 1].unor.induk.id}</small>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-x-2 mb-4">
                    <Button type="default" onClick={() => router.push(`/dashboard/skp/${IdSkp}/periode_penilaian/${IdPeriode}/penilaian/1/rekap_penilaian`)}>
                        Rekap Penilaian Bawahan
                    </Button>
                    <Button type="default" icon={<PrinterOutlined />} onClick={() => router.push('/document/1/evaluasi_kinerja')}>
                        Cetak Dokumen Evaluasi Kinerja
                    </Button>
                    <Button type="primary" onClick={() => router.push(`/dashboard/skp/${IdSkp}/periode_penilaian/${IdPeriode}/penilaian/1/lihat_kurva`)}>
                        Lihat Kurva
                    </Button>
                    <Button type="primary">Pembinaan Bawahan</Button>
                </div>
                <DataTable columns={Column} data={bawahan} loading={loading} />
                <CrudModal type="create" onClose={onClose} formFields={modal.formFields} data={modal.modalData} onSubmit={modal.onSubmit} isModalOpen={modal.trigger} title={modal.title}></CrudModal>

                {/* <Tabs defaultActiveKey="1" type="card">
                    <Tabs.Items tab="Pelaksanaan Kinerja" key="1">
                        <table className="normaltable">
                            <thead>
                                <tr>
                                    <th>Hasil Kerja</th>
                                    <th>Perilaku Kerja</th>
                                    <th>Nilai SKP</th>
                                    <th>Capaian Organisasi</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td colSpan={5}>
                                        <div className="grid grid-flow-row divide-y text-xs mb-12 p-2">
                                            <div className="flex items-center justify-between py-2">
                                                <span className="uppercase font-semibold">periode penilaian</span>
                                                <div className="flex flex-col gap-y-1 items-end">
                                                    <b className="text-right capitalize">Januari</b>
                                                    <Tag color="blue">1 Januari 2024 s/d 31 Januari 2024</Tag>
                                                    <span>
                                                        <b>Batas:</b>5 Februari 2024
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between py-2">
                                                <span className="uppercase font-semibold">atasan</span>
                                                <p className="text-right uppercase">SUPRATMAN NENTO </p>
                                            </div>
                                            <div className="flex items-center justify-between py-2">
                                                <span className="uppercase font-semibold">jabatan</span>
                                                <p className="text-right uppercase">Kepala BADAN KEPEGAWAIAN DAN PENGEMBANGAN SUMBER DAYA MANUSIA</p>
                                            </div>
                                            <div className="flex items-center justify-between py-2">
                                                <span className="uppercase font-semibold">unit kerja</span>
                                                <p className="text-right uppercase"> BADAN KEPEGAWAIAN DAN PENGEMBANGAN SUMBER DAYA MANUSIA</p>
                                            </div>
                                            <div className="flex items-center gap-x-2 py-2">
                                                <Button type="primary">Cetak Form Penilaian</Button>
                                                <Button type="primary">Cetak Dokumen Evaluasi Kinerja</Button>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>-</td>
                                    <td>-</td>
                                    <td>-</td>
                                    <td>-</td>
                                    <td>
                                        <div className="flex flex-col p-4 gap-y-2">
                                            <Button type="default" className="w-fit" onClick={() => router.push(`/dashboard/skp/${IdSkp}/penilaian/1/penilaian_rhk`)}>
                                                Penilaian SKP
                                            </Button>
                                            <Button type="default" className="w-fit" onClick={() => router.push(`/dashboard/skp/${IdSkp}/penilaian/1/feedback_perilaku`)}>
                                                Feedback Perilaku
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </Tabs.Items>
                  
                </Tabs> */}
            </Card>
        </div>
    );
};

export default page;
