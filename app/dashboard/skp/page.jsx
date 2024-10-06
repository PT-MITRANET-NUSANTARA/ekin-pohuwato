'use client';

import { Breadcrumb, Button, Card, Select, Tag, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { dummySkp } from '@/data';
import React, { useState } from 'react';
import Link from 'next/link';
import { CrudModal } from '@/components';
import { useRouter } from 'next/navigation';
const { Title } = Typography;

const page = () => {
    const router = useRouter();
    const [modal, setModal] = useState({ trigger: false, modalData: null, title: '', type: '' });
    const { Option } = Select;

    const onSubmit = () => {
        console.log('this is onsubmit');
    };

    const formFields = [
        {
            label: 'Periode Mulai',
            name: 'periode_awal',
            type: 'number',
            rules: [
                {
                    required: true,
                    message: 'Field periode mulai wajib di isi'
                }
            ]
        },
        {
            label: 'Periode Akhir',
            name: 'periode_akhir',
            type: 'number',
            rules: [
                {
                    required: true,
                    message: 'Field periode selesai wajib di isi'
                }
            ]
        },
        {
            label: 'Pendekatan',
            name: 'pendekatan',
            type: 'select',
            rules: [
                {
                    required: true,
                    message: 'Field periode selesai wajib di isi'
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

    const handleClose = () => {
        setModal({ trigger: false, modalData: null });
    };

    console.log(modal.modalData);
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
                            Data Renstra
                        </Title>
                        <div>
                            <Button type="primary" icon={<PlusOutlined />} onClick={() => setModal({ modalData: null, title: 'Tambah Data', trigger: true, type: 'create' })}>
                                Tambah
                            </Button>
                        </div>
                    </div>
                    <div className="flex flex-col gap-y-4">
                        {dummySkp.map((item) => (
                            <Card type="inner" title={<Tag color="blue">{item._id}</Tag>}>
                                <div className="w-full flex flex-col gap-y-4">
                                    <div className="flex w-full items-center gap-x-2 ">
                                        <Button onClick={() => router.push(`/dashboard/skp/${item._id}/detail`)}>Detail SKP</Button>
                                        <Button onClick={() => router.push(`/dashboard/skp/${item._id}/matriks_peran_hasil`)}>Matriks Peran Hasil</Button>
                                        <Button onClick={() => router.push(`/dashboard/skp/${item._id}/skp_bawahan`)}>SKP Bawahan</Button>
                                        <Button onClick={() => router.push(`/dashboard/skp/${item._id}/penilaian`)}>Penilaian</Button>
                                        <Button onClick={() => router.push(`/dashboard/skp/${item._id}/monitoring_kinerja`)}>Monitoring Kinerja</Button>
                                        <Button onClick={() => router.push(`/dashboard/skp/${item._id}/hasil_kerja`)}>Hasil Kerja</Button>
                                    </div>

                                    <div className="grid grid-flow-row divide-y text-xs">
                                        <div className="flex items-center justify-between py-2">
                                            <span className="uppercase font-semibold">periode</span>
                                            <Tag color="blue" className="capitalize">
                                                {item.periode_akhir}
                                            </Tag>
                                        </div>
                                        <div className="flex items-center justify-between py-2">
                                            <span className="uppercase font-semibold">pendekatan</span>
                                            <Tag color="blue" className="capitalize">
                                                {item.pendekatan}
                                            </Tag>
                                        </div>
                                        <div className="flex items-center justify-between py-2">
                                            <span className="uppercase font-semibold">unit kerja</span>
                                            <p className="text-right uppercase">{item.unit}</p>
                                        </div>
                                        <div className="flex items-center justify-between py-2">
                                            <span className="uppercase font-semibold">status pegawai</span>
                                            <p className="text-right capitalize">{item.status}</p>
                                        </div>
                                        <div className="flex items-center justify-between py-2">
                                            <span className="uppercase font-semibold">status</span>
                                            <Tag color="green" className="capitalize">
                                                {item.status}
                                            </Tag>
                                        </div>
                                        <div className="flex items-center justify-between py-2">
                                            <span className="uppercase font-semibold">keterangan jabatan</span>
                                            <p className="text-right capitalize">{item.jabatan}</p>
                                        </div>
                                        <div className="flex items-center justify-between py-2">
                                            <span className="uppercase font-semibold">jenis pegawai</span>
                                            <p className="text-right capitalize">{item.jabatan}</p>
                                        </div>
                                    </div>
                                    <div className="flex w-full items-center justify-end gap-x-2 ">
                                        <Button type="primary" icon={<EditOutlined />} onClick={() => setModal({ modalData: item, title: `Edit ${item.skp}`, trigger: true, type: 'edit' })}>
                                            Edit
                                        </Button>
                                        <Button danger variant="filled" type="primary" icon={<DeleteOutlined />}>
                                            Hapus
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </Card>
            <CrudModal width={800} isModalOpen={modal.trigger} title={modal.title} data={modal.modalData} onSubmit={onSubmit} formFields={formFields} onClose={handleClose} type={modal.type}>
                <CrudModal.Extra>
                    <div className="flex flex-col">
                        <Card className="mt-12 bg-blue-500 text-white mb-6">
                            <p className="text-xs">
                                Cek terlebih dahulu data Unit Kerja dan Atasan sebelum membuat SKP. Jika terdapat kesalahan bisa dilakukan perubahan pada menu <b>Profil</b>.
                            </p>
                        </Card>
                        {modal.type === 'create' && (
                            <div className="grid grid-flow-row divide-y text-xs px-4 mb-6">
                                <div className="flex items-center justify-between py-2">
                                    <span className="uppercase font-semibold">unit kerja</span>
                                    <p className="text-right">BIDANG PENGADAAN, PEMBERHENTIAN DAN INFORMASI KEPEGAWAIAN</p>
                                </div>
                                <div className="flex items-center justify-between py-2">
                                    <span className="uppercase font-semibold">jenis pegawai</span>
                                    <Tag color="blue">Pimpinan</Tag>
                                </div>
                                <div className="flex items-center justify-between py-2">
                                    <span className="uppercase font-semibold">atasan</span>
                                    <div className="flex flex-col gap-y-1">
                                        <p className="text-right">SUPRATMAN NENTO</p>
                                        <p className="text-right">BIDANG PENGADAAN, PEMBERHENTIAN DAN INFORMASI KEPEGAWAIAN</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between py-2">
                                    <span className="uppercase font-semibold">unit kerja atasan</span>
                                    <p className="text-right">BADAN KEPEGAWAIAN DAN PENGEMBANGAN SUMBER DAYA MANUSIA</p>
                                </div>
                            </div>
                        )}

                        <Card className=" bg-blue-500 text-white">
                            <p className="text-xs">
                                Periode Rencana SKP yang dibuat pada menu ini adalah <b>TAHUNAN</b>. Periode Penilaian Periodik (BULANAN / TRIWULANAN) dan FINAL dibuat di menu Penilaian.
                            </p>
                        </Card>
                    </div>
                </CrudModal.Extra>
            </CrudModal>
        </div>
    );
};

export default page;
