'use client';

import { Alert, Breadcrumb, Button, Card, Modal, Space, Table, Typography } from 'antd';
import { PlusOutlined, EditOutlined, EyeOutlined, DeleteOutlined, DatabaseOutlined, SearchOutlined } from '@ant-design/icons';
import { DataTable, CrudModal, DataLoading } from '@/components';
import React, { useEffect, useState } from 'react';
import { destroy, getAll, store, update } from '@/controller/RenstraController';
import useFetchData from '@/hooks/useFetchData';
import { dummyRenstra } from '@/data';
import { useRouter } from 'next/navigation';
import { getAll as getAllMisi } from '@/controller/MisiController';
import { getAll as getAllPeriode } from '@/controller/PeriodeController';

import Link from 'next/link';
import { dateFormatter } from '@/utils';

const { Title } = Typography;
const page = () => {
    const router = useRouter();
    const { data, setData, loading, msg, status } = useFetchData(getAll);
    const [modal, setModal] = useState({ trigger: false, modalData: null, title: '' });
    const [misiModal, setMisiModal] = useState({ trigger: false, modalData: [] });
    const [alert, setAlert] = useState({ show: false, message: null, description: null, type: 'info' });
    const [misi, setMisi] = useState(null);
    const [periode, setPeriode] = useState(null);
    const [submitLoading, setSubmitLoading] = useState(false)


    useEffect(() => {
        if (data) {
            fetchData();
        }
    }, [data]);

    const fetchData = async () => {
        try {
            const periode = await getAllPeriode();
            const misi = await getAllMisi();
            setPeriode(periode.data);
            setMisi(misi.data);
        } catch (error) {
            console.log(error);
        }
    };

    const onSubmit = async (values, type, id) => {
        try {
            setSubmitLoading(true);
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
                    description: type === 'delete' ? 'Berhasil Menghapus Renstra' : type === 'edit' ? 'Berhasil Mengedit Renstra' : 'Berhasil Menambahkan Renstra',
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
            title: 'Misi',
            dataIndex: 'misi',
            key: 'misi',
            sorter: (a, b) => a.misi.length - b.misi.length,
            width: '30%',
            render: (_, record) => (
                <>
                    <Button icon={<SearchOutlined />} onClick={() => setMisiModal({ modalData: record.misi, trigger: true })}>
                        Info
                    </Button>
                    <Modal open={misiModal.trigger} onCancel={() => setMisiModal({ modalData: null, trigger: false })} footer={null}>
                        <Table
                            className="mt-8"
                            dataSource={misiModal.modalData?.map((item, index) => ({ ...item, key: index }))}
                            pagination={false}
                            bordered
                            columns={[
                                {
                                    title: 'Misi',
                                    dataIndex: 'name',
                                    key: 'name'
                                },
                                {
                                    title: 'Visi',
                                    dataIndex: ['visi', 'name'],
                                    key: 'visi'
                                }
                            ]}
                        />
                    </Modal>
                </>
            )
        },

        {
            title: 'Peroide Mulai',
            dataIndex: 'periode_start',
            key: 'periode_start',
            sorter: (a, b) => new Date(a.periode_start) - new Date(b.periode_start),

            render: (record) => dateFormatter(record)
        },
        {
            title: 'Periode Selesai',
            dataIndex: 'periode_end',
            key: 'periode_end',
            sorter: (a, b) => new Date(a.periode_end) - new Date(b.periode_end),
            render: (record) => dateFormatter(record)
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="small">
                    <Button
                        onClick={() =>
                            setModal({ trigger: true, modalData: { ...record, misi: record.misi?.map((item) => ({ value: item._id, label: item.name })), periode: record.misi[0].visi.periode._id }, title: `Edit Renstra ${record._id}`, type: 'show' })
                        }
                        // type='primary'
                        size="middle"
                        icon={<EyeOutlined />}
                    />
                    <Button
                        onClick={() =>
                            setModal({ trigger: true, modalData: { ...record, misi: record.misi?.map((item) => ({ value: item._id, label: item.name })), periode: record.misi[0].visi.periode._id }, title: `Edit Renstra ${record._id}`, type: 'edit' })
                        }
                        // type='primary'
                        size="middle"
                        color="primary"
                        variant="outlined"
                        icon={<EditOutlined />}
                    />

                    <Button
                        onClick={() =>
                            setModal({
                                trigger: true,
                                modalData: { ...record, misi: record.misi?.map((item) => ({ value: item._id, label: item.name })), periode: record.misi[0].visi.periode._id },
                                title: `Edit Renstra ${record._id}`,
                                type: 'delete'
                            })
                        }
                        // type='primary'
                        size="middle"
                        danger
                        icon={<DeleteOutlined />}
                    />
                </Space>
            )
        }
    ];

    const formFields = [
        {
            label: 'Periode',
            name: 'periode',
            type: 'select',
            rules: [
                {
                    required: true,
                    message: 'Field periode wajib di isi'
                }
            ],
            options: periode?.map((item) => ({
                label: `${dateFormatter(item.periode_start)} - ${dateFormatter(item.periode_end)}`,
                value: item._id,
                id: item._id
            }))
        },
        {
            label: 'Misi',
            name: 'misi',
            type: 'select',
            rules: [
                {
                    required: true,
                    message: 'Field misi wajib di isi'
                }
            ],
            options: misi?.map((item) => ({
                label: item.name,
                value: item._id,
                id_option_parent: item.visi.periode,
                id: item._id
            })),
            mode: 'multiple',
            parentField: 'periode'
        },
        {
            label: 'Periode Mulai',
            name: 'periode_start',
            type: 'date',
            rules: [
                {
                    required: true,
                    message: 'Field periode mulai wajib di isi'
                }
            ],
            min: 1,
            max: 3000
        },
        {
            label: 'Periode Selesai',
            name: 'periode_end',
            type: 'date',
            rules: [
                {
                    required: true,
                    message: 'Field periode selesai wajib di isi'
                }
            ],
            min: 1,
            max: 3000
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
                                Data Renstra
                            </Title>
                            <div>
                                <Button type="primary" icon={<PlusOutlined />} onClick={() => setModal({ modalData: null, title: 'Tambah Data', trigger: true, type: 'create' })}>
                                    Tambah
                                </Button>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <DataTable columns={Column} data={data} />
                        </div>
                        <CrudModal isLoading={submitLoading} title={modal.title} isModalOpen={modal.trigger} data={modal.modalData} onSubmit={onSubmit} onClose={handleClose} formFields={formFields} type={modal.type} />
                    </div>
                </Card>
            )}
        </div>
    );
};

export default page;
