'use client';

import { CrudModal, DataLoading, DataTable } from '@/components';
import { dummyPeriodePenilaian } from '@/data/dummyData';
import { dateFormatter } from '@/utils';
import { Alert, Breadcrumb, Button, Card, Space, Typography } from 'antd';
import { PlusOutlined, EditOutlined, EyeOutlined, DeleteOutlined, DatabaseOutline0, DatabaseOutlined } from '@ant-design/icons';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getAll, store, destroy, update } from '@/controller/periodePenilaianController';
import useFetchData from '@/hooks/useFetchData';
import { getData } from '@/controller/AuthorizationController';
import { getById } from '@/controller/IDSN/UnitController';
import { getById as getSKP } from '@/controller/SKPController';
import { cekJT } from '@/utils/jabatanUtils';

const { Title } = Typography;

const page = () => {
    const router = useRouter();
    const { IdSkp } = useParams();
    const [modal, setModal] = useState({ trigger: false, modalData: null, title: '', formFields: [], onSubmit: () => {} });
    const [data, setData] = useState(null);

    const { data: user, setData: setUser } = useFetchData(getData);
    const [isJT, setIsJT] = useState(false);
    const [alert, setAlert] = useState({ show: false, message: null, description: null, type: 'info' });
    const [loading, setLoading] = useState(true);
    const [submitLoading, setSubmitLoading] = useState();
    const [pagination, setPagination] = useState({ page: 1, limit: 10, filters: {}, total: 0 });
    const [periode, setPeriode] = useState([]);
    useEffect(() => {
        if (user) {
            fetchData();
        }
    }, [user]);

    console.log(user);

    const fetchData = async () => {
        try {
            const selectedJabatan = user.jabatan;
            const struktur = await getById(user.token, selectedJabatan.unor.induk.id);
            const data = await getAll(pagination.page, pagination.limit, { skp: IdSkp, ...pagination.filters });
            setPagination({ ...pagination, page: data.data.pagination.currentPage, limit: data.data.pagination.pageSize, total: data.data.pagination.totalItems });
            const isJT = cekJT(struktur.mapData[0], selectedJabatan.nama_jabatan);
            const skp = await getSKP(IdSkp);
            console.log(skp);
            console.log(skp);
            if (!isJT) {
                const periode = await getAll('undefined', 'undefined', { skp: skp.data.skp[skp.data.skp.length - 1]._id });
                setPeriode(periode.data);
            }

            setIsJT(isJT);
         
            setData(data.data.data);
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    };

    const jptSubmitPeriode = async (values, type, id, formData) => {
        setSubmitLoading(true);
        try {
            let response;
            let dt = values;
            dt = { ...dt, skp: IdSkp };
            switch (type) {
                case 'create':
                    response = await store(dt);
                    break;

                case 'edit':
                    response = await update(id, dt);
                    break;

                case 'delete':
                    response = await destroy(dt);
                    break;

                default:
                    throw new Error('Tipe operasi tidak valid');
            }
            console.log(response);

            if (response.ok) {
                const newData = await getAll(IdSkp);
                setData(newData.data);
                setAlert({
                    show: true,
                    message: response.msg,
                    description: type === 'delete' ? 'Berhasil Menghapus Periode RKT' : type === 'edit' ? 'Berhasil Mengedit Periode RKT' : 'Berhasil Menambahkan Periode RKT',
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

    const SubmitPeriode = async (values, type, id, formData) => {
        setSubmitLoading(true);
        try {
            let response;
            const selected = periode?.find((item) => item._id === values.periode);
            let dt = { skp: IdSkp, periodePenilaian: values.periode, periodeStart: selected.periodeStart, periodeEnd: selected.periodeEnd, name: selected.name };
            console.log(dt);

            switch (type) {
                case 'create':
                    response = await store(dt);
                    break;

                case 'edit':
                    response = await update(id, dt);
                    break;

                case 'delete':
                    response = await destroy(dt);
                    break;

                default:
                    throw new Error('Tipe operasi tidak valid');
            }
            console.log(response);

            if (response.ok) {
                const newData = await getAll(IdSkp);
                setData(newData.data);
                setAlert({
                    show: true,
                    message: response.msg,
                    description: type === 'delete' ? 'Berhasil Menghapus Periode RKT' : type === 'edit' ? 'Berhasil Mengedit Periode RKT' : 'Berhasil Menambahkan Periode RKT',
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
            title: 'Nama Periode',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: 'Periode Mulai',
            dataIndex: 'periodeStart',
            key: 'periodeStart',
            sorter: (a, b) => new Date(a.periodeStart) - new Date(b.periodeStart),
            render: (record) => dateFormatter(record)
        },
        {
            title: 'Periode Selesai',
            dataIndex: 'periodeEnd',
            key: 'periodeEnd',
            sorter: (a, b) => new Date(a.periodeEnd) - new Date(b.periodeEnd),
            render: (record) => dateFormatter(record)
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="small">
                    {isJT && (
                        <>
                            <Button onClick={() => setModal({ trigger: true, modalData: record, title: `Edit Renstra ${record._id}`, type: 'edit' })} size="middle" icon={<EditOutlined />} />
                            <Button onClick={() => setModal({ trigger: true, modalData: record, title: `Renstra ${record._id}`, type: 'show' })} size="middle" color="default" icon={<EyeOutlined />} />
                        </>
                    )}
                    <Button onClick={() => setModal({ trigger: true, modalData: record, title: `Delete Renstra ${record._id}`, type: 'delete' })} size="middle" color="danger" icon={<DeleteOutlined />} />

                    <Button onClick={() => router.push(`/dashboard/skp/${IdSkp}/periode_penilaian/${record._id}/penilaian`)} size="middle" color="danger">
                        Detail
                    </Button>
                </Space>
            )
        }
    ];

    const handleClose = () => {
        setModal({ trigger: false, modalData: null });
    };

    const formFields = [
        {
            label: 'Nama Periode',
            name: 'name',
            type: 'text',
            rules: [
                {
                    required: true,
                    message: 'Field nama periode wajib di isi'
                }
            ]
        },
        {
            label: 'Periode Mulai',
            name: 'periodeStart',
            type: 'date',
            rules: [
                {
                    required: true,
                    message: 'Field periode mulai wajib di isi'
                }
            ]
        },
        {
            label: 'Periode Selesai',
            name: 'periodeEnd',
            type: 'date',
            rules: [
                {
                    required: true,
                    message: 'Field periode selesai wajib di isi'
                }
            ]
        }
    ];

    const isNotJtFormFields = [
        {
            label: 'Pilih Periode',
            name: 'periode',
            type: 'select',
            rules: [
                {
                    required: true,
                    message: 'Field nama periode wajib di isi'
                }
            ],
            options: periode?.map((item) => ({
                label: item.name,
                value: item._id
            }))
        }
    ];

    console.log('isJt', isJT);
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
                                Data Periode Penilaian
                            </Title>
                            {isJT ? (
                                <div>
                                    <Button type="primary" icon={<PlusOutlined />} onClick={() => setModal({ modalData: null, title: 'Tambah Data', trigger: true, type: 'create', onSubmit: jptSubmitPeriode, formFields: formFields })}>
                                        Tambah
                                    </Button>
                                </div>
                            ) : (
                                <div>
                                    <Button type="primary" icon={<PlusOutlined />} onClick={() => setModal({ modalData: null, title: 'Tambah Data', trigger: true, type: 'create', formFields: isNotJtFormFields, onSubmit: SubmitPeriode })}>
                                        Tambah
                                    </Button>
                                </div>
                            )}
                        </div>
                        <DataTable columns={Column} data={data} loading={loading} />
                        <CrudModal isLoading={submitLoading} title={modal.title} isModalOpen={modal.trigger} onSubmit={modal.onSubmit} onClose={handleClose} data={modal.modalData} formFields={modal.formFields} type={modal.type} />
                    </div>
                </Card>
            )}
        </div>
    );
};

export default page;
