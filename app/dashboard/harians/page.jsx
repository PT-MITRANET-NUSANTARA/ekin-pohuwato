'use client';

import { Alert, Breadcrumb, Button, Card, message, Space, Table, Tag, Typography } from 'antd';
import { PlusOutlined, EditOutlined, EyeOutlined, DeleteOutlined, DatabaseOutlined, ReloadOutlined } from '@ant-design/icons';
import { DataTable, CrudModal } from '@/components';
import React, { useEffect, useState } from 'react';
import { destroy, getAll, store, update, getByUserId } from '@/controller/AbsenceController';
import useFetchData from '@/hooks/useFetchData';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { dummyHarian } from '@/data/dummyData';
import { dateFormatter } from '@/utils';
import { getData } from '@/controller/AuthorizationController';
import dayjs from 'dayjs';

const { Title } = Typography;

const page = () => {
    const router = useRouter();
    const { data ,msg, status } = useFetchData(getData);
    const [modal, setModal] = useState({ trigger: false, modalData: null, title: '' });
    const [alert, setAlert] = useState({ show: false, message: null, description: null, type: 'info' });
    const [absence, setAbsence] = useState(null); 
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (data) {
            fetchData();
        } 
    }, [data]);

    const fetchData = async () => {
        try {
            const absence = await getByUserId(data.user.idASN );
            setAbsence(absence.data);
            setLoading(false);
        } catch (error) {
            
        }
    }


    const onSubmit = async (values, type, id) => {
        try {
            let response;
            
            const dt = { ...values, user_id : data.user.idASN  };
            console.log(dt);
            switch (type) {
                case 'create':
                    response = await store(data.user.idASN  , dt);
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
                const absence = await getByUserId(data.user.idASN );
                setAbsence(absence.data);
                setAlert({
                    show: true,
                    message: response.msg,
                    description: type === 'delete' ? 'Berhasil Menghapus Absence' : type === 'edit' ? 'Berhasil Mengedit Absence' : 'Berhasil Menambahkan Absence',
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
            title: 'Tanggal',
            dataIndex: 'date',
            key: 'date',
            render: (record) => dateFormatter(record)
            
        },
        {
            title: 'Status Kehadiran',
            dataIndex: 'status',
            key: 'status',
            render: (_, { status }) => (
                <>
                    {(() => {
                        switch (status) {
                            case 'hadir':
                                return (
                                    <Tag color="blue" className="capitalize">
                                        {status}
                                    </Tag>
                                );
                            case 'alpa':
                                return (
                                    <Tag color="red" className="capitalize">
                                        {status}
                                    </Tag>
                                );
                            case 'izin':
                                return (
                                    <Tag color="yellow" className="capitalize">
                                        {status}
                                    </Tag>
                                );
                            default:
                                return (
                                    <Tag color="error" className="capitalize">
                                        {status}
                                    </Tag>
                                );
                        }
                    })()}
                </>
            ),
            searchable: true
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => {
                const query = new URLSearchParams(record).toString();
                return (
                    <Space size="small">
                        <Button
                            onClick={() => router.push(`/dashboard/harians/${record._id}/aktivitas?${query}`)}
                            // type='primary'
                            size="middle"
                            color="primary"
                            variant="outlined"
                            icon={<DatabaseOutlined />}
                        />
                    </Space>
                );
            }
        }
    ];

    const formFields = [
        {
            label: 'Status',
            name: 'status',
            type: 'select',
            options: [
                {
                    label: 'Hadir',
                    value: 'Hadir'
                },
                {
                    label: 'Izin',
                    value: 'Sakit'
                },
                {
                    label: 'Sakit',
                    value: 'Izin'
                },
                {
                    label: 'Alpha',
                    value: 'Alpha'
                }
            ],
            rules: [
                {
                    required: true,
                    message: "Field status wajib di isi",
                }
            ]
        },
        {
            label: 'Tanggal',
            name: 'date',
            type: 'date',
            extra: { maxDate: dayjs(), minDate: dayjs() },
            rules: [
                {
                    required: true,
                    message: 'Field periode mulai wajib di isi'
                }
            ],

        },
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
                            Data Harian
                        </Title>
                        <div className="flex items-center gap-x-2">
                            <Button type="primary" icon={<PlusOutlined />} onClick={() => setModal({ trigger: true, title: 'create', type: 'create' })}>
                                Tambah Absence
                            </Button>
                        </div>
                    </div>
                    <DataTable columns={Column} data={absence} loading={loading} />
                    <CrudModal title={modal.title} isModalOpen={modal.trigger} data={modal.modalData} onSubmit={onSubmit} onClose={handleClose} formFields={formFields} type={modal.type}></CrudModal>
                </div>
            </Card>
        </div>
    );
};

export default page;
