'use client';

import { Alert, Breadcrumb, Button, Card, Modal, Space, Table, Typography } from 'antd';
import { PlusOutlined, EditOutlined, EyeOutlined, DeleteOutlined, DatabaseOutlined, SearchOutlined } from '@ant-design/icons';
import { DataTable, CrudModal } from '@/components';
import React, { useEffect, useState } from 'react';
import { destroy, getAll, store, update } from '@/controller/RenstraController';
import useFetchData from '@/hooks/useFetchData';
import { dummyRenstra } from '@/data';
import { useRouter } from 'next/navigation';
import { getAll as getAllMisi } from '@/controller/MisiController';
import Link from 'next/link';

const { Title } = Typography;

const page = () => {
    const router = useRouter();
    const { data, setData, loading, msg, status } = useFetchData(getAll);
    const [modal, setModal] = useState({ trigger: false, modalData: null, title: '' });
    const [misiModal, setMisiModal] = useState({ trigger: false, modalData: [] });
    const [alert, setAlert] = useState({ show: false, message: null, description: null, type: 'info' });
    const [misi, setMisi] = useState(null);

    useEffect(() => {
        if (data) {
            fetchData();
        }
    }, [data]);

    const fetchData = async () => {
        try {
            const data = await getAllMisi();
            setMisi(data.data);
        } catch (error) {
            console.log(error);
        }
    };
    const onSubmit = async (values, type, id) => {
        try {
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

        console.log('Operation completed');
        handleClose();
    };

    const nana = {
        _id: '670892b2181786763b9212c7',
        name: 'Renstra 123',
        periode_start: '2020-09-30T16:00:00.000Z',
        periode_end: '2025-10-29T16:00:00.000Z',
        misi: [
            {
                _id: '67088f39181786763b92129b',
                name: 'Meningkatkan derajat kesehatan masyarakat dan Pendidikan',
                visi: '67088d7d181786763b921263',
                createdAt: '2024-10-11T02:36:41.940Z',
                updatedAt: '2024-10-11T02:36:41.940Z',
                __v: 0
            },
            {
                _id: '67088fc8181786763b9212a5',
                name: 'Meningkatkan kualitas pembangunan infrastruktur dan lingkungan',
                visi: '67088d7d181786763b921263',
                createdAt: '2024-10-11T02:39:04.841Z',
                updatedAt: '2024-10-11T02:39:04.841Z',
                __v: 0
            },
            {
                _id: '67088fdf181786763b9212af',
                name: 'Mewujudkan masyarakat yang produktif dan inovatif',
                visi: '67088d7d181786763b921263',
                createdAt: '2024-10-11T02:39:27.770Z',
                updatedAt: '2024-10-11T02:39:27.770Z',
                __v: 0
            },
            {
                _id: '67088fe8181786763b9212b5',
                name: 'Mewujudkan pemerintahan yang baik,  Masyarakat  tertib  dan religius',
                visi: '67088d7d181786763b921263',
                createdAt: '2024-10-11T02:39:36.955Z',
                updatedAt: '2024-10-11T02:39:36.955Z',
                __v: 0
            }
        ],
        createdAt: '2024-10-11T02:51:30.842Z',
        updatedAt: '2024-10-11T02:51:30.842Z',
        __v: 0
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
            title: 'Misi',
            dataIndex: 'misi',
            key: 'misi',
            sorter: (a, b) => a.name.length - b.name.length,
            width: '30%',
            render: (_, record) => (
                <>
                    <Button icon={<SearchOutlined />} onClick={() => setMisiModal({ modalData: record.misi, trigger: true })}>
                        {record._id}
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
                                    dataIndex: 'visi',
                                    key: 'visi'
                                }
                            ]}
                        />
                    </Modal>
                </>
            )
        },
        {
            title: 'Renstra',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.length - b.name.length,
            width: '30%'
        },
        {
            title: 'Peroide Mulai',
            dataIndex: 'periode_start',
            key: 'periode_start',
            sorter: (a, b) => a.periode_start.length - b.periode_start.length,
            width: '30%'
        },
        {
            title: 'Periode Selesai',
            dataIndex: 'periode_end',
            key: 'periode_end',
            sorter: (a, b) => a.periode_end.length - b.periode_end.length,
            width: '30%'
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="small">
                    <Button
                        onClick={() => setModal({ trigger: true, modalData: record, title: `Edit Renstra ${record._id}`, type: 'edit' })}
                        // type='primary'
                        size="middle"
                        color="primary"
                        variant="outlined"
                        icon={<EditOutlined />}
                    />
                    <Button
                        onClick={() => setModal({ trigger: true, modalData: record, title: `Renstra ${record._id}`, type: 'show' })}
                        // type='primary'
                        size="middle"
                        icon={<EyeOutlined />}
                    />

                    <Button
                        onClick={() => setModal({ trigger: true, modalData: record, title: `Delete Renstra ${record._id}`, type: 'delete' })}
                        // type='primary'
                        size="middle"
                        danger
                        icon={<DeleteOutlined />}
                    />

                    <Button
                        onClick={() => router.push(`/dashboard/programs/${record._id}`)}
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
            name: 'name',
            type: 'text',
            rules: [
                {
                    required: true,
                    message: 'Field renstra wajib di isi'
                }
            ]
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
            options: misi?.map((item) => ({ value: item._id, label: item.name })),
            mode: 'multiple'
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
                    <DataTable columns={Column} data={data} loading={loading} />
                    <CrudModal title={modal.title} isModalOpen={modal.trigger} data={modal.modalData} onSubmit={onSubmit} onClose={handleClose} formFields={formFields} type={modal.type} />
                </div>
            </Card>
        </div>
    );
};

export default page;
