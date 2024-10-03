'use client';

import { Breadcrumb, Button, Card, Tag, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import React from 'react';
import Link from 'next/link';

const { Title } = Typography;

const page = () => {
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
            <Card className="">
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
                        <Card
                            type="inner"
                            title={<Tag color="blue">idSKP</Tag>}
                          
                        >
                            <div className="w-full flex flex-col gap-y-4">
                                <div className="flex w-full items-center gap-x-2 ">
                                    <Button>Detail SKP</Button>
                                    <Button>Matriks Peran Hasil</Button>
                                    <Button>SKP Bawahan</Button>
                                    <Button>Penilaian</Button>
                                </div>

                                <div className="grid grid-flow-row divide-y text-xs">
                                    <div className="flex items-center justify-between py-2">
                                        <span className="uppercase font-semibold">periode</span>
                                        <Tag color="blue">1 Januari 2024 - 31 Desember 2024</Tag>
                                    </div>
                                    <div className="flex items-center justify-between py-2">
                                        <span className="uppercase font-semibold">pendekatan</span>
                                        <Tag color="blue">Kuantitatif</Tag>
                                    </div>
                                    <div className="flex items-center justify-between py-2">
                                        <span className="uppercase font-semibold">unit kerja</span>
                                        <p className="text-right">BIDANG PENGADAAN, PEMBERHENTIAN DAN INFORMASI KEPEGAWAIAN</p>
                                    </div>
                                    <div className="flex items-center justify-between py-2">
                                        <span className="uppercase font-semibold">status pegawai</span>
                                        <p className="text-right">Definitif</p>
                                    </div>
                                    <div className="flex items-center justify-between py-2">
                                        <span className="uppercase font-semibold">status</span>
                                        <Tag color="green">PERSETUJUAN</Tag>
                                    </div>
                                    <div className="flex items-center justify-between py-2">
                                        <span className="uppercase font-semibold">keterangan jabatan</span>
                                        <p className="text-right">KEPALA BIDANG PENGADAAN, PEMBERHENTIAN DAN INFORMASI KEPEGAWAIAN</p>
                                    </div>
                                    <div className="flex items-center justify-between py-2">
                                        <span className="uppercase font-semibold">jenis pegawai</span>
                                        <p className="text-right">Pimpinan</p>
                                    </div>
                                </div>
                                <div className="flex w-full items-center justify-end gap-x-2 ">
                                    <Button type="primary" icon={<EditOutlined />}>Edit</Button>
                                    <Button danger variant="filled" type="primary" icon={<DeleteOutlined />}>
                                        Hapus
                                    </Button>
                                </div>
                            </div>
                        </Card>
                        
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default page;
