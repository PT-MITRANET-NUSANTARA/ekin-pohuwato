'use client';

import { CrudModal, DataTable } from '@/components';
import { dummyTujuan, dummyVisiMisi } from '@/data/dummyData';
import { Alert, Breadcrumb, Button, Card, Space, Table, Typography } from 'antd';
import { PlusOutlined, EditOutlined, EyeOutlined, DeleteOutlined, DatabaseOutlined } from '@ant-design/icons';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import useFetchData from '@/hooks/useFetchData';
import { getAll, store, update, destroy } from '@/controller/TujuanController';
import { getAll as getAllRenstra } from '@/controller/RenstraController';

const { Title } = Typography;

const page = () => {
    const { data, setData, loading, msg, status } = useFetchData(getAll);
    const [modal, setModal] = useState({ trigger: false, modalData: null, title: '' });
    const [alert, setAlert] = useState({ show: false, message: null, description: null, type: 'info' });
    const [renstra, setRenstra] = useState(null);

    useEffect(() => {
        if (data) {
            fetchData();
        }
    }, [data]);

    const fetchData = async () => {
        try {
            const data = await getAllRenstra();
            setRenstra(data.data);
        } catch (error) {
            console.log(error);
        }
    };
    const onSubmit = async (values, type, id) => {
        try {
            let response;
            const dt = values
            switch (type) {
                case 'create':
                    response = await store(dt);
                    break;

                case 'edit':
                    response = await update(id, dt);
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

        console.log('Operation completed');
        handleClose();
    };

    const mapFormDataToData = (formData) => {
        return {
            renstra: formData.renstra,
            name: formData.name,
            sasaran_strategis: formData.sasaran_strategis,
            indikator_kinerja: {
                name: formData.indikator_kinerja.name,
                target: formData.indikator_kinerja.target,
                satuan: formData.indikator_kinerja.satuan
            }
        };
    };

    const mapDataToFormData = (data) => {
        return {
            renstra: data.renstra,
            name: data.name,
            sasaran_strategis: data.sasaran_strategis,
            indikator_kinerja: data.indikator_kinerja
        };
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
            title: 'Tujuan',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.length - b.name.length,
            width: '15%'
        },
        {
            title: 'Renstra',
            dataIndex: 'renstra',
            key: 'renstra',
            sorter: (a, b) => a.renstra.length - b.renstra.length,
            width: '15%'
        },
        {
            title: 'Sasaran Strategis',
            dataIndex: 'sasaran_strategis',
            key: 'sasaran_strategis',
            sorter: (a, b) => a.sasaran_strategis.length - b.sasaran_strategis.length,
            width: '20%'
        },
        {
            title: 'Indikator Kinerja',
            dataIndex: 'indikator_kinerja', // Harus merupakan array of objects
            key: 'indikator_kinerja',
            width: '30%',
            render: (indikator_kinerja) => (
                <Table
                    dataSource={indikator_kinerja.map((item, index) => ({ ...item, key: index }))} // Loop through indikator_kinerja array
                    pagination={false} // Disable pagination for the nested table
                    bordered
                    columns={[
                        {
                            title: 'Name',
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
            )
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
                                modalData: record,
                                title: `Edit Renstra ${record._id}`,
                                type: 'edit'
                            })
                        }
                        size="middle"
                        icon={<EditOutlined />}
                    />
                    <Button
                        onClick={() =>
                            setModal({
                                trigger: true,
                                modalData: record,
                                title: `Renstra ${record._id}`,
                                type: 'show'
                            })
                        }
                        size="middle"
                        icon={<EyeOutlined />}
                    />
                    <Button
                        onClick={() =>
                            setModal({
                                trigger: true,
                                modalData: record,
                                title: `Delete Renstra ${record._id}`,
                                type: 'delete'
                            })
                        }
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
            label: 'Renstra',
            name: 'renstra',
            type: 'select',
            rules: [
                {
                    required: true,
                    message: 'Field nama wajib di isi'
                }
            ],
            options: renstra?.map((item) => ({ value: item._id, label: item.periode_start + ' - ' + item.periode_end }))
        },
        {
            label: 'Tujuan',
            name: 'name',
            type: 'longtext',
            rules: [
                {
                    required: true,
                    message: 'Field nama wajib di isi'
                }
            ]
        },
        {
            label: 'Sasaran Stragetis',
            name: 'sasaran_strategis',
            type: 'longtext',
            rules: [
                {
                    required: true,
                    message: 'Field nama wajib di isi'
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
                    message: 'Field nama wajib di isi'
                }
            ]
        }
    ];

    console.log(data);

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
                            Data Tujuan
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
