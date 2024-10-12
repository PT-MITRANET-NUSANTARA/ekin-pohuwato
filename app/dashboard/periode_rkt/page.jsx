'use client';

import { CrudModal, DataTable } from '@/components';
import { dummyPeriodePenilaian } from '@/data/dummyData';
import { Alert, Breadcrumb, Button, Card, Space, Typography, Upload } from 'antd';
import { PlusOutlined, EditOutlined, EyeOutlined, DeleteOutlined, DatabaseOutlined, UploadOutlined, DownloadOutlined } from '@ant-design/icons';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { destroy, getAll, store, update, getByUnitId } from '@/controller/PeriodeRKTController';
import useFetchData from '@/hooks/useFetchData';
const { Title } = Typography;
import { store as upload } from '@/controller/DokumentController';
import { getData } from '@/controller/AuthorizationController';
import { getByNIP } from '@/controller/IDSN/JabatanController';
const page = () => {
    const router = useRouter();
    const { data, setData } = useFetchData(getData);
    const [dt, setDT] = useState([]);
    const [unor, setUnor] = useState(null);
    const [modal, setModal] = useState({ trigger: false, modalData: null, title: '', formFields: [], onSubmit: () => {} });
    const [alert, setAlert] = useState({ show: false, message: null, description: null, type: 'info' });

    const [loadingData, setLoadingData] = useState(true);
    useEffect(() => {
        if (data) {
            fetchData();
        }
    }, [data]);

    const fetchData = async () => {
        try {
            const jabatan = await getByNIP(data?.token, data?.user.nipBaru);
            const selectedJabatan = jabatan.mapData.data[0];
            setUnor(selectedJabatan.unor.induk);
            const dt = await getByUnitId(selectedJabatan.unor.id);
            setDT(dt.data);
            setLoadingData(false);
        } catch (error) {
            console.log(error);
        }
    };

    const onSubmit = async (values, type, id, formData) => {
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
                    response = await destroy(dt);
                    break;

                default:
                    throw new Error('Tipe operasi tidak valid');
            }
            console.log(response);

            if (response.ok) {
                const newData = await getByUnitId(unor.id);
                setDT(newData.data);
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

        console.log('Operation completed');
        handleClose();
    };

    const customSubmit = (values, type, id, formData) => {
        console.log(values)
        const query = new URLSearchParams(values).toString();
        router.push(`/document/${id}/perjanjian_kinerja?${query}`);
    };

    const perjanjianSubmit = async (values, type, id, listImage) => {
        const periode = dt.find((item) => item._id === id);
        periode.perjanjianKinerja = listImage;
        console.log('PERIODE',periode);
        const response = await update(id, periode);
        console.log(response);
        
        if (response.ok) {
            const newData = await getByUnitId(unor.id);
            setDT(newData.data);
            setAlert({
                show: true,
                message: response.msg,
                description: 'Berhasil Mengupload Perjanjian Kinerja',
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
        handleClose();
    }

    const Column = [
        {
            title: 'ID',
            dataIndex: '_id',
            key: '_id',
            sorter: (a, b) => a._id.length - b._id.length,
            width: '10%'
        },
        {
            title: 'Periode Mulai',
            dataIndex: 'periode_start',
            key: 'periode_start',
            sorter: (a, b) => a.content.length - b.content.length,
            width: '30%'
        },
        {
            title: 'Periode Selesai',
            dataIndex: 'periode_end',
            key: 'periode_end',
            sorter: (a, b) => a.content.length - b.content.length,
            width: '30%'
        },
        {
            title: 'Perjanjian Kinerja',
            dataIndex: 'perjanjianKinerja',
            key: 'perjanjianKinerja',
            sorter: (a, b) => a.content.length - b.content.length,
            width: '30%',
            render: (_, record) => (
                <>
                    {console.log(record)}
                    <Space size="small">
                        <Button icon={<UploadOutlined />} onClick={() => setModal({ trigger: true, modalData: record, title: `Upload ${record._id}`, type: 'edit', formFields: perjanjianFields, onSubmit: perjanjianSubmit })}></Button>
                        <Button
                            // type='primary'
                            size="middle"
                            color="default"
                            onClick={() => setModal({ trigger: true, modalData: record, title: `Upload ${record._id}`, type: 'edit', formFields: formPerjanjian, onSubmit: customSubmit })}
                            icon={<EyeOutlined />}
                        />
                        <Button
                            // type='primary'
                            size="middle"
                            color="default"
                            onClick={() => router.push('/document/1/perjanjian_kinerja')}
                            icon={<DownloadOutlined />}
                        />
                    </Space>
                </>
            )
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="small">
                    <Button
                        onClick={() => setModal({ trigger: true, modalData: record, title: `Periode RKT ${record._id}`, type: 'show', formFields: rktFields, onSubmit: onSubmit })}
                        // type='primary'
                        size="middle"
                        color="default"
                        icon={<EyeOutlined />}
                    />
                    <Button
                        onClick={() => setModal({ trigger: true, modalData: record, title: `Edit Periode RKT ${record._id}`, type: 'edit', formFields: rktFields, onSubmit: onSubmit })}
                        // type='primary'
                        size="middle"
                        color="primary"
                        variant="outlined"
                        icon={<EditOutlined />}
                    />

                    <Button
                        onClick={() => setModal({ trigger: true, modalData: record, title: `Delete Periode RKT ${record._id}`, type: 'delete', formFields: rktFields, onSubmit: onSubmit })}
                        // type='primary'
                        size="middle"
                        danger
                        icon={<DeleteOutlined />}
                    />
                    <Button
                        onClick={() => router.push(`/dashboard/rkt/${record._id}/`)}
                        // type='primary'
                        size="middle"
                        color="primary"
                        variant="outlined"
                        icon={<DatabaseOutlined />}
                    />
                </Space>
            )
        }
    ];

    const rktFields = [
        {
            label: 'Periode Mulai',
            name: 'periode_start',
            type: 'date',
            rules: [
                {
                    required: true,
                    message: 'Field periode mulai wajib di isi'
                }
            ],
            min: 1,
            max: 3000
        },
        {
            label: 'Periode Selesai',
            name: 'periode_end',
            type: 'date',
            rules: [
                {
                    required: true,
                    message: 'Field periode selesai wajib di isi'
                }
            ],
            min: 1,
            max: 3000
        }
    ];

    const perjanjianFields = [
        {
            label: 'Perjanjian Kinerja',
            name: 'perjanjian',
            type: 'upload',
            rules: [
                {
                    required: true,
                    message: 'Field perjanjian kinerja mulai wajib di isi'
                }
            ]
        }
    ];

    const formPerjanjian = [
        {
            label: 'Nama pihak pertama',
            name: 'nama_pihak_pertama',
            type: 'text',
            rules: [
                {
                    required: true,
                    message: 'Field nama pihak pertama wajib di isi'
                }
            ]
        },
        {
            label: 'Jabatan pihak pertama',
            name: 'jabatan_pihak_pertama',
            type: 'text',
            rules: [
                {
                    required: true,
                    message: 'Field jabatan pihak pertama wajib di isi'
                }
            ]
        },
        {
            label: 'Nama pihak kedua',
            name: 'nama_pihak_kedua',
            type: 'text',
            rules: [
                {
                    required: true,
                    message: 'Field nama pihak kedua wajib di isi'
                }
            ]
        },
        {
            label: 'Jabatan pihak kedua',
            name: 'jabatan_pihak_kedua',
            type: 'text',
            rules: [
                {
                    required: true,
                    message: 'Field jabatan pihak kedua wajib di isi'
                }
            ]
        },
        {
            label: 'Tanggal',
            name: 'tanggal',
            type: 'date',
            rules: [
                {
                    required: true,
                    message: 'Field tanggal wajib di isi'
                }
            ]
        },
        {
            label: 'Tempat',
            name: 'tempat',
            type: 'text',
            rules: [
                {
                    required: true,
                    message: 'Field tempat wajib di isi'
                }
            ]
        },
    
       
    ]

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
                            Data Periode RKT
                        </Title>
                        <div>
                            <Button type="primary" icon={<PlusOutlined />} onClick={() => setModal({ modalData: null, title: 'Tambah Data', trigger: true, type: 'create', formFields: rktFields, onSubmit: onSubmit })}>
                                Tambah
                            </Button>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <DataTable columns={Column} data={dt} loading={loadingData} />
                    </div>
                    <CrudModal title={modal.title} onSubmit={modal.onSubmit} isModalOpen={modal.trigger} onClose={handleClose} data={modal.modalData} formFields={modal.formFields} type={modal.type} />
                </div>
            </Card>
        </div>
    );
};

export default page;
