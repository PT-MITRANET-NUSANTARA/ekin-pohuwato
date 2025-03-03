'use client';

import { Alert, Breadcrumb, Button, Card, Space, Table, Tag, Typography } from 'antd';
import { PlusOutlined, EditOutlined, EyeOutlined, DeleteOutlined, DatabaseOutlined } from '@ant-design/icons';
import { DataTable, CrudModal } from '@/components';
import React, { useEffect, useState } from 'react';
import { destroy, getAll, store, update } from '@/controller/RenstraController';
import useFetchData from '@/hooks/useFetchData';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { dummyOrganisasi } from '@/data/dummyData';
import { getData } from '@/controller/AuthorizationController';
import { getAllPosjabByUnit } from '@/controller/IDSN/JabatanController';
import useNotification from '@/app/hook/useNotification';


const { Title } = Typography;

const page = () => {
    const router = useRouter();
    const [modal, setModal] = useState({ trigger: false, modalData: null, title: '' });
    const { success, error } = useNotification()
    const { data: user, setData: setUser } = useFetchData(getData);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if (user) {
            fetchData();
        }
    }, [user]);

    const fetchData = async () => {
        try {


            const unit = await getAllPosjabByUnit(user.token, user.jabatan.unor.induk.id);
            console.log(unit);

            // setUnor(bawahan);
            console.log(unit);

            setData(unit.mapData.data);
            // setPagination({ ...pagination, page: data.data.pagination.currentPage, limit: data.data.pagination.pageSize, total: data.data.pagination.totalItems });
            // setLoadingData(false);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
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
                success('Berhasil', type === 'delete' ? 'Berhasil Menghapus Monitoring Kinerja' : type === 'edit' ? 'Berhasil Mengedit Monitoring Kinerja' : 'Berhasil Menambahkan Monitoring Kinerja')
            } else {
                if (Array.isArray(response.data)) {
                    response.data.forEach((err) => {
                        error('Gagal', err);
                    });
                } else {
                    error('Gagal', response.data);
                }
            }
        } catch (error) {
            error('Gagal', err.message);
        }

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
            title: 'NIP',
            dataIndex: 'name',
            key: 'name',
            searchable: true,
            render: (_, record) => (
                record.nip_asn
            )
        },
        {
            title: 'Nama',
            dataIndex: 'name',
            key: 'name',
            searchable: true,
            render: (_, record) => (
                record.nama_asn
            )
        },
        {
            title: 'Unit',
            dataIndex: 'unor',
            key: 'unor',
            searchable: true,
            render: (_, record) => (
                record.unor.nama
            )
        },
        {
            title: 'Jabatan',
            dataIndex: 'jabatan',
            key: 'jabatan',
            searchable: true,
            render: (_, record) => (
                record.nama_jabatan
            )
        },

        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="small">
                    <Button
                        onClick={() => router.push(window.location.pathname + `/${record.nip_asn}`)}
                        // type='primary'
                        size="middle"
                    >
                        Detail
                    </Button>
                </Space>
            )
        }
    ];

    const formFields = [
        {
            label: 'Role',
            name: 'role',
            type: 'select',
            rules: [
                {
                    required: true,
                    message: 'Field role wajib di isi'
                }
            ],
            options: [
                {
                    label: 'Admin UMPEG',
                    value: 'admin_umpeg'
                },
                {
                    label: 'Petugas',
                    value: 'petugas'
                },
                {
                    label: 'User',
                    value: 'user'
                }
            ]
        }
    ];

    const handleClose = () => {
        setModal({ trigger: false, modalData: null });
    };

    return (
        <div className="w-full flex flex-col gap-y-4">
            {alert.show !== false && <Alert message={alert.message} description={alert.description} type={alert.type} showIcon closable />}

            <Card className="">
                <div className="flex flex-col">
                    <div className="flex items-center justify-between mb-12">
                        <Title className="mt-2" level={5}>
                            Monitoring Kinerja
                        </Title>
                    </div>
                    <DataTable columns={Column} data={data} loading={loading} />
                    <CrudModal title={modal.title} isModalOpen={modal.trigger} data={modal.modalData} onSubmit={onSubmit} onClose={handleClose} formFields={formFields} type={modal.type}></CrudModal>
                </div>
            </Card>
        </div>
    );
};

export default page;
