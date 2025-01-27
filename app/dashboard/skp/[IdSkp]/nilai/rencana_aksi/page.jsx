'use client';

import { Badge, Breadcrumb, Button, Card, message, Skeleton, Tag, Typography } from 'antd';
import { UserOutlined, DotChartOutlined, PrinterOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import useFetchData from '@/hooks/useFetchData';
import { getData } from '@/controller/AuthorizationController';
import { getById } from '@/controller/SKPController';
import { getByNIP } from '@/controller/IDSN/JabatanController';
import { formatDateToDayMonthYear } from '@/utils/util';
import { CrudModal } from '@/components';
import { update } from '@/controller/RHKController';
import dayjs from 'dayjs';
const { Title } = Typography;
const page = () => {
    const { IdSkp } = useParams();
    const router = useRouter();
    const { data, setData, loading } = useFetchData(getData);
    const [jabatan, setJabatan] = useState(null);
    const [skp, setSkp] = useState(null);
    const [loadingData, setLoadingData] = useState(true);
    const [modal, setModal] = useState({ trigger: false, modalData: null, title: '', formFields: [], onSubmit: () => {} });

    useEffect(() => {
        if (data) {
            fetchData();
        }
    }, [data]);

    const fetchData = async () => {
        try {
            const jabatan = await getByNIP(data.token, data.user.nipBaru);
            const skp = await getById(IdSkp);
            console.log(skp.data.rhks);

            setSkp(skp.data);
            setJabatan(skp.data.jabatan[skp.data.jabatan.length - 1]);
            setLoadingData(false);
        } catch (error) {
            console.log(error);
        }
    };

    console.log(skp);

    const rencanaAksiFields = [
        {
            label: 'Rencana Aksi',
            name: 'rencana_aksi',
            type: 'longtext',
            rules: [
                {
                    required: true,
                    message: 'Field rencana aksi wajib diisi'
                }
            ]
        },
        {
            label: 'Target',
            name: 'target',
            type: 'text',
            rules: [
                {
                    required: true,
                    message: 'Field target wajib diisi'
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
                            <Card type="inner" title="Pegawai Yang Menilai" className="col-span-6 w-full">
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
                            <Card type="inner" title="Pegawai Yang Dinilai" className="col-span-6 w-full">
                                <div className="grid grid-flow-row divide-y text-xs">
                                    <div className="flex items-center justify-between py-2">
                                        <span className="uppercase font-semibold">nama</span>
                                        <p color="blue" className="capitalize">
                                            {data?.user.nama}
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-between py-2">
                                        <span className="uppercase font-semibold">nip</span>
                                        <p color="blue" className="capitalize">
                                            {data?.user.nipBaru}
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
                        </div>
                        <table className="normaltable">
                            <thead>
                                <tr>
                                    <th>NO</th>
                                    <th style={{ maxWidth: '12rem' }}>RENCANA HASIL KERJA </th>
                                    <th>RENCANA AKSI</th>
                                </tr>
                            </thead>
                            <tbody className="capitalize text-sm">
                                {skp?.rhks?.length > 0 ? (
                                    skp.rhks.map((item, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>
                                                <div className="flex flex-col gap-y-2 p-2">
                                                    <Typography.Text>{item.desc}</Typography.Text>
                                                    <Tag color="blue" className="w-fit">
                                                        {item.klasifikasi}
                                                    </Tag>
                                                    <Typography.Text>Indikator :</Typography.Text>
                                                    <ul className="list-decimal list-inside">
                                                        {item.aspek?.length > 0 ? (
                                                            item.aspek.map((aspek, index) => (
                                                                <li key={index}>
                                                                    {aspek.jenis}: {aspek.indikator}
                                                                </li>
                                                            ))
                                                        ) : (
                                                            <li>No aspek data available</li>
                                                        )}
                                                    </ul>
                                                </div>
                                            </td>
                                            <td>
                                                {/* Rencana Aksi: {item.rencana.rencana_aksi} */}
                                                <br />
                                                {/* Target: {item.rencana.target} */}
                                                <div className="flex flex-col items-center gap-y-2">
                                                    <Button
                                                        onClick={() =>
                                                            setModal({
                                                                trigger: true,
                                                                formFields: rencanaAksiFields,
                                                                title: 'Tambah Rencana Aksi',
                                                                type: 'create',
                                                                onSubmit: async (values) => {
                                                                    console.log(item);

                                                                    const dt = {
                                                                        skp: item.skp,
                                                                        rhk: item.rhk._id,
                                                                        rkt: item.rkt? item.rkt._id : null, 
                                                                        jenis: item.jenis,
                                                                        desc: item.desc,
                                                                        klasifikasi: item.klasifikasi,
                                                                        rencana: {
                                                                            rencana_aksi: values.rencana_aksi,
                                                                            target: values.target
                                                                        }
                                                                    };
                                                                    console.log('DT', dt);

                                                                    const res = await update(item._id, dt);
                                                                    console.log(res);

                                                                    if (res.ok) {
                                                                        fetchData();
                                                                        setModal({ trigger: false, modalData: null });
                                                                        message.success('Data berhasil diupdate');
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
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={3}>No data available</td>
                                    </tr>
                                )}
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
