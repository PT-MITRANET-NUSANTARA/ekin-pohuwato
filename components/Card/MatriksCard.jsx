'use client';
import { Button, Card, Collapse, Dropdown, message, Space, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import DataTable from '../DataTable/DataTable';
import { getByUserIdAndPeriode } from '@/controller/SKPController';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';

import { store as storeRHK, destroy as destroyRHK, update as updateRHK } from '@/controller/RHKController';
import { store as storeAspek } from '@/controller/AspekController';
import { getById, store as storeSKP, getBySKPAndPeriode } from '@/controller/SKPController';
import { update as updateAspek, destroy as destroyAspek } from '@/controller/AspekController';
import CrudModal from '../Modal/CrudModal';

const MatriksCard = ({ SKP, dataItem, rhkData, aspekData, rencanaAksiData }) => {
    const [infoModal, setInfoModal] = useState({ trigger: false, title: '', onClose: () => { }, data: null, type: '', isLoading: false, column: [] });
    const [modal, setModal] = useState({ trigger: false, modalData: null, title: '', formFields: [], onSubmit: () => { } });
    const [submitLoading, setSubmitLoading] = useState(false);

    const [data, setData] = useState(null);
    const [rhk, setRhk] = useState([]);
    useEffect(() => {
        fetchData();
    }, []);
    const fetchData = async () => {
        try {
            const response = await getById(dataItem._id);
            const jabatan = response.data.jabatan[response.data.jabatan.length - 1];
            console.log('matrix', jabatan);
            const rhks = response.data.rhks.filter(rhk => rhk.posjab === jabatan.id_posjab);
            setRhk(rhks)
            setData(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    const statusColors = {
        draft: 'blue',
        submitted: 'orange',
        approved: 'green',
        rejected: 'red'
    };

    const handleModalSubmit = async (key, value, id) => {
        setSubmitLoading(true);
        try {
            if (key === '1') {
                const updatedData = {
                    rhk: value.rhk,
                    jenis: value.jenis,
                    indikator: value.indikator,
                    target_tahunan: {
                        target: value.target_tahunan,
                        satuan: String(value.satuan)
                    }
                };
                await updateAspek(id, updatedData);
                message.success('Berhasil Mengedit Aspek');
            } else {
                const newData = {
                    rhk: value.rhk,
                    jenis: value.jenis,
                    indikator: value.indikator,
                    target_tahunan: {
                        target: value.target_tahunan,
                        satuan: String(value.satuan)
                    }
                };
                await storeAspek(newData);
                message.success('Berhasil Menambahkan Aspek');
            }

            fetchData(); 
        } catch (error) {
            message.error('Operasi gagal: ' + error.message);
        } finally {
            setSubmitLoading(false);
            setModal({ trigger: false });
        }
    };
    const actionMethod = ({ key, item }) => {
        const modalConfig = {
            1: {
                title: 'Edit Aspek',
                type: 'edit',
                formFields: AspekFields,
                modalData: { ...item, target_tahunan: item.target_tahunan.target, satuan: item.target_tahunan.satuan },
                onSubmit: async (value) => await handleModalSubmit(key, value, item._id)
            },
            2: {
                title: 'Delete Aspek',
                type: 'delete',
                formFields: AspekFields,
                modalData: { ...item, rhk: item.rhk._id, target_tahunan: item.target_tahunan.target, satuan: item.target_tahunan.satuan },
                onSubmit: async (value) => await handleModalSubmit(key, value)
            }
        };

        const config = modalConfig[key];
        if (config) {
            setModal({ trigger: true, ...config });
        }
    };

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
            dataIndex: 'desc',
            key: 'desc',
            sorter: (a, b) => a.desc.length - b.desc.length,
            render: (_, record) => record.desc
        },
        {
            title: 'Aspek',
            dataIndex: 'aspek',
            key: 'aspek',
            render: (record) => (
                <div className="flex flex-col gap-y-1">
                    {record.map((item) => (
                        <Dropdown
                            key={item._id} // Ensure a unique key for each element
                            menu={{
                                items: [
                                    {
                                        key: '1',
                                        label: (
                                            <Button size="small" type="link" icon={<EditOutlined />}>
                                                Edit
                                            </Button>
                                        )
                                    },
                                    // {
                                    //     key: '2',
                                    //     label: (
                                    //         <Button size="small" type="link" danger icon={<DeleteOutlined />}>
                                    //             Delete
                                    //         </Button>
                                    //     )
                                    // }
                                ],
                                onClick: ({ key }) => actionMethod({ key, item }) // Wrap the function call
                            }}
                        >
                            <Button className="w-fit">{item.jenis}</Button>
                        </Dropdown>
                    ))}
                    {/* <Button
                        className="w-fit"
                        variant="outlined"
                        color="primary"
                        icon={<PlusOutlined />}
                        onClick={() =>
                            setModal({
                                trigger: true,
                                title: 'Tambah Aspek',
                                type: 'create',
                                formFields: AspekFields,
                                onSubmit: async (value) => {
                                    setSubmitLoading(true);

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
                                    setSubmitLoading(false);

                                    message.success('Berhasil Menambahkan Aspek');
                                    setModal({ trigger: false });
                                }
                            })
                        }
                    >
                        Tambah
                    </Button> */}
                </div>
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
                                formFields: rhkData.fields,
                                onSubmit: async (values) => {
                                    setSubmitLoading(true);

                                    console.log(record);
                                    let dt = values;
                                    console.log(dt);

                                    dt = { ...dt, skp: record.skp, posjab: dataItem.jabatan[dataItem.jabatan.length - 1].id_posjab };
                                    const response = await updateRHK(record._id, dt);
                                    console.log(response);

                                    if (response.ok) {
                                        message.success('Berhasil Mengubah RHK');
                                        setModal({ trigger: false });
                                    } else {
                                        message.error('Gagal Mengubah RHK');
                                    }
                                    setSubmitLoading(false);
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
                                formFields: rhkData.fields,
                                onSubmit: async (values) => {
                                    setSubmitLoading(true);

                                    const response = await destroyRHK(record._id);
                                    if (response.ok) {
                                        message.success('Berhasil Menghapus RHK');
                                        setModal({ trigger: false });
                                    } else {
                                        message.error('Gagal Menghapus RHK');
                                    }
                                    setSubmitLoading(false);
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
        <Card type="inner" title={dataItem.user_id} extra={<Tag color={statusColors[dataItem.status]}>{dataItem.status}</Tag>}>
            <div className="grid grid-flow-row divide-y text-xs">
                <div className="flex items-center justify-between py-2">
                    <span className="uppercase font-semibold">nama</span>
                    <p className="text-right uppercase">{dataItem.jabatan[dataItem.jabatan.length - 1].nama_asn}</p>
                </div>
                <div className="flex items-center justify-between py-2">
                    <span className="uppercase font-semibold">jabatan</span>
                    <div className="flex flex-col gap-y-2 text-right items-end">
                        <p>{dataItem.jabatan[dataItem.jabatan.length - 1].nama_jabatan}</p>
                        {/* <small>ID : {item.id || '197801012007011026'}</small> */}
                    </div>
                </div>
                <div className="flex flex-col gap-y-4 py-2 pt-4">
                    <div className="flex items-center gap-x-2">
                        <Button className="w-fit" type="primary">
                            Lihat SKP
                        </Button>
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
                                        setSubmitLoading(true);
                                        const dt = {
                                            ...value,
                                            posjab: dataItem.jabatan[dataItem.jabatan.length - 1].id_posjab,
                                            skp: dataItem._id
                                        };
                                        const rhk = await storeRHK(dt);

                                        console.log(rhk);

                                        message.success('Berhasil Menambahkan RHK');
                                        fetchData();
                                        setSubmitLoading(false);
                                        setModal({ trigger: false });
                                    }
                                })
                            }
                        >
                            Tambah RHK
                        </Button>
                    </div>
                    <DataTable columns={rhkColumns} data={rhk} loading={rhkData.loading} />

                    {/* <Collapse bordered> */}

                    {/* <Collapse.Panel
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
                        </Collapse.Panel> */}

                    {/* </Collapse> */}
                </div>
            </div>
            <CrudModal isLoading={submitLoading} formFields={modal.formFields} isModalOpen={modal.trigger} data={modal.modalData} onClose={() => setModal({ trigger: false })} onSubmit={modal.onSubmit} title={modal.title} type={modal.type} />
        </Card>
    );
};

export default MatriksCard;
