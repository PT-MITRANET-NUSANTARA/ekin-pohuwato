'use client';

import { Button, Card, message, Space, Table, Tag, Typography } from 'antd';
import { PlusOutlined, EditOutlined, EyeOutlined, DeleteOutlined, DatabaseOutlined, ReloadOutlined } from '@ant-design/icons';
import { DataTable, CrudModal, FilterField, DataLoading } from '@/components';
import React, { useEffect, useState } from 'react';
import { destroy, getAll, store, update, getByUserId, getByUnitId } from '@/controller/AbsenceController';
import useFetchData from '@/hooks/useFetchData';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { dummyHarian } from '@/data/dummyData';
import { dateFormatter } from '@/utils';
import { getData } from '@/controller/AuthorizationController';
import dayjs from 'dayjs';
import { getAllPosjabByUnit } from '@/controller/IDSN/JabatanController';
import useNotification from '@/app/hook/useNotification';

const { Title } = Typography;

const page = () => {
    const router = useRouter();
    const [modal, setModal] = useState({ trigger: false, modalData: null, title: '' });
    const [absence, setAbsence] = useState(null);
    const [loading, setLoading] = useState(false);
    const { data: user, setData: setUser } = useFetchData(getData);
    const [data, setData] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, filters: {}, total: 0 });
    const [unor, setUnor] = useState(null);
    const { success, error } = useNotification()
    const [submitLoading, setSubmitLoading] = useState(false)


    useEffect(() => {
        if (user) {
            fetchData();
        }
    }, [user, pagination.page, pagination.limit]);

    const fetchData = async () => {
        setLoading(true)
        try {
            const data = await getByUnitId(user.jabatan.unor.induk.id);
            const unit = await getAllPosjabByUnit(user.token, user.jabatan.unor.induk.id);
            setUnor(unit.mapData.data);
            setData(data.data.data);
            setPagination({ ...pagination, page: data.data.pagination.currentPage, limit: data.data.pagination.pageSize, total: data.data.pagination.totalItems });
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (values, type, id) => {
        setSubmitLoading(true)
        try {
            let response;

            const dt = { ...values, unit: user.jabatan.unor.induk, jabatan: unor.find((item) => item.nip_asn == values.user_id) };
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
                success('Berhasil', type === 'delete' ? 'Berhasil Menghapus Absen' : type === 'edit' ? 'Berhasil Mengedit Absen' : 'Berhasil Menambahkan Absen')
            } else {
                if (Array.isArray(response.data)) {
                    response.data.forEach((err) => {
                        error('Gagal', err);
                    });
                } else {
                    error('Gagal', response.data);
                }
            }
        } catch (error) {
            error('Gagal', response.data);
        }
        setSubmitLoading(false)
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
            title: 'Nama',
            dataIndex: 'name',
            key: 'name',
            render: (_, record) => record.jabatan.nama_asn
        },
        {
            title: 'NIP',
            dataIndex: 'nip',
            key: 'nip',
            render: (_, record) => record.user_id
        },
        {
            title: 'Tanggal',
            dataIndex: 'date',
            key: 'date',
            render: (record) => dateFormatter(record)
        },
        {
            title: 'Status Kehadiran',
            dataIndex: 'status',
            key: 'status',
            render: (_, { status }) => (
                <>
                    {(() => {
                        switch (status) {
                            case 'Hadir':
                                return (
                                    <Tag color="blue" className="capitalize">
                                        {status}
                                    </Tag>
                                );
                            case 'Dinas diluar':
                                return (
                                    <Tag color="green" className="capitalize">
                                        {status}
                                    </Tag>
                                );
                            case 'Izin':
                                return (
                                    <Tag color="yellow" className="capitalize">
                                        {status}
                                    </Tag>
                                );

                            case 'Sakit':
                                return (
                                    <Tag color="orange" className="capitalize">
                                        {status}
                                    </Tag>
                                );
                            case 'Tanpa Keterangan':
                                return (
                                    <Tag color="red" className="capitalize">
                                        {status}
                                    </Tag>
                                );
                            default:
                                return (
                                    <Tag color="error" className="capitalize">
                                        undefined
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
            render: (_, record) => {
                const query = new URLSearchParams(record).toString();
                return (
                    <Space size="small">
                        <Button
                            onClick={() => setModal({ trigger: true, title: 'Hapus Data Absensi', type: 'edit', modalData: { ...record, date: dateFormatter(record.date) } })}
                            // type='primary'
                            size="middle"
                            variant="outlined"
                            icon={<EditOutlined />}
                        />
                        <Button 
                             onClick={() => 
                                setModal({ 
                                    trigger: true, 
                                    title: 'Hapus Data Absensi', 
                                    type: 'delete', 
                                    modalData: { ...record, date: dateFormatter(record.date) } 
                                })
                            }
                            // type='primary'
                            size="middle"
                            variant="outlined"
                            icon={<DeleteOutlined />}
                        />
                        <Button
                            onClick={() => router.push(`/dashboard/harians/${record._id}/aktivitas?${query}`)}
                            // type='primary'
                            size="middle"
                            variant="outlined"
                        >
                            Detail
                        </Button>
                        

                    </Space>
                );
            }
        }
    ];

    const formFields = [
        {
            label: 'Pilih Pegawai',
            name: 'user_id',
            type: 'select',
            options: unor?.map((item) => ({
                label: item.nama_asn,
                value: item.nip_asn
            })),
            rules: [
                {
                    required: true,
                    message: 'Field pegawai wajib di isi'
                }
            ]
        },
        {
            label: 'Status',
            name: 'status',
            type: 'select',
            options: [
                {
                    label: 'Hadir',
                    value: 'Hadir'
                },
                {
                    label: 'Tanpa Keterangan',
                    value: 'Tanpa Keterangan'
                },
                {
                    label: 'Dinas Luar',
                    value: 'Dinas'
                },
                {
                    label: 'Sakit',
                    value: 'Sakit'
                },
                {
                    label: 'Izin',
                    value: 'Izin'
                }
            ],
            rules: [
                {
                    required: true,
                    message: 'Field status wajib di isi'
                }
            ]
        },
        {
            label: 'Tanggal',
            name: 'date',
            type: 'date',
            // extra: { maxDate: dayjs(), minDate: dayjs() },
            rules: [
                {
                    required: true,
                    message: 'Field tanggal mulai wajib di isi'
                }
            ]
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

    const filterFileds = [
        {
            label: 'Status',
            name: 'status',
            type: 'select',
            filter: 'eq',
            options: [
                {
                    label: 'Hadir',
                    value: 'Hadir'
                },
                {
                    label: 'Izin',
                    value: 'Sakit'
                },
                {
                    label: 'Sakit',
                    value: 'Izin'
                },
                {
                    label: 'Alpha',
                    value: 'Alpha'
                }
            ]
        }
    ];

    const handleClose = () => {
        setModal({ trigger: false, modalData: null });
    };

    return (
        <div className="w-full flex flex-col gap-y-4">
            {loading ? (
                <DataLoading loadingData={loading} />
            ) : (
                <Card className="">
                    <div className="flex flex-col">
                        <div className="flex items-center justify-between mb-12">
                            <Title className="mt-2" level={5}>
                                Data Harian
                            </Title>
                            <div className="flex items-center gap-x-2">
                                <Button type="primary" icon={<PlusOutlined />} onClick={() => setModal({ trigger: true, title: 'create', type: 'create' })}>
                                    Tambah Absen
                                </Button>
                            </div>
                        </div >
                        <div className="w-full">
                            <FilterField fields={filterFileds} onSubmit={onFilter}></FilterField>
                        </div>
                        <div className="overflow-x-auto">
                            <DataTable columns={Column} data={data} loading={loading} />
                        </div>
                        <CrudModal title={modal.title} isModalOpen={modal.trigger} data={modal.modalData} onSubmit={onSubmit} onClose={handleClose} formFields={formFields} type={modal.type} isLoading={submitLoading}></CrudModal>
                    </div >
                </Card >
            )}

        </div>
    );
};

export default page;
