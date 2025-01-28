'use client';

import { CrudModal, DataTable } from '@/components';
import { Breadcrumb, Button, Card, Modal, Skeleton, Space, Tag, Typography } from 'antd';
import { EditOutlined, EyeOutline, CheckCircleFilled, PlusOutlined } from '@ant-design/icons';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { dummySkpBawahan } from '@/data/dummyData';
import { useParams, useRouter } from 'next/navigation';
import useFetchData from '@/hooks/useFetchData';
import { getData } from '@/controller/AuthorizationController';
import { getAllPosjabByUnit, getByNIP } from '@/controller/IDSN/JabatanController';
import { getBySKPId, storeBawahan, update } from '@/controller/SKPController';
import useNotification from '@/app/hook/useNotification';

const { Title } = Typography;

const page = () => {
    const { confirm } = Modal;
    const { success, error } = useNotification();
    const router = useRouter();
    const { IdSkp } = useParams();
    const [data, setData] = useState([]);
    const [loadingData, setLoadingData] = useState(true);
    const { data: user, setData: setUser } = useFetchData(getData);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, filters: {}, total: 0 });
    const [modal, setModal] = useState({ trigger: false, modalData: null, title: '', type: '' });
    const [submitLoading, setSubmitLoading] = useState(false);
    const [unor, setUnor] = useState(null);


    useEffect(() => {
        if (user) {
            fetchData();
        }
    }, [user, pagination.page, pagination.limit]);


    const fetchData = async () => {
        try {
            const data = await getBySKPId(IdSkp, pagination.page, pagination.limit, pagination.filters);
            const selectedJabatan = user.jabatan;

            const unit = await getAllPosjabByUnit(user.token, selectedJabatan.unor.induk.id);
            const bawahan = unit.mapData.data.filter((item) => (item.unor.id == selectedJabatan.unor.id && item.nama_jabatan !== selectedJabatan.nama_jabatan) || item.unor.atasan?.unor_id === selectedJabatan.unor.id);

            setUnor(bawahan)
            setData(data.data.data);
            setPagination({ ...pagination, page: data.data.pagination.currentPage, limit: data.data.pagination.pageSize, total: data.data.pagination.totalItems });
            setLoadingData(false);
        } catch (error) {
            console.log(error);
        }
    };

    const Column = [
        {
            title: 'No',
            dataIndex: 'index',
            render: (text, record, index) => index + 1,
            width: '5%'
        },
        {
            title: 'NIP',
            dataIndex: 'user_id',
            key: 'name',
        },
        {
            title: 'Nama',
            dataIndex: 'name',
            key: 'name',
            render: (_, record) => {
                const lastJabatan = record.jabatan?.[record.jabatan.length - 1];
                return lastJabatan ? lastJabatan.nama_asn : 'No Jabatan';
            }
        },
        {
            title: 'Nama Unit Kerja',
            dataIndex: 'unor',
            key: 'unor',
            render: (_, record) => {
                const lastJabatan = record.jabatan?.[record.jabatan.length - 1];
                return lastJabatan ? lastJabatan.unor?.nama : 'No Organisasi';
            }
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (_, record) => (
                <>
                    {(() => {
                        switch (record.status) {
                            case 'approved':
                                return (
                                    <Tag color="blue" className="capitalize">
                                        {record.status}
                                    </Tag>
                                );
                            case 'rejected':
                                return (
                                    <div className="flex flex-col gap-y-2">
                                        <Tag color="red" className="capitalize w-fit">
                                            {record.status}
                                        </Tag>
                                        "{record.keterangan}"
                                    </div>
                                );
                            case 'submitted':
                                return (
                                    <Tag color="yellow" className="capitalize">
                                        {record.status}
                                    </Tag>
                                );
                            case 'draft':
                                return (
                                    <Tag color="blue" className="capitalize">
                                        {record.status}
                                    </Tag>
                                );
                        }
                    })()}
                </>
            )
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="small">
                    <Button
                        onClick={() => router.push(`/dashboard/skp/${IdSkp}/skp_bawahan/${record._id}`)}
                        // type='primary'
                        size="middle"
                    >
                        Detail
                    </Button>
                    {record.status !== 'approved' && record.status !== 'submitted' ? (
                        <Button
                            onClick={() => {
                                confirm({
                                    title: `Setujui laporan aktivitas ini?`,
                                    icon: <CheckCircleFilled style={{ color: '#3b82f6' }} />,
                                    content: <span>Klik ok untuk verifikasi SKP ini</span>,
                                    async onOk() {
                                        const data = { ...record, status: 'submitted' };
                                        console.log(data);

                                        const res = await update(data._id, data);
                                        if (res.ok) {
                                            fetchData();
                                        }
                                    },
                                    onCancel() {
                                        console.log('Cancel');
                                    }
                                });
                            }}
                            size="middle"
                        >
                            Ajukan SKP
                        </Button>
                    ) : null}
                </Space>
            )
        }
    ];

    const onSubmit = async (values, type, id) => {
        setSubmitLoading(true);
        try {
            let response;
            let dt = values;
            dt = { ...dt, jabatan: [unor.find((item) => item.nip_asn == values.user_id)] };
            console.log(IdSkp);

            switch (type) {
                case 'create':
                    response = await storeBawahan(IdSkp, dt);
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
                fetchData();
                success('Berhasil', response.msg);
                // setAlert({
                //     show: true,
                //     message: response.msg,
                //     description: type === 'delete' ? 'Berhasil Menghapus SKP' : type === 'edit' ? 'Berhasil Mengedit SKP' : 'Berhasil Menambahkan SKP',
                //     type: 'success'
                // });
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
        setSubmitLoading(false);

        handleClose();
    };

    const formFields = [
        {
            label: 'Bawahan',
            name: 'user_id',
            type: 'select',
            rules: [
                {
                    required: true,
                    message: 'Field renstra wajib di isi'
                }
            ],
            options: unor?.map((item) => ({
                label: item.nama_asn,
                value: item.nip_asn
            }))
        },
        {
            label: 'Pendekatan',
            name: 'pendekatan',
            type: 'select',
            rules: [
                {
                    required: true,
                    message: 'Field pendekatan wajib di isi'
                }
            ],
            options: [
                {
                    label: 'Kuantitatif',
                    value: 'kuantitatif'
                },
                {
                    label: 'Kualitatif',
                    value: 'kualitatif'
                }
            ]
        }
    ];

    return (
        <div className="w-full flex flex-col gap-y-4">
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
            <Card>
                <div className="flex items-center justify-between mb-6">
                    <div className='flex flex-col'>
                        <Title className="mt-2" level={5}>
                            Data SKP Bawahan
                        </Title>
                        <p className="text-sm uppercase">{user?.jabatan.unor.nama}</p>

                    </div>

                    <div>

                        <Button type="primary" icon={<PlusOutlined />} onClick={() => setModal({ modalData: null, title: 'Tambah Data', trigger: true, type: 'create', })}>
                            Tambah
                        </Button>
                    </div>
                </div>
                {loadingData ? (
                    <Skeleton active />
                ) : (
                    <>
                        <DataTable columns={Column} data={data} loading={false}></DataTable>
                    </>
                )}
            </Card>
            <CrudModal isLoading={submitLoading} width={800} isModalOpen={modal.trigger} title={modal.title} data={modal.modalData} onSubmit={onSubmit} formFields={formFields} onClose={() => setModal({ trigger: false, modalData: null })} type={modal.type}>
            </CrudModal>
        </div>
    );
};

export default page;
