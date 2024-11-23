'use client';

import { CrudModal, DataTable } from '@/components';
import { dummyMisi } from '@/data/dummyData';
import { Alert, Breadcrumb, Button, Card, Space, Typography } from 'antd';
import { PlusOutlined, EditOutlined, EyeOutlined, DeleteOutlined, DatabaseOutlined, SearchOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { dateFormatter } from '@/utils';
import { getAll, store, update, destroy } from '@/controller/MisiController';
import React, { useEffect, useState } from 'react';
import { getAll as getAllVisi } from '@/controller/VisiController';
import { getAll as getAllPeriode } from '@/controller/PeriodeController';
import useFetchData from '@/hooks/useFetchData';

const { Title } = Typography;

const page = () => {
    const [modal, setModal] = useState({ trigger: false, modalData: null, title: '', formFields: [] });
    const [alert, setAlert] = useState({ show: false, message: null, description: null, type: 'info' });
    const { data, setData, loading, msg, status } = useFetchData(getAll);

    const [visi, setVisi] = useState(null);
    const [periode, setPeriode] = useState(null);

    useEffect(() => {
        if (data) {
            fetchData();
        }
    }, [data]);

    const fetchData = async () => {
        try {
            const periode = await getAllPeriode();
            const visi = await getAllVisi();
            setPeriode(periode.data);
            setVisi(visi.data);
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
            console.log(response);
            

            if (response.ok) {
                const data = await getAll();
                setData(data.data);
                setAlert({
                    show: true,
                    message: response.msg,
                    description: type === 'delete' ? 'Berhasil Menghapus Misi' : type === 'edit' ? 'Berhasil Mengedit Misi' : 'Berhasil Menambahkan Misi',
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
            title: 'No',
            dataIndex: 'index',
            render: (text, record, index) => index + 1,
            width: '5%'
        },
        {
            title: 'Visi',
            dataIndex: 'visi',
            key: 'visi',
            sorter: (a, b) => a.visi.length - b.visi.length,
            render: (_, record) => (
                <>
                    <Button onClick={() => setModal({ formFields: visiFields, trigger: true, modalData: record.visi, title: `Lihat Visi ${record.visi._id}`, type: 'show' })} icon={<SearchOutlined />}>
                        Info
                    </Button>
                </>
            )
        },
        {
            title: 'Misi',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.length - b.name.length,
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="small">
                    <Button
                        onClick={() => setModal({ formFields: misiFields, trigger: true, modalData: {...record, visi: record.visi._id, periode: record.visi.periode}, title: `Edit Misi ${record._id}`, type: 'show' })}
                        // type='primary'
                        size="middle"
                        variant="outlined"
                        icon={<EyeOutlined />}
                    />
                    <Button
                        onClick={() => setModal({ formFields: misiFields, trigger: true, modalData: {...record, visi: record.visi._id, periode: record.visi.periode}, title: `Edit Misi ${record._id}`, type: 'edit' })}
                        // type='primary'
                        size="middle"
                        variant="outlined"
                        color="primary"
                        icon={<EditOutlined />}
                    />

                    <Button
                        onClick={() => setModal({ formFields: misiFields, trigger: true, modalData: {...record, visi: record.visi._id, periode: record.visi.periode}, title: `Edit Misi ${record._id}`, type: 'delete' })}
                        // type='primary'
                        size="middle"
                        danger
                        icon={<DeleteOutlined />}
                    />
                </Space>
            )
        }
    ];

    const misiFields = [
        {
            label: 'Periode',
            name: 'periode',
            type: 'select',
            rules: [
                {
                    required: true,
                    message: 'Field Periode wajib di isi'
                }
            ],
            options: periode?.map((item) => ({
                label: `${dateFormatter(item.periode_start)} - ${dateFormatter(item.periode_end)}`,
                value: item._id,
                id: item._id
            })),
        },
        {
            label: 'Visi',
            name: 'visi',
            type: 'select',
            rules: [
                {
                    required: true,
                    message: 'Field visi wajib di isi'
                }
            ],
            options: visi?.map((item) => ({ 
                label: item.name,
                value: item._id,
                id_option_parent: item.periode._id,
                id: item._id
             })),
            parentField: 'periode'
        },
        {
            label: 'Misi',
            name: 'name',
            type: 'longtext',
            rules: [
                {
                    required: true,
                    message: 'Field misi mulai wajib di isi'
                }
            ]
        }
    ];

    const visiFields = [
        {
            label: 'Visi',
            name: 'name',
            type: 'longtext'
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
                            Data Misi
                        </Title>
                        <div>
                            <Button type="primary" icon={<PlusOutlined />} onClick={() => setModal({ modalData: null, title: 'Tambah Data', trigger: true, type: 'create', formFields: misiFields })}>
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
