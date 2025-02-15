'use client';

import { Alert, Breadcrumb, Button, Card, Space, Table, Tag, Tooltip, Typography } from 'antd';
import { PlusOutlined, EditOutlined, EyeOutlined, DeleteOutlined, DatabaseOutlined, ReloadOutlined } from '@ant-design/icons';
import { DataTable, CrudModal, DataLoading } from '@/components';
import React, { useEffect, useState } from 'react';
import { destroy, getAll, store, update } from '@/controller/RenstraController';
import useFetchData from '@/hooks/useFetchData';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { dummyAktivitas, dummyBawahan, dummyHarian } from '@/data/dummyData';
import { dateFormatter } from '@/utils';
import { getByUserId } from '@/controller/AbsenceController';
import { getData } from '@/controller/AuthorizationController';
import { getById } from '@/controller/SKPController';
import { formatDateToDayMonthYear } from '@/utils/util';
import { get } from '@/controller/SettingsController';
import { getByAbsenceDetail } from '@/controller/HarianController';

const { Title } = Typography;

const page = () => {
    const router = useRouter();
    const { idSkp, idBawahan } = useParams();
    const { IdOrganisasi, IdTanggal } = useParams();
    const [modal, setModal] = useState({ trigger: false, modalData: null, title: '' });
    const [alert, setAlert] = useState({ show: false, message: null, description: null, type: 'info' });
    const { data: user, setData: setUser } = useFetchData(getData);
    const [data, setData] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, filters: {}, total: 0 });
    const [loading, setLoading] = useState();
    useEffect(() => {
        if (user) {
            fetchData();
        }
    }, [user, pagination.page, pagination.limit]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const skp = await getById(idSkp);
            const data = await getByUserId(skp.data.user_id, pagination.page, pagination.limit, {
                ...pagination.filters,
                date: { $gte: dateFormatter(skp.data.periode_awal), $lte: dateFormatter(skp.data.periode_akhir) }
            });
            console.log(data);
            const settings = await get();

            const updateData = data.data.data.map(async (record) => {
                const res = await getByAbsenceDetail(record._id, settings.data.total_time);
                console.log(res);
                return {
                    ...record,
                    total: res.data.total,
                    mines: res.data.mines
                };
            });

            const absence = await Promise.all(updateData);

            setData(absence);
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    const onSubmit = async (values, type, id) => {
        try {
            let response;

            switch (type) {
                case 'create':
                    response = await store(values);
                    break;

                case 'edit':
                    response = await update(id, values);
                    break;

                case 'delete':
                    response = await destroy(id);
                    break;

                default:
                    throw new Error('Tipe operasi tidak valid');
            }

            if (response.ok) {
                const data = await getAll();
                setData(data.data);
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
            title: 'Tanggal',
            dataIndex: 'date',
            key: 'date',
            render: (record) => (record ? formatDateToDayMonthYear(record) : 'undifined')
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
            title: 'Total Waktu',
            dataIndex: 'total',
            key: 'total'
        },
        {
            title: 'Sisa Waktu',
            dataIndex: 'mines',
            key: 'mines'
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => {
                return (
                    <Space size="small">
                        <Button
                            onClick={() => router.push(`/dashboard/monitoring_kinerja/${idBawahan}/${idSkp}/${record._id}`)}
                            // type='primary'
                            size="middle"
                            color="primary"
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
            label: 'Role',
            name: 'role',
            type: 'select',
            rules: [
                {
                    required: true,
                    message: 'Field role wajib di isi'
                }
            ],
            options: [
                {
                    label: 'Admin UMPEG',
                    value: 'admin_umpeg'
                },
                {
                    label: 'Petugas',
                    value: 'petugas'
                },
                {
                    label: 'User',
                    value: 'user'
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

            {loading ? (
                <DataLoading loadingData={loading} />
            ) : (
                <Card className="">
                    <div className="flex flex-col">
                        <div className="flex items-center justify-between mb-6">
                            <Title className="mt-2" level={5}>
                                Data Harian
                            </Title>
                            <div>
                                <Tooltip title="Refresh Data">
                                    <Button icon={<ReloadOutlined />} onClick={() => fetchData()} />
                                </Tooltip>
                            </div>
                        </div>
                        <Card type="inner" title="Status" className="mb-6">
                            <div className="grid grid-flow-row divide-y text-xs">
                                <div className="flex items-center justify-between py-2">
                                    <span className="uppercase font-semibold">Nama ASN</span>
                                    <p className="text-right uppercase">{data[0]?.jabatan.nama_asn}</p>
                                </div>
                                <div className="flex items-center justify-between py-2">
                                    <span className="uppercase font-semibold">Jabatan ASN</span>
                                    <p className="text-right uppercase">{data[0]?.jabatan.nama_jabatan}</p>
                                </div>
                                <div className="flex items-center justify-between py-2">
                                    <span className="uppercase font-semibold">NIP ASN</span>
                                    <p className="text-right uppercase">{data[0]?.jabatan.nip_asn}</p>
                                </div>
                                <div className="flex items-center justify-between py-2">
                                    <span className="uppercase font-semibold">UNIT ASN</span>
                                    <p className="text-right uppercase">{data[0]?.jabatan.unor.nama}</p>
                                </div>
                            </div>
                        </Card>
                        <DataTable columns={Column} data={data} loading={loading} />
                        <CrudModal title={modal.title} isModalOpen={modal.trigger} data={modal.modalData} onSubmit={onSubmit} onClose={handleClose} formFields={formFields} type={modal.type}></CrudModal>
                    </div>
                </Card>
            )}
        </div>
    );
};

export default page;
