'use client';

import { Avatar, Button, Card, Tabs, Typography } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { dummyAtasan, dummyBawahan } from '@/data';
import React from 'react';
import { DataTable } from '@/components';
const { Title } = Typography;

const page = () => {
    const loading = false;

    const Column = [
        {
            title: 'NIP',
            dataIndex: 'nip',
            key: 'nip',
            sorter: (a, b) => a.nip.length - b.nip.length,
            width: '30%',
            searchable: true
        },
        {
            title: 'Nama',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.length - b.name.length,
            width: '30%',
            searchable: true
        },
        {
            title: 'Jabatan',
            dataIndex: 'jabatan',
            key: 'jabatan',
            sorter: (a, b) => a.jabatan.length - b.jabatan.length,
            width: '30%',
            searchable: true
        },
        {
            title: 'Golru',
            dataIndex: 'golru',
            key: 'golru',
            sorter: (a, b) => a.golru.length - b.golru.length,
            width: '30%',
            searchable: true
        }
    ];
    return (
        <div className="w-full grid grid-cols-12 gap-2">
            <div className="col-span-12 mb-6">
                <Card>
                    <Tabs defaultActiveKey="1" type="card">
                        <Tabs.Items tab="Data Atasan" key="1">
                            <div className="flex flex-col gap-y-4">
                                <div className="grid grid-flow-row divide-y text-xs">
                                    <div className="flex items-center justify-between py-2">
                                        <span className="uppercase font-semibold">nip</span>
                                        <p className="text-right">196710281989021002</p>
                                    </div>
                                    <div className="flex items-center justify-between py-2">
                                        <span className="uppercase font-semibold">nama</span>
                                        <p className="text-right">SUPRATMAN NENTO</p>
                                    </div>
                                    <div className="flex items-center justify-between py-2">
                                        <span className="uppercase font-semibold">unit kerja</span>
                                        <p className="text-right">BADAN KEPEGAWAIAN DAN PENGEMBANGAN SUMBER DAYA MANUSIA</p>
                                    </div>
                                    <div className="flex items-center justify-between py-2">
                                        <span className="uppercase font-semibold">jabatan</span>
                                        <p className="text-right">Kepala BADAN KEPEGAWAIAN DAN PENGEMBANGAN SUMBER DAYA MANUSIA</p>
                                    </div>
                                    <div className="flex items-center justify-between py-2">
                                        <span className="uppercase font-semibold">golongan/ruang</span>
                                        <p className="text-right">IV/c</p>
                                    </div>
                                </div>
                            </div>
                        </Tabs.Items>
                        <Tabs.Items tab="List Pegawai Satuan Unit Kerja" key="2">
                            <DataTable columns={Column} data={dummyAtasan} loading={loading} />
                        </Tabs.Items>
                        <Tabs.Items tab="List Pegawai Bawahan" key="3">
                            <DataTable columns={Column} data={dummyBawahan} loading={loading} />
                        </Tabs.Items>
                        <Tabs.Items tab="Klaim Pimpinan Unit Kerja" key="4">
                            Data UNit
                        </Tabs.Items>
                    </Tabs>
                </Card>
            </div>
            <div className="col-span-2">
                <Avatar src="/profil.jpg" shape="square"  className="w-full h-auto aspect-square border-4 border-blue-500" />
            </div>
            <div className="col-span-6">
                <Card>
                    <div className="flex flex-col gap-y-4">
                        <Title className="m-0" level={5}>
                            Data Diri
                        </Title>
                        <div className="grid grid-flow-row divide-y text-xs">
                            <div className="flex items-center justify-between py-2">
                                <span className="uppercase font-semibold">instansi</span>
                                <p className="text-right">Pemerintah Kab. Pohuwato</p>
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <span className="uppercase font-semibold">nomor kartu asn</span>
                                <p className="text-right">M.140870</p>
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <span className="uppercase font-semibold">nip</span>
                                <p className="text-right">197904012005011015</p>
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <span className="uppercase font-semibold">nama</span>
                                <p className="text-right">SYAIFUL SAFRIL LUMA</p>
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <span className="uppercase font-semibold">tempat lahir</span>
                                <p className="text-right">Gorontalo</p>
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <span className="uppercase font-semibold">tmt cpns</span>
                                <p className="text-right">1 Januari 2023</p>
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <span className="uppercase font-semibold">tmt pns</span>
                                <p className="text-right">1 Maret 2023</p>
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <span className="uppercase font-semibold">jabatan</span>
                                <p className="text-right">KEPALA BIDANG PENGADAAN, PEMBERHENTIAN DAN INFORMASI KEPEGAWAIAN </p>
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <span className="uppercase font-semibold">jenjang</span>
                                <p className="text-right">jenjang</p>
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <span className="uppercase font-semibold">tmt jabatan</span>
                                <p className="text-right">1 Maret 2023</p>
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <span className="uppercase font-semibold">pangkat/golongan/ruang</span>
                                <p className="text-right">Penata Tingkat I / III/d</p>
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <span className="uppercase font-semibold">gelar depan</span>
                                <p className="text-right"></p>
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <span className="uppercase font-semibold">gelar belakang</span>
                                <p className="text-right">SE</p>
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <span className="uppercase font-semibold">jenis pegawai</span>
                                <p className="text-right">Pimpinan</p>
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <span className="uppercase font-semibold">jenis kelamin</span>
                                <p className="text-right">pria</p>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
            <div className="col-span-4">
                <Card>
                    <div className="flex flex-col gap-y-4">
                        <Title className="m-0" level={5}>
                            Data Unit
                        </Title>
                        <div className="grid grid-flow-row divide-y text-xs">
                            <div className="flex items-start justify-between py-2">
                                <span className="uppercase font-semibold">unit kerja pns</span>
                                <div className="flex flex-col gap-y-2 text-right items-end">
                                    <p>BIDANG PENGADAAN, PEMBERHENTIAN DAN INFORMASI KEPEGAWAIAN </p>
                                    <small>ID : 8ae482855a71b686015a74eabbde7454</small>
                                    <Button type="primary" shape="circle" size="small" icon={<SearchOutlined />} />
                                </div>
                            </div>
                            <div className="flex items-start justify-between py-2">
                                <span className="uppercase font-semibold">unit kerja atasan</span>
                                <div className="flex flex-col gap-y-2 text-right items-end">
                                    <p>BIDANG PENGADAAN, PEMBERHENTIAN DAN INFORMASI KEPEGAWAIAN </p>
                                    <small>ID : 8ae482855a71b686015a74eabbde7454</small>
                                    {/* <Button type="primary" shape="circle" size='small' icon={<SearchOutlined />} /> */}
                                </div>
                            </div>
                            <div className="flex items-start justify-between py-2">
                                <span className="uppercase font-semibold">unit kerja induk(unit jpt / unit mandiri)</span>
                                <div className="flex flex-col gap-y-2 text-right items-end">
                                    <p>BIDANG PENGADAAN, PEMBERHENTIAN DAN INFORMASI KEPEGAWAIAN </p>
                                    <small>ID : 8ae482855a71b686015a74eabbde7454</small>
                                    {/* <Button type="primary" shape="circle" size='small' icon={<SearchOutlined />} /> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default page;
