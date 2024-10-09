'use client';

import { Breadcrumb, Button, Card, Collapse, Form, Modal, Select, Space, Tag, Typography, Input, Skeleton } from 'antd';
import { ReloadOutlined, PlusOutlined, PrinterOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import Link from 'next/link';
import React, { use, useEffect, useState } from 'react';
import { CrudModal, DataTable, SearchPegawai, TambahPegawai, TruncateText } from '@/components';
import { dummyIntervensiRhk } from '@/data';
import useFetchData from '@/hooks/useFetchData';
import { getData } from '@/controller/AuthorizationController';
import { getAllPosjabByUnit, getByNIP } from '@/controller/IDSN/JabatanController';
import { useParams } from 'next/navigation';
import { getById } from '@/controller/SKPController';
import { options } from 'joi';
import { dummyAspeks, dummyRencanaAksi } from '@/data/dummyData';
const { Title } = Typography;
const { Option } = Select;

const page = () => {
    const { Id } = useParams();
    const [rhkModal, setRhkModal] = useState({ trigger: false, modalData: null, title: '' });
    const [aspekModal, setAspekModal] = useState({ trigger: false, modalData: null, title: '' });
    const [rencanaAksiModal, setRencanaAksiModal] = useState({ trigger: false, modalData: null, title: '' });

    const { data, setData, loading } = useFetchData(getData);
    const [jabatan, setJabatan] = useState(null);
    const [unor, setUnor] = useState(null);
    const [SKP, setSKP] = useState(null);

    useEffect(() => {
        if (data) {
            fetchData();
        }
    }, [data]);

    const fetchData = async () => {
        try {
            const jabatan = await getByNIP(data.token, data.user.nipBaru);
            const skp = await getById(Id);
            setSKP(skp.data);
            const selectedJabatan = jabatan.mapData.data[0];
            const unit = await getAllPosjabByUnit(data.token, selectedJabatan.unor.induk.id);
            const bawahan = unit.mapData.data.filter((item) => item.unor.id == selectedJabatan.unor.id && item.nama_jabatan !== selectedJabatan.nama_jabatan);
            setJabatan(selectedJabatan);

            setUnor(bawahan);
        } catch (error) {
            console.log(error);
        }
    };

    const aspekColumns = [
        {
            title: 'ID',
            dataIndex: '_id',
            key: '_id',
            sorter: (a, b) => a._id.length - b._id.length,
            width: '10%'
        },
        {
            title: 'Jenis',
            dataIndex: 'jenis',
            key: 'jenis',
            sorter: (a, b) => a.jenis.length - b.jenis.length,
            width: '30%'
        },
        {
            title: 'Indikator',
            dataIndex: 'indikator',
            key: 'indikator',
            sorter: (a, b) => a.indikator.length - b.indikator.length,
            width: '30%'
        },

        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="small">
                    <Button
                        // type='primary'
                        onClick={() => setAspekModal({ trigger: true, modalData: record, title: 'Edit RHK Intervensi', type: 'edit' })}
                        size="middle"
                        icon={<EditOutlined />}
                    />

                    <Button
                        // type='primary'
                        onClick={() => setAspekModal({ trigger: true, modalData: record, title: 'Edit RHK Intervensi', type: 'delete' })}
                        size="middle"
                        color="danger"
                        icon={<DeleteOutlined />}
                    />
                </Space>
            )
        }
    ];

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
            dataIndex: 'nama_rhk',
            key: 'nama_rhk',
            sorter: (a, b) => a.nama_rhk.length - b.nama_rhk.length,
            width: '30%'
        },
        {
            title: 'Hasil RHK',
            dataIndex: 'intervensi',
            key: 'intervensi',
            sorter: (a, b) => a.intervensi.length - b.intervensi.length,
            width: '30%'
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
                        onClick={() => setRhkModal({ trigger: true, modalData: record, title: 'Edit RHK Intervensi', type: 'edit' })}
                        size="middle"
                        icon={<EditOutlined />}
                    />

                    <Button
                        // type='primary'
                        onClick={() => setRhkModal({ trigger: true, modalData: record, title: 'Edit RHK Intervensi', type: 'delete' })}
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
            width: '30%'
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="small">
                    <Button
                        // type='primary'
                        onClick={() => setRencanaAksiModal({ trigger: true, modalData: record, title: 'Edit RHK Intervensi', type: 'edit' })}
                        size="middle"
                        icon={<EditOutlined />}
                    />

                    <Button
                        // type='primary'
                        onClick={() => setRencanaAksiModal({ trigger: true, modalData: record, title: 'Edit RHK Intervensi', type: 'delete' })}
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
                    message: 'Field nama wajib di isi'
                }
            ],
            options: SKP?.rhks.map((item) => ({ value: item._id, label: item.desc }))
        },
        {
            label: 'Jenis',
            name: 'jenis',
            type: 'select',
            rules: [
                {
                    required: true,
                    message: 'Field nama wajib di isi'
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
            label: 'Klasifikasi',
            name: 'klasifikasi',
            type: 'select',
            rules: [
                {
                    required: true,
                    message: 'Field nama wajib di isi'
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
            name: 'intervensi',
            type: 'longtext',
            rules: [
                {
                    required: true,
                    message: 'Field periode mulai wajib di isi'
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
                    message: 'Field nama wajib di isi'
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
                    message: 'Field nama wajib di isi'
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
                    message: 'Field nama wajib di isi'
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
                    {unor?.map((item, index) => (
                        <Card type="inner" key={index} title={item.userId}>
                            <div className="grid grid-flow-row divide-y text-xs">
                                <div className="flex items-center justify-between py-2">
                                    <span className="uppercase font-semibold">nama</span>
                                    <p className="text-right uppercase">{item.nama_asn}</p>
                                </div>
                                <div className="flex items-center justify-between py-2">
                                    <span className="uppercase font-semibold">jabatan</span>
                                    <div className="flex flex-col gap-y-2 text-right items-end">
                                        <p>{item.nama_jabatan}</p>
                                        {/* <small>ID : {item.id || '197801012007011026'}</small> */}
                                    </div>
                                </div>
                                <div className="flex flex-col gap-y-4 py-2 pt-4">
                                    <div className="flex items-center gap-x-2">
                                        <Button className="w-fit" type="primary">
                                            Lihat SKP
                                        </Button>
                                        <Button className="w-fit" type="primary">
                                            Tambah RHK
                                        </Button>
                                        <Button danger className="w-fit" type="primary">
                                            Hapus
                                        </Button>
                                    </div>
                                    <Collapse bordered>
                                        <Collapse.Panel
                                            key="1"
                                            header="RHK Yang di Intervensi"
                                            extra={<Button onClick={() => setRhkModal({ trigger: true, modalData: dummyIntervensiRhk, title: 'Tambah RHK Intervensi', type: 'create' })}>Tambah RHK</Button>}
                                        >
                                            <DataTable columns={rhkColumns} data={dummyIntervensiRhk} loading={loading} />
                                        </Collapse.Panel>
                                        <Collapse.Panel key="2" header="Aspek" extra={<Button onClick={() => setAspekModal({ trigger: true, modalData: dummyAspeks, title: 'Tambah RHK Intervensi', type: 'create' })}>Tambah Aspek</Button>}>
                                            <DataTable columns={aspekColumns} data={dummyAspeks} loading={loading} />
                                        </Collapse.Panel>
                                        <Collapse.Panel
                                            key="3"
                                            header="Rencana Aksi"
                                            extra={<Button onClick={() => setRencanaAksiModal({ trigger: true, modalData: dummyRencanaAksi, title: 'Tambah RHK Intervensi', type: 'create' })}>Tambah Rencana Aksi</Button>}
                                        >
                                            <DataTable columns={rencanaAksiColumn} data={dummyRencanaAksi} loading={false} />
                                        </Collapse.Panel>
                                    </Collapse>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </Card>
            <CrudModal formFields={RhkFields} isModalOpen={rhkModal.trigger} data={rhkModal.modalData} onClose={() => setRhkModal({ trigger: false })} onSubmit={() => setRhkModal({ trigger: false })} title={rhkModal.title} type={rhkModal.type} />
            <CrudModal
                formFields={AspekFields}
                isModalOpen={aspekModal.trigger}
                data={aspekModal.modalData}
                onClose={() => setAspekModal({ trigger: false })}
                onSubmit={() => setAspekModal({ trigger: false })}
                title={aspekModal.title}
                type={aspekModal.type}
            />
            <CrudModal
                formFields={RencanaAksiField}
                isModalOpen={rencanaAksiModal.trigger}
                data={rencanaAksiModal.modalData}
                onClose={() => setRencanaAksiModal({ trigger: false })}
                onSubmit={() => setRencanaAksiModal({ trigger: false })}
                title={rencanaAksiModal.title}
                type={rencanaAksiModal.type}
            />
        </div>
    );
};

export default page;
