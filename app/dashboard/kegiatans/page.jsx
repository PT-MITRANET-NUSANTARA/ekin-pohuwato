'use client';

import { Alert, Breadcrumb, Button, Card, Modal, Space, Table, Typography } from 'antd';
import { PlusOutlined, EditOutlined, EyeOutlined, DeleteOutlined, DatabaseOutlined, SearchOutlined } from '@ant-design/icons';
import { DataTable, CrudModal } from '@/components';
import React, { useEffect, useState } from 'react';
import { destroy, getAll, store, update } from '@/controller/KegiatanController';
import { getAll as getAllProgram } from '@/controller/ProgramController';
import useFetchData from '@/hooks/useFetchData';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

const { Title } = Typography;

const page = () => {
    const router = useRouter();
    const { IdRenstra } = useParams();
    const { data, setData, loading, msg, status } = useFetchData(getAll);
    const [program, setProgram] = useState(null);

    useEffect(() => {
        if (data) {
            fetchData();
        }
    }, [data]);

    const fetchData = async () => {
        try {
            const data = await getAllProgram();
            setProgram(data.data);
        } catch (error) {
            console.log(error);
        }
    };

    const [modal, setModal] = useState({ trigger: false, modalData: null, title: '', formFields: [] });
    const [indikatorModal, setIndikatorModal] = useState({ trigger: false, modalData: [] });

    const [alert, setAlert] = useState({ show: false, message: null, description: null, type: 'info' });

    const onSubmit = async (values, type, id) => {
        try {
            console.log(values);

            let response;

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
                    description: type === 'delete' ? 'Berhasil Menghapus Indikator' : type === 'edit' ? 'Berhasil Mengedit Indikator' : 'Berhasil Menambahkan Indikator',
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

        console.log('Operation completed');
        handleClose();
    };

   

    const Column = [
        {
            title: 'ID',
            dataIndex: '_id',
            key: '_id',
            sorter: (a, b) => a._id.length - b._id.length,
            width: '10%'
        },
        {
            title: 'Program',
            dataIndex: 'program',
            key: 'name',
            sorter: (a, b) => a.name.length - b.name.length,
            width: '10%',
            render: (_, record) => (
                <>
                    <Button onClick={() => setModal({ formFields: programFields, trigger: true, modalData: record.program, title: `Lihat Program ${record.program._id}`, type: 'show' })} icon={<SearchOutlined />}>
                        {record.program._id}
                    </Button>
                </>
            )
        },
        {
            title: 'Nama',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.length - b.name.length,
            width: '30%'
        },
        {
            title: 'Indikator Kinerja',
            dataIndex: 'indikator_kinerja',
            key: 'indikator_kinerja',
            width: '30%',
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
            key: 'satuan',
            sorter: (a, b) => a.periode_end.length - b.periode_end.length,
            width: '30%'
        },

        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="small">
                    <Button
                        onClick={() => setModal({ trigger: true, modalData: record, title: `Kegiatan ${record._id}`, type: 'show', formFields: formFields })}
                        // type='primary'
                        size="middle"
                        color="default"
                        icon={<EyeOutlined />}
                    />
                    <Button
                        onClick={() => setModal({ trigger: true, modalData: record, title: `Edit Kegiatan ${record._id}`, type: 'edit', formFields: formFields })}
                        // type='primary'
                        size="middle"
                        color="primary"
                        variant="outlined"
                        icon={<EditOutlined />}
                    />

                    <Button
                        onClick={() => setModal({ trigger: true, modalData: record, title: `Delete Kegiatan ${record._id}`, type: 'delete', formFields: formFields })}
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
    console.log(program);

    const formFields = [
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
            options: program?.map((item) => ({ value: item._id, label: item.name }))
        },
        {
            label: 'Kegiatan',
            name: 'name',
            type: 'longtext',
            rules: [
                {
                    required: true,
                    message: 'Field kegiatan wajib di isi'
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

    const programFields = [
        {
            label: 'Program',
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
                    },
                    {
                        title: <Link href={`dashboard/renstra/${IdRenstra}/programs`}>Programs {IdRenstra}</Link>
                    }
                ]}
            />
            <Card className="">
                <div className="flex flex-col">
                    <div className="flex items-center justify-between mb-12">
                        <Title className="mt-2" level={5}>
                            Data Kegiatan
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
                    <CrudModal title={modal.title} isModalOpen={modal.trigger} data={modal.modalData} onSubmit={onSubmit} onClose={handleClose} formFields={modal.formFields} type={modal.type} />
                </div>
            </Card>
        </div>
    );
};

export default page;
