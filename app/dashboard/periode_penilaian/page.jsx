'use client';

import { CrudModal, DataLoading, DataTable } from '@/components';
import { dummyPeriodePenilaian } from '@/data/dummyData';
import { dateFormatter } from '@/utils';
import { Alert, Breadcrumb, Button, Card, Space, Typography } from 'antd';
import { PlusOutlined, EditOutlined, EyeOutlined, DeleteOutlined, DatabaseOutline0, DatabaseOutlined } from '@ant-design/icons';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getAll, store, destroy, update } from '@/controller/periodePenilaianController';
import { getAll as getAllSkp } from '@/controller/SKPController';
import useFetchData from '@/hooks/useFetchData';
import { getData } from '@/controller/AuthorizationController';
import { formatDateToDayMonthYear } from '@/utils/util';


const { Title } = Typography;

const page = () => {
    const router = useRouter();
    const { IdSkp } = useParams();
    const [modal, setModal] = useState({ trigger: false, modalData: null, title: '' });
    const [data, setData] = useState(null);
    const [alert, setAlert] = useState({ show: false, message: null, description: null, type: 'info' });
    const [loading, setLoading] = useState(true);
    const [submitLoading, setSubmitLoading] = useState()
    const [skp, setSkp] = useState(null);


    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const data = await getAll(IdSkp);
            const skpData = await getAllSkp();
            console.log(skpData)
            setSkp(skpData.data)
            setData(data.data);
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    };


    const onSubmit = async (values, type, id, formData) => {
        setSubmitLoading(true)
        try {
            let response;
            let dt = values;
            dt = { ...dt, skp: IdSkp };
            switch (type) {
                case 'create':
                    response = await store(dt);
                    break;

                case 'edit':
                    response = await update(id, dt);
                    break;

                case 'delete':
                    response = await destroy(dt);
                    break;

                default:
                    throw new Error('Tipe operasi tidak valid');
            }
            console.log(response);

            if (response.ok) {
                const newData = await getAll(IdSkp);
                setData(newData.data);
                setAlert({
                    show: true,
                    message: response.msg,
                    description: type === 'delete' ? 'Berhasil Menghapus Periode RKT' : type === 'edit' ? 'Berhasil Mengedit Periode RKT' : 'Berhasil Menambahkan Periode RKT',
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
        setSubmitLoading(false)


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
            title: 'Nama Periode',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: 'Periode Mulai',
            dataIndex: 'periodeStart',
            key: 'periodeStart',
            sorter: (a, b) => new Date(a.periodeStart) - new Date(b.periodeStart),
            render: (record) => dateFormatter(record)
        },
        {
            title: 'Periode Selesai',
            dataIndex: 'periodeEnd',
            key: 'periodeEnd',
            sorter: (a, b) => new Date(a.periodeEnd) - new Date(b.periodeEnd),
            render: (record) => dateFormatter(record)
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
                        onClick={() => router.push(`/dashboard/skp/${IdSkp}/periode_penilaian/${record._id}/penilaian`)}
                        // type='primary'
                        size="middle"
                        color="danger"
                    >
                        Detail
                    </Button>
                </Space>
            )
        }
    ];

    const handleClose = () => {
        setModal({ trigger: false, modalData: null });
    };

    const formFields = [
        {
            label: 'Pilih SKP',
            name: 'skp',
            type: 'select',
            rules: [
                {
                    required: true,
                    message: 'Field skp wajib di isi'
                }
            ],
            options: skp?.map((item) => ({
                label: formatDateToDayMonthYear(item.periode_awal) + ' - ' + formatDateToDayMonthYear(item.periode_akhir),
                value: item._id
            }))
        },
        {
            label: 'Nama Periode',
            name: 'name',
            type: 'text',
            rules: [
                {
                    required: true,
                    message: 'Field nama periode wajib di isi'
                }
            ]
        },
        {
            label: 'Periode Mulai',
            name: 'periodeStart',
            type: 'date',
            rules: [
                {
                    required: true,
                    message: 'Field periode mulai wajib di isi'
                }
            ]
        },
        {
            label: 'Periode Selesai',
            name: 'periodeEnd',
            type: 'date',
            rules: [
                {
                    required: true,
                    message: 'Field periode selesai wajib di isi'
                }
            ]
        }
    ];

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
                                Data Periode Penilaian
                            </Title>
                            <div>
                                <Button type="primary" icon={<PlusOutlined />} onClick={() => setModal({ modalData: null, title: 'Tambah Data', trigger: true, type: 'create' })}>
                                    Tambah
                                </Button>
                            </div>
                        </div>
                        <DataTable columns={Column} data={data} loading={loading} />
                        <CrudModal isLoading={submitLoading} title={modal.title} isModalOpen={modal.trigger} onSubmit={onSubmit} onClose={handleClose} data={modal.modalData} formFields={formFields} type={modal.type} />
                    </div>
                </Card>
            )}
        </div>
    );
};

export default page;
