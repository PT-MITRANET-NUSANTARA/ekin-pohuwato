'use client';

import { Alert, Breadcrumb, Button, Card, Space, Table, Typography } from 'antd';
import { PlusOutlined, EditOutlined, EyeOutlined, DeleteOutlined, DatabaseOutlined } from '@ant-design/icons';
import { DataTable, CrudModal } from '@/components';
import React, { useCallback, useEffect, useState } from 'react';
import { destroy, getAll, store, update, getByRenstraId } from '@/controller/ProgramController';
import { getAll as getAllRenstra } from '@/controller/RenstraController';
import useFetchData from '@/hooks/useFetchData';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

const { Title } = Typography;

const page = () => {
    const router = useRouter();
    const { IdRenstra } = useParams();
    const fetchByRenstraId = useCallback(() => getByRenstraId(IdRenstra), [IdRenstra]);

    const { data, setData, loading, msg, status } = useFetchData(fetchByRenstraId);

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
            const data = await getByRenstraId(IdRenstra);
            setRenstra(data.data);
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
                    description: type === 'delete' ? 'Berhasil Menghapus Program' : type === 'edit' ? 'Berhasil Mengedit Program' : 'Berhasil Menambahkan Program',
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
            title: 'Renstra',
            dataIndex: 'renstra',
            key: 'renstra',
            sorter: (a, b) => a.renstra.length - b.renstra.length,
        },
        {
            title: 'Nama',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.length - b.name.length,
        },
        {
            title: 'Sasaran Strategis',
            dataIndex: 'sasaran_strategis',
            key: 'sasaran_strategis',
            sorter: (a, b) => a.sasaran_strategis.length - b.sasaran_strategis.length,
        },
        {
            title: 'Satuan',
            dataIndex: 'satuan',
            key: 'satuan',
            sorter: (a, b) => a.satuan.length - b.satuan.length,
        },
        {
            title: 'Target Indikator',
            dataIndex: 'target_indikator',
            key: 'target_indikator',
            sorter: (a, b) => a.target_indikator.length - b.target_indikator.length,
        },
        {
            title: 'Total Anggaran',
            dataIndex: 'total_anggaran',
            key: 'satuan',
            sorter: (a, b) => a.total_anggaran.length - b.total_anggaran.length,
        },

        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="small">
                    <Button
                        onClick={() => setModal({ trigger: true, modalData: record, title: `Edit Program ${record._id}`, type: 'edit' })}
                        // type='primary'
                        size="middle"
                        icon={<EditOutlined />}
                    />
                    <Button
                        onClick={() => setModal({ trigger: true, modalData: record, title: `Program ${record._id}`, type: 'show' })}
                        // type='primary'
                        size="middle"
                        color="default"
                        icon={<EyeOutlined />}
                    />

                    <Button
                        onClick={() => setModal({ trigger: true, modalData: record, title: `Delete Program ${record._id}`, type: 'delete' })}
                        // type='primary'
                        size="middle"
                        color="danger"
                        icon={<DeleteOutlined />}
                    />

                    <Button
                        onClick={() => router.push(`/dashboard/kegiatans/${record._id}`)}
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
            label: 'Renstra',
            name: 'renstra',
            type: 'select',
            rules: [
                {
                    required: true,
                    message: 'Field renstra wajib di isi'
                }
            ],
            options: renstra?.map((item) => ({ value: item._id, label: item.name }))
        },
        {
            label: 'Program',
            name: 'name',
            type: 'text',
            rules: [
                {
                    required: true,
                    message: 'Field program wajib di isi'
                }
            ]
        },
        {
            label: 'Sasaran Stragetis',
            name: 'sasaran_strategis',
            type: 'text',
            rules: [
                {
                    required: true,
                    message: 'Field sasaran strategis wajib di isi'
                }
            ]
        },
        {
            label: 'Indikator Kinerja',
            name: 'indikator_kinerja',
            type: 'text',
            rules: [
                {
                    required: true,
                    message: 'Field indikator kinerja wajib di isi'
                }
            ]
        },
        {
            label: 'Target Indikator',
            name: 'target_indikator',
            type: 'text',
            rules: [
                {
                    required: true,
                    message: 'Field target indikator wajib di isi'
                }
            ]
        },
        {
            label: 'Satuan',
            name: 'satuan',
            type: 'text',
            rules: [
                {
                    required: true,
                    message: 'Field satuan wajib di isi'
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
                        title: <Link href={`/dashboard/programs`}>Programs</Link>
                    },
                    {
                        title: <Link href={`/dashboard/programs/${IdRenstra}`}>{IdRenstra}</Link>
                    }
                ]}
            />
            <Card className="">
                <div className="flex flex-col">
                    <div className="flex items-center justify-between mb-12">
                        <Title className="mt-2" level={5}>
                            Data Programs {IdRenstra}
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
