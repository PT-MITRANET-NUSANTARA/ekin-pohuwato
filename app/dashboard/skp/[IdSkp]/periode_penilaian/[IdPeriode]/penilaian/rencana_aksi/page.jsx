'use client';

import { Breadcrumb, Button, Card, List, Tag, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { CrudModal, DataLoading, InfoModal, RencanaAksiButton } from '@/components';
import { getById } from '@/controller/SKPController';
import { getById as getByIdPenilaian } from '@/controller/periodePenilaianController';
import { dateFormatter } from '@/utils';
import { store } from '@/controller/RencanaAksiController';
const { Title } = Typography;
const page = () => {
    const router = useRouter();

    const { IdSkp, IdRhk, IdPeriode } = useParams();
    const [modal, setModal] = useState({ trigger: false, modalData: null, title: '', formFields: [], onSubmit: () => { } });
    const [infoModal, setInfoModal] = useState({ trigger: false, title: '', onClose: () => { }, data: null, type: '', isLoading: false, column: [] });

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [atasan, setAtasan] = useState(null);
    const [bawahan, setBawahan] = useState(null);
    const [penilaian, setPenilaian] = useState(null);
    const [periode, setPeriode] = useState(null);
    const [utama, setUtama] = useState(null);
    const [tambahan, setTambahan] = useState(null);
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true)
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
            } else {
                setAtasan(bawahan.unor.atasan);
            }

            setUtama(skp.data.rhks.filter((item) => item.jenis === 'utama'));
            setTambahan(skp.data.rhks.filter((item) => item.jenis === 'tambahan'));
            setData(skp.data);
            setBawahan(bawahan);
        } catch (error) {
            console.log(error);
        }
        setLoading(false)
    };
    // const onSubmit = async (value) => {
    //     try {
    //         let data;

    //         if (penilaian) {
    //             data = {
    //                 ...penilaian,
    //                 ratingKinerja: value.rating
    //             };

    //             console.log(data);

    //             // Call the update function and handle response
    //             const res = await update(penilaian._id, data);
    //             console.log(res);
    //         } else {
    //             data = {
    //                 ratingKinerja: value.rating,
    //                 periodePenilaian: IdPeriode,
    //                 skp: IdRhk
    //             };

    //             const res = await store(data);
    //             console.log(res);
    //         }
    //         fetchData();

    //         // Close modal on success
    //         setModal((prev) => ({ ...prev, trigger: false }));
    //     } catch (err) {
    //         console.error(err); // Log the error
    //     }
    // };

    const onClose = () => {
        setModal((prev) => ({ ...prev, trigger: false }));
    };

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
            {loading ? (
                <DataLoading loadingData={loading} />
            ) : (
                <Card>
                    <div className="flex flex-col gap-y-4 mb-6">
                        <div className="w-full flex items-center justify-between">
                            <Title className="mt-2" level={5}>
                                Rencana Aksi
                            </Title>
                        </div>

                        <div className="grid grid-flow-row divide-y text-xs">
                            <div className="flex items-center justify-between py-2">
                                <span className="uppercase font-semibold">periode</span>
                                <Tag color="blue" className="capitalize">
                                    {data?.periode_awal && data?.periode_akhir ? dateFormatter(data.periode_awal) + '-' + dateFormatter(data.periode_akhir) : 'Tanggal tidak tersedia'}
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
                                        {bawahan?.nip_asn}
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
                                    <p className="text-right capitalize"> {bawahan?.unor?.atasan?.unor_jabatan}</p>
                                </div>
                                <div className="flex justify-between py-2">
                                    <span className="uppercase font-semibold">unit kerja</span>
                                    <div className="flex flex-col gap-y-2 text-right items-end">
                                        <p>{bawahan?.unor?.atasan?.unor_nama}</p>
                                        <small>ID : {bawahan?.unor?.atasan?.unor_id}</small>
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
                                <th>ASPEK</th>
                                <th>INDIKATOR KINERJA INDIVIDU</th>
                                <th>TARGET TAHUNAN</th>
                            </tr>
                        </thead>
                        <tbody className="capitalize text-sm">
                            <tr>
                                <td colSpan={9} className="text-left px-2">
                                    Utama
                                </td>
                            </tr>
                            {utama?.map((item, index) => (
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
                                        <td rowSpan={item.aspek ? item.aspek.length + 1 : 1}>
                                            <RencanaAksiButton IdPeriode={IdPeriode} fetchData={fetchData} getByIdPenilaian={getByIdPenilaian} item={item} rencanaAksiFields={rencanaAksiFields} setModal={setModal} />
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
                            <tr>
                                <td colSpan={9} className="text-left px-2">
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
                                        <td rowSpan={item.aspek ? item.aspek.length + 1 : 1}>
                                            <RencanaAksiButton />
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
                            <tr>
                                <td colSpan={6}>Rating Hasil Kinerja</td>
                                <td colSpan={4}>
                                    {data?.hasil
                                        ? (() => {
                                            const hasil = data.hasil[IdPeriode];
                                            switch (hasil) {
                                                case 2:
                                                    return (
                                                        <div className="inline-flex gap-2">
                                                            <p>
                                                                <s>Diatas ekspektasi</s>
                                                            </p>
                                                            <p>Sesuai ekspektasi</p>
                                                            <p>
                                                                <s>Dibawah ekspektasi</s>
                                                            </p>
                                                        </div>
                                                    );
                                                case 3:
                                                    return (
                                                        <div className="inline-flex gap-2">
                                                            <p>Diatas ekspektasi</p>
                                                            <p>
                                                                <s>Sesuai ekspektasi</s>
                                                            </p>
                                                            <p>
                                                                <s>Dibawah ekspektasi</s>
                                                            </p>
                                                        </div>
                                                    );
                                                case 1:
                                                    return (
                                                        <div className="inline-flex gap-2">
                                                            <p>
                                                                <s>Diatas ekspektasi</s>
                                                            </p>
                                                            <p>
                                                                <s>Sesuai ekspektasi</s>
                                                            </p>
                                                            <p>Dibawah ekspektasi</p>
                                                        </div>
                                                    );
                                                default:
                                                    return hasil || '';
                                            }
                                        })()
                                        : ''}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <CrudModal type="create" onClose={onClose} formFields={modal.formFields} data={modal.modalData} onSubmit={modal.onSubmit} isModalOpen={modal.trigger} title={modal.title}></CrudModal>
                    <InfoModal close={infoModal.onClose} data={infoModal.data} isModalOpen={infoModal.trigger} title={infoModal.title} columns={infoModal.column} isLoading={infoModal.isLoading} type={infoModal.type} />
                </Card>
            )}

        </div>
    );
};

export default page;
