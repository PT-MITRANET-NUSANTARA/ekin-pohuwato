'use client';

import { Alert, Breadcrumb, Button, Card, List, Modal, Skeleton, Space, Table, Typography } from 'antd';
import { PlusOutlined, EditOutlined, EyeOutlined, DeleteOutlined, DatabaseOutlined, SearchOutlined } from '@ant-design/icons';
import { DataTable, CrudModal, DataLoading, FilterField, InfoModal } from '@/components';
import React, { useEffect, useState } from 'react';
import { destroy, getAll, store, update, getByUnitId } from '@/controller/RKTController';
import useFetchData from '@/hooks/useFetchData';
import { getAll as getAllSub, getByUnitId as getSubByUnit } from '@/controller/SubKegiatanController';
import { getAll as getAllPeriode, getByUnitId as getPeriodeByUnit } from '@/controller/PeriodeRKTController';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getAll as getAllRenstra, getByUnitId as getRenstraByUnit } from '@/controller/RenstraController';

import { getData } from '@/controller/AuthorizationController';
import { dateFormatter } from '@/utils';
import { formatDateToDayMonthYear } from '@/utils/util';
import useNotification from '@/app/hook/useNotification';

const { Title } = Typography;

const page = () => {
    const router = useRouter();
    const [modal, setModal] = useState({ trigger: false, modalData: null, title: '' });
    const [infoModal, setInfoModal] = useState({ trigger: false, title: '', onClose: () => {}, data: null, type: '', isLoading: false, column: [] });
    const [customModal, setCustomModal] = useState({ trigger: false, modalData: null });
    const { success, error } = useNotification();

    const [periodeRKT, setPeriodeRKT] = useState(null);
    const [subKegiatan, setSubkegiatans] = useState(null);
    const [loadingData, setLoadingData] = useState(true);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [renstra, setRenstra] = useState(null);

    const [data, setData] = useState([]);
    const { data: user } = useFetchData(getData);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, filters: {}, total: 0 });

    useEffect(() => {
        if (user) {
            fetchData();
        }
    }, [user, pagination.page, pagination.limit]);

    const fetchData = async () => {
        try {
            setLoadingData(true);

            const unitId = user.jabatan?.unor?.induk.id;

            const [mainData, sub, renstra, periode] = await Promise.all([getByUnitId(unitId, pagination.page, pagination.limit, pagination.filters), getSubByUnit(unitId), getRenstraByUnit(unitId), getPeriodeByUnit(unitId)]);

            setData(mainData.data.data);
            setPagination((prev) => ({
                ...prev,
                page: mainData.data.pagination.currentPage,
                limit: mainData.data.pagination.pageSize,
                total: mainData.data.pagination.totalItems
            }));
            setPeriodeRKT(periode.data);
            setSubkegiatans(sub.data);
            setRenstra(renstra.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoadingData(false);
        }
    };

    const onSubmit = async (values, type, id) => {
        try {
            let response;
            let dt = values;
            dt = { ...dt, unit: user.jabatan.unor.induk };
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

            if (response.ok) {
                fetchData();
                success('Berhasil', type === 'delete' ? 'Berhasil Menghapus RKT' : type === 'edit' ? 'Berhasil Mengedit RKT' : 'Berhasil Menambahkan RKT');
            } else {
                if (Array.isArray(response.data)) {
                    response.data.forEach((err) => {
                        error('Gagal', err);
                    });
                } else {
                    error('Gagal', response.data);
                }
            }
        } catch (err) {
            error('Gagal', err.message);
        }
        setSubmitLoading(false);

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
            title: 'Nama RKT',
            dataIndex: 'name',
            width: '10%'
        },
        {
            title: 'Label RKT',
            dataIndex: 'label',
            width: '10%'
        },
        {
            title: 'Sub Kegiatan',
            dataIndex: 'subKegiatan',
            key: 'subKegiatan',
            // width: '30%',
            render: (_, record) => (
                <>
                    <Button icon={<SearchOutlined />} onClick={() => {
                        setInfoModal({
                            title: 'Informasi Sub Kegiatan',
                            trigger: true,
                            type: 'desc',
                            data: [
                                {
                                    key: 'subKegiatan',
                                    label: 'Sub Kegiatan',
                                    children: (
                                        <List
                                            dataSource={record.subKegiatan}
                                            renderItem={(item) => (
                                                <List.Item>
                                                    <div className="flex flex-col">
                                                        <Typography.Text>{item.name}</Typography.Text>
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
                    }}>
                        Info
                    </Button>
                </>
            )
        },
        {
            title: 'Rencana Anggaran',
            dataIndex: 'total_anggaran',
            key: 'total_anggaran',
            sorter: (a, b) => a.total_anggaran - b.total_anggaran
        },
        {
            title: 'Indikator',
            key: 'indikator',
            render: (_, record) => (
                <Space>
                    <Button icon={<SearchOutlined />} onClick={() => setCustomModal({ modalData: record.output, trigger: true })}>
                        Output
                    </Button>
                    <Button icon={<SearchOutlined />} onClick={() => setCustomModal({ modalData: record.input, trigger: true })}>
                        Input
                    </Button>
                    <Button icon={<SearchOutlined />} onClick={() => setCustomModal({ modalData: record.outcome, trigger: true })}>
                        Outcome
                    </Button>
                </Space>
            )
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
                                            label: 'Rencana Anggaran',
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
                                                                <Typography.Title style={{ color: '#5E9EA0' }} level={5} className="m-0">
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
                                                                <Typography.Title style={{ color: '#5E9EA0' }} level={5} className="m-0">
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
                                                                <Typography.Title style={{ color: '#5E9EA0' }} level={5} className="m-0">
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
                                    modalData: { ...record, renstra: record.periodeRKT.renstra, periodeRKT: record.periodeRKT._id, subKegiatan: record.subKegiatan?.map((item) => ({ value: item._id, label: item.name }))}, // Data yang sudah di-reverse transform
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
                                    modalData: { ...record, renstra: record.periodeRKT.renstra, periodeRKT: record.periodeRKT._id,subKegiatan: record.subKegiatan?.map((item) => ({ value: item._id, label: item.name })) }, // Data yang sudah di-reverse transform
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
            label: 'Renstra',
            name: 'renstra',
            type: 'select',
            rules: [
                {
                    required: true,
                    message: 'Field renstra wajib di isi'
                }
            ],
            options: renstra?.map((item) => ({
                label: `${formatDateToDayMonthYear(item.periode_start)} - ${formatDateToDayMonthYear(item.periode_end)}`,
                value: item._id,
                id: item._id
            }))
        },
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
            parentField: 'renstra',
            options: periodeRKT?.map((item) => ({
                label: `${formatDateToDayMonthYear(item.periode_start) + ' - ' + formatDateToDayMonthYear(item.periode_end)}`,
                value: item._id,
                id_option_parent: item.renstra?._id,
                id: item._id
            }))
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
            options: subKegiatan?.map((item) => ({ value: item._id, label: item.name })),
            mode: 'multiple'
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
            label: 'Label RKT',
            name: 'label',
            type: 'select',
            rules: [
                {
                    required: true,
                    message: 'Field sub kegiatan wajib di isi'
                }
            ],
            options: [
                {
                    value: 'KINERJA BERBASIS ANGGARAN',
                    label: 'KINERJA BERBASIS ANGGARAN'
                },
                {
                    value: 'KINERJA NON ANGGARAN',
                    label: 'KINERJA NON ANGGARAN'
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
            label: 'Rencana Anggaran',
            name: 'total_anggaran',
            type: 'number',
            rules: [
                {
                    required: true,
                    message: 'Field rencana anggaran wajib di isi'
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
            options: periodeRKT?.map((item) => ({ value: item._id, label: formatDateToDayMonthYear(item.periode_start) + ' - ' + formatDateToDayMonthYear(item.periode_end) }))
        },
        {
            label: 'Sub  Kegiatan',
            name: 'subKegiatan',
            type: 'select',
            filter: 'eq',
            options: subKegiatan?.map((item) => ({ value: item._id, label: item.name }))
        }
    ];

    const handleClose = () => {
        setModal({ trigger: false, modalData: null });
    };

    return (
        <div className="w-full flex flex-col gap-y-4">
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
