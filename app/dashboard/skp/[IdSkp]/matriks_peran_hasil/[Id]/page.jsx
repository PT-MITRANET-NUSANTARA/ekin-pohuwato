'use client';

import { Breadcrumb, Button, Card, Collapse, Form, Modal, Select, Space, Tag, Typography, Input, Skeleton, message } from 'antd';
import { ReloadOutlined, PlusOutlined, PrinterOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import Link from 'next/link';
import React, { use, useEffect, useState } from 'react';
import { CrudModal, MatriksCard } from '@/components';
import useFetchData from '@/hooks/useFetchData';
import { getData } from '@/controller/AuthorizationController';
import { getAllPosjabByUnit, getByNIP } from '@/controller/IDSN/JabatanController';
import { useParams } from 'next/navigation';
import { getById, getByUserIdAndPeriode, store as storeSKP } from '@/controller/SKPController';
import { dummyIntervensiRhk } from '@/data';
import { dummyAspeks, dummyRencanaAksi } from '@/data/dummyData';

const { Title } = Typography;
const { Option } = Select;

const page = () => {
    const { Id, IdSkp } = useParams();
    const [modal, setModal] = useState({ trigger: false, modalData: null, title: '', formFields: [], onSubmit: () => {} });

    const { data, setData, loading } = useFetchData(getData);
    const [jabatan, setJabatan] = useState(null);
    const [unor, setUnor] = useState(null);
    const [SKP, setSKP] = useState(null);
    const [loadingData, setLoadingData] = useState(true);

    useEffect(() => {
        if (data) {
            fetchData();
        }
    }, [data]);

    const fetchData = async () => {
        try {
            const jabatan = await getByNIP(data.token, data.user.nipBaru);
            const skp = await getById(Id);
            console.log(skp);

            setSKP(skp.data);
            const selectedJabatan = jabatan.mapData.data[0];
            const unit = await getAllPosjabByUnit(data.token, selectedJabatan.unor.induk.id);
            const bawahan = unit.mapData.data.filter((item) => (item.unor.id == selectedJabatan.unor.id && item.nama_jabatan !== selectedJabatan.nama_jabatan) || item.unor.atasan?.unor_id === selectedJabatan.unor.id);
            setJabatan(selectedJabatan);

            setUnor(bawahan);
            setLoadingData(false);
        } catch (error) {
            console.log(error);
        }
    };

    const submitRhk = async (value) => {
        const response = await getByUserIdAndPeriode(dataItem.userId, SKP.periodeRKT);
        console.log(value);
        const skp = response.data;
        console.log(skp);

        if (skp) {
            const dt = {
                ...value,
                skp: skp._id
            };
            const rhk = await storeRHK(dataItem.userId, dt);
            console.log(rhk);

            message.success('Berhasil Menambahkan RHK');
        } else {
            const data = {
                periode_awal: SKP.periode_awal,
                periode_akhir: SKP.periode_akhir,
                skp: [SKP._id],
                periodeRKT: SKP.periodeRKT,
                pendekatan: SKP.pendekatan,
                renstra: SKP.renstra,
                jabatan: [dataItem]
            };
            const newSKP = await storeSKP(dataItem.userId, data, '0');
            const dt = {
                ...value,
                skp: newSKP?.data._id
            };

            const rhk = await storeRHK(dataItem.userId, dt);
            message.success('Berhasil Menambahkan RHK');
        }
        setModal(...modal, { trigger: false });
    };

    const aspekColumns = [
        {
            title: 'No',
            dataIndex: 'index',
            render: (text, record, index) => index + 1,
            width: '5%'
        },
        {
            title: 'Jenis',
            dataIndex: 'jenis',
            key: 'jenis',
            sorter: (a, b) => a.jenis.length - b.jenis.length,
        },
        {
            title: 'Indikator',
            dataIndex: 'indikator',
            key: 'indikator',
            sorter: (a, b) => a.indikator.length - b.indikator.length,
        },

        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="small">
                    <Button
                        // type='primary'
                        onClick={() => setModal({ trigger: true, modalData: record, title: 'Edit Aspek', type: 'edit', formFields: AspekFields, onSubmit: () => {} })}
                        size="middle"
                        icon={<EditOutlined />}
                    />

                    <Button
                        // type='primary'
                        onClick={() => setModal({ trigger: true, modalData: record, title: 'Delete Aspek', type: 'delete', formFields: AspekFields, onSubmit: () => {} })}
                        size="middle"
                        color="danger"
                        icon={<DeleteOutlined />}
                    />
                </Space>
            )
        }
    ];

    console.log(SKP);
    
    const rhkColumns = [
        {
            title: 'ID',
            dataIndex: '_id',
            key: '_id',
            sorter: (a, b) => a._id.length - b._id.length,
            width: '10%'
        },
        {
            title: 'RHK Yang di Intervensi',
            dataIndex: 'rhk',
            key: 'rhk',
            sorter: (a, b) => a.rhk.length - b.rhk.length,
            render: (_, record) => ( 
                record.rhk?.desc ? record.rhk.desc : record.rhk.rkt.name
            )
        },
        {
            title: 'Hasil RHK',
            dataIndex: 'intervensi',
            key: 'intervensi',
            sorter: (a, b) => a.intervensi.length - b.intervensi.length,
            render: (_, record) => ( 
                record.desc
            )
        },
        // {
        //     title: 'Rencana Aksi',
        //     dataIndex: 'rencana_aksi',
        //     key: 'rencana_aksi',
        //     sorter: (a, b) => a.rencana_aksi.length - b.rencana_aksi.length,
        //     width: '30%',
        //     render: (_, record) => (
        //         <div className="flex flex-col gap-y-2">
        //             <ul className="list-disc list-inside">
        //                 {record.rencana_aksi.map((item) => (
        //                     <li>{item.content}</li>
        //                 ))}
        //             </ul>
        //             <Button type="primary" className="w-fit" onClick={() => setRencanaAksiModal(true)}>
        //                 Tambah
        //             </Button>
        //         </div>
        //     )
        // },
        // {
        //     title: 'Rencana Aksi',
        //     dataIndex: 'jenis_rhk',
        //     key: 'jenis_rhk',
        //     sorter: (a, b) => a.jenis_rhk.length - b.jenis_rhk.length,
        //     width: '30%',
        //     render: (_, record) => (
        //         <div className="flex flex-col gap-y-2">
        //             <Tag color="blue" className="w-fit">
        //                 {record.jenis_rhk}
        //             </Tag>
        //             <Button type="default" className="w-fit" onClick={() => setJenisRhkModal(true)}>
        //                 Ubah Jenis
        //             </Button>
        //         </div>
        //     )
        // },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="small">
                    <Button
                        // type='primary'
                        onClick={() => setModal({ trigger: true, modalData: record, title: 'Edit RHK Intervensi', type: 'edit', formFields: RhkFields, onSubmit: () => {} })}
                        size="middle"
                        icon={<EditOutlined />}
                    />

                    <Button
                        // type='primary'
                        onClick={() => setModal({ trigger: true, modalData: record, title: 'Delete RHK Intervensi', type: 'delete', formFields: RhkFields, onSubmit: () => {} })}
                        size="middle"
                        color="danger"
                        icon={<DeleteOutlined />}
                    />
                </Space>
            )
        }
    ];

    const rencanaAksiColumn = [
        {
            title: 'ID',
            dataIndex: '_id',
            key: '_id',
            sorter: (a, b) => a._id.length - b._id.length,
            width: '10%'
        },
        {
            title: 'Content',
            dataIndex: 'content',
            key: 'content',
            sorter: (a, b) => a.content.length - b.content.length,
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="small">
                    <Button
                        // type='primary'
                        onClick={() => setModal({ trigger: true, modalData: record, title: 'Edit Rencana Aksi', type: 'edit', formFields: RhkFields, onSubmit: () => {} })}
                        size="middle"
                        icon={<EditOutlined />}
                    />

                    <Button
                        // type='primary'
                        onClick={() => setModal({ trigger: true, modalData: record, title: 'Delete Rencana Aksi', type: 'delete', formFields: RhkFields })}
                        size="middle"
                        color="danger"
                        icon={<DeleteOutlined />}
                    />
                </Space>
            )
        }
    ];

    

    const RhkFields = [
        {
            label: 'RHK',
            name: 'rhk',
            type: 'select',
            rules: [
                {
                    required: true,
                    message: 'Field rhk wajib di isi'
                }
            ],
            options: SKP?.rhks.map((item) => ({ value: item._id, label: item.desc ? item.desc : item.rkt.name }))
        },
        {
            label: 'Klasifikasi',
            name: 'klasifikasi',
            type: 'select',
            rules: [
                {
                    required: true,
                    message: 'Field klasifikasi wajib di isi'
                }
            ],
            options: [
                {
                    value: 'organisasi',
                    label: 'Organisasi'
                },
                {
                    value: 'Individu',
                    label: 'individu'
                }
            ]
        },
        {
            label: 'Jenis',
            name: 'jenis',
            type: 'select',
            rules: [
                {
                    required: true,
                    message: 'Field jenis wajib di isi'
                }
            ],
            options: [
                {
                    value: 'utama',
                    label: 'Utama'
                },
                {
                    value: 'tambahan',
                    label: 'Tambahan'
                }
            ]
        },
        {
            label: 'Isi Intervensi RHK',
            name: 'desc',
            type: 'longtext',
            rules: [
                {
                    required: true,
                    message: 'Field isi intervensi mulai wajib di isi'
                }
            ]
        }
    ];

    const AspekFields = [
        {
            label: 'Jenis',
            name: 'jenis',
            type: 'select',
            rules: [
                {
                    required: true,
                    message: 'Field jenis wajib di isi'
                }
            ],
            options: [
                {
                    label: 'organisasi',
                    value: 'organisasi'
                },
                {
                    label: 'organisasi',
                    value: 'organisasi'
                },
                {
                    label: 'organisasi',
                    value: 'organisasi'
                },
                {
                    label: 'organisasi',
                    value: 'organisasi'
                }
            ]
        },
        {
            label: 'Jenis',
            name: 'indikator',
            type: 'text',
            rules: [
                {
                    required: true,
                    message: 'Field indikator wajib di isi'
                }
            ]
        }
    ];

    const RencanaAksiField = [
        {
            label: 'Content',
            name: 'content',
            type: 'text',
            rules: [
                {
                    required: true,
                    message: 'Field content wajib di isi'
                }
            ]
        }
    ];

    const rhkData = {
        loading: false,
        data: dummyIntervensiRhk,
        columns: rhkColumns,
        fields: RhkFields,
    };

    const aspekData = {
        loading: false,
        data: dummyAspeks,
        columns: aspekColumns,
        fields: AspekFields
    };

    const rencanaAksiData = {
        loading: false,
        data: dummyRencanaAksi,
        columns: rencanaAksiColumn,
        fields: AspekFields
    };

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
                <div className="flex items-center justify-between mb-6">
                    <Title className="mt-2" level={5}>
                        Data Matriks SKP
                    </Title>
                    <div className="flex items-center gap-x-2">
                        <Button type="default" icon={<PrinterOutlined />}>
                            Cetak
                        </Button>
                    </div>
                </div>

                {loadingData ? (
                    <Skeleton active />
                ) : (
                    <>
                        <div className="grid grid-flow-row divide-y text-xs mb-12">
                            <div className="flex items-center justify-between py-2">
                                <span className="uppercase font-semibold">{jabatan?.nama_jabatan}</span>
                                {/* <p className="text-right uppercase">Tahun 2024</p> */}
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <span className="uppercase font-semibold">Unit Organisasi</span>
                                <p className="text-right uppercase">{jabatan?.unor.nama}</p>
                            </div>
                        </div>

                        <div className="w-full flex flex-col gap-y-4">
                            {unor?.map((item, index) => {
                                return <MatriksCard dataItem={item} aspekData={aspekData} rencanaAksiData={rencanaAksiData} rhkData={rhkData} key={index} setModal={setModal} modal={modal} SKP={SKP} />;
                            })}
                        </div>
                    </>
                )}
            </Card>
            <CrudModal formFields={modal.formFields} isModalOpen={modal.trigger} data={modal.modalData} onClose={() => setModal({ trigger: false })} onSubmit={modal.onSubmit} title={modal.title} type={modal.type} />
        </div>
    );
};

export default page;
