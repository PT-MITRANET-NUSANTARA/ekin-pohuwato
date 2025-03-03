'use client';

import { Alert, Breadcrumb, Button, Card, Form, Modal, Select, Space, Table, Tag, Typography } from 'antd';
import { PlusOutlined, EditOutlined, EyeOutlined, DeleteOutlined, DatabaseOutlined } from '@ant-design/icons';
import { DataTable, CrudModal } from '@/components';
import React, { useState } from 'react';
import { destroy, getAll, store, update } from '@/controller/RenstraController';
import useFetchData from '@/hooks/useFetchData';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { dummyAktivitas, dummyBawahan } from '@/data/dummyData';
import useNotification from '@/app/hook/useNotification';


const { Title } = Typography;
const { Option } = Select

const page = () => {
    const router = useRouter();
    const { IdOrganisasi, IdTanggal } = useParams();
    const { data, setData, loading, msg, status } = useFetchData(getAll);
    const [modal, setModal] = useState({ trigger: false, modalData: null, title: '' });
    const [aktivitasModal, setAktivitasModal] = useState(false)
    const { success, error } = useNotification()


    const onSubmit = async (values, type, id) => {
        try {
            let response;

            switch (type) {
                case 'create':
                    response = await store(values);
                    break;

                case 'edit':
                    response = await update(id, values);
                    break;

                case 'delete':
                    response = await destroy(id);
                    break;

                default:
                    throw new Error('Tipe operasi tidak valid');
            }

            if (response.ok) {
                const data = await getAll();
                setData(data.data);
                success('Berhasil', type === 'delete' ? 'Berhasil Menghapus Visi' : type === 'edit' ? 'Berhasil Mengedit Visi' : 'Berhasil Menambahkan Visi')
            } else {
                if (Array.isArray(response.data)) {
                    response.data.forEach((err) => {
                        error('Gagal', err);
                    });
                } else {
                    error('Gagal', response.data);
                }
            }
        } catch (error) {
            error('Gagal', err.message);
        }

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
            title: 'Content',
            dataIndex: 'content',
            key: 'content',
            sorter: (a, b) => a.content.length - b.content.length,
            width: '30%'
        },

        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="small">
                    <Button
                        onClick={() => setAktivitasModal(true)}
                        // type='primary'
                        size="middle"
                        icon={<EditOutlined />}
                    />
                </Space>
            )
        }
    ];

    const formFields = [
        {
            label: 'Role',
            name: 'role',
            type: 'select',
            rules: [
                {
                    required: true,
                    message: 'Field nama wajib di isi'
                }
            ],
            options: [
                {
                    label: 'Admin UMPEG',
                    value: 'admin_umpeg'
                },
                {
                    label: 'Petugas',
                    value: 'petugas'
                },
                {
                    label: 'User',
                    value: 'user'
                }
            ]
        }
    ];

    const handleClose = () => {
        setModal({ trigger: false, modalData: null });
    };

    return (
        <div className="w-full flex flex-col gap-y-4">
            <Card className="">
                <div className="flex flex-col">
                    <div className="flex items-center justify-between mb-12">
                        <Title className="mt-2" level={5}>
                            Aktivitas Hasil Kinerja
                        </Title>

                    </div>
                    <DataTable columns={Column} data={dummyAktivitas} loading={loading} />
                    <CrudModal title={modal.title} isModalOpen={modal.trigger} data={modal.modalData} onSubmit={onSubmit} onClose={handleClose} formFields={formFields} type={modal.type}></CrudModal>
                    <Modal open={aktivitasModal} onClose={() => setAktivitasModal(false)} onCancel={() => setAktivitasModal(false)}>
                        <Form className="mt-6 " layout="vertical">
                            <Form.Item name="hasil_kerja" label="Masukan Hasil Kerja Sebagai SKP">
                                <Select>
                                    <Option>Ya</Option>
                                    <Option>Tidak</Option>
                                </Select>
                            </Form.Item>
                        </Form>
                    </Modal>
                </div>
            </Card>
        </div>
    );
};

export default page;
