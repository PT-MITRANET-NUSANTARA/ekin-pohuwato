'use client';

import { Alert, Breadcrumb, Button, Card, List, Modal, Space, Table, Typography } from 'antd';
import { PlusOutlined, EditOutlined, EyeOutlined, DeleteOutlined, DatabaseOutlined, SearchOutlined } from '@ant-design/icons';
import { DataTable, CrudModal, DataLoading, FilterField, InfoModal } from '@/components';
import React, { useEffect, useState } from 'react';
import { destroy, getAll, getByUnitId, store, update } from '@/controller/SubKegiatanController';
import { getAll as getAllKegiatan, getByUnitId as getKegiatanByUnit } from '@/controller/KegiatanController';
import { getAll as getAllProgram, getByUnitId as getProgramByUnit } from '@/controller/ProgramController';
import { getAll as getAllTujuan, getByUnitId as getTujuanByUnit } from '@/controller/TujuanController';
import { getAll as getAllRenstra, getByUnitId as getRenstraByUnit } from '@/controller/RenstraController';
import useFetchData from '@/hooks/useFetchData';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { dateFormatter } from '@/utils';
import { getData } from '@/controller/AuthorizationController';
import { formatDateToDayMonthYear } from '@/utils/util';
import useNotification from '@/app/hook/useNotification';


const { Title } = Typography;

