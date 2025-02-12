'use client';

import { Breadcrumb, Button, Card, Space, Typography } from 'antd';
import { FileOutlined, PrinterOutlined, } from '@ant-design/icons';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CrudModal, DataLoading, DataTable } from '@/components';
import useFetchData from '@/hooks/useFetchData';
import { getById, getBySKPId } from '@/controller/SKPController';
import { dateFormatter } from '@/utils';
import { getData } from '@/controller/AuthorizationController';

const { Title } = Typography;

const page = () => {
    const router = useRouter();
    const { IdSkp, IdPeriode } = useParams();
    const [modal, setModal] = useState({ trigger: false, modalData: null, title: '', formFields: [], onSubmit: () => { } });
    const [skp, setSKP] = useState(null);
    const [bawahan, setBawahan] = useState(null);
    const [loading, setLoading] = useState(true);
    const { data: user, setData: setUser } = useFetchData(getData);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, filters: {}, total: 0 });
    const [data, setData] = useState([]);

    useEffect(() => {
        if (user) {
            fetchData();
        }
    }, [user, pagination.page, pagination.limit]);

    const fetchData = async () => {
        try {
            const data = await getBySKPId(IdSkp, pagination.page, pagination.limit, {
                ...pagination.filters,
                status: { $in: [ 'approved'] }
            });
            console.log(data);
            const skp = await getById(IdSkp);
            setData(data.data.data);
            setPagination({ ...pagination, page: data.data.pagination.currentPage, limit: data.data.pagination.pageSize, total: data.data.pagination.totalItems });
            setSKP(skp.data);
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
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
            searchable: true,
            render: (_, record) => {
                const lastJabatan = record.jabatan?.[record.jabatan.length - 1];
                return lastJabatan ? lastJabatan.nama_asn : 'No Jabatan';
            }
        },
        {
            title: 'Nama Organisasi',
            dataIndex: 'unor',
            key: 'unor',
            searchable: true,
            render: (_, record) => {
                const lastJabatan = record.jabatan?.[record.jabatan.length - 1];
                return lastJabatan ? lastJabatan.unor?.nama : 'No Organisasi';
            }
        },
        {
            title: 'Jabatan',
            dataIndex: 'jabatan',
            key: 'jabatan',
            searchable: true,
            render: (_, record) => {
                const lastJabatan = record.jabatan?.[record.jabatan.length - 1];
                return lastJabatan ? lastJabatan.nama_jabatan : 'No Jabatan';
            }
        },

        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="small" direction="vertical">

                    <Button
                        // type='primary'
                        size="middle"
                        onClick={() => router.push(window.location.pathname + `/${record._id}/penilaian_rhk`)}
                    >
                        Hasil Kerja
                    </Button>

                    <Button
                        // type='primary'
                        size="middle"
                        onClick={() => router.push(window.location.pathname + `/${record._id}/feedback_perilaku`)}
                    >
                        Perilaku
                    </Button>
                    <Button onClick={() => router.push(window.location.pathname + `/${record.id}/predikat_kinerja`)}>Predikat Kinerja</Button>

                </Space>
            )
        }
    ];

    const onClose = () => {
        setModal((prev) => ({ ...prev, trigger: false }));
    };

    const evaluasiKinerjaPrintFields = [
        {
            label: 'Tanggal Pegawai',
            name: 'tanggal_pegawai',
            type: 'date',
            rules: [
                {
                    required: true,
                    message: 'Field tanggal pegawai pertama wajib di isi'
                }
            ]
        },
        {
            label: 'Lokasi Pegawai',
            name: 'lokasi_pegawai',
            type: 'text',
            rules: [
                {
                    required: true,
                    message: 'Field lokasi pertama wajib di isi'
                }
            ]
        },
        {
            label: 'Tanggal Pejabat Penilai Kinerja',
            name: 'tanggal_penilai',
            type: 'date',
            rules: [
                {
                    required: true,
                    message: 'Field Tanggal Penilai Kinerja wajib di isi'
                }
            ]
        }
    ];
    return (
        <div className="flex flex-col gap-y-4">
          
            {loading ? (
                <DataLoading loadingData={loading} />
            ) : (
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
                        <Button type="default" icon={<PrinterOutlined />} onClick={() => setModal({ trigger: true, formFields: evaluasiKinerjaPrintFields, title: 'Cetak Dokumen Evaluasi Kinerja', onSubmit: () => { } })}>
                            Cetak Dokumen Evaluasi Kinerja
                        </Button>
                        <Button
                            size="middle"
                            onClick={() => router.push(window.location.pathname + `/rencana_aksi`)}
                        >
                            Rencana Aksi
                        </Button>
                        <Button type="primary" onClick={() => router.push(`/dashboard/skp/${IdSkp}/periode_penilaian/${IdPeriode}/penilaian/1/lihat_kurva`)}>
                            Lihat Kurva
                        </Button>
                        <Button
                            type='primary'
                            icon={<FileOutlined />}
                            size="middle"
                            onClick={() => router.push(window.location.pathname + `/lihat_hasil`)}
                        >
                            Lihat Hasil
                        </Button>

                    </div>
                    <DataTable columns={Column} data={data} loading={loading} />
                    <CrudModal type="create" onClose={onClose} formFields={modal.formFields} data={modal.modalData} onSubmit={modal.onSubmit} isModalOpen={modal.trigger} title={modal.title}></CrudModal>
                </Card>
            )}
        </div>
    );
};

export default page;
