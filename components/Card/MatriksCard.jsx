'use client';
import { Button, Card, Collapse, message, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import DataTable from '../DataTable/DataTable';
import { getByUserIdAndPeriode } from '@/controller/SKPController';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

import { store as storeRHK } from '@/controller/RHKController';
import { store as storeAspek } from '@/controller/AspekController';
import { getById,  store as storeSKP, getBySKPAndPeriode} from '@/controller/SKPController';


const MatriksCard = ({ SKP, dataItem, rhkData, aspekData, rencanaAksiData, setModal, modal }) => {
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
                const { target_tahunan, rhk , ...rest } = record;
                return (
                    <Space size="small">
                        <Button
                            // type='primary'
                            onClick={() =>
                                setModal({
                                    trigger: true,
                                    modalData: {
                                        ...rest,
                                        rhk: rhk._id,
                                        target_tahunan: target_tahunan?.target,
                                        satuan: target_tahunan?.satuan
                                    },
                                    title: 'Edit Aspek',
                                    type: 'edit',
                                    formFields: AspekFields,
                                    onSubmit: () => {}
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
                                        ...rest,
                                        rhk: rhk._id,
                                        target_tahunan: target_tahunan?.target,
                                        satuan: target_tahunan?.satuan
                                    },
                                    title: 'Delete Aspek',
                                    type: 'delete',
                                    formFields: AspekFields,
                                    onSubmit: () => {}
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
                    message: 'Field target tahunan wajib di isi'
                }
            ]
        },
       
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
                    <Collapse bordered>
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
                                                        satuan: value.satuan
                                                    },
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
                        {/* <Collapse.Panel
                            key="3"
                            header="Rencana Aksi"
                            extra={<Button onClick={() => setModal({ trigger: true, title: 'Tambah Rencana Aksi', type: 'create', formFields: rencanaAksiData.fields, onSubmit: () => {} })}>Tambah Rencana Aksi</Button>}
                        >
                            <DataTable columns={rencanaAksiData.columns} data={rencanaAksiData.data} loading={rencanaAksiData.loading} />
                        </Collapse.Panel> */}
                    </Collapse>
                </div>
            </div>
        </Card>
    );
};

export default MatriksCard;
