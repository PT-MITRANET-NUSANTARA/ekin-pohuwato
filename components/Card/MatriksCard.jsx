'use client';
import { Button, Card, Collapse, message, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import DataTable from '../DataTable/DataTable';
import { getByUserIdAndPeriode } from '@/controller/SKPController';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

import { store as storeRHK } from '@/controller/RHKController';

const MatriksCard = ({ SKP, dataItem, rhkData, aspekData, rencanaAksiData, setModal, modal }) => {
    const [data, setData] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getByUserIdAndPeriode(dataItem.userId, SKP.periodeRKT);
                if (response.data) {
                    console.log('HERE', response.data);
                }
                setData(response.data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, []);

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
            options: data?.rhks.map((item) => ({value: item._id, label: item.desc}))
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
            type: 'text',
            rules: [
                {
                    required: true,
                    message: 'Field indikator wajib di isi'
                }
            ],
        },
        {
            label: 'Target Tahunan',
            name: 'target_tahunan',
            type: 'text',
            rules: [
                {
                    required: true,
                    message: 'Field target tahunan wajib di isi'
                }
            ]
        },
        {
            label: 'Deskripsi',
            name: '',
            type: 'longtext',
            rules: [
                {
                    required: true,
                    message: 'Field deskripsi wajib di isi'
                }
            ]
        }
    ];

    return (
        <Card type="inner" title={dataItem.userId}>
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
                        <Collapse.Panel key="2" header="Aspek" extra={<Button onClick={() => setModal({ trigger: true, title: 'Tambah Aspek', type: 'create', formFields: AspekFields, onSubmit: () => {} })}>Tambah Aspek</Button>}>
                            <DataTable columns={aspekColumns} data={aspekData.data} loading={aspekData.loading} />
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
