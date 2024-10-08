'use client';

import { Alert, Breadcrumb, Button, Card, Space, Table, Tag, Typography } from 'antd';
import { PlusOutlined, EditOutlined, EyeOutlined, DeleteOutlined, DatabaseOutlined } from '@ant-design/icons';
import { DataTable, CrudModal } from '@/components';
import React, { useEffect, useState } from 'react';
import { destroy, getAll, store, update, getByUserId } from '@/controller/HarianController';
import useFetchData from '@/hooks/useFetchData';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { dummyAktivitas } from '@/data/dummyData';
import { getData } from '@/controller/AuthorizationController';
import {getByUserId as getRHKByUserId} from '@/controller/RHKController';

const { Title } = Typography;

const page = () => {
    const router = useRouter();
    const {data, setData, loading}  = useFetchData(getData) 
    const [modal, setModal] = useState({ trigger: false, modalData: null, title: '' });
    const [alert, setAlert] = useState({ show: false, message: null, description: null, type: 'info' });
    const [harian, setHarian]  = useState(null);
    const [rhk, setRHK] = useState(null);

    useEffect(() => {
        if (data) {
            fetchData();
        }
    }, [data]);

    const fetchData = async () => {
        try {
            const harian = await getByUserId(data.user.idASN);
            const rhk = await getRHKByUserId(data.user.idASN);
            setRHK(rhk.data)
            setHarian(harian.data)
        } catch (error) {
            console.log(error);
        }
    };

    const onSubmit = async (values, type, id, formData) => {
        try {
            let response;
            let dt = {}
            if (values.files) {
                const berkas = values.files
                delete values.files
                dt = {...values, date : Date.now(), files: berkas.fileList}
            }else
            {   
                dt = {...values, date : Date.now()}
            }
          
            switch (type) {
                case 'create':
                    response = await store(data.user.idASN,dt);
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

    const Column = [
        {
            title: 'ID',
            dataIndex: '_id',
            key: '_id',
            sorter: (a, b) => a._id.length - b._id.length,
            width: '10%'
        },
        {
            title: 'Content',
            dataIndex: 'content',
            key: 'content',
            sorter: (a, b) => a.content.length - b.content.length,
            width: '30%'
        },
        {
            title: 'Status Kehadiran',
            dataIndex: 'bukti',
            key: 'bukti',
            sorter: (a, b) => a.bukti.length - b.bukti.length,
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
                        icon={<EditOutlined />}
                    />
                    <Button
                        onClick={() => setModal({ trigger: true, modalData: record, title: `Renstra ${record._id}`, type: 'show' })}
                        // type='primary'
                        size="middle"
                        color="default"
                        icon={<EyeOutlined />}
                    />

                    <Button
                        onClick={() => setModal({ trigger: true, modalData: record, title: `Delete Renstra ${record._id}`, type: 'delete' })}
                        // type='primary'
                        size="middle"
                        color="danger"
                        icon={<DeleteOutlined />}
                    />

                    <Button
                        onClick={() => router.push(`/dashboard/harians/${record._id}/Aktivitas`)}
                        // type='primary'
                        size="middle"
                        color="danger"
                        icon={<DatabaseOutlined />}
                    />
                </Space>
            )
        }
    ];

    const formFields = [
        {
            label: 'RHK',
            name: 'rhk',
            type: 'text',
            rules: [
                {
                    required: true,
                    message: 'Field nama wajib di isi'
                }
            ]
        },
        {
            label: 'Nama Kegiatan',
            name: 'namaKegiatan',
            type: 'text',
            rules: [
                {
                    required: true,
                    message: 'Field nama wajib di isi'
                }
            ]
        },
        {
            label: 'Waktu Mulai',
            name: 'startDateTime',
            type: 'time',
            rules: [
                {
                    required: true,
                    message: 'Field nama wajib di isi'
                }
            ]
        },
        {
            label: 'Waktu Selesai',
            name: 'endDateTime',
            type: 'time',
            rules: [
                {
                    required: true,
                    message: 'Field nama wajib di isi'
                }
            ]
        },
        {
            label: 'Deksripsi Kegiatan',
            name: 'deskripsiKegiatan',
            type: 'longtext',
            rules: [
                {
                    required: true,
                    message: 'Field nama wajib di isi'
                }
            ]
        },
        {
            label: 'Tautan Kegiatan',
            name: 'tautan',
            type: 'text',
        },
        {
            label: 'Bukti Aktivitas',
            name: 'files',
            type: 'upload',
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
                            Detail Data Harian
                        </Title>
                        <div>
                            <Button type="primary" icon={<PlusOutlined />} onClick={() => setModal({ modalData: null, title: 'Tambah Data', trigger: true, type: 'create' })}>
                                Tambah
                            </Button>
                        </div>
                    </div>
                    <DataTable columns={Column} data={dummyAktivitas} loading={loading} />
                    <CrudModal title={modal.title} isModalOpen={modal.trigger} data={modal.modalData} onSubmit={onSubmit} onClose={handleClose} formFields={formFields} type={modal.type}></CrudModal>
                </div>
            </Card>
        </div>
    );
};

export default page;
