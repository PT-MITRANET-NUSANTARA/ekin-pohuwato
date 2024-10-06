"use client"

import { DataTable } from '@/components';
import { dummyRekapPenilaian } from '@/data';
import { Breadcrumb, Button, Card, Typography } from 'antd';
import Link from 'next/link';
import React from 'react';

const {Title} = Typography;

const page = () => {


    const Column = [
        {
            title: 'ID',
            dataIndex: '_id',
            key: '_id',
            sorter: (a, b) => a._id.length - b._id.length,
            width: '10%'
        },
        {
            title: 'Name',
            dataIndex: 'nip',
            key: 'nip',
            sorter: (a, b) => a.nip.length - b.nip.length,
            width: '30%'
        },
        {
            title: 'Peroide Mulai',
            dataIndex: 'nama',
            key: 'nama',
            sorter: (a, b) => a.nama.length - b.nama.length,
            width: '30%'
        },
        {
            title: 'Periode Selesai',
            dataIndex: 'jabatan',
            key: 'jabatan',
            sorter: (a, b) => a.jabatan.length - b.jabatan.length,
            width: '30%'
        },
        {
            title: 'Periode Selesai',
            dataIndex: 'rating_hasil_kinerja',
            key: 'rating_hasil_kinerja',
            sorter: (a, b) => a.rating_hasil_kinerja.length - b.rating_hasil_kinerja.length,
            width: '30%'
        },
        {
            title: 'Periode Selesai',
            dataIndex: 'rating_perilaku_kerja',
            key: 'rating_perilaku_kerja',
            sorter: (a, b) => a.rating_perilaku_kerja.length - b.rating_perilaku_kerja.length,
            width: '30%'
        },
        {
            title: 'Periode Selesai',
            dataIndex: 'predikat_kinerja_periodik',
            key: 'predikat_kinerja_periodik',
            sorter: (a, b) => a.predikat_kinerja_periodik.length - b.predikat_kinerja_periodik.length,
            width: '30%'
        },
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
            <Card className="">
                <div className="flex flex-col">
                    <div className="flex items-center justify-between mb-12">
                        <Title className="mt-2" level={5}>
                            Rekap Penilaian Bawahan
                        </Title>
                        <div>
                            <Button type="primary"onClick={() => setModal({ modalData: null, title: 'Tambah Data', trigger: true, type: 'create' })}>
                                Download Excel
                            </Button>
                        </div>
                    </div>
                </div>
                <DataTable columns={Column} data={dummyRekapPenilaian} loading={false} ></DataTable>
            </Card>
        </div>
    );
};

export default page;
