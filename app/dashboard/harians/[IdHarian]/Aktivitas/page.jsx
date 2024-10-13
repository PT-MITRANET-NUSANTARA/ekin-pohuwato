'use client';

import { Alert, Breadcrumb, Button, Card, Space, Table, Tag, Typography } from 'antd';
import { PlusOutlined, EditOutlined, EyeOutlined, DeleteOutlined, DatabaseOutlined } from '@ant-design/icons';
import { DataTable, CrudModal } from '@/components';
import React, { useEffect, useState } from 'react';
import { destroy, getAll, store, update, getByUserId } from '@/controller/HarianController';
import useFetchData from '@/hooks/useFetchData';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { dummyAktivitas } from '@/data/dummyData';
import { getData } from '@/controller/AuthorizationController';
import { getByUserId as getRHKByUserId } from '@/controller/RHKController';
import { getByUnitId } from '@/controller/PeriodeRKTController';
import { getByUserId as getSKPByUser } from '@/controller/SKPController';
import { getByNIP } from '@/controller/IDSN/JabatanController';

const { Title } = Typography;

const page = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const { data, setData } = useFetchData(getData);
    const [modal, setModal] = useState({ trigger: false, modalData: null, title: '' });
    const [alert, setAlert] = useState({ show: false, message: null, description: null, type: 'info' });
    const [harian, setHarian] = useState(null);
    const [rhk, setRHK] = useState(null);
    const [periode, setPeriode] = useState(null);
    const [skp, setSKP] = useState(null);

    useEffect(() => {
        if (data) {
            fetchData();
        }
    }, [data]);

    const fetchData = async () => {
        try {
            const harian = await getByUserId(data.user.idASN);
            const rhk = await getRHKByUserId(data.user.idASN);
            const jabatan = await getByNIP(data.token, data.user.nipBaru);
            const selectedJabatan = jabatan.mapData.data[0];
            const periode = await getByUnitId(selectedJabatan.unor.induk.id);
            console.log('HERE', data.user.idASN);

            const skp = await getSKPByUser(data.user.idASN);
            const rhks = skp?.data.flatMap((item) => item.rhks);
            setSKP(skp.data);
            setPeriode(periode.data);
            setRHK(rhks);
            setHarian(harian.data);
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    };

    console.log(periode);
    console.log('rhk', rhk);

    const onSubmit = async (values, type, id, listImage, fileList) => {
        try {
            let response;
            let dt = {};
            const updatedListImage = listImage.map((img) => {
                const matchingFile = fileList.find((file) => file.uid === img.uid);

                if (matchingFile) {
                    return {
                        ...img,
                        name: matchingFile.name,
                        type: matchingFile.type
                    };
                }

                return img;
            });
            if (values.files) {
                const berkas = values.files;
                delete values.files;
                dt = { ...values, date: Date.now(), files: berkas.fileList };
            } else {
                dt = { ...values, date: Date.now() };
            }

            switch (type) {
                case 'create':
                    response = await store(data.user.idASN, dt);
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

        console.log('Operation completed');
        handleClose();
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
            title: 'Content',
            dataIndex: 'content',
            key: 'content',
            sorter: (a, b) => a.content.length - b.content.length,
            width: '30%'
        },
        {
            title: 'Status Kehadiran',
            dataIndex: 'bukti',
            key: 'bukti',
            sorter: (a, b) => a.bukti.length - b.bukti.length,
            width: '30%'
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="small">
                    <Button
                        onClick={() => setModal({ trigger: true, modalData: record, title: `Edit Renstra ${record._id}`, type: 'edit' })}
                        // type='primary'
                        size="middle"
                        icon={<EditOutlined />}
                    />
                    <Button
                        onClick={() => setModal({ trigger: true, modalData: record, title: `Renstra ${record._id}`, type: 'show' })}
                        // type='primary'
                        size="middle"
                        color="default"
                        icon={<EyeOutlined />}
                    />

                    <Button
                        onClick={() => setModal({ trigger: true, modalData: record, title: `Delete Renstra ${record._id}`, type: 'delete' })}
                        // type='primary'
                        size="middle"
                        color="danger"
                        icon={<DeleteOutlined />}
                    />

                    <Button
                        onClick={() => router.push(`/dashboard/harians/${record._id}/Aktivitas`)}
                        // type='primary'
                        size="middle"
                        color="danger"
                        icon={<DatabaseOutlined />}
                    />
                </Space>
            )
        }
    ];

    const formFields = [
        {
            label: 'Periode',
            name: 'periodeRKT',
            type: 'select',
            rules: [
                {
                    required: true,
                    message: 'Field periode wajib diisi'
                }
            ],
            options: periode?.map((item) => ({
                label: `${item.periode_start} - ${item.periode_end}`,
                value: item._id,
                id: item._id
            }))
        },
        {
            label: 'SKP',
            name: 'skp',
            type: 'select',
            rules: [
                {
                    required: true,
                    message: 'Field SKP wajib diisi'
                }
            ],
            options: skp?.map((item) => ({
                label: `${item.periode_awal} - ${item.periode_akhir}`,
                value: item._id,
                id_option_parent: item.periodeRKT,
                id: item._id
            })),
            parentField: 'periodeRKT'
        },
        {
            label: 'RHK',
            name: 'rhk',
            type: 'select',
            rules: [
                {
                    required: true,
                    message: 'Field RHK wajib diisi'
                }
            ],
            options: rhk?.map((item) => ({
                label: item.desc,
                value: item._id,
                id_option_parent: item.skp,
                id: item._id
            })),
            parentField: 'skp'
        },
        {
            label: 'Nama Kegiatan',
            name: 'namaKegiatan',
            type: 'text',
            rules: [
                {
                    required: true,
                    message: 'Field nama kegiatan wajib diisi'
                }
            ]
        },
        {
            label: 'Waktu Mulai',
            name: 'startDateTime',
            type: 'time',
            rules: [
                {
                    required: true,
                    message: 'Field waktu mulai wajib diisi'
                }
            ]
        },
        {
            label: 'Waktu Selesai',
            name: 'endDateTime',
            type: 'time',
            rules: [
                {
                    required: true,
                    message: 'Field waktu selesai wajib diisi'
                }
            ]
        },
        {
            label: 'Deskripsi Kegiatan',
            name: 'deskripsiKegiatan',
            type: 'longtext',
            rules: [
                {
                    required: true,
                    message: 'Field deskripsi wajib diisi'
                }
            ]
        },
        {
            label: 'Tautan Kegiatan',
            name: 'tautan',
            type: 'text'
        },
        {
            label: 'Bukti Aktivitas',
            name: 'files',
            type: 'upload'
        },
        {
            label: 'Parent Select',
            name: 'parent_select',
            type: 'select',
            options: [
                { id: 'P1', value: '01', label: 'Option 01' },
                { id: 'P2', value: '02', label: 'Option 02' }
            ]
        },
        {
            label: 'Child Select',
            name: 'child_select',
            type: 'select',
            parentField: 'parent_select',
            options: [
                { id: 'C1', id_option_parent: '01', value: 'C1', label: 'Child 1 of 01' },
                { id: 'C2', id_option_parent: '02', value: 'C2', label: 'Child 2 of 02' }
            ]
        },
        {
            label: 'Grandchild Select',
            name: 'grandchild_select',
            type: 'select',
            parentField: 'child_select',
            options: [
                { id: 'G1', id_option_parent: 'C1', value: 'G1', label: 'Grandchild 1 of C1' },
                { id: 'G2', id_option_parent: 'C2', value: 'G2', label: 'Grandchild 2 of C2' }
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
            <Card className="">
                <div className="flex flex-col">
                    <div className="flex items-center justify-between mb-12">
                        <Title className="mt-2" level={5}>
                            Detail Data Harian
                        </Title>
                        <div>
                            <Button type="primary" icon={<PlusOutlined />} onClick={() => setModal({ modalData: null, title: 'Tambah Data', trigger: true, type: 'create' })}>
                                Tambah
                            </Button>
                        </div>
                    </div>
                    <DataTable columns={Column} data={dummyAktivitas} loading={loading} />
                    <CrudModal title={modal.title} isModalOpen={modal.trigger} data={modal.modalData} onSubmit={onSubmit} onClose={handleClose} formFields={formFields} type={modal.type}></CrudModal>
                </div>
            </Card>
        </div>
    );
};

export default page;
