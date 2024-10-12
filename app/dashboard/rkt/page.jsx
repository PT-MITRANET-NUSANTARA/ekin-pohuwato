'use client';

import { Alert, Breadcrumb, Button, Card, Space, Table, Typography } from 'antd';
import { PlusOutlined, EditOutlined, EyeOutlined, DeleteOutlined, DatabaseOutlined } from '@ant-design/icons';
import { DataTable, CrudModal } from '@/components';
import React, { useEffect, useState } from 'react';
import { destroy, getAll, store, update, getByUnitId } from '@/controller/RKTController';
import useFetchData from '@/hooks/useFetchData';
import { getAll as getAllSub } from '@/controller/SubKegiatanController';
import { getAll as getAllPeriode } from '@/controller/PeriodeRKTController';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getData } from '@/controller/AuthorizationController';
import { getByNIP } from '@/controller/IDSN/JabatanController';

const { Title } = Typography;


const page = () => {
    const router = useRouter();
    const [dt, setDT] = useState([])
    const {data, setData, loading}  = useFetchData(getData) 
    const [modal, setModal] = useState({ trigger: false, modalData: null, title: '' });
    const [alert, setAlert] = useState({ show: false, message: null, description: null, type: 'info' });
    const [periodeRKT, setPeriodeRKT] = useState(null);
    const [subKegiatan, setSubkegiatans] = useState(null);
    const [unor, setUnor] = useState(null);

    useEffect(() => {
        if (data) {
            fetchData();
        }
    }, [data]);

    const fetchData = async () => {
        try {
            const sub = await getAllSub();
            const periode = await getAllPeriode();
  
            const jabatan = await getByNIP(data?.token, data?.user.nipBaru);
            const selectedJabatan = jabatan.mapData.data[0];
            console.log(selectedJabatan);
            setUnor(selectedJabatan.unor.induk);
            const dt = await getByUnitId(selectedJabatan.unor.id);

            setDT(dt.data)
            setPeriodeRKT(periode.data);
            setSubkegiatans(sub.data);
        } catch (error) {
            console.log(error);
        }
    };
    
    const onSubmit = async (values, type, id) => {
        try {
            let response;
            let dt = values;
            dt = { ...dt, unit: unor };
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
                const newData = await getByUnitId(unor.id);
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
            title: 'Periode RKT',
            dataIndex: 'periodeRKT',
            key: 'periodeRKT',
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
            
                return (
                    <Space size="small">
                        <Button
                            onClick={() => setModal({ 
                                trigger: true, 
                                modalData: record, // Data yang sudah di-reverse transform
                                title: `Edit Renstra ${record._id}`, 
                                type: 'edit' 
                            })}
                            size="middle"
                            icon={<EditOutlined />}
                        />
                        <Button
                            onClick={() => setModal({ 
                                trigger: true, 
                                modalData: record, // Data yang sudah di-reverse transform
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
                                modalData: record, // Data yang sudah di-reverse transform
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

    const formFields = [
        {
            label: 'Periode RKT', 
            name: 'periodeRKT',
            type: 'select',
            rules: [
                {
                    required: true,
                    message: 'Field nama wajib di isi'
                }
            ],
            options : periodeRKT?.map((item) => ({ value: item._id, label: item.periode_start + ' - ' + item.periode_end }))
        },
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
            options : subKegiatan?.map((item) => ({ value: item._id, label: item.name }))
        },
        {
            label: 'Nama',
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
            label: 'Input',
            name: 'input',
            type: 'repeater',
            obj: { name: 'longtext', target: 'number', satuan: 'string' },
            rules: [
                {
                    required: true,
                    message: 'Field nama wajib di isi'
                }
            ]
        },
       

        {
            label: 'Output',
            name: 'output',
            type: 'repeater',
            obj: { name: 'longtext', target: 'number', satuan: 'string' },
            rules: [
                {
                    required: true,
                    message: 'Field nama wajib di isi'
                }
            ]
        },
       

        {
            label: 'Outcome',
            name: 'outcome',
            type: 'repeater',
            obj: { name: 'longtext', target: 'number', satuan: 'string' },
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
            min: 1
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
