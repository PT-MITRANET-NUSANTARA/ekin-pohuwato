'use client';

import { Alert, Breadcrumb, Button, Card, Modal, Space, Table, Typography } from 'antd';
import { PlusOutlined, EditOutlined, EyeOutlined, DeleteOutlined, DatabaseOutlined, SearchOutlined } from '@ant-design/icons';
import { DataTable, CrudModal, DataLoading } from '@/components';
import React, { useEffect, useState } from 'react';
import { destroy, getAll, store, update } from '@/controller/SubKegiatanController';
import { getAll as getAllKegiatan } from '@/controller/KegiatanController';
import { getAll as getAllProgram } from '@/controller/ProgramController';
import { getAll as getAllTujuan } from '@/controller/TujuanController';
import { getAll as getAllRenstra } from '@/controller/RenstraController';
import useFetchData from '@/hooks/useFetchData';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { dateFormatter } from '@/utils';

const { Title } = Typography;

const page = () => {
    const router = useRouter();
    const { data, setData, loading, msg, status } = useFetchData(getAll);
    const [modal, setModal] = useState({ trigger: false, modalData: null, title: '', formFields: [] });
    const [indikatorModal, setIndikatorModal] = useState({ trigger: false, modalData: [] });
    const [alert, setAlert] = useState({ show: false, message: null, description: null, type: 'info' });

    const [kegiatan, setKegiatan] = useState(null);
    const [renstra, setRenstra] = useState(null);
    const [tujuan, setTujuan] = useState(null);
    const [program, setProgram] = useState(null);
    const [submitLoading, setSubmitLoading] = useState(false)


    useEffect(() => {
        if (data) {
            fetchData();
        }
    }, [data]);

    const fetchData = async () => {
        try {
            const kegiatan = await getAllKegiatan();
            const renstra = await getAllRenstra();
            const tujuan = await getAllTujuan();
            const program = await getAllProgram();
            setRenstra(renstra.data);
            setTujuan(tujuan.data);
            setProgram(program.data);
            setKegiatan(kegiatan.data);
        } catch (error) {
            console.log(error);
        }
    };

    const onSubmit = async (values, type, id) => {
        try {
            let response;
            setSubmitLoading(true);
            switch (type) {
                case 'create':
                    response = await store(values);
                    break;

                case 'edit':
                    response = await update(id, values);
                    break;

                case 'delete':
                    response = await destroy(id);
                    break;

                default:
                    throw new Error('Tipe operasi tidak valid');
            }

            console.log(response);
            if (response.ok) {
                const data = await getAll();
                setData(data.data);
                setAlert({
                    show: true,
                    message: response.msg,
                    description: type === 'delete' ? 'Berhasil Menghapus Sub Kegiatan' : type === 'edit' ? 'Berhasil Mengedit Sub Kegiatan' : 'Berhasil Menambahkan Sub Kegiatan',
                    type: 'success'
                });
            } else {
                setAlert({
                    show: true,
                    message: 'Gagal',
                    description: response.msg,
                    type: 'error'
                });
            }
        } catch (error) {
            setAlert({
                show: true,
                message: 'Error',
                description: error.message,
                type: 'error'
            });
        }
        setSubmitLoading(false);

        console.log('Operation completed');
        handleClose();
    };

    const Column = [
        {
            title: 'No',
            dataIndex: 'index',
            render: (text, record, index) => index + 1,
            width: '5%'
        },
        {
            title: 'Kegiatan',
            dataIndex: 'kegiatan',
            key: 'kegiatan',
            render: (_, record) => (
                <Button onClick={() => setModal({ formFields: kegiatanFields, trigger: true, modalData: record.kegiatan, title: `Lihat Kegiatan ${record.kegiatan._id}`, type: 'show' })} icon={<SearchOutlined />}>
                    Info
                </Button>
            )
        },
        {
            title: 'Nama',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.length - b.name.length
        },

        {
            title: 'Indikator Kinerja',
            dataIndex: 'indikator_kinerja',
            key: 'indikator_kinerja',
            render: (_, record) => (
                <>
                    <Button icon={<SearchOutlined />} onClick={() => setIndikatorModal({ modalData: record.indikator_kinerja, trigger: true })}>
                        Info
                    </Button>
                    <Modal open={indikatorModal.trigger} onCancel={() => setIndikatorModal({ modalData: null, trigger: false })} footer={null}>
                        <Table
                            className="mt-8"
                            dataSource={indikatorModal.modalData?.map((item, index) => ({ ...item, key: index }))}
                            pagination={false}
                            bordered
                            columns={[
                                {
                                    title: 'Indikator',
                                    dataIndex: 'name',
                                    key: 'name'
                                },
                                {
                                    title: 'Target',
                                    dataIndex: 'target',
                                    key: 'target'
                                },
                                {
                                    title: 'Satuan',
                                    dataIndex: 'satuan',
                                    key: 'satuan'
                                }
                            ]}
                        />
                    </Modal>
                </>
            )
        },
        {
            title: 'Total Anggaran',
            dataIndex: 'total_anggaran',
            key: 'total_anggaran',
            sorter: (a, b) => a.total_anggaran.length - b.total_anggaran.length
        },

        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="small">
                    <Button
                        onClick={() =>
                            setModal({
                                trigger: true,
                                modalData: {
                                    ...record,
                                    renstra: {
                                        label: `${dateFormatter(record.kegiatan.program.tujuan.renstra.periode_start)} - ${dateFormatter(record.kegiatan.program.tujuan.renstra.periode_end)}`,
                                        value: record.kegiatan.program.tujuan.renstra._id
                                    },
                                    tujuan: {
                                        label: record.kegiatan.program.tujuan.name,
                                        value: record.kegiatan.program.tujuan._id
                                    },
                                    program: {
                                        label: record.kegiatan.program.name,
                                        value: record.kegiatan.program._id
                                    },
                                    kegiatan: {
                                        label: record.kegiatan.name,
                                        value: record.kegiatan._id
                                    }
                                },
                                title: `Edit Program ${record._id}`,
                                type: 'show',
                                formFields: formFields
                            })
                        }
                        // type='primary'
                        size="middle"
                        color="default"
                        icon={<EyeOutlined />}
                    />
                    <Button
                        onClick={() =>
                            setModal({
                                trigger: true,
                                modalData: {
                                    ...record,
                                    renstra: {
                                        label: `${dateFormatter(record.kegiatan.program.tujuan.renstra.periode_start)} - ${dateFormatter(record.kegiatan.program.tujuan.renstra.periode_end)}`,
                                        value: record.kegiatan.program.tujuan.renstra._id
                                    },
                                    tujuan: {
                                        label: record.kegiatan.program.tujuan.name,
                                        value: record.kegiatan.program.tujuan._id
                                    },
                                    program: {
                                        label: record.kegiatan.program.name,
                                        value: record.kegiatan.program._id
                                    },
                                    kegiatan: {
                                        label: record.kegiatan.name,
                                        value: record.kegiatan._id
                                    }
                                },
                                title: `Edit Program ${record._id}`,
                                type: 'edit',
                                formFields: formFields
                            })
                        }
                        // type='primary'
                        size="middle"
                        variant="outlined"
                        color="primary"
                        icon={<EditOutlined />}
                    />

                    <Button
                        onClick={() =>
                            setModal({
                                trigger: true,
                                modalData: {
                                    ...record,
                                    renstra: {
                                        label: `${dateFormatter(record.kegiatan.program.tujuan.renstra.periode_start)} - ${dateFormatter(record.kegiatan.program.tujuan.renstra.periode_end)}`,
                                        value: record.kegiatan.program.tujuan.renstra._id
                                    },
                                    tujuan: {
                                        label: record.kegiatan.program.tujuan.name,
                                        value: record.kegiatan.program.tujuan._id
                                    },
                                    program: {
                                        label: record.kegiatan.program.name,
                                        value: record.kegiatan.program._id
                                    },
                                    kegiatan: {
                                        label: record.kegiatan.name,
                                        value: record.kegiatan._id
                                    }
                                },
                                title: `Edit Program ${record._id}`,
                                type: 'delete',
                                formFields: formFields
                            })
                        }
                        // type='primary'
                        size="middle"
                        danger
                        icon={<DeleteOutlined />}
                    />

                    <Button
                        onClick={() => router.push(`/dashboard/kegiatans/${record._id}`)}
                        // type='primary'
                        size="middle"
                        color="primary"
                        variant="outlined"
                        icon={<DatabaseOutlined />}
                    />
                </Space>
            )
        }
    ];

    const formFields = [
        {
            label: 'Renstra',
            name: 'renstra',
            type: 'select',
            rules: [
                {
                    required: true,
                    message: 'Field renstra wajib di isi'
                }
            ],
            options: renstra?.map((item) => ({
                label: `${dateFormatter(item.periode_start)} - ${dateFormatter(item.periode_end)}`,
                value: item._id,
                id: item._id
            }))
        },
        {
            label: 'Tujuan',
            name: 'tujuan',
            type: 'select',
            rules: [
                {
                    required: true,
                    message: 'Field tujuan wajib di isi'
                }
            ],
            options: tujuan?.map((item) => ({
                label: item.name,
                value: item._id,
                id_option_parent: item.renstra._id,
                id: item._id
            })),
            parentField: 'renstra'
        },
        {
            label: 'Program',
            name: 'program',
            type: 'select',
            rules: [
                {
                    required: true,
                    message: 'Field program wajib di isi'
                }
            ],
            options: program?.map((item) => ({
                label: item.name,
                value: item._id,
                id_option_parent: item.tujuan._id,
                id: item._id
            })),
            parentField: 'tujuan'
        },
        {
            label: 'Kegiatan',
            name: 'kegiatan',
            type: 'select',
            rules: [
                {
                    required: true,
                    message: 'Field kegiatan wajib di isi'
                }
            ],
            options: kegiatan?.map((item) => ({
                label: item.name,
                value: item._id,
                id_option_parent: item.program._id,
                id: item._id
            })),
            parentField: 'program'
        },
        {
            label: 'Sub Kegiatan',
            name: 'name',
            type: 'longtext',
            rules: [
                {
                    required: true,
                    message: 'Field sub kegiatan wajib di isi'
                }
            ]
        },

        {
            label: 'Indikator Kinerja',
            name: 'indikator_kinerja',
            type: 'repeater',
            obj: { name: 'longtext', target: 'number', satuan: 'string' },
            rules: [
                {
                    required: true,
                    message: 'Field indikator kinerja wajib di isi'
                }
            ]
        },
        {
            label: 'Total Anggaran',
            name: 'total_anggaran',
            type: 'number',
            rules: [
                {
                    required: true,
                    message: 'Field total anggaran selesai wajib di isi'
                }
            ],
            min: 0
        }
    ];

    const kegiatanFields = [
        {
            label: 'Kegiatan',
            name: 'name',
            type: 'text'
        }
    ];

    const handleClose = () => {
        setModal({ trigger: false, modalData: null });
    };

    return (
        <div className="w-full flex flex-col gap-y-4">
            {alert.show !== false && <Alert message={alert.message} description={alert.description} type={alert.type} showIcon closable />}
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
                <Card className="">
                    <div className="flex flex-col">
                        <div className="flex items-center justify-between mb-12">
                            <Title className="mt-2" level={5}>
                                Data Sub Kegiatan
                            </Title>
                            <div>
                                <Button type="primary" icon={<PlusOutlined />} onClick={() => setModal({ modalData: null, title: 'Tambah Data', trigger: true, type: 'create', formFields: formFields })}>
                                    Tambah
                                </Button>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <DataTable columns={Column} data={data} loading={loading} />
                        </div>
                        <CrudModal isLoading={submitLoading} title={modal.title} isModalOpen={modal.trigger} data={modal.modalData} onSubmit={onSubmit} onClose={handleClose} formFields={modal.formFields} type={modal.type} />
                    </div>
                </Card>
            )}
        </div>
    );
};

export default page;
