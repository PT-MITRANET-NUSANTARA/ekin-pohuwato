'use client';
import { Button, Card, Collapse, message, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import DataTable from '../DataTable/DataTable';
import { getByUserIdAndPeriode } from '@/controller/SKPController';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

import { store as storeRHK } from '@/controller/RHKController';
import { store as storeAspek } from '@/controller/AspekController';
import { getById, store as storeSKP, getBySKPAndPeriode } from '@/controller/SKPController';
import { update as updateAspek, destroy as destroyAspek } from '@/controller/AspekController';

const MatriksCard = ({ SKP, dataItem, rhkData, aspekData, rencanaAksiData, setModal, modal }) => {
    const [infoModal, setInfoModal] = useState({ trigger: false, title: '', onClose: () => {}, data: null, type: '', isLoading: false, column: [] });
    const [data, setData] = useState(null);
    const [aspek, setAspek] = useState(null);
    useEffect(() => {
        fetchData();
    }, []);
    const fetchData = async () => {
        try {
            const response = await getBySKPAndPeriode(dataItem.id_asn, SKP.periodeRKT, SKP._id);
            console.log('MATRIK', response);

            setData(response.data);
            const aspek = response.data.rhks
                .flatMap((item) => item.aspek) // Menggabungkan semua aspek ke satu array
                .filter((aspek) => aspek); // Filter jika ada nilai null/undefined
            setAspek(aspek);
        } catch (error) {
            console.log(error);
        }
    };

    console.log(data);
    console.log(aspek);

    const aspekColumns = [
        {
            title: 'No',
            dataIndex: 'index',
            render: (text, record, index) => index + 1,
            width: '5%'
        },
        {
            title: 'Name',
            dataIndex: 'desc',
            key: 'desc',
            sorter: (a, b) => a.jenis.length - b.jenis.length,
            width: '30%',
            render: (text, record) => record.rhk.desc
        },
        {
            title: 'Target Tahunan',
            dataIndex: 'target_tahunan',
            key: 'target_tahunan',
            sorter: (a, b) => a.jenis.length - b.jenis.length,
            width: '30%',
            render: (text, record) => record.target_tahunan.target + ' ' + record.target_tahunan.satuan
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
            render: (_, record) => {
                console.log(record);
                return (
                    <Space size="small">
                        <Button
                            // type='primary'
                            onClick={() =>
                                setModal({
                                    trigger: true,
                                    modalData: {
                                        ...record,
                                        rhk: record?.rhk?._id,
                                        target_tahunan: record?.target_tahunan?.target,
                                        satuan: `${record?.target_tahunan?.satuan}`
                                    },
                                    title: 'Edit Aspek',
                                    type: 'edit',
                                    formFields: AspekFields,
                                    onSubmit: async (values) => {
                                        const dt = { ...values, rhk: rhk._id };
                                    }
                                })
                            }
                            size="middle"
                            icon={<EditOutlined />}
                        />

                        <Button
                            // type='primary'
                            onClick={() =>
                                setModal({
                                    trigger: true,
                                    modalData: {
                                        ...record,
                                        rhk: record?.rhk?._id,
                                        target_tahunan: record?.target_tahunan?.target,
                                        satuan: record?.target_tahunan?.satuan
                                    },
                                    title: 'Delete Aspek',
                                    type: 'delete',
                                    formFields: AspekFields,
                                    onSubmit: async (values) => {
                                        const dt = { ...values };
                                        console.log(values);
                                        console.log(record);
                                    }
                                })
                            }
                            size="middle"
                            color="danger"
                            icon={<DeleteOutlined />}
                        />
                    </Space>
                );
            }
        }
    ];

    const AspekFields = [
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
            options: data?.rhks?.map((item) => ({ value: item._id, label: item.desc }))
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
                    label: 'Kuantitas',
                    value: 'kuantitas'
                },
                {
                    label: 'Kualitas',
                    value: 'kualitas'
                },
                {
                    label: 'Waktu',
                    value: 'waktu'
                },
                {
                    label: 'Deskripsi',
                    value: 'deksripsi'
                }
            ]
        },
        {
            label: 'Indikator',
            name: 'indikator',
            type: 'longtext',
            rules: [
                {
                    required: true,
                    message: 'Field indikator wajib di isi'
                }
            ]
        },
        {
            label: 'Target Tahunan',
            name: 'target_tahunan',
            type: 'number',
            rules: [
                {
                    required: true,
                    message: 'Field target tahunan wajib di isi'
                }
            ],
            min: 1
        },
        {
            label: 'Satuan',
            name: 'satuan',
            type: 'text',
            rules: [
                {
                    required: true,
                    message: 'Field satuan wajib di isi'
                },
                {
                    validator: (_, value) => {
                        if (typeof value !== 'string') {
                            return Promise.reject('Satuan harus berupa teks');
                        }
                        return Promise.resolve();
                    }
                }
            ]
        }
    ];

    const rhkColumns = [
        {
            title: 'No',
            dataIndex: 'index',
            render: (text, record, index) => index + 1,
            width: '5%'
        },
        {
            title: 'RHK Yang di Intervensi',
            dataIndex: 'rhk',
            key: 'rhk',
            sorter: (a, b) => a.rhk.length - b.rhk.length,
            render: (_, record) => (record.rhk?.desc ? record.rhk.desc : record.rhk.rkt.name)
        },
        {
            title: 'Hasil RHK',
            dataIndex: 'intervensi',
            key: 'intervensi',
            sorter: (a, b) => a.intervensi.length - b.intervensi.length,
            render: (_, record) => record.desc
        },
        {
            title: 'Aspek',
            dataIndex: 'aspek',
            key: 'aspek',
            render: (record) =>
                record.length >= 0 ? (
                    <Button
                        onClick={() =>
                          setInfoModal({
                            title: "Data Aspek"
                            
                          })  
                        }
                    >
                        Periksa
                    </Button>
                ) : (
                    <Button
                        onClick={() =>
                            setModal({
                                trigger: true,
                                title: 'Tambah Aspek',
                                type: 'create',
                                formFields: AspekFields,
                                onSubmit: async (value) => {
                                    const dt = {
                                        rhk: value.rhk,
                                        jenis: value.jenis,
                                        indikator: value.indikator,
                                        target_tahunan: {
                                            target: value.target_tahunan,
                                            satuan: String(value.satuan)
                                        }
                                    };
                                    const res = await storeAspek(dt);
                                    fetchData();

                                    message.success('Berhasil Menambahkan Aspek');
                                    setModal({ trigger: false });
                                }
                            })
                        }
                    >
                        Tambah
                    </Button>
                )
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="small">
                    <Button
                        // type='primary'
                        onClick={() =>
                            setModal({
                                trigger: true,
                                modalData: { ...record, rhk: record.rhk._id },
                                title: 'Edit RHK Intervensi',
                                type: 'edit',
                                formFields: RhkFields,
                                onSubmit: async (values) => {
                                    console.log(record);
                                    let dt = values;
                                    console.log(dt);

                                    dt = { ...dt, skp: record.skp };
                                    const response = await updateRHK(record._id, dt);
                                    console.log(response);

                                    if (response.ok) {
                                        message.success('Berhasil Mengubah RHK');
                                        setModal({ trigger: false });
                                    } else {
                                        message.error('Gagal Mengubah RHK');
                                    }
                                }
                            })
                        }
                        size="middle"
                        icon={<EditOutlined />}
                    />

                    <Button
                        // type='primary'
                        onClick={() =>
                            setModal({
                                trigger: true,
                                modalData: { ...record, rhk: record.rhk._id },
                                title: 'Delete RHK Intervensi',
                                type: 'delete',
                                formFields: RhkFields,
                                onSubmit: async (values) => {
                                    const response = await destroyRHK(record._id);
                                    if (response.ok) {
                                        message.success('Berhasil Menghapus RHK');
                                        setModal({ trigger: false });
                                    } else {
                                        message.error('Gagal Menghapus RHK');
                                    }
                                }
                            })
                        }
                        size="middle"
                        color="danger"
                        icon={<DeleteOutlined />}
                    />
                </Space>
            )
        }
    ];

    return (
        <Card type="inner" title={dataItem.id_asn}>
            <div className="grid grid-flow-row divide-y text-xs">
                <div className="flex items-center justify-between py-2">
                    <span className="uppercase font-semibold">nama</span>
                    <p className="text-right uppercase">{dataItem.nama_asn}</p>
                </div>
                <div className="flex items-center justify-between py-2">
                    <span className="uppercase font-semibold">jabatan</span>
                    <div className="flex flex-col gap-y-2 text-right items-end">
                        <p>{dataItem.nama_jabatan}</p>
                        {/* <small>ID : {item.id || '197801012007011026'}</small> */}
                    </div>
                </div>
                <div className="flex flex-col gap-y-4 py-2 pt-4">
                    <div className="flex items-center gap-x-2">
                        <Button className="w-fit" type="primary">
                            Lihat SKP
                        </Button>
                    </div>
                    <DataTable columns={rhkColumns} data={data?.rhks} loading={rhkData.loading} />

                    {/* <Collapse bordered>
                        <Collapse.Panel
                            key="1"
                            header="RHK Yang di Intervensi"
                            extra={
                                <Button
                                    onClick={() =>
                                        setModal({
                                            trigger: true,
                                            title: 'Tambah RHK Intervensi',
                                            type: 'create',
                                            formFields: rhkData.fields,
                                            onSubmit: async (value) => {
                                                const skp = data;
                                                console.log(skp);

                                                if (skp) {
                                                    const dt = {
                                                        ...value,
                                                        skp: skp._id
                                                    };
                                                    const rhk = await storeRHK(dataItem.id_asn, dt);

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
                                                    const newSKP = await storeSKP(dataItem.id_asn, data, '0');
                                                    const dt = {
                                                        ...value,
                                                        skp: newSKP?.data._id
                                                    };

                                                    const rhk = await storeRHK(dataItem.id_asn, dt);
                                                    fetchData();
                                                    message.success('Berhasil Menambahkan RHK');
                                                }
                                                setModal({ trigger: false });
                                            }
                                        })
                                    }
                                >
                                    Tambah RHK
                                </Button>
                            }
                        >
                            <DataTable columns={rhkData.columns} data={data?.rhks} loading={rhkData.loading} />
                        </Collapse.Panel>
                        <Collapse.Panel
                            key="2"
                            header="Aspek"
                            extra={
                                <Button
                                    onClick={() =>
                                        setModal({
                                            trigger: true,
                                            title: 'Tambah Aspek',
                                            type: 'create',
                                            formFields: AspekFields,
                                            onSubmit: async (value) => {
                                                const dt = {
                                                    rhk: value.rhk,
                                                    jenis: value.jenis,
                                                    indikator: value.indikator,
                                                    target_tahunan: {
                                                        target: value.target_tahunan,
                                                        satuan: String(value.satuan)
                                                    }
                                                };
                                                const res = await storeAspek(dt);
                                                fetchData();

                                                message.success('Berhasil Menambahkan Aspek');
                                                setModal({ trigger: false });
                                            }
                                        })
                                    }
                                >
                                    Tambah Aspek
                                </Button>
                            }
                        >
                            <DataTable columns={aspekColumns} data={aspek} loading={aspekData.loading} />
                        </Collapse.Panel>
                     
                    </Collapse> */}
                </div>
            </div>
        </Card>
    );
};

export default MatriksCard;
