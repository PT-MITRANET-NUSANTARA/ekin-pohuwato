'use client';

import { Alert, Breadcrumb, Button, Card, List, Modal, Space, Tag, Typography } from 'antd';
import { CheckCircleFilled, CheckOutlined, CloseOutlined, HistoryOutlined, XOutlined } from '@ant-design/icons';
import { DataTable, CrudModal, FilterField } from '@/components';
import React, { useEffect, useState } from 'react';
import { dummySKPVerification } from '@/data/dummyData';
import Link from 'next/link';
import useFetchData from '@/hooks/useFetchData';
import { getData } from '@/controller/AuthorizationController';
import { getAll, update } from '@/controller/SKPController';
import { useRouter } from 'next/navigation';
import { dateFormatter } from '@/utils';

const { Title } = Typography;

const page = () => {
    const { confirm } = Modal;
    const router = useRouter()
    const [modal, setModal] = useState({ trigger: false, modalData: null, title: '', formFields: [], onSubmit: () => { } });
    const [feedBackModal, setFeedbackModal] = useState({ trigger: false, modalData: [] });
    const [alert, setAlert] = useState({ show: false, message: null, description: null, type: 'info' });
    const { data: user, setData: setUser } = useFetchData(getData);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, filters: {}, total: 0 });
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchData();
        }
    }, [user, pagination.page, pagination.limit]);

    const fetchData = async () => {
        try {
            const data = await getAll(pagination.page, pagination.limit, {
                ...pagination.filters,
                'jabatan[-1].unor.induk.id': user.jabatan?.unor?.induk,
                status: { $in: ['submitted', 'approved', 'rejected'] }
            });
            console.log(data);
            
            const filteredUsers = data.data.data.filter((user) => {
                const lastJabatan = data.data.data.jabatan?.at(-1); // Ambil elemen terakhir dengan at(-1)
                return lastJabatan?.unor?.induk?.id === user.jabatan?.unor?.induk;
            });

            console.log(filteredUsers);

            setData(filteredUsers);
            setPagination({ ...pagination, filters: pagination.filters, page: data.data.pagination.currentPage, limit: data.data.pagination.pageSize, total: data.data.pagination.totalItems });
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
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
            title: 'Nama Asn',
            dataIndex: 'user_id',
            key: 'nama_skp'
        },
        {
            title: 'NIP',
            dataIndex: 'jabatan',
            key: 'nama_skp',
            render: (record) => record[record.length - 1].userId
        },
        {
            title: 'Jabatan',
            dataIndex: 'jabatan',
            key: 'nama_skp',
            render: (record) => record[record.length - 1].nama_jabatan,
        },
        {
            title: 'Unor',
            dataIndex: 'jabatan',
            key: 'nama_skp',
            render: (record) => record[record.length - 1].unor.nama,
        },
        {
            title: 'Periode SKP',
            dataIndex: 'periode_skp',
            key: 'periode_skp',
            render: (_, record) => dateFormatter(record.periode_awal) + ' - ' + dateFormatter(record.periode_akhir)

        },
        {
            title: 'Pendekatan',
            dataIndex: 'pendekatan',
            key: 'datadiri'
        },
        // {
        //     title: 'Atasan',
        //     dataIndex: 'atasan',
        //     key: 'atasan'
        // },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (_, record) => (
                <div className='inline-flex items-center'>
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
                                    <div className='flex flex-col gap-y-2'>
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
                    <Button
                        icon={<HistoryOutlined />}
                        variant='link'
                        color='primary'
                        onClick={() => {
                            setFeedbackModal({ trigger: true, modalData: data })
                        }}
                    />
                    <Modal title="List Feedback" open={feedBackModal.trigger} onCancel={() => setFeedbackModal({ modalData: null, trigger: false })} footer={null} >
                        <List
                            className="w-full col-span-4 mt-6"
                            itemLayout="horizontal"
                            dataSource={feedBackModal.modalData}
                            renderItem={(item) => (
                                <List.Item>
                                    <button className='inline-flex items-center justify-between w-full hover:bg-gray-100 p-3 rounded-md'>
                                        <div className='inline-flex gap-x-2 items-center'>
                                            <HistoryOutlined />
                                            <b>10 Januari 2024</b>
                                        </div>
                                        {(() => {
                                            switch (item.status) {
                                                case 'approved':
                                                    return (
                                                        <Tag color="blue" className="capitalize">
                                                            {item.status}
                                                        </Tag>
                                                    );
                                                case 'rejected':
                                                    return (
                                                        <div className="flex flex-col gap-y-2">
                                                            <Tag color="red" className="capitalize w-fit">
                                                                {item.status}
                                                            </Tag>
                                                            "{record.keterangan}"
                                                        </div>
                                                    );
                                                case 'submitted':
                                                    return (
                                                        <Tag color="yellow" className="capitalize">
                                                            {item.status}
                                                        </Tag>
                                                    );
                                                case 'draft':
                                                    return (
                                                        <Tag color="blue" className="capitalize">
                                                            {item.status}
                                                        </Tag>
                                                    );
                                            }
                                        })()}
                                    </button>
                                </List.Item>
                            )}
                        />
                    </Modal>
                </div>
            ),
            searchable: true
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="small">
                    <Button
                        onClick={() => {
                            router.push(window.location.pathname + `/${record.id}`);
                        }}
                        size="middle"
                    >
                        Detail
                    </Button>

                    {record.status === 'submitted' && (
                        <>
                            <Button
                                icon={<CheckOutlined />}
                                onClick={() => {
                                    confirm({
                                        title: `Setujui laporan aktivitas ini?`,
                                        icon: <CheckCircleFilled style={{ color: '#3b82f6' }} />,
                                        content: <span>Klik ok untuk verifikasi SKP ini</span>,
                                        async onOk() {
                                            const data = { ...record, status: 'approved' };
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
                                variant="outlined"
                                color="primary"
                            />
                            <Button
                                onClick={() =>
                                    setModal({
                                        trigger: true,
                                        title: `Tolak Verifikasi SKP`,
                                        type: 'create',
                                        formFields: feedbackFields,
                                        onSubmit: async (value) => {
                                            const data = { ...record, status: 'rejected', msg: value.feedback };
                                            console.log(data);

                                            const res = await update(data._id, data);
                                            console.log(res);

                                            if (res.ok) {
                                                setModal({ trigger: false, modalData: null });
                                                fetchData();
                                            }
                                        }
                                    })
                                }
                                size="middle"
                                danger
                                icon={<CloseOutlined />}
                            />
                        </>
                    )}

                    {record.status === 'rejected' && (
                        <Button
                            icon={<CheckOutlined />}
                            onClick={() => {
                                confirm({
                                    title: `Setujui laporan aktivitas ini?`,
                                    icon: <CheckCircleFilled style={{ color: '#3b82f6' }} />,
                                    content: <span>Klik ok untuk verifikasi SKP ini</span>,
                                    async onOk() {
                                        const data = { ...record, status: 'approved' };
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
                            variant="outlined"
                            color="primary"
                        />
                    )}
                </Space>
            )
        }
    ];

    const feedbackFields = [
        {
            label: 'Feedback',
            name: 'feedback',
            type: 'longtext',
            rules: [
                {
                    required: true,
                    message: 'Field feedback wajib di isi'
                }
            ]
        }
    ];

    const filterFileds = [
        {
            id: 1,
            name: 'periode skp',
            options: [
                {
                    label: 'sample',
                    value: 'sample'
                }
            ]
        },
        {
            id: 1,
            name: 'atasan',
            options: [
                {
                    label: 'sample',
                    value: 'sample'
                }
            ]
        },
        {
            id: 1,
            name: 'status skp',
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
            {/* {loading ? (
                <DataLoading loadingData={loading} />
            ) : ( */}
            <Card className="">
                <div className="flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                        <Title className="mt-2" level={5}>
                            Data verifikasi SKP
                        </Title>
                        <div>
                            {/* <Button loading={loading} type="primary" icon={<PlusOutlined />} onClick={() => setModal({ modalData: null, title: 'Tambah Data', trigger: true, type: 'create', formFields: formFields })}>
                                    Tambah
                                </Button> */}
                        </div>
                    </div>
                    <div className="w-full">
                        {/* <FilterField fields={filterFileds}></FilterField> */}
                    </div>
                    <div className="overflow-x-auto">
                        <DataTable columns={Column} data={data} setPagination={setPagination} pagination={pagination} />
                    </div>
                    <CrudModal title={modal.title} isModalOpen={modal.trigger} data={modal.modalData} onSubmit={modal.onSubmit} onClose={handleClose} formFields={modal.formFields} type={modal.type} />
                </div>
            </Card>
            {/* )} */}
        </div>
    );
};

export default page;
