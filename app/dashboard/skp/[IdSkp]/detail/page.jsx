'use client';

import { Breadcrumb, Button, Card, Skeleton, Tag, Typography } from 'antd';
import { UserOutlined, DotChartOutlined, PrinterOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import useFetchData from '@/hooks/useFetchData';
import { getData } from '@/controller/AuthorizationController';
import { getById } from '@/controller/SKPController';
import { getByNIP } from '@/controller/IDSN/JabatanController';
import { formatDateToDayMonthYear } from '@/utils/util';
const { Title } = Typography;
const page = () => {
    const { IdSkp } = useParams();
    const router = useRouter();
    const { data, setData, loading } = useFetchData(getData);
    const [jabatan, setJabatan] = useState(null);
    const [skp, setSkp] = useState(null);
    const [loadingData, setLoadingData] = useState(true);
    console.log(jabatan);

    console.log(data);

    useEffect(() => {
        if (data) {
            fetchData();
        }
    }, [data]);

    const fetchData = async () => {
        try {
            const jabatan = await getByNIP(data.token, data.user.nipBaru);
            const skp = await getById(IdSkp);
            const selectedJabatan = jabatan.mapData.data[0];
            setSkp(skp.data);
            setJabatan(selectedJabatan);
            setLoadingData(false);
        } catch (error) {
            console.log(error);
        }
    };

    console.log(skp);

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
                            <Button type="primary" icon={<UserOutlined />} onClick={() => router.push('/dashboard/profil')}>
                                Lihat Data Profil
                            </Button>
                            <Button type="default" icon={<DotChartOutlined />} onClick={() => router.push(`/dashboard/skp/${IdSkp}/matriks_peran_hasil`)}>
                                Lihat Matriks
                            </Button>
                            <Button type="default" icon={<PrinterOutlined />}>
                                Cetak
                            </Button>
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
                                {skp?.rhks.map((item, index) => (
                                    <>
                                        <tr>
                                            <td rowSpan={item.aspek ? item.aspek.length + 1 : 1}>{index + 1}</td>
                                            <td rowSpan={item.aspek ? item.aspek.length + 1 : 1} style={{ maxWidth: '12rem', padding: '8px' }}>
                                                <div className="flex flex-col gap-y-2 text-left">
                                                    <p>{item.rhk.rkt? item.rhk.rkt.name : item.rhk.desc}</p>
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
                                        <td>{item.feedback || 'N/A'}</td>
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
                                            <p>Dukungan Sumber Daya</p>
                                            <Button className="w-fit" type="primary">
                                                Edit
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td style={{ border: '1px solid black', padding: '8px' }}>
                                        <div className="flex flex-col gap-y-2">
                                            <p>Dukungan Sumber Daya</p>
                                            <Button className="w-fit" type="primary">
                                                Edit
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </>
                )}
            </Card>
        </div>
    );
};

export default page;