const page = () => {
    const router = useRouter();
    const [modal, setModal] = useState({ trigger: false, modalData: null, title: '', formFields: [] });
    const [infoModal, setInfoModal] = useState({ trigger: false, title: '', onClose: () => { }, data: null, type: '', isLoading: false, column: [] });

    const [indikatorModal, setIndikatorModal] = useState({ trigger: false, modalData: [] });
    const [alert, setAlert] = useState({ show: false, message: null, description: null, type: 'info' });
    const { success, error } = useNotification()

    const [kegiatan, setKegiatan] = useState(null);
    const [renstra, setRenstra] = useState(null);
    const [tujuan, setTujuan] = useState(null);
    const [program, setProgram] = useState(null);
    const [submitLoading, setSubmitLoading] = useState(false);

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, filters: {}, total: 0 });
    const { data: user, setData: setUser } = useFetchData(getData);


    useEffect(() => {
        if (user) {
            fetchData();
        }
    }, [user, pagination.page, pagination.limit]);

    const fetchData = async () => {
        try {
            const data = await getByUnitId(user.jabatan?.unor?.induk.id, pagination.page, pagination.limit, pagination.filters);
            setData(data.data.data);
            setPagination({ ...pagination, page: data.data.pagination.currentPage, limit: data.data.pagination.pageSize, total: data.data.pagination.totalItems });
            const kegiatan = await getKegiatanByUnit(user.jabatan?.unor?.induk.id);
            const renstra = await getRenstraByUnit(user.jabatan?.unor?.induk.id);
            const tujuan = await getTujuanByUnit(user.jabatan?.unor?.induk.id);
            const program = await getProgramByUnit(user.jabatan?.unor?.induk.id);
            setRenstra(renstra.data);
            setTujuan(tujuan.data);
            setProgram(program.data);
            setKegiatan(kegiatan.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
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
                    response = await update(id, {
                        ...dt,
                        tujuan: dt.tujuan.value ? dt.tujuan.value : dt.tujuan,
                        renstra: dt.renstra.value ? dt.renstra.value : dt.renstra,
                        program: dt.program.value ? dt.program.value : dt.program,
                        kegiatan: dt.kegiatan.value ? dt.kegiatan.value : dt.kegiatan,
                    });
                    break;

                case 'delete':
                    response = await destroy(id);
                    break;

                default:
                    throw new Error('Tipe operasi tidak valid');
            }

            if (response.ok) {
                fetchData()
                success('Berhasil', type === 'delete' ? 'Berhasil Menghapus Sub Kegiatan' : type === 'edit' ? 'Berhasil Mengedit Sub Kegiatan' : 'Berhasil Menambahkan Sub Kegiatan')

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
            title: 'Kegiatan',
            dataIndex: 'kegiatan',
            key: 'kegiatan',
            render: (_, record) => (
                <Button
                    icon={<SearchOutlined />}
                    onClick={() => {
                        setInfoModal({
                            title: 'Informasi Kegiatan',
                            trigger: true,
                            type: 'desc',
                            data: [
                                {
                                    key: 'name',
                                    label: 'Nama Kegiatan',
                                    children: record.kegiatan.name
                                },
                                {
                                    key: 'total_anggaran',
                                    label: 'Total Anggaran',
                                    children: record.kegiatan.total_anggaran
                                }
                            ],
                            isLoading: false,
                            onClose: () => setInfoModal({ ...infoModal, trigger: false, data: null })
                        });
                    }}
                >
                    Info
                </Button>
            )
        },
        {
            title: 'Nama',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.length - b.name.length
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
            title: 'Total Anggaran',
            dataIndex: 'total_anggaran',
            key: 'total_anggaran',
            sorter: (a, b) => a.total_anggaran.length - b.total_anggaran.length
        },

        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="small">
                    <Button
                        onClick={() => {
                            setInfoModal({
                                title: 'Informasi Subkegiatan',
                                trigger: true,
                                type: 'desc',
                                data: [
                                    {
                                        key: 'name',
                                        label: 'Nama Subkegiatan',
                                        children: record.name
                                    },
                                    {
                                        key: 'name_kegiatan',
                                        label: 'Nama Kegiatan',
                                        children: record.kegiatan.name
                                    },
                                    {
                                        key: 'total_anggaran',
                                        label: 'Total Anggaran',
                                        children: record.total_anggaran
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
                        // type='primary'
                        size="middle"
                        color="default"
                        icon={<EyeOutlined />}
                    />
                    <Button
                        onClick={() =>
                            setModal({
                                trigger: true,
                                modalData: {
                                    ...record,
                                    renstra: {
                                        label: `${formatDateToDayMonthYear(record.kegiatan.program.tujuan.renstra.periode_start)} - ${formatDateToDayMonthYear(record.kegiatan.program.tujuan.renstra.periode_end)}`,
                                        value: record.kegiatan.program.tujuan.renstra._id
                                    },
                                    tujuan: {
                                        label: record.kegiatan.program.tujuan.name,
                                        value: record.kegiatan.program.tujuan._id
                                    },
                                    program: {
                                        label: record.kegiatan.program.name,
                                        value: record.kegiatan.program._id
                                    },
                                    kegiatan: {
                                        label: record.kegiatan.name,
                                        value: record.kegiatan._id
                                    }
                                },
                                title: `Edit Program ${record._id}`,
                                type: 'edit',
                                formFields: formFields
                            })
                        }
                        // type='primary'
                        size="middle"
                        variant="outlined"
                        color="primary"
                        icon={<EditOutlined />}
                    />

                    <Button
                        onClick={() =>
                            setModal({
                                trigger: true,
                                modalData: {
                                    ...record,
                                    renstra: {
                                        label: `${formatDateToDayMonthYear(record.kegiatan.program.tujuan.renstra.periode_start)} - ${formatDateToDayMonthYear(record.kegiatan.program.tujuan.renstra.periode_end)}`,
                                        value: record.kegiatan.program.tujuan.renstra._id
                                    },
                                    tujuan: {
                                        label: record.kegiatan.program.tujuan.name,
                                        value: record.kegiatan.program.tujuan._id
                                    },
                                    program: {
                                        label: record.kegiatan.program.name,
                                        value: record.kegiatan.program._id
                                    },
                                    kegiatan: {
                                        label: record.kegiatan.name,
                                        value: record.kegiatan._id
                                    }
                                },
                                title: `Edit Program ${record._id}`,
                                type: 'delete',
                                formFields: formFields
                            })
                        }
                        // type='primary'
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
            options: renstra?.map((item) => ({
                label: `${formatDateToDayMonthYear(item.periode_start)} - ${formatDateToDayMonthYear(item.periode_end)}`,
                value: item._id,
                id: item._id
            }))
        },
        {
            label: 'Tujuan',
            name: 'tujuan',
            type: 'select',
            rules: [
                {
                    required: true,
                    message: 'Field tujuan wajib di isi'
                }
            ],
            options: tujuan?.map((item) => ({
                label: item.name,
                value: item._id,
                id_option_parent: item.renstra._id,
                id: item._id
            })),
            parentField: 'renstra'
        },
        {
            label: 'Program',
            name: 'program',
            type: 'select',
            rules: [
                {
                    required: true,
                    message: 'Field program wajib di isi'
                }
            ],
            options: program?.map((item) => ({
                label: item.name,
                value: item._id,
                id_option_parent: item.tujuan._id,
                id: item._id
            })),
            parentField: 'tujuan'
        },
        {
            label: 'Kegiatan',
            name: 'kegiatan',
            type: 'select',
            rules: [
                {
                    required: true,
                    message: 'Field kegiatan wajib di isi'
                }
            ],
            options: kegiatan?.map((item) => ({
                label: item.name,
                value: item._id,
                id_option_parent: item.program._id,
                id: item._id
            })),
            parentField: 'program'
        },
        {
            label: 'Sub Kegiatan',
            name: 'name',
            type: 'longtext',
            rules: [
                {
                    required: true,
                    message: 'Field sub kegiatan wajib di isi'
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
        },
        {
            label: 'Total Anggaran',
            name: 'total_anggaran',
            type: 'number',
            rules: [
                {
                    required: true,
                    message: 'Field total anggaran selesai wajib di isi'
                }
            ],
            min: 0
        }
    ];

    const kegiatanFields = [
        {
            label: 'Kegiatan',
            name: 'name',
            type: 'text'
        }
    ];

    const onFilter = async (values) => {
        filterFileds.forEach((field) => {
            let value = values[field.name];
            if (value !== undefined && value !== null) {
                switch (field.type) {
                    case 'date':
                        value = formatDateToDayMonthYear(value);
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

    const filterFileds = [
        {
            label: 'Renstra',
            name: 'renstra',
            type: 'select',
            filter: 'eq',
            options: renstra?.map((item) => ({
                label: `${formatDateToDayMonthYear(item.periode_start)} - ${formatDateToDayMonthYear(item.periode_end)}`,
                value: item._id,
                id: item._id
            }))
        },
        {
            label: 'Tujuan',
            name: 'tujuan',
            type: 'select',
            filter: 'eq',
            options: tujuan?.map((item) => ({
                label: item.name,
                value: item._id,
                id_option_parent: item.renstra._id,
                id: item._id
            })),
        },
        {
            label: 'Program',
            name: 'program',
            type: 'select',
            filter: 'eq',
            options: program?.map((item) => ({
                label: item.name,
                value: item._id,
                id_option_parent: item.tujuan._id,
                id: item._id
            })),
        },
        {
            label: 'Kegiatan',
            name: 'kegiatan',
            type: 'select',
            fitler: 'eq',
            options: kegiatan?.map((item) => ({
                label: item.name,
                value: item._id,
                id_option_parent: item.program._id,
                id: item._id
            })),
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
            {loading ? (
                <DataLoading loadingData={loading} />
            ) : (
                <Card className="">
                    <div className="flex flex-col">
                        <div className="flex items-center justify-between mb-12">
                            <Title className="mt-2" level={5}>
                                Data Sub Kegiatan
                            </Title>
                            <div>
                                <Button type="primary" icon={<PlusOutlined />} onClick={() => setModal({ modalData: null, title: 'Tambah Data', trigger: true, type: 'create', formFields: formFields })}>
                                    Tambah
                                </Button>
                            </div>
                        </div>
                        <div className="w-full">
                            <FilterField fields={filterFileds} onSubmit={onFilter}></FilterField>
                        </div>
                        <div className="overflow-x-auto">
                            <DataTable columns={Column} data={data} loading={loading} setPagination={setPagination} pagination={pagination} />
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
