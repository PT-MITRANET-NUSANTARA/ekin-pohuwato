'use client';

import { Alert, Breadcrumb, Button, Card, Space, Table, Tag, Typography } from 'antd';
import { PlusOutlined, EditOutlined, EyeOutlined, DeleteOutlined, DatabaseOutlined } from '@ant-design/icons';
import { DataTable, CrudModal } from '@/components';
import React, { useEffect, useState } from 'react';
import { getAll} from '@/controller/IDSN/UnitController';
import useFetchData from '@/hooks/useFetchData';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { dummyHarian, dummyUnit } from '@/data/dummyData';
import { getData } from '@/controller/AuthorizationController';

const { Title } = Typography;

const page = () => {
    const router = useRouter();
    const { data, setData, loading, msg, status } = useFetchData(getData);

    const [modal, setModal] = useState({ trigger: false, modalData: null, title: '' });
    const [alert, setAlert] = useState({ show: false, message: null, description: null, type: 'info' });
    const [unit, setUnit]   = useState(null);
    useEffect(() => {
        if (data) {
            fetchData();
        }
    }, [data]);

    const fetchData = async () => {
        try {
            const unit = await getAll(data.token);
            setUnit(unit.mapData)
            
        } catch (error) {
            console.log(error);
        }
    };
    console.log(unit);
    

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

    const Column = [
        {
            title: 'ID',
            dataIndex: 'idUnor',
            key: 'idUnor',
            sorter: (a, b) => a._id.length - b._id.length,
            width: '10%'
        },
        {
            title: 'Unit',
            dataIndex: 'nmUnor',
            key: 'nmUnor',
            sorter: (a, b) => a.name.length - b.name.length,
            width: '30%'
        },
        {
            title: 'Jabatan',
            dataIndex: 'jabatan',
            key: 'jabatan',
            sorter: (a, b) => a.role.length - b.role.length,
            width: '30%',
            render: (_, { role }) => (
                <>
                    {(() => {
                        switch (role) {
                            case 'Admin UMPEG':
                                return (
                                    <Tag color="blue" className="capitalize">
                                        {role}
                                    </Tag>
                                );
                            case 'Petugas':
                                return (
                                    <Tag color="red" className="capitalize">
                                        {role}
                                    </Tag>
                                );
                            case 'User':
                                return (
                                    <Tag color="yellow" className="capitalize">
                                        {role}
                                    </Tag>
                                );
                            default:
                                return (
                                    <Tag color="error" className="capitalize">
                                        {role}
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
            render: (_, record) => (
                <Space size="small">
                    <Button
                        onClick={() => setModal({ trigger: true, modalData: record, title: `Edit Admin ${record._id}`, type: 'edit' })}
                        // type='primary'
                        size="middle"
                        icon={<EditOutlined />}
                    />
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
                    message: 'Field nama wajib di isi'
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
                },
            ]
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
                            Data Admin
                        </Title>
                    </div>
                    <DataTable columns={Column} data={unit} loading={loading} />
                    <CrudModal title={modal.title} isModalOpen={modal.trigger} data={modal.modalData} onSubmit={onSubmit} onClose={handleClose} formFields={formFields} type={modal.type}></CrudModal>
                </div>
            </Card>
        </div>
    );
};

export default page;
