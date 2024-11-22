'use client';

import { Alert, Breadcrumb, Button, Card, Modal, Space, Table, Tag, Typography } from 'antd';
import { PlusOutlined, EditOutlined, EyeOutlined, DeleteOutlined, DatabaseOutlined, SearchOutlined } from '@ant-design/icons';
import { DataTable, CrudModal } from '@/components';
import React, { useEffect, useState } from 'react';
import { destroy, getAll, store, update } from '@/controller/SubKegiatanController';
import { getAll as getAllKegiatan } from '@/controller/KegiatanController';
import { getAll as getAllProgram } from '@/controller/ProgramController';
import { getAll as getAllTujuan } from '@/controller/TujuanController';
import { getAll as getAllRenstra } from '@/controller/RenstraController';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { dummyTpp } from '@/data/dummyData';

const { Title } = Typography;

const page = () => {
    const router = useRouter();
    // const { data, setData, loading, msg, status } = useFetchData(getAll);
    const [modal, setModal] = useState({ trigger: false, modalData: null, title: '', formFields: [] });
    const [alert, setAlert] = useState({ show: false, message: null, description: null, type: 'info' });

    const [kegiatan, setKegiatan] = useState(null);
    const [renstra, setRenstra] = useState(null);
    const [tujuan, setTujuan] = useState(null);
    const [program, setProgram] = useState(null);

    // useEffect(() => {
    //     if (data) {
    //         fetchData();
    //     }
    // }, [data]);

    const fetchData = async () => {
        try {
            const kegiatan = await getAllKegiatan();
            const renstra = await getAllRenstra();
            const tujuan = await getAllTujuan();
            const program = await getAllProgram();
            setRenstra(renstra.data);
            setTujuan(tujuan.data);
            setProgram(program.data);
            setKegiatan(kegiatan.data);
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
                    description: type === 'delete' ? 'Berhasil Menghapus Sub Kegiatan' : type === 'edit' ? 'Berhasil Mengedit Sub Kegiatan' : 'Berhasil Menambahkan Sub Kegiatan',
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
            title: 'Unit Organisasi',
            dataIndex: 'unit_organisasi',
            key: 'unit_organisasi',
            sorter: (a, b) => a.unit_organisasi.length - b.unit_organisasi.length
        },
        {
            title: 'ID ASN',
            dataIndex: 'idasn',
            key: 'idasn',
            sorter: (a, b) => a.idasn.length - b.idasn.length
        },
        {
            title: 'namaa',
            dataIndex: 'nama',
            key: 'nama',
            sorter: (a, b) => a.nama.length - b.nama.length
        },
        {
            title: 'Jabatan',
            dataIndex: 'jabatan',
            key: 'jabatan',
            sorter: (a, b) => a.jabatan.length - b.jabatan.length
        },
        {
            title: 'Status Kehadiran',
            dataIndex: 'status',
            key: 'status',
            sorter: (a, b) => a.status.length - b.status.length,
            width: '30%',
            render: (_, { status }) => (
                <>
                    {(() => {
                        switch (status) {
                            case 'menerima':
                                return (
                                    <Tag color="blue" className="capitalize">
                                        {status}
                                    </Tag>
                                );
                            case 'tidak menerima':
                                return (
                                    <Tag color="red" className="capitalize">
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
            render: (_, record) => (
                <Space size="small">
                    <Button
                        onClick={() => setModal({ trigger: true, modalData: record, title: `Sub Kegiatan ${record._id}`, type: 'show', formFields: formFields })}
                        // type='primary'
                        size="middle"
                        color="default"
                        icon={<EyeOutlined />}
                    />
                    <Button
                        onClick={() => setModal({ trigger: true, modalData: record, title: `Edit Sub Kegiatan ${record._id}`, type: 'edit', formFields: formFields })}
                        // type='primary'
                        size="middle"
                        variant="outlined"
                        color="primary"
                        icon={<EditOutlined />}
                    />

                    <Button
                        onClick={() => setModal({ trigger: true, modalData: record, title: `Delete Sub Kegiatan ${record._id}`, type: 'delete', formFields: formFields })}
                        // type='primary'
                        size="middle"
                        danger
                        icon={<DeleteOutlined />}
                    />

                    {/* <Button
                        onClick={() => router.push(`/dashboard/kegiatans/${record._id}`)}
                        // type='primary'
                        size="middle"
                        color="primary"
                        variant="outlined"
                        icon={<DatabaseOutlined />}
                    /> */}
                </Space>
            )
        }
    ];

    const formFields = [
        {
            label: 'Pegawai',
            name: 'pegawai',
            type: 'select',
            rules: [
                {
                    required: true,
                    message: 'Field pegawai wajib di isi'
                }
            ],
            options: [
                {
                    label: 'pegawai a',
                    value: '001'
                }
            ]
        },
        {
            label: 'Status',
            name: 'status',
            type: 'select',
            rules: [
                {
                    required: true,
                    message: 'Field status wajib di isi'
                }
            ],
            options: [
                {
                    label: 'diterima',
                    value: 'diterima'
                },
                {
                    label: 'tidak diterima',
                    value: 'tidak diterima'
                }
            ]
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
                            Data TPP
                        </Title>
                        <div>
                            <Button type="primary" icon={<PlusOutlined />} onClick={() => setModal({ modalData: null, title: 'Tambah Data', trigger: true, type: 'create', formFields: formFields })}>
                                Tambah
                            </Button>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <DataTable columns={Column} data={dummyTpp} loading={false} />
                    </div>
                    <CrudModal title={modal.title} isModalOpen={modal.trigger} data={modal.modalData} onSubmit={onSubmit} onClose={handleClose} formFields={modal.formFields} type={modal.type} />
                </div>
            </Card>
        </div>
    );
};

export default page;
