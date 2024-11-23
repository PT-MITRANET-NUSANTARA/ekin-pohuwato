'use client';

import { Alert, Breadcrumb, Button, Card, Modal, Space, Table, Tag, Typography } from 'antd';
import { PlusOutlined, EditOutlined, EyeOutlined, DeleteOutlined, DatabaseOutlined, SearchOutlined } from '@ant-design/icons';
import { DataTable, CrudModal } from '@/components';
import React, { useEffect, useState } from 'react';
import { destroy, getAll, getByUnitId, store, update } from '@/controller/TPPController';
import { getAll as getAllPeriode } from '@/controller/PeriodeRKTController';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { dummyTpp } from '@/data/dummyData';
import useFetchData from '@/hooks/useFetchData';
import { getData } from '@/controller/AuthorizationController';
import { getAllPosjabByUnit, getByNIP } from '@/controller/IDSN/JabatanController';
import { dateFormatter } from '@/utils';

const { Title } = Typography;

const page = () => {
    const router = useRouter();
    const { data, setData, msg, status } = useFetchData(getData);
    const [modal, setModal] = useState({ trigger: false, modalData: null, title: '', formFields: [] });
    const [alert, setAlert] = useState({ show: false, message: null, description: null, type: 'info' });

    const [periode, setPeriode] = useState(null);
    const [pegawai, setPegawai] = useState(null);
    const [loading, setLoading] = useState(true);
    const [tpp, setTpp] = useState(null);
    const [unor, setUnor] = useState(null);
    useEffect(() => {
        if (data) {
            fetchData();
        }
    }, [data]);

    const fetchData = async () => {
        try {
            const jabatan = await getByNIP(data.token, data.user.nipBaru);
            const selectedJabatan = jabatan.mapData.data[0];
            const struktur = await getAllPosjabByUnit(data.token, selectedJabatan.unor.induk.id);
            setPegawai(struktur.mapData.data);
            const periode = await getAllPeriode(selectedJabatan.unor.induk.id);
            setPeriode(periode.data);
            setUnor(selectedJabatan.unor.induk.id);
            const tpp = await getByUnitId(selectedJabatan.unor.induk.id);
            setTpp(tpp.data);
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    };

    console.log(pegawai);
    

    const onSubmit = async (values, type, id) => {
        try {
            let response;
            const jabatan = pegawai.find((item) => item.id_asn === values.pegawai);
            const dt = {
                periodeRKT: values.periodeRKT,
                jabatan: jabatan,
                unit: jabatan.unor,
                user_id : jabatan.id_asn,
                status: values.status
            };

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

            console.log(response);
            if (response.ok) {
                const data = await getByUnitId(unor);
                setTpp(data.data);
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
            title: 'ID ASN',
            dataIndex: ['jabatan', 'id_asn'],
            key: 'idasn',
            sorter: (a, b) => a.idasn.length - b.idasn.length
        },
        {
            title: 'Unit Organisasi',
            dataIndex: ['unit', 'nama'],
            key: 'unit_organisasi',
            sorter: (a, b) => a.unit_organisasi.length - b.unit_organisasi.length
        },
        {
            title: 'Nama',
            dataIndex: ['jabatan', 'nama_asn'],
            key: 'nama',
            sorter: (a, b) => a.nama.length - b.nama.length
        },
        {
            title: 'Jabatan',
            dataIndex: ['jabatan', 'nama_jabatan'],
            key: 'jabatan',
            sorter: (a, b) => a.jabatan.length - b.jabatan.length
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            sorter: (a, b) => a.status.length - b.status.length,
            width: '30%',
            render: (_, { status }) => (
                <>
                    {(() => {
                       if (status) {
                           return <Tag color="green">Menerima</Tag>;
                       }
                       else
                          {
                            return <Tag color="red">Tidak Menerima</Tag>;
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
            label: 'Periode RKT',
            name: 'periodeRKT',
            type: 'select',
            rules: [
                {
                    required: true,
                    message: 'Field pegawai wajib di isi'
                }
            ],
            options : periode?.map((item) => ({
                label: `${dateFormatter(item.periode_start)} - ${dateFormatter(item.periode_end)}`,
                value: item._id,
                id: item._id
            }))
        },

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
            options : pegawai?.map((item) => ({
                label: item.nama_asn,
                value: item.id_asn,
                id: item.id_asn
            }))
            
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
                    label: 'Menerima',
                    value: true
                },
                {
                    label: 'Tidak Menerima',
                    value: false
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
                        <DataTable columns={Column} data={tpp} loading={loading} />
                    </div>
                    <CrudModal title={modal.title} isModalOpen={modal.trigger} data={modal.modalData} onSubmit={onSubmit} onClose={handleClose} formFields={modal.formFields} type={modal.type} />
                </div>
            </Card>
        </div>
    );
};

export default page;
