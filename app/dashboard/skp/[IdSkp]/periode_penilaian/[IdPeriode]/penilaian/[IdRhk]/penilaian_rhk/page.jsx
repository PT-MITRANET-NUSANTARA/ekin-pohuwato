'use client';

import { Breadcrumb, Button, Card, Form, Input, InputNumber, Modal, Tag, Typography } from 'antd';
import { UserOutlined, DotChartOutlined, PrinterOutlined, ReloadOutlined, SearchOutlined, PlusOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { CrudModal } from '@/components';
import { getById } from '@/controller/SKPController';
import {store, destroy, update} from '@/controller/penilaianController'

import { dummyFeedback } from '@/data';
const { Title } = Typography;
const page = () => {
    const router = useRouter();

    const { IdSkp, IdRhk, IdPeriode } = useParams();
    const [modal, setModal] = useState({ trigger: false, modalData: null, title: '', formFields: [] });
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [atasan, setAtasan] = useState(null);
    const [bawahan, setBawahan] = useState(null);
    const [penilaian, setPenilaian] = useState(null);
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const skp = await getById(IdRhk);
            const penilaian = skp.data.penilaians.find((item) => item.periodePenilaian === IdPeriode);
            console.log(penilaian);
            setPenilaian(penilaian);

            const skpAtasan = skp.data.skp.find((item) => item._id === IdSkp);
            const index = skp.data.skp.findIndex((item) => item._id === IdSkp);
            const bawahan = skp.data.jabatan[index];
            const jabatan = skpAtasan.jabatan;

            const atasan = jabatan.find((item) => {
                return item.unor.induk.id === bawahan.unor.induk.id;
            });

            setData(skp.data);
            setBawahan(bawahan);
            setAtasan(atasan);
        } catch (error) {
            console.log(error);
        }
    };

    const onSubmit = async (value) => {  
        try {
            let data;
    
            if (penilaian) {
                data = {
                    ...penilaian,
                    ratingKinerja: value.rating,
                };
    
                console.log(data);
    
                // Call the update function and handle response
                const res = await update(penilaian._id, data);
                console.log(res);
            } else {
                data = {
                    ratingKinerja: value.rating,
                    periodePenilaian: IdRhk,
                };
    
                const res = await store(data);
                console.log(res);
            }
    
            // Close modal on success
            setModal((prev) => ({ ...prev, trigger: false }));
        } catch (err) {
            console.error(err); // Log the error
        }
    };
    
    

    const onClose = () => {
        setModal((prev) => ({ ...prev, trigger: false }));
    };

    const ratingFileds = [
        {
            label: 'Beri Rating',
            name: 'rating',
            type: 'rating',
            rules: [
                {
                    required: true,
                    message: 'Field rating wajib di isi'
                }
            ]
        }
    ];

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
                            Sasaran Kinerja Pegawai
                        </Title>
                        <div className="flex items-center gap-x-2">
                            <Button type="default" icon={<PrinterOutlined />}>
                                Cetak Form Penilaian
                            </Button>
                            <Button type="default" icon={<PrinterOutlined />}>
                                Cetak Dokumen Evaluasi Kinerja
                            </Button>
                            <Button type="primary" icon={<PlusOutlined />} onClick={() => setModal({ trigger: true, modalData: dummyFeedback, title: 'Tambah Feedback', formFields: ratingFileds })}>
                                Buat Rating Hasil Kinerja
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-flow-row divide-y text-xs">
                        <div className="flex items-center justify-between py-2">
                            <span className="uppercase font-semibold">periode</span>
                            <Tag color="blue" className="capitalize">
                                {data?.periode_awal + ' - ' + data?.periode_akhir}
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
                            <th>ASPEK</th>
                            <th>INDIKATOR KINERJA INDIVIDU</th>
                            <th>TARGET TAHUNAN</th>
                            <th>BUKTI DUKUNG</th>
                            <th>RELASI</th>
                            <th>FEEDBACK</th>
                        </tr>
                    </thead>
                    <tbody className="capitalize text-sm">
                        <tr>
                            <td colSpan={9} className="text-left px-2">
                                Utama
                            </td>
                        </tr>
                        {data?.rhks.map((item, index) => (
                            <>
                                <tr>
                                    <td rowSpan={item.aspek ? item.aspek.length + 1 : 1}>{index + 1}</td>
                                    <td rowSpan={item.aspek ? item.aspek.length + 1 : 1} style={{ maxWidth: '12rem', padding: '8px' }}>
                                        <div className="flex flex-col gap-y-2 text-left">
                                            <p>{item.desc}</p>
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
                                            <td></td>
                                            <td></td>
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
                            <td colSpan={4}></td>
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
                                {/* <td>
                                    {item.feedback || (
                                            <div className="flex items-center justify-center">
                                                <Button type="primary" onClick={() => setModal({ trigger: true, modalData: dummyFeedback, title: 'Tambah Feedback', formFields: formFields })}>
                                                    Tambah
                                                </Button>
                                            </div>
                                    )}
                                </td> */}
                                <td></td>
                                <td></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <CrudModal type="create" onClose={onClose} formFields={modal.formFields} data={modal.modalData} onSubmit={onSubmit} isModalOpen={modal.trigger} title={modal.title}></CrudModal>
            </Card>
        </div>
    );
};

export default page;
