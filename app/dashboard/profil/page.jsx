'use client';

import { Avatar, Badge, Button, Card, Image, Tabs, Typography } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { dummyAtasan, dummyBawahan } from '@/data';
import React, { useEffect, useState } from 'react';
import { DataTable } from '@/components';
import { getData } from '@/controller/AuthorizationController';
import useFetchData from '@/hooks/useFetchData';
import { getByNIP, getFotoByNIP } from '@/controller/IDSN/DataUtamaController';
import { getAllPosjabByUnit, getByNIP as getJabatanByNIP } from '@/controller/IDSN/JabatanController';
const { Title } = Typography;
import { cekJabatan } from '@/utils/jabatanUtils';
import { getById } from '@/controller/IDSN/UnitController';

const page = () => {
    const { data, loading } = useFetchData(getData); // Assuming getData is the function fetching the token and NIP
    const [user, setUser] = useState(null);
    const [foto, setFoto] = useState(null);
    const [bawahan, setBawahan] = useState(null);
    const [unor, setUnor] = useState(null);

    useEffect(() => {
        if (data) {
            fetchData(); // You're fetching data when `data` changes
        }
    }, [data]);

    const fetchData = async () => {
        try {
            const dt = await getByNIP(data?.token, data?.user.nipBaru);
            const jabatan = await getJabatanByNIP(data?.token, data?.user.nipBaru);
            setUser({
                user: dt.mapData.DataUtama,
                jabatan: jabatan.mapData.data[0]
            });
            const selectedJabatan = jabatan.mapData.data[0];
            const unit = await getAllPosjabByUnit(data?.token, selectedJabatan.unor.induk.id);
            const struktur = await getById(data?.token, selectedJabatan.unor.induk.id);

            const isAtasan = cekJabatan(struktur.mapData[0], selectedJabatan.nama_jabatan);
            console.log('AtASAN', isAtasan);

            let bawahan = [];
            let unor = [];

            if (isAtasan) {
                // Filter bawahan based on the selectedJabatan conditions
                bawahan = unit.mapData.data.filter((item) => (item.unor.id === selectedJabatan.unor.id && item.nama_jabatan !== selectedJabatan.nama_jabatan) || item.unor.atasan?.unor_id === selectedJabatan.unor.id);

                // Filter unor based on selectedJabatan.unor.id
                unor = unit.mapData.data
                    .filter((item) => item.unor.id === selectedJabatan.unor.id)
                    .map((item) => ({
                        ...item, // Spread the existing properties of the object
                        isPemimpin: item.userId === selectedJabatan.userId // Set isPemimpin to true if userId matches
                    }));
            } else {
                // If not an atasan, set bawahan as an empty array
                bawahan = [];
                unor = unit.mapData.data.filter((item) => item.unor.id === selectedJabatan.unor.id);
            }
            const foto = await getFotoByNIP(data?.token, data?.user.nipBaru);
            setFoto(foto);
            setBawahan(bawahan);
            setUnor(unor);
        } catch (error) {
            console.error(error);
        }
    };

    const Column = [
        {
            title: 'idASN',
            dataIndex: 'userId',
            key: 'userId',
            sorter: (a, b) => a.nip.length - b.nip.length,
            searchable: true
        },
        {
            title: 'Nama',
            dataIndex: 'nama_asn',
            key: 'nama_asn',
            sorter: (a, b) => a.nama_asn.length - b.nama_asn.length,
            searchable: true
        },
        {
            title: 'Jabatan',
            dataIndex: 'nama_jabatan',
            key: 'nama_jabatan',
            sorter: (a, b) => a.nama_jabatan.length - b.nama_jabatan.length,
            searchable: true
        },
        {
            title: 'Unit Kerja',
            dataIndex: 'unitkerja',
            key: 'unitkerja',
            sorter: (a, b) => a.unitkerja.length - b.unitkerja.length,
            searchable: true,
            render: (text, record) => record.unor?.nama || 'N/A' // Safely render `unor.nama` or 'N/A' if not available
        }
    ];

    const ColumnUnor = [
        {
            title: 'idASN',
            dataIndex: 'userId',
            key: 'userId',
            sorter: (a, b) => a.userId.length - b.userId.length,
            searchable: true
        },
        {
            title: 'Nama',
            dataIndex: 'nama_asn',
            key: 'nama_asn',
            sorter: (a, b) => a.nama_asn.length - b.nama_asn.length,
            width: '30%',
            searchable: true
        },
        {
            title: 'Jabatan',
            dataIndex: 'nama_jabatan',
            key: 'nama_jabatan',
            sorter: (a, b) => a.nama_jabatan.length - b.nama_jabatan.length,
            searchable: true
        },
        {
            title: 'Unit Kerja',
            dataIndex: 'unitkerja',
            key: 'unitkerja',
            sorter: (a, b) => a.unitKerja.length - b.unitKerja.length,
            searchable: true,
            render: (text, record) => record.unor?.nama || 'N/A' // Safely render `unor.nama` or 'N/A' if not available
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (text, record) => {
                // If isPemimpin is true, render a Badge with "Pimpinan", otherwise render an empty string
                return record.isPemimpin ? <Badge count="Pimpinan" style={{ backgroundColor: '#52c41a' }} /> : '';
            }
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
                                        <p className="text-right">{user?.jabatan.unor.atasan.asn.nip_atasan}</p>
                                    </div>
                                    <div className="flex items-center justify-between py-2">
                                        <span className="uppercase font-semibold">nama</span>
                                        <p className="text-right">{user?.jabatan.unor.atasan.asn.nama_atasan}</p>
                                    </div>
                                    <div className="flex items-center justify-between py-2">
                                        <span className="uppercase font-semibold">unit kerja</span>
                                        <p className="text-right">{user?.jabatan.unor.atasan.unor_nama}</p>
                                    </div>
                                    <div className="flex items-center justify-between py-2">
                                        <span className="uppercase font-semibold">jabatan</span>
                                        <p className="text-right">{user?.jabatan.unor.atasan.unor_jabatan}</p>
                                    </div>
                                    {/* <div className="flex items-center justify-between py-2">
                                        <span className="uppercase font-semibold">golongan/ruang</span>
                                        <p className="text-right">IV/c</p>
                                    </div> */}
                                </div>
                            </div>
                        </Tabs.Items>
                        <Tabs.Items tab="List Pegawai Satuan Unit Kerja" key="2">
                            <DataTable columns={ColumnUnor} data={unor ? unor : []} loading={loading} />
                        </Tabs.Items>
                        <Tabs.Items tab="List Pegawai Bawahan" key="3">
                            <DataTable columns={Column} data={bawahan ? bawahan : []} loading={loading} />
                        </Tabs.Items>
                    </Tabs>
                </Card>
            </div>
            <div className="col-span-2">
                {/* <Avatar src={foto} shape="square" size={200} className="border-4 border-blue-500" /> */}
                <Image src={foto} className="w-full border-4 border-blue-500 rounded-lg" />
            </div>
            <div className="col-span-6">
                <Card>
                    <div className="flex flex-col gap-y-4">
                        <Title className="m-0" level={5}>
                            Data Diri
                        </Title>
                        <div className="grid grid-flow-row divide-y text-xs">
                            {/* <div className="flex items-center justify-between py-2">
                                <span className="uppercase font-semibold">instansi</span>
                                <p className="text-right">Pemerintah Kab. Pohuwato</p>
                            </div> */}
                            <div className="flex items-center justify-between py-2">
                                <span className="uppercase font-semibold">nomor kartu asn</span>
                                <p className="text-right">{user?.user.idASN}</p>
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <span className="uppercase font-semibold">nip</span>
                                <p className="text-right">{user?.user.nipBaru}</p>
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <span className="uppercase font-semibold">nama</span>
                                <p className="text-right">{user?.user.nama}</p>
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <span className="uppercase font-semibold">tempat lahir</span>
                                <p className="text-right">Gorontalo</p>
                            </div>
                            {/* <div className="flex items-center justify-between py-2">
                                <span className="uppercase font-semibold">tmt cpns</span>
                                <p className="text-right">1 Januari 2023</p>
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <span className="uppercase font-semibold">tmt pns</span>
                                <p className="text-right">1 Maret 2023</p>
                            </div> */}
                            <div className="flex items-center justify-between py-2">
                                <span className="uppercase font-semibold">jabatan</span>
                                <p className="text-right">{user?.jabatan.nama_jabatan} </p>
                            </div>
                            {/* <div className="flex items-center justify-between py-2">
                                <span className="uppercase font-semibold">jenjang</span>
                                <p className="text-right">jenjang</p>
                            </div> */}
                            {/* <div className="flex items-center justify-between py-2">
                                <span className="uppercase font-semibold">tmt jabatan</span>
                                <p className="text-right">1 Maret 2023</p>
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <span className="uppercase font-semibold">pangkat/golongan/ruang</span>
                                <p className="text-right">Penata Tingkat I / III/d</p>
                            </div> */}
                            <div className="flex items-center justify-between py-2">
                                <span className="uppercase font-semibold">gelar depan</span>
                                <p className="text-right">{user?.user.gelarDepan}</p>
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <span className="uppercase font-semibold">gelar belakang</span>
                                <p className="text-right">{user?.user.gelarBelakang}</p>
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <span className="uppercase font-semibold">jenis pegawai</span>
                                <p className="text-right">{user?.user.jenisPegawai.nama}</p>
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <span className="uppercase font-semibold">jenis kelamin</span>
                                <p className="text-right">{user?.user.jenisKelamin.nama}</p>
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
                                    <p>{user?.jabatan.unor.nama} </p>
                                    <small>ID : {user?.jabatan.unor.id}</small>
                                    {/* <Button type="primary" shape="circle" size="small" icon={<SearchOutlined />} /> */}
                                </div>
                            </div>
                            <div className="flex items-start justify-between py-2">
                                <span className="uppercase font-semibold">unit kerja atasan</span>
                                <div className="flex flex-col gap-y-2 text-right items-end">
                                    <p>{user?.jabatan.unor.atasan.unor_nama} </p>
                                    <small>ID : {user?.jabatan.unor.atasan.unor_id}</small>
                                    {/* <Button type="primary" shape="circle" size='small' icon={<SearchOutlined />} /> */}
                                </div>
                            </div>
                            <div className="flex items-start justify-between py-2">
                                <span className="uppercase font-semibold">unit kerja induk(unit jpt / unit mandiri)</span>
                                <div className="flex flex-col gap-y-2 text-right items-end">
                                    <p>{user?.jabatan.unor.induk.nama} </p>
                                    <small>ID : {user?.jabatan.unor.induk.id}</small>
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
