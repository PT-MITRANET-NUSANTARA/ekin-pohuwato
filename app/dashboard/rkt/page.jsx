'use client';

import { Alert, Breadcrumb, Button, Card, Space, Table, Typography } from 'antd';
import { PlusOutlined, EditOutlined, EyeOutlined, DeleteOutlined, DatabaseOutlined } from '@ant-design/icons';
import { DataTable, CrudModal } from '@/components';
import React, { useEffect, useState } from 'react';
import { destroy, getAll, store, update, getByUnitId } from '@/controller/RKTController';
import useFetchData from '@/hooks/useFetchData';
import { getAll as getAllSub } from '@/controller/SubKegiatanController';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getData } from '@/controller/AuthorizationController';

const { Title } = Typography;

const transformFormData = (formData) => {
    return {
        _id : formData._id,
        subKegiatan: formData.subKegiatan,
        name: formData.name,
        input: {
            name: formData.input_name,
            target_capaian: formData.input_target_capaian,
            satuan: formData.input_satuan
        },
        output: {
            name: formData.output_name,
            target_capaian: formData.output_target_capaian,
            satuan: formData.output_satuan
        },
        outcome: {
            name: formData.outcome_name,
            target_capaian: formData.outcome_target_capaian,
            satuan: formData.outcome_satuan
        },
        total_anggaran: formData.total_anggaran
    };
};

const reverseTransformFormData = (simpleData) => {
    return {
        _id : simpleData._id,
        subKegiatan: simpleData.subKegiatan,
        name: simpleData.name,
        input_name: simpleData.input.name,
        input_target_capaian: simpleData.input.target_capaian,
        input_satuan: simpleData.input.satuan,
        output_name: simpleData.output.name,
        output_target_capaian: simpleData.output.target_capaian,
        output_satuan: simpleData.output.satuan,
        outcome_name: simpleData.outcome.name,
        outcome_target_capaian: simpleData.outcome.target_capaian,
        outcome_satuan: simpleData.outcome.satuan,
        total_anggaran: simpleData.total_anggaran
    };
};


