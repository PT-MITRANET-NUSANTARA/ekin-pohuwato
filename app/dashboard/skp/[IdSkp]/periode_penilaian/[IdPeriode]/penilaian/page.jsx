'use client';

import { Breadcrumb, Button, Card, Space, Tabs, Tag, Typography } from 'antd';
import { EditOutlined, DeleteOutlined, SearchOutlined, PrinterOutlined, FileOutlined, PlusOutlined } from '@ant-design/icons';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CrudModal, DataLoading, DataTable } from '@/components';
import { dummyBawahan } from '@/data';
import { getData } from '@/controller/AuthorizationController';
import useFetchData from '@/hooks/useFetchData';
import { getById, getBySKP } from '@/controller/SKPController';
import { getById as getByIdPenilaian } from '@/controller/periodePenilaianController';
import { dateFormatter } from '@/utils';
import { getHasilSkp } from '@/controller/ReportController';

const { Title } = Typography;

const page = () => {
    const router = useRouter();
    const { IdSkp, IdPeriode } = useParams();
    const [modal, setModal] = useState({ trigger: false, modalData: null, title: '', formFields: [], onSubmit: () => { } });

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
                <Space size="small" direction='vertical'>
                    <Button
                        // type='primary'
                        size="middle"
                        onClick={() => router.push(window.location.pathname + `/${record._id}/lihat_hasil`)}
                    >
                        Lihat Hasil
                    </Button>
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
                        onClick={() => router.push(window.location.pathname + `/${record._id}/rencana_aksi`)}
                    >
                        Rencana Aksi
                    </Button>

                    <Button
                        // type='primary'
                        size="middle"
                        onClick={() => router.push(window.location.pathname + `/${record._id}/feedback_perilaku`)}
                    >
                        Perilaku
                    </Button>
                    <Button onClick={() => router.push(window.location.pathname + `/${record.id}/predikat_kinerja`)}>Predikat Kinerja</Button>
                    <Button
                        loading={loading}
                        icon={<FileOutlined />}
                        size="middle"
                        onClick={async () => {
                            const res = await getById(record._id);
                            const periode = await getByIdPenilaian(IdPeriode);
                            // console.log(periode);
                            // console.log(res);
                            if (res.ok) {
                                console.log(res.data);
                                asd
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
                        Cetak
                    </Button>
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
        },
    ]
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
                        <Button type="default" icon={<PrinterOutlined />} onClick={() => setModal({trigger: true, formFields: evaluasiKinerjaPrintFields, title: "Cetak Dokumen Evaluasi Kinerja", onSubmit: () => {}})}>
                            Cetak Dokumen Evaluasi Kinerja
                        </Button>
                        <Button type="primary" onClick={() => router.push(`/dashboard/skp/${IdSkp}/periode_penilaian/${IdPeriode}/penilaian/1/lihat_kurva`)}>
                            Lihat Kurva
                        </Button>
                    </div>
                    <DataTable columns={Column} data={bawahan} loading={loading} />
                    <CrudModal type="create" onClose={onClose} formFields={modal.formFields} data={modal.modalData} onSubmit={modal.onSubmit} isModalOpen={modal.trigger} title={modal.title}></CrudModal>
                </Card>
            )}
        </div>
    );
};

export default page;
