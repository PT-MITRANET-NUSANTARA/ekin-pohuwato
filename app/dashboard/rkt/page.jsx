'use client';

import { Alert, Breadcrumb, Button, Card, Modal, Space, Table, Typography } from 'antd';
import { PlusOutlined, EditOutlined, EyeOutlined, DeleteOutlined, DatabaseOutlined, SearchOutlined } from '@ant-design/icons';
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
    const [dt, setDT] = useState([]);
    const { data, setData } = useFetchData(getData);
    const [modal, setModal] = useState({ trigger: false, modalData: null, title: '' });
    const [customModal, setCustomModal] = useState({ trigger: false, modalData: null });
    const [alert, setAlert] = useState({ show: false, message: null, description: null, type: 'info' });
    const [periodeRKT, setPeriodeRKT] = useState(null);
    const [subKegiatan, setSubkegiatans] = useState(null);
    const [unor, setUnor] = useState(null);
    const [loadingData, setLoadingData] = useState(true);

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
            const dt = await getByUnitId(selectedJabatan.unor.induk.id);

            setDT(dt.data);
            setPeriodeRKT(periode.data);
            setSubkegiatans(sub.data);
            setLoadingData(false);
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
                const newData = await getByUnitId(unor.induk.id);
                setDT(newData.data);
                setAlert({
                    show: true,
                    message: response.msg,
                    description: type === 'delete' ? 'Berhasil Menghapus RKT' : type === 'edit' ? 'Berhasil Mengedit RKT' : 'Berhasil Menambahkan RKT',
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

    const nana = {
        _id: '670a7f089d7ed2c9e143348f',
        periodeRKT: '670a7ebe9d7ed2c9e1433470',
        subKegiatan: '670a7e9c9d7ed2c9e143344f',
        name: 'asdasd',
        input: [
            {
                name: '2',
                target: 2,
                satuan: '2',
                _id: '670a7f089d7ed2c9e1433490'
            }
        ],
        output: [
            {
                name: '2',
                target: 2,
                satuan: '2',
                _id: '670a7f089d7ed2c9e1433491'
            }
        ],
        outcome: [
            {
                name: '2',
                target: 2,
                satuan: '2',
                _id: '670a7f089d7ed2c9e1433492'
            }
        ],
        unit: {
            id: '8ae482a75a4bd60d015a4d1931d72258',
            id_simpeg: 2171,
            nama: 'BADAN KEPEGAWAIAN DAN PENGEMBANGAN SUMBER DAYA MANUSIA'
        },
        total_anggaran: 2,
        createdAt: '2024-10-12T13:52:08.248Z',
        updatedAt: '2024-10-12T13:52:08.248Z',
        __v: 0
    };

    const Column = [
        {
            title: 'ID',
            dataIndex: '_id',
            key: '_id',
            sorter: (a, b) => a._id.length - b._id.length,
            width: '5%'
        },
        {
            title: 'Periode RKT',
            dataIndex: 'periodeRKT',
            key: 'periodeRKT',
            sorter: (a, b) => a._id.length - b._id.length,
            width: '5%'
        },
        {
            title: 'Sub Kegiatan',
            dataIndex: 'subKegiatan',
            key: 'subKegiatan',
            sorter: (a, b) => a._id.length - b._id.length,
            width: '5%'
        },
        {
            title: 'Input',
            dataIndex: 'input',
            key: 'input',
            width: '30%',
            render: (_, record) => (
                <Button icon={<SearchOutlined />} onClick={() => setCustomModal({ modalData: record.input, trigger: true })}>
                    Info
                </Button>
            )
        },
        {
            title: 'Output',
            dataIndex: 'output',
            key: 'output',
            width: '30%',
            render: (_, record) => (
                <Button icon={<SearchOutlined />} onClick={() => setCustomModal({ modalData: record.output, trigger: true })}>
                    Info
                </Button>
            )
        },
        {
            title: 'Outcome',
            dataIndex: 'outcome',
            key: 'outcome',
            width: '30%',
            render: (_, record) => (
                <Button icon={<SearchOutlined />} onClick={() => setCustomModal({ modalData: record.outcome, trigger: true })}>
                    Info
                </Button>
            )
        },
        {
            title: 'Total Anggaran',
            dataIndex: 'total_anggaran',
            key: 'total_anggaran',
            sorter: (a, b) => a.total_anggaran - b.total_anggaran,
            width: '30%'
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => {
                // Lakukan reverse transform pada data

                return (
                    <Space size="small">
                        <Button
                            onClick={() =>
                                setModal({
                                    trigger: true,
                                    modalData: record, // Data yang sudah di-reverse transform
                                    title: `Renstra ${record._id}`,
                                    type: 'show'
                                })
                            }
                            size="middle"
                            color="default"
                            icon={<EyeOutlined />}
                        />
                        <Button
                            onClick={() =>
                                setModal({
                                    trigger: true,
                                    modalData: record, // Data yang sudah di-reverse transform
                                    title: `Edit Renstra ${record._id}`,
                                    type: 'edit'
                                })
                            }
                            size="middle"
                            variant="outlined"
                            color="primary"
                            icon={<EditOutlined />}
                        />

                        <Button
                            onClick={() =>
                                setModal({
                                    trigger: true,
                                    modalData: record, // Data yang sudah di-reverse transform
                                    title: `Delete Renstra ${record._id}`,
                                    type: 'delete'
                                })
                            }
                            size="middle"
                            danger
                            icon={<DeleteOutlined />}
                        />
                        <Button onClick={() => router.push(`/dashboard/programs/${record._id}`)} size="middle" color="primary" variant="outlined" icon={<DatabaseOutlined />} />
                    </Space>
                );
            }
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
                    message: 'Field nama wajib di isi'
                }
            ],
            options: periodeRKT?.map((item) => ({ value: item._id, label: item.periode_start + ' - ' + item.periode_end }))
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
            options: subKegiatan?.map((item) => ({ value: item._id, label: item.name }))
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
                            Data RKT
                        </Title>
                        <div>
                            <Button type="primary" icon={<PlusOutlined />} onClick={() => setModal({ modalData: null, title: 'Tambah Data', trigger: true, type: 'create' })}>
                                Tambah
                            </Button>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <DataTable columns={Column} data={dt} loading={loadingData} />
                    </div>
                    <CrudModal title={modal.title} isModalOpen={modal.trigger} data={modal.modalData} onSubmit={onSubmit} onClose={handleClose} formFields={formFields} type={modal.type} />
                    <Modal open={customModal.trigger} onCancel={() => setCustomModal({ modalData: null, trigger: false })} footer={null}>
                        {customModal.modalData ? (
                            <Table
                                className="mt-8"
                                dataSource={customModal.modalData.map((item, index) => ({
                                    ...item,
                                    key: index
                                }))}
                                pagination={false}
                                bordered
                                columns={[
                                    {
                                        title: 'Name',
                                        dataIndex: 'name',
                                        key: 'name'
                                    },
                                    {
                                        title: 'Target',
                                        dataIndex: 'target',
                                        key: 'target'
                                    },
                                    {
                                        title: 'Satuan',
                                        dataIndex: 'satuan',
                                        key: 'satuan'
                                    }
                                ]}
                            />
                        ) : null}
                    </Modal>
                </div>
            </Card>
        </div>
    );
};

export default page;