const page = () => {
    const router = useRouter();
    const [dt, setDT] = useState([])
    const {data, setData, loading}  = useFetchData(getData) 
    const [modal, setModal] = useState({ trigger: false, modalData: null, title: '' });
    const [alert, setAlert] = useState({ show: false, message: null, description: null, type: 'info' });
    const [subkegiatans, setSubkegiatans] = useState(null);

    useEffect(() => {
        if (data) {
            fetchData();
        }
    }, [data]);

    const fetchData = async () => {
        try {
            const sub = await getAllSub();
            const dt = await getByUnitId(data.user.unor.id);
            console.log('here', dt);
            
            setDT(dt.data)
            setSubkegiatans(sub.data);
        } catch (error) {
            console.log(error);
        }
    };

    const onSubmit = async (values, type, id) => {
        try {
            let response;
            let dt = transformFormData(values);
            dt = { ...dt, unit: data.user.unor };
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
            
            if (response.ok) {
                const newData = await getByUnitId(data.user.unor.id);
                setDT(newData.data);
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
            width: '5%',
        },
        {
            title: 'Sub Kegiatan',
            dataIndex: 'subKegiatan',
            key: 'subKegiatan',
            sorter: (a, b) => a._id.length - b._id.length,
            width: '5%',
        },
        {
            title: 'Input',
            dataIndex: 'input',
            key: 'input',
            width: '30%',
            render: (input) => (
                <div>
                    <div key='name'><strong>Nama :</strong> {input['name']}</div>
                    <div key='name'><strong>Target Capaian :</strong> {input['target_capaian']}</div>
                    <div key='name'><strong>Satuan :</strong> {input['satuan']}</div>
                </div>
            ),
        },
        {
            title: 'Output',
            dataIndex: 'output',
            key: 'output',
            width: '30%',
            render: (input) => (
                <div>
                <div key='name'><strong>Nama :</strong> {input['name']}</div>
                <div key='name'><strong>Target Capaian :</strong> {input['target_capaian']}</div>
                <div key='name'><strong>Satuan :</strong> {input['satuan']}</div>
            </div>
            ),
        },
        {
            title: 'Outcome',
            dataIndex: 'outcome',
            key: 'outcome',
            width: '30%',
            render: (input) => (
                <div>
                    <div key='name'><strong>Nama :</strong> {input['name']}</div>
                    <div key='name'><strong>Target Capaian :</strong> {input['target_capaian']}</div>
                    <div key='name'><strong>Satuan :</strong> {input['satuan']}</div>
                </div>
            ),
        },
        {
            title: 'Total Anggaran',
            dataIndex: 'total_anggaran',
            key: 'total_anggaran',
            sorter: (a, b) => a.total_anggaran - b.total_anggaran,
            width: '30%',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => {
                // Lakukan reverse transform pada data
                const transformedRecord = reverseTransformFormData(record);
            
                return (
                    <Space size="small">
                        <Button
                            onClick={() => setModal({ 
                                trigger: true, 
                                modalData: transformedRecord, // Data yang sudah di-reverse transform
                                title: `Edit Renstra ${record._id}`, 
                                type: 'edit' 
                            })}
                            size="middle"
                            icon={<EditOutlined />}
                        />
                        <Button
                            onClick={() => setModal({ 
                                trigger: true, 
                                modalData: transformedRecord, // Data yang sudah di-reverse transform
                                title: `Renstra ${record._id}`, 
                                type: 'show' 
                            })}
                            size="middle"
                            color="default"
                            icon={<EyeOutlined />}
                        />
                        <Button
                            onClick={() => setModal({ 
                                trigger: true, 
                                modalData: transformedRecord, // Data yang sudah di-reverse transform
                                title: `Delete Renstra ${record._id}`, 
                                type: 'delete' 
                            })}
                            size="middle"
                            color="danger"
                            icon={<DeleteOutlined />}
                        />
                        <Button
                            onClick={() => router.push(`/dashboard/programs/${record._id}`)}
                            size="middle"
                            color="danger"
                            icon={<DatabaseOutlined />}
                        />
                    </Space>
                );
            }
            
        },
    ];

    console.log(data);
    
    

    const formFields = [
        {
            label: 'Sub  Kegiatan', 
            name: 'subKegiatan',
            type: 'select',
            rules: [
                {
                    required: true,
                    message: 'Field nama wajib di isi'
                }
            ],
            options : subkegiatans?.map((item) => ({ value: item._id, label: item.name }))
        },
        {
            label: 'Nama',
            name: 'name',
            type: 'text',
            rules: [
                {
                    required: true,
                    message: 'Field nama wajib di isi'
                }
            ]
        },
        {
            label: 'Input Nama',
            name: 'input_name',
            type: 'text',
            rules: [
                {
                    required: true,
                    message: 'Field nama wajib di isi'
                }
            ]
        },
        {
            label: 'Input Target Capaian',
            name: 'input_target_capaian',
            type: 'text',
            rules: [
                {
                    required: true,
                    message: 'Field nama wajib di isi'
                }
            ]
        },
        {
            label: 'Input Satuan',
            name: 'input_satuan',
            type: 'text',
            rules: [
                {
                    required: true,
                    message: 'Field nama wajib di isi'
                }
            ]
        },

        {
            label: 'Output Nama',
            name: 'output_name',
            type: 'text',
            rules: [
                {
                    required: true,
                    message: 'Field nama wajib di isi'
                }
            ]
        },
        {
            label: 'Output Target Capaian',
            name: 'output_target_capaian',
            type: 'text',
            rules: [
                {
                    required: true,
                    message: 'Field nama wajib di isi'
                }
            ]
        },
        {
            label: 'Output Satuan',
            name: 'output_satuan',
            type: 'text',
            rules: [
                {
                    required: true,
                    message: 'Field nama wajib di isi'
                }
            ]
        },

        {
            label: 'Outcome Nama',
            name: 'outcome_name',
            type: 'text',
            rules: [
                {
                    required: true,
                    message: 'Field nama wajib di isi'
                }
            ]
        },
        {
            label: 'Outcome Target Capaian',
            name: 'outcome_target_capaian',
            type: 'text',
            rules: [
                {
                    required: true,
                    message: 'Field nama wajib di isi'
                }
            ]
        },
        {
            label: 'Outcome Satuan',
            name: 'outcome_satuan',
            type: 'text',
            rules: [
                {
                    required: true,
                    message: 'Field nama wajib di isi'
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
                    message: 'Field nama wajib di isi'
                }
            ],
            min: 0
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
                    },
                ]}
            />
            <Card className="">
                <div className="flex flex-col">
                    <div className="flex items-center justify-between mb-12">
                        <Title className="mt-2" level={5}>
                            Data RKT
                        </Title>
                        <div>
                            <Button type="primary" icon={<PlusOutlined />} onClick={() => setModal({ modalData: null, title: 'Tambah Data', trigger: true, type: 'create' })}>
                                Tambah
                            </Button>
                        </div>
                    </div>
                    <DataTable columns={Column} data={dt} loading={loading} />
                    <CrudModal title={modal.title} isModalOpen={modal.trigger} data={modal.modalData} onSubmit={onSubmit} onClose={handleClose} formFields={formFields} type={modal.type} />
                </div>
            </Card>
        </div>
    );
};

export default page;
