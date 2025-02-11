'use client';

import { Breadcrumb, Button, Card, Collapse, Form, Modal, Select, Space, Tag, Typography, Input, Skeleton, message } from 'antd';
import { ReloadOutlined, PlusOutlined, PrinterOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import Link from 'next/link';
import React, { use, useEffect, useState } from 'react';
import { CrudModal, MatriksCard } from '@/components';
import useFetchData from '@/hooks/useFetchData';
import { getData } from '@/controller/AuthorizationController';
import { getAllPosjabByUnit, getByNIP } from '@/controller/IDSN/JabatanController';
import { useParams } from 'next/navigation';
import { getById, getBySKPId, store as storeSKP } from '@/controller/SKPController';
import { update as updateRHK, destroy as destroyRHK, getBySKPId as getRHKBySkp } from '@/controller/RHKController';
import { update as updateAspek, destroy as destroyAspek } from '@/controller/AspekController';
import { dummyIntervensiRhk } from '@/data';
import { dummyAspeks, dummyRencanaAksi } from '@/data/dummyData';
import { useRouter } from 'next/navigation';

const { Title } = Typography;
const { Option } = Select;

const page = () => {
    const { Id, IdSkp } = useParams();
    const [modal, setModal] = useState({ trigger: false, modalData: null, title: '', formFields: [], onSubmit: () => {} });
    const router = useRouter();
    const { data: user, setData: setUser } = useFetchData(getData);
    const [data, setData] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, filters: {}, total: 0 });
    const [loadingData, setLoadingData] = useState(true);
    const [rhk, setRhk] = useState([]);

    useEffect(() => {
        if (user) {
            fetchData();
        }
    }, [user, pagination.page, pagination.limit]);

    const fetchData = async () => {
        try {
            const data = await getBySKPId(IdSkp, pagination.page, pagination.limit, pagination.filters);
            
            const rhks = await getRHKBySkp(IdSkp);
            setRhk(rhks.data);
            setData(data.data.data);
            setPagination({ ...pagination, page: data.data.pagination.currentPage, limit: data.data.pagination.pageSize, total: data.data.pagination.totalItems });
            setLoadingData(false);
        } catch (error) {
            console.log(error);
        }
    };

    // const submitRhk = async (value) => {
    //     const response = await getByUserIdAndPeriode(dataItem.userId, SKP.periodeRKT);
    //     console.log(value);
    //     const skp = response.data;
    //     console.log(skp);

    //     if (skp) {
    //         const dt = {
    //             ...value,
    //             skp: skp._id
    //         };
    //         const rhk = await storeRHK(dataItem.userId, dt);
    //         console.log(rhk);

    //         message.success('Berhasil Menambahkan RHK');
    //     } else {
    //         const data = {
    //             periode_awal: SKP.periode_awal,
    //             periode_akhir: SKP.periode_akhir,
    //             skp: [SKP._id],
    //             periodeRKT: SKP.periodeRKT,
    //             pendekatan: SKP.pendekatan,
    //             renstra: SKP.renstra,
    //             jabatan: [dataItem]
    //         };
    //         const newSKP = await storeSKP(dataItem.userId, data, '0');
    //         const dt = {
    //             ...value,
    //             skp: newSKP?.data._id
    //         };

    //         const rhk = await storeRHK(dataItem.userId, dt);
    //         message.success('Berhasil Menambahkan RHK');
    //     }
    //     setModal(...modal, { trigger: false });
    // };

    const aspekColumns = [
        {
            title: 'No',
            dataIndex: 'index',
            render: (text, record, index) => index + 1,
            width: '5%'
        },
        {
            title: 'Jenis',
            dataIndex: 'jenis',
            key: 'jenis',
            sorter: (a, b) => a.jenis.length - b.jenis.length
        },
        {
            title: 'Indikator',
            dataIndex: 'indikator',
            key: 'indikator',
            sorter: (a, b) => a.indikator.length - b.indikator.length
        },

        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="small">
                    <Button
                        // type='primary'
                        onClick={() =>
                            setModal({
                                trigger: true,
                                modalData: record,
                                title: 'Edit Aspek',
                                type: 'edit',
                                formFields: AspekFields,
                                onSubmit: async (values) => {
                                    const dt = values;

                                    // const response = await updateAspek(record._id, dt);
                                    // if (response.ok) {
                                    //     message.success('Berhasil Mengubah Aspek');
                                    //     setModal({ trigger: false });
                                    // }else
                                    // {
                                    //     message.error('Gagal Mengubah Aspek');
                                    // }
                                }
                            })
                        }
                        size="middle"
                        icon={<EditOutlined />}
                    />

                    <Button
                        // type='primary'
                        onClick={() => setModal({ trigger: true, modalData: record, title: 'Delete Aspek', type: 'delete', formFields: AspekFields, onSubmit: () => {} })}
                        size="middle"
                        color="danger"
                        icon={<DeleteOutlined />}
                    />
                </Space>
            )
        }
    ];

    const rencanaAksiColumn = [
        {
            title: 'No',
            dataIndex: 'index',
            render: (text, record, index) => index + 1,
            width: '5%'
        },
        {
            title: 'Content',
            dataIndex: 'content',
            key: 'content',
            sorter: (a, b) => a.content.length - b.content.length
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="small">
                    <Button
                        // type='primary'
                        onClick={() => setModal({ trigger: true, modalData: record, title: 'Edit Rencana Aksi', type: 'edit', formFields: RhkFields, onSubmit: () => {} })}
                        size="middle"
                        icon={<EditOutlined />}
                    />

                    <Button
                        // type='primary'
                        onClick={() => setModal({ trigger: true, modalData: record, title: 'Delete Rencana Aksi', type: 'delete', formFields: RhkFields })}
                        size="middle"
                        color="danger"
                        icon={<DeleteOutlined />}
                    />
                </Space>
            )
        }
    ];

    const RhkFields = [
        {
            label: 'RHK',
            name: 'rhk',
            type: 'select',
            rules: [
                {
                    required: true,
                    message: 'Field rhk wajib di isi'
                }
            ],
            options: rhk?.map((item) => ({ value: item._id, label: item.desc ? item.desc : item.rkt.name }))
        },
        {
            label: 'Klasifikasi',
            name: 'klasifikasi',
            type: 'select',
            rules: [
                {
                    required: true,
                    message: 'Field klasifikasi wajib di isi'
                }
            ],
            options: [
                {
                    value: 'organisasi',
                    label: 'Organisasi'
                },
                {
                    value: 'Individu',
                    label: 'individu'
                }
            ]
        },
        {
            label: 'Jenis',
            name: 'jenis',
            type: 'select',
            rules: [
                {
                    required: true,
                    message: 'Field jenis wajib di isi'
                }
            ],
            options: [
                {
                    value: 'utama',
                    label: 'Utama'
                },
                {
                    value: 'tambahan',
                    label: 'Tambahan'
                }
            ]
        },
        {
            label: 'Isi Intervensi RHK',
            name: 'desc',
            type: 'longtext',
            rules: [
                {
                    required: true,
                    message: 'Field isi intervensi mulai wajib di isi'
                }
            ]
        }
    ];

    const AspekFields = [
        {
            label: 'Jenis',
            name: 'jenis',
            type: 'select',
            rules: [
                {
                    required: true,
                    message: 'Field jenis wajib di isi'
                }
            ],
            options: [
                {
                    label: 'organisasi',
                    value: 'organisasi'
                },
                {
                    label: 'organisasi',
                    value: 'organisasi'
                },
                {
                    label: 'organisasi',
                    value: 'organisasi'
                },
                {
                    label: 'organisasi',
                    value: 'organisasi'
                }
            ]
        },
        {
            label: 'Jenis',
            name: 'indikator',
            type: 'text',
            rules: [
                {
                    required: true,
                    message: 'Field indikator wajib di isi'
                }
            ]
        }
    ];

    const rhkData = {
        loading: false,
        data: dummyIntervensiRhk,
        fields: RhkFields
    };

    const aspekData = {
        loading: false,
        data: dummyAspeks,
        columns: aspekColumns,
        fields: AspekFields
    };

    const rencanaAksiData = {
        loading: false,
        data: dummyRencanaAksi,
        columns: rencanaAksiColumn,
        fields: AspekFields
    };

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
                    <Title className="mt-2" level={5}>
                        Data Matriks SKP
                    </Title>
                    <div className="flex items-center gap-x-2">
                        <Button type="default" icon={<PrinterOutlined />} onClick={() => router.push('/document/1/matriks_peran_hasil')}>
                            Cetak
                        </Button>
                    </div>
                </div>

                {loadingData ? (
                    <Skeleton active />
                ) : (
                    <>
                        <div className="grid grid-flow-row divide-y text-xs mb-12">
                            <div className="flex items-center justify-between py-2">
                                <span className="uppercase font-semibold">{user.jabatan?.nama_jabatan}</span>
                                {/* <p className="text-right uppercase">Tahun 2024</p> */}
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <span className="uppercase font-semibold">Unit Organisasi</span>
                                <p className="text-right uppercase">{user?.jabatan?.unor.nama}</p>
                            </div>
                        </div>

                        <div className="w-full flex flex-col gap-y-4">
                            {data?.map((item, index) => {
                                return <MatriksCard dataItem={item} aspekData={aspekData} rencanaAksiData={rencanaAksiData} rhkData={rhkData} key={index} modal={modal} SKP={IdSkp} />;
                            })}
                        </div>
                    </>
                )}
            </Card>
        </div>
    );
};

export default page;
