'use client';

import { CrudModal, DataTable } from '@/components';
import { Breadcrumb, Button, Card, Collapse, Modal, Space, Tag, Typography } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, CloseOutlined, DeleteOutlined, EditOutlined, EyeOutlined, FileAddOutlined, XOutlined } from '@ant-design/icons';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { dummyAktivitas } from '@/data/dummyData';
import { getData } from '@/controller/AuthorizationController';
import { destroy, getAll, store, update, getByUserId, getByUserIdAbsence } from '@/controller/HarianController';
import { getAllPosjabByUnit, getByNIP } from '@/controller/IDSN/JabatanController';
import useFetchData from '@/hooks/useFetchData';
import { useParams } from 'next/navigation';

const { Title } = Typography;

const page = () => {
    const {IdSkp} = useParams();
    const [modal, setModal] = useState({ trigger: false, modalData: null, title: '', formFields: [] });
    const { data, setData } = useFetchData(getData);
    const [periksa, setPeriksa] = useState(null);
    const [tolak, setTolak] = useState(null);
    const [terima, setTerima] = useState(null);
    const [periode, setPeriode] = useState(null);
    const [loading, setLoading] = useState(true);
    const [bawahan, setBawahan] = useState(null);

    useEffect(() => {
        if (data) {
            fetchData();
        }
    }, [data]);

    const fetchData = async () => {
        try {
            const jabatan = await getByNIP(data.token, data.user.nipBaru);
            const selectedJabatan = jabatan.mapData.data[0];

            const unit = await getAllPosjabByUnit(data.token, selectedJabatan.unor.induk.id);

            // Filter data bawahan
            const bawahan = unit.mapData.data.filter((item) => (item.unor.id === selectedJabatan.unor.id && item.nama_jabatan !== selectedJabatan.nama_jabatan) || item.unor.atasan?.unor_id === selectedJabatan.unor.id);
            console.log(bawahan);
            
            const allHarian = [];

            for (let item of bawahan) {
                const response = await getByUserId(item.userId);

                if (Array.isArray(response.data)) {
                    allHarian.push(...response.data); 
                } else {
                    allHarian.push(response.data);
                }
            }

            console.log(allHarian);
            
            const harianBawahan = allHarian.filter(
                (item) => {
                    const skpArray = item.rhk?.skp?.skp; // Pastikan skp adalah array
                    const lastSkp = skpArray?.[skpArray.length - 1]; // Ambil elemen terakhir
                    return lastSkp?._id === IdSkp; // Bandingkan dengan IdSkp
                }
            );
                      

            console.log('HARIAN', harianBawahan);
            setBawahan(bawahan);
            setTerima(harianBawahan.filter((item) => item.msg?.status === 'Terima'));
            setPeriksa(harianBawahan.filter((item) => item.msg?.status === 'Periksa'));
            setTolak(harianBawahan.filter((item) => item.msg?.status === 'Tolak'));

            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    };

    const Column = [
        {
            title: 'ID',
            dataIndex: '_id',
            key: '_id',
            sorter: (a, b) => a._id.length - b._id.length,
            width: '10%'
        },
        {
            title: 'IdASN',
            dataIndex: 'IdASN',
            key: 'IdASN',
            sorter: (a, b) => a.date.length - b.date.length,
            width: '30%',
            render: (_, record) => (bawahan?.find((item) => item.userId === record.user_id)?.userId)
        },
        {
            title: 'Nama',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.date.length - b.date.length,
            width: '30%',
            render: (_, record) => (bawahan?.find((item) => item.userId === record.user_id)?.nama_asn)
        },
        {
            title: 'Tanggal',
            dataIndex: 'date',
            key: 'date',
            sorter: (a, b) => a.date.length - b.date.length,
            width: '30%'
        },
        {
            title: 'Deskripsi Kegiatan',
            dataIndex: 'deskripsiKegiatan',
            key: 'deskripsiKegiatan',
            sorter: (a, b) => a.deskripsiKegiatan.length - b.deskripsiKegiatan.length,
            width: '30%'
        },
        {
            title: 'Nama Kegiatan',
            dataIndex: 'namaKegiatan',
            key: 'namaKegiatan',
            sorter: (a, b) => a.namaKegiatan.length - b.namaKegiatan.length,
            width: '30%'
        },
        {
            title: 'Waktu Mulai',
            dataIndex: 'startDateTime',
            key: 'startDateTime',
            sorter: (a, b) => a.startDateTime.length - b.startDateTime.length,
            width: '30%'
        },
        {
            title: 'Waktu Selesai',
            dataIndex: 'endDateTime',
            key: 'endDateTime',
            sorter: (a, b) => a.endDateTime.length - b.endDateTime.length,
            width: '30%'
        },
        {
            title: 'Status',
            dataIndex: 'msg',
            key: 'msg',
            sorter: (a, b) => a.msg.length - b.msg.length,
            render: (_, record) => (
                <>
                    {(() => {
                        switch (record.msg?.status) {
                            case 'Periksa':
                                return (
                                    <Tag color="blue" className="capitalize">
                                        {record.msg.status}
                                    </Tag>
                                );
                            case 'Terima':
                                return (
                                    <Tag color="red" className="capitalize">
                                        {record.msg.status}
                                    </Tag>
                                );
                            case 'Tolak':
                                return (
                                    <div className="flex flex-col gap-y-2">
                                        <Tag color="yellow" className="capitalize">
                                            {record.msg.status}
                                        </Tag>
                                        {record.msg.message}
                                    </div>
                                );
                            default:
                                return <div></div>;
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
                        onClick={() => setModal({ trigger: true, modalData: record, title: `Edit Renstra ${record._id}`, type: 'status', formFields: terimaField })}
                        // type='primary'
                        size="middle"
                        icon={<CheckCircleOutlined />}
                    />
                </Space>
            )
        }
    ];

    const terimaField = [
        {
            label: 'Content',
            name: 'content',
            type: 'longtext',
            rules: [
                {
                    required: true,
                    message: 'Field indikator wajib di isi'
                }
            ]
        },
        {
            label: 'Bukti',
            name: 'bukti',
            type: 'text',
            rules: [
                {
                    required: true,
                    message: 'Field indikator wajib di isi'
                }
            ]
        }
    ];

    const tolakFields = [
        {
            label: 'Indikator',
            name: 'indikator',
            type: 'longtext',
            rules: [
                {
                    required: true,
                    message: 'Field indikator wajib di isi'
                }
            ]
        }
    ];

    const handleClose = () => {
        setModal({ trigger: false, modalData: null });
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
                <div className="flex flex-col">
                    <div className="flex items-center justify-between mb-12">
                        <Title className="mt-2" level={5}>
                            Data Aktivitas SKP
                        </Title>
                    </div>
                    {/* <DataTable columns={Column} data={dummyAktivitas} loading={false} /> */}
                    <Collapse bordered>
                        <Collapse.Panel key="1" header="Periksa">
                            <DataTable columns={Column} data={periksa} loading={false} />
                        </Collapse.Panel>
                        <Collapse.Panel key="2" header={<div className="text-blue-500">Terima</div>}>
                            <DataTable columns={Column} data={terima} loading={false} />
                        </Collapse.Panel>
                        <Collapse.Panel key="2" header={<div className="text-red-500">Tolak</div>}>
                            <DataTable columns={Column} data={tolak} loading={false} />
                        </Collapse.Panel>
                    </Collapse>
                    <CrudModal title={modal.title} isModalOpen={modal.trigger} data={modal.modalData} onSubmit={() => {}} onClose={handleClose} formFields={modal.formFields} type={modal.type} />
                </div>
            </Card>
        </div>
    );
};

export default page;
