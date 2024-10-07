'use client';

import { Breadcrumb, Button, Card, Collapse, Form, Modal, Select, Space, Tag, Typography, Input } from 'antd';
import { ReloadOutlined, PlusOutlined, PrinterOutlined, EditOutlined, DeleteOutlined} from '@ant-design/icons';
import Link from 'next/link';
import React, { use, useState } from 'react';
import { DataTable, SearchPegawai, TambahPegawai, TruncateText } from '@/components';
import { dummyIntervensiRhk } from '@/data';

const { Title } = Typography;
const { Option } = Select;

const page = () => {

    const loading = false;

    const [pegawaiModal, setPegawaiModal] = useState(false);
    const [jenisRhkModal, setJenisRhkModal] = useState(false);
    const [rencanaAksiModal, setRencanaAksiModal] = useState(false);

    const Column = [
        {
            title: 'ID',
            dataIndex: '_id',
            key: '_id',
            sorter: (a, b) => a._id.length - b._id.length,
            width: '10%'
        },
        {
            title: 'RHK Yang di Intervensi',
            dataIndex: 'nama_rhk',
            key: 'nama_rhk',
            sorter: (a, b) => a.nama_rhk.length - b.nama_rhk.length,
            width: '30%'
        },
        {
            title: 'Hasil RHK',
            dataIndex: 'intervensi',
            key: 'intervensi',
            sorter: (a, b) => a.intervensi.length - b.intervensi.length,
            width: '30%'
        },
        {
            title: 'Rencana Aksi',
            dataIndex: 'rencana_aksi',
            key: 'rencana_aksi',
            sorter: (a, b) => a.rencana_aksi.length - b.rencana_aksi.length,
            width: '30%',
            render: (_, record) => (
                <div className='flex flex-col gap-y-2'>
                    <ul className='list-disc list-inside'>
                        {record.rencana_aksi.map((item) => (
                            <li>{item.content}</li>
                        ))}
                    </ul>
                    <Button type='primary' className='w-fit' onClick={() => setRencanaAksiModal(true)}>
                        Tambah 
                    </Button>
                </div>
            ) 
        },
        {
            title: 'Rencana Aksi',
            dataIndex: 'jenis_rhk',
            key: 'jenis_rhk',
            sorter: (a, b) => a.jenis_rhk.length - b.jenis_rhk.length,
            width: '30%',
            render: (_, record) => (
                <div className='flex flex-col gap-y-2'>
                    <Tag color='blue' className='w-fit'>{record.jenis_rhk}</Tag>
                    <Button type='default' className='w-fit' onClick={() => setJenisRhkModal(true)}>
                        Ubah Jenis 
                    </Button>
                </div>
            ) 
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="small">
                    <Button
                        // type='primary'
                        size="middle"
                        icon={<EditOutlined />}
                    />
                    

                    <Button
                        // type='primary'
                        size="middle"
                        color="danger"
                        icon={<DeleteOutlined />}
                    />

                 
                </Space>
            )
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
                    <Title className="mt-2" level={5}>
                        Data Matriks SKP
                    </Title>
                    <div className="flex items-center gap-x-2">
                        <Button type="primary" icon={<ReloadOutlined />}>
                            Sinkronisasi SKP Bawahan
                        </Button>
                        <Button type="default" icon={<PlusOutlined />} onClick={() => setPegawaiModal(true)}>
                            Tambah Pegawai
                        </Button>
                        <Button type="default" icon={<PrinterOutlined />}>
                            Cetak
                        </Button>
                    </div>
                </div>
                <div className="grid grid-flow-row divide-y text-xs mb-12">
                    <div className="flex items-center justify-between py-2">
                        <span className="uppercase font-semibold">unit kerja</span>
                        <p className="text-right uppercase">Tahun 2024</p>
                    </div>
                    <div className="flex items-center justify-between py-2">
                        <span className="uppercase font-semibold">status pegawai</span>
                        <p className="text-right uppercase">BIDANG PENGADAAN, PEMBERHENTIAN DAN INFORMASI KEPEGAWAIAN </p>
                    </div>
                </div>
                <div className="w-full flex flex-col gap-y-4">
                    <Card type="inner" title="taruh title disini">
                        <div className="grid grid-flow-row divide-y text-xs ">
                            <div className="flex items-center justify-between py-2">
                                <span className="uppercase font-semibold">nama</span>
                                <p className="text-right uppercase">YAHYA S MALABAR NOOR</p>
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <span className="uppercase font-semibold">jabatan</span>
                                <div className="flex flex-col gap-y-2 text-right items-end">
                                    <p>PRANATA KEARSIPAN</p>
                                    <small>ID : 197801012007011026</small>
                                </div>
                            </div>
                            <div className="flex flex-col gap-y-4 py-2 pt-4">
                                <div className="flex items-center gap-x-2">
                                    <Button className="w-fit" type="primary">
                                        Lihat SKP
                                    </Button>
                                    <Button className="w-fit" type="primary">
                                        Tambah RHK
                                    </Button>
                                    <Button danger className="w-fit" type="primary">
                                        Hapus
                                    </Button>
                                </div>
                                <Collapse bordered>
                                    <Collapse.Panel key="1" header="RHK Yang di Intervensi">
                                        <DataTable columns={Column} data={dummyIntervensiRhk} loading={false} />
                                    </Collapse.Panel>
                                </Collapse>
                            </div>
                        </div>
                    </Card>
                </div>
            </Card>
            <TambahPegawai isModalOpen={pegawaiModal} onCancel={() => setPegawaiModal(false)} onClose={() => setPegawaiModal(false)}/>
            <Modal open={jenisRhkModal} onClose={() => setJenisRhkModal(false)} onCancel={() => setJenisRhkModal(false)}>
                <Form className='mt-6 ' layout='vertical'>
                    <Form.Item name="jenis_rhk" label="Ubah Jenis RHK">
                        <Select size='large'>
                            <Option>Organisasi</Option>
                            <Option>Lainnya</Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
            <Modal open={rencanaAksiModal} onClose={() => setRencanaAksiModal(false)} onCancel={() => setRencanaAksiModal(false)}>
                <Form className='mt-6 ' layout='vertical'>
                    <Form.Item name="rencana_aksi" label="Tambah Rencana Aksi">
                       <Input size='large'></Input>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default page;
