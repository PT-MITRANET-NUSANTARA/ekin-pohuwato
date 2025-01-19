'use client';

import { Alert, Breadcrumb, Button, Card, List, Modal, Skeleton, Space, Table, Typography } from 'antd';
import { PlusOutlined, EditOutlined, EyeOutlined, DeleteOutlined, DatabaseOutlined, SearchOutlined } from '@ant-design/icons';
import { DataTable, CrudModal, DataLoading, FilterField, InfoModal } from '@/components';
import React, { useEffect, useState } from 'react';
import { destroy, getAll, store, update, getByUnitId } from '@/controller/RKTController';
import useFetchData from '@/hooks/useFetchData';
import { getAll as getAllSub } from '@/controller/SubKegiatanController';
import { getAll as getAllPeriode } from '@/controller/PeriodeRKTController';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getData } from '@/controller/AuthorizationController';
import { getByNIP } from '@/controller/IDSN/JabatanController';
import { dateFormatter } from '@/utils';

const { Title } = Typography;

const page = () => {
    const router = useRouter();
    const [modal, setModal] = useState({ trigger: false, modalData: null, title: '' });
    const [infoModal, setInfoModal] = useState({ trigger: false, title: '', onClose: () => { }, data: null, type: '', isLoading: false, column: [] });

    const [customModal, setCustomModal] = useState({ trigger: false, modalData: null });
    const [alert, setAlert] = useState({ show: false, message: null, description: null, type: 'info' });
    const [periodeRKT, setPeriodeRKT] = useState(null);
    const [subKegiatan, setSubkegiatans] = useState(null);
    const [unor, setUnor] = useState(null);
    const [loadingData, setLoadingData] = useState(true);
    const [submitLoading, setSubmitLoading] = useState(false);

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, filters: {}, total: 0 });


    useEffect(() => {
        fetchData();
    }, [pagination.page, pagination.limit]);

    const fetchData = async () => {
        try {
            const data = await getAll(pagination.page, pagination.limit, pagination.filters);
            setData(data.data.data);
            setPagination({ ...pagination, page: data.data.pagination.currentPage, limit: data.data.pagination.pageSize, total: data.data.pagination.totalItems });
            const sub = await getAllSub();
            const periode = await getAllPeriode();
            const jabatan = await getByNIP(data?.token, data?.user.nipBaru);
            const selectedJabatan = jabatan.mapData.data[0];
            setUnor(selectedJabatan.unor.induk);
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
            console.log(dt);
            setSubmitLoading(true);

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
                fetchData()
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
        setSubmitLoading(false);

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
            title: 'Output',
            dataIndex: 'output',
            key: 'output',
            render: (_, record) => (
                <Button icon={<SearchOutlined />} onClick={() => setCustomModal({ modalData: record.output, trigger: true })}>
                    Info
                </Button>
            )
        },
        {
            title: 'Input',
            dataIndex: 'input',
            key: 'input',
            render: (_, record) => (
                <Button icon={<SearchOutlined />} onClick={() => setCustomModal({ modalData: record.input, trigger: true })}>
                    Info
                </Button>
            )
        },
        {
            title: 'Outcome',
            dataIndex: 'outcome',
            key: 'outcome',
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
            sorter: (a, b) => a.total_anggaran - b.total_anggaran
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => {
                // Lakukan reverse transform pada data

                return (
                    <Space size="small">
                        <Button
                            onClick={() => {
                                setInfoModal({
                                    title: 'Informasi Kegiatan',
                                    trigger: true,
                                    type: 'desc',
                                    data: [
                                        {
                                            key: 'name',
                                            label: 'Nama RKT',
                                            children: record.name
                                        },
                                        {
                                            key: 'total_anggaran',
                                            label: 'Total Anggaran',
                                            children: record.total_anggaran
                                        },
                                        {
                                            key: 'unit_organisasi',
                                            label: 'Unit Organisasi',
                                            children: record.unit.nama
                                        },
                                        {
                                            key: 'input',
                                            label: 'Input',
                                            children: (
                                                <List
                                                    dataSource={record.input}
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
                                        },
                                        {
                                            key: 'output',
                                            label: 'Output',
                                            children: (
                                                <List
                                                    dataSource={record.output}
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
                                        },
                                        {
                                            key: 'outcome',
                                            label: 'Outcome',
                                            children: (
                                                <List
                                                    dataSource={record.outcome}
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
                        {/* <Button onClick={() => router.push(`/dashboard/programs/${record._id}`)} size="middle" color="primary" variant="outlined" icon={<DatabaseOutlined />} /> */}
                    </Space>
                );
            }
        }
    ];

    const onFilter = async (values) => {
        filterFileds.forEach((field) => {
            let value = values[field.name];
            if (value !== undefined && value !== null) {
                switch (field.type) {
                    case 'date':
                        value = dateFormatter(value);
                        break;

                    default:
                        value = value;
                        break;
                }

                switch (field.filter) {
                    case 'gte':
                        pagination.filters[field.name] = { $gte: value };
                        break;
                    case 'lte':
                        pagination.filters[field.name] = { $lte: value };
                        break;
                    case 'gt':
                        pagination.filters[field.name] = { $gt: value };
                        break;
                    case 'lt':
                        pagination.filters[field.name] = { $lt: value };
                        break;
                    case 'eq':
                        pagination.filters[field.name] = value; // Equality
                        break;
                    case 'ne':
                        pagination.filters[field.name] = { $ne: value };
                        break;
                    case 'in':
                        pagination.filters[field.name] = { $in: Array.isArray(value) ? value : [value] };
                        break;
                    case 'nin':
                        pagination.filters[field.name] = { $nin: Array.isArray(value) ? value : [value] };
                        break;
                    case 'regex':
                        pagination.filters[field.name] = { $regex: value, $options: 'i' }; // Case-insensitive regex
                        break;
                    case 'exists':
                        pagination.filters[field.name] = { $exists: Boolean(value) };
                        break;
                    default:
                        console.warn(`Unsupported filter type: ${field.filter}`);
                }
            } else {
                if (pagination.filters.hasOwnProperty(field.name)) {
                    delete pagination.filters[field.name];
                }
            }
        });
        fetchData();
    };

    const formFields = [
        {
            label: 'Periode RKT',
            name: 'periodeRKT',
            type: 'select',
            rules: [
                {
                    required: true,
                    message: 'Field periode rkt wajib di isi'
                }
            ],
            options: periodeRKT?.map((item) => ({ value: item._id, label: dateFormatter(item.periode_start) + ' - ' + dateFormatter(item.periode_end) }))
        },
        {
            label: 'Sub  Kegiatan',
            name: 'subKegiatan',
            type: 'select',
            rules: [
                {
                    required: true,
                    message: 'Field sub kegiatan wajib di isi'
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
                    message: 'Field input wajib di isi'
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
                    message: 'Field output wajib di isi'
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
                    message: 'Field outcome wajib di isi'
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
                    message: 'Field total anggaran wajib di isi'
                }
            ],
            min: 1
        }
    ];

    const filterFileds = [
        {
            label: 'Periode RKT',
            name: 'periodeRKT',
            type: 'select',
            filter: 'eq',
            options: periodeRKT?.map((item) => ({ value: item._id, label: dateFormatter(item.periode_start) + ' - ' + dateFormatter(item.periode_end) }))
        },
        {
            label: 'Sub  Kegiatan',
            name: 'subKegiatan',
            type: 'select',
            filter: 'eq',
            options: subKegiatan?.map((item) => ({ value: item._id, label: item.name }))
        },
    ];

    const handleClose = () => {
        setModal({ trigger: false, modalData: null });
    };

    console.log(dt);

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
            {loadingData ? (
                <DataLoading loadingData={loadingData} />
            ) : (
                <Card className="">
                    <div className="flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                            <Title className="mt-2" level={5}>
                                Data RKT
                            </Title>
                            <div>
                                <Button type="primary" icon={<PlusOutlined />} onClick={() => setModal({ modalData: null, title: 'Tambah Data', trigger: true, type: 'create' })}>
                                    Tambah
                                </Button>
                            </div>
                        </div>
                        <div className="w-full">
                            <FilterField fields={filterFileds} onSubmit={onFilter}></FilterField>
                        </div>
                        <div className="overflow-x-auto">
                            <DataTable columns={Column} data={data} setPagination={setPagination} pagination={pagination} />
                        </div>
                        <CrudModal isLoading={submitLoading} title={modal.title} isModalOpen={modal.trigger} data={modal.modalData} onSubmit={onSubmit} onClose={handleClose} formFields={formFields} type={modal.type} />
                        <InfoModal width={600} close={infoModal.onClose} data={infoModal.data} isModalOpen={infoModal.trigger} title={infoModal.title} columns={infoModal.column} isLoading={infoModal.isLoading} type={infoModal.type} />
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
            )}
        </div>
    );
};

export default page;
