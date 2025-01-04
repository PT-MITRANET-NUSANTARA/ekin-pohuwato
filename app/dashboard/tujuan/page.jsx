'use client';

import { CrudModal, DataLoading, DataTable, FilterField, InfoModal, LoaderPage } from '@/components';
import { Alert, Breadcrumb, Button, Card, List, Modal, Space, Table, Tooltip, Typography } from 'antd';
import { PlusOutlined, EditOutlined, EyeOutlined, DeleteOutlined, DatabaseOutlined, SearchOutlined } from '@ant-design/icons';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import useFetchData from '@/hooks/useFetchData';
import { getAll, store, update, destroy } from '@/controller/TujuanController';
import { getAll as getAllRenstra } from '@/controller/RenstraController';
import { dateFormatter } from '@/utils';

const { Title } = Typography;

const page = () => {
    const { data, setData, msg, status } = useFetchData(getAll);
    const [modal, setModal] = useState({ trigger: false, modalData: null, title: '', formFields: [] });
    const [infoModal, setInfoModal] = useState({ trigger: false, title: '', onClose: () => {}, data: null, type: '', isLoading: false, column: [] });

    const [indikatorModal, setIndikatorModal] = useState({ trigger: false, modalData: [] });
    const [alert, setAlert] = useState({ show: false, message: null, description: null, type: 'info' });
    const [renstra, setRenstra] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitLoading, setSubmitLoading] = useState(false);

    useEffect(() => {
        if (data) {
            fetchData();
        }
    }, [data]);

    const fetchData = async () => {
        try {
            const data = await getAllRenstra();
            setRenstra(data.data);
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    };
    const onSubmit = async (values, type, id) => {
        try {
            setSubmitLoading(true);
            let response;
            const dt = values;

            console.log(dt);

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
                const data = await getAll();
                setData(data.data);
                setAlert({
                    show: true,
                    message: response.msg,
                    description: type === 'delete' ? 'Berhasil Menghapus Tujuan' : type === 'edit' ? 'Berhasil Mengedit Tujuan' : 'Berhasil Menambahkan Tujuan',
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
        setSubmitLoading(false);

        console.log('Operation completed');
        handleClose();
    };

    const mapFormDataToData = (formData) => {
        return {
            renstra: formData.renstra,
            name: formData.name,
            sasaran_strategis: formData.sasaran_strategis,
            indikator_kinerja: {
                name: formData.indikator_kinerja.name,
                target: formData.indikator_kinerja.target,
                satuan: formData.indikator_kinerja.satuan
            }
        };
    };

    const mapDataToFormData = (data) => {
        return {
            renstra: data.renstra,
            name: data.name,
            sasaran_strategis: data.sasaran_strategis,
            indikator_kinerja: data.indikator_kinerja
        };
    };

    const Column = [
        {
            title: 'No',
            dataIndex: 'index',
            render: (text, record, index) => index + 1,
            width: '5%'
        },
        {
            title: 'Tujuan',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.length - b.name.length
        },
        {
            title: 'Renstra',
            dataIndex: 'renstra',
            key: 'renstra',
            sorter: (a, b) => a.renstra.length - b.renstra.length,
            render: (_, record) => (
                <>
                    <Button
                        onClick={() => {
                            setInfoModal({
                                title: 'Informasi Renstra',
                                trigger: true,
                                type: 'desc',
                                data: [
                                    {
                                        key: 'periode_start',
                                        label: 'Periode Mulai',
                                        children: dateFormatter(record.renstra.periode_start)
                                    },
                                    {
                                        key: 'periode_end',
                                        label: 'Periode Akhir',
                                        children: dateFormatter(record.renstra.periode_end)
                                    }
                                ],
                                isLoading: false,
                                onClose: () => setInfoModal({ ...infoModal, trigger: false, data: null })
                            });
                        }}
                    >
                        Info
                    </Button>
                </>
            )
        },
        {
            title: 'Sasaran Strategis',
            dataIndex: 'sasaran_strategis',
            key: 'sasaran_strategis',
            sorter: (a, b) => a.sasaran_strategis.length - b.sasaran_strategis.length
        },
        {
            title: 'Indikator Kinerja',
            dataIndex: 'indikator_kinerja',
            key: 'indikator_kinerja',
            render: (_, record) => (
                <>
                    <Button icon={<SearchOutlined />} onClick={() => setIndikatorModal({ modalData: record.indikator_kinerja, trigger: true })}>
                        Info
                    </Button>
                    <Modal open={indikatorModal.trigger} onCancel={() => setIndikatorModal({ modalData: null, trigger: false })} footer={null}>
                        <Table
                            className="mt-8"
                            dataSource={indikatorModal.modalData?.map((item, index) => ({ ...item, key: index }))}
                            pagination={false}
                            bordered
                            columns={[
                                {
                                    title: 'Indikator',
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
                    </Modal>
                </>
            )
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="small">
                    <Button
                        onClick={() => {
                            setInfoModal({
                                title: 'Informasi Tujuan',
                                trigger: true,
                                type: 'desc',
                                data: [
                                    {
                                        key: 'name',
                                        label: 'Tujuan',
                                        children: record.name
                                    },
                                    {
                                        key: 'sasaran_strategis',
                                        label: 'Sasaran Strategis',
                                        children: record.sasaran_strategis
                                    },
                                    {
                                        key: 'renstra',
                                        label: 'Periode Renstra',
                                        children: dateFormatter(record.renstra.periode_start) + ', Sampai ' + dateFormatter(record.renstra.periode_end)
                                    },
                                    {
                                        key: 'indikator_kinerja',
                                        label: 'Indikator Kinerja',
                                        children: (
                                            <List
                                                dataSource={record.indikator_kinerja}
                                                renderItem={(item) => (
                                                    <List.Item>
                                                        <div className="flex flex-col">
                                                            <Typography.Title level={5} className="m-0">
                                                                Indikator : {item.name}
                                                            </Typography.Title>
                                                            <Typography.Text>Satuan : {item.satuan}</Typography.Text>
                                                            <Typography.Text>Target : {item.target}</Typography.Text>
                                                        </div>
                                                    </List.Item>
                                                )}
                                            />
                                        )
                                    }
                                ],
                                isLoading: false,
                                onClose: () => setInfoModal({ ...infoModal, trigger: false, data: null })
                            });
                        }}
                        size="middle"
                        icon={<EyeOutlined />}
                    />
                    <Button
                        onClick={() =>
                            setModal({
                                trigger: true,
                                modalData: { ...record, renstra: record.renstra._id },
                                title: `Edit Tujuan ${record._id}`,
                                type: 'edit',
                                formFields: formFields
                            })
                        }
                        size="middle"
                        color="primary"
                        variant="outlined"
                        icon={<EditOutlined />}
                    />

                    <Button
                        onClick={() =>
                            setModal({
                                trigger: true,
                                modalData: { ...record, renstra: record.renstra._id },
                                title: `Delete Tujuan ${record._id}`,
                                type: 'delete',
                                formFields: formFields
                            })
                        }
                        size="middle"
                        danger
                        icon={<DeleteOutlined />}
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
            options: renstra?.map((item) => ({ value: item._id, label: dateFormatter(item.periode_start) + ' - ' + dateFormatter(item.periode_end) }))
        },
        {
            label: 'Tujuan',
            name: 'name',
            type: 'longtext',
            rules: [
                {
                    required: true,
                    message: 'Field tujuan wajib di isi'
                }
            ]
        },
        {
            label: 'Sasaran Stragetis',
            name: 'sasaran_strategis',
            type: 'longtext',
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
            type: 'repeater',
            obj: { name: 'longtext', target: 'number', satuan: 'string' },
            rules: [
                {
                    required: true,
                    message: 'Field indikator kinerja wajib di isi'
                }
            ]
        }
    ];

    const renstraFields = [
        {
            label: 'Periode Mulai',
            name: 'periode_start',
            type: 'date'
        },
        {
            label: 'Periode Selesai',
            name: 'periode_end',
            type: 'date'
        }
    ];

    const filterFileds = [
        {
            id: 1,
            name: 'rentra',
            options: [
                {
                    label: 'sample',
                    value: 'sample'
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
            {loading ? (
                <DataLoading loadingData={loading} />
            ) : (
                <Card className="">
                    <div className="flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                            <Title className="mt-2" level={5}>
                                Data Tujuan
                            </Title>
                            <div>
                                <Button type="primary" icon={<PlusOutlined />} onClick={() => setModal({ modalData: null, title: 'Tambah Data', trigger: true, type: 'create', formFields: formFields })}>
                                    Tambah
                                </Button>
                            </div>
                        </div>
                        <div className="w-full">
                            <FilterField fields={filterFileds}></FilterField>
                        </div>
                        <div className="overflow-x-auto">
                            <DataTable columns={Column} data={data} />
                        </div>
                        <CrudModal isLoading={submitLoading} title={modal.title} isModalOpen={modal.trigger} data={modal.modalData} onSubmit={onSubmit} onClose={handleClose} formFields={modal.formFields} type={modal.type} />
                        <InfoModal width={600} close={infoModal.onClose} data={infoModal.data} isModalOpen={infoModal.trigger} title={infoModal.title} columns={infoModal.column} isLoading={infoModal.isLoading} type={infoModal.type} />
                    </div>
                </Card>
            )}
        </div>
    );
};

export default page;
