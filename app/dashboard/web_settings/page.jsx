'use client';
import useNotification from '@/app/hook/useNotification';
import { CrudModal, DataTable } from '@/components';
import { getData } from '@/controller/AuthorizationController';
import { get, update } from '@/controller/SettingsController';
import { dummyMisi } from '@/data/dummyData';
import useFetchData from '@/hooks/useFetchData';
import { Card, Form, Tabs, Input, Button, TimePicker, InputNumber, Space, Typography } from 'antd';
import { EditOutlined, EyeOutlined, DeleteOutlined, SearchOutlined, PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';

const page = () => {
    const [submitLoading, setSubmitLoading] = useState(false);
    const [form] = Form.useForm();
    const { data: user, setData: setUser } = useFetchData(getData);
    const [dataSettings, setDataSettings] = useState(null);
    const { success, error } = useNotification()
    const [modal, setModal] = useState({ trigger: false, modalData: null, title: '', formFields: [] });

    const submitFinish = async (values) => {
        try {
            setSubmitLoading(true);
            const data = {
                ...values,
                harian_end: dayjs(values.harian_end).format('HH:mm:ss').toString(),
                harian_start: dayjs(values.harian_start).format('HH:mm:ss').toString(),
                istirahat_start: dayjs(values.istirahat_start).format('HH:mm:ss').toString(),
                istirahat_end: dayjs(values.istirahat_end).format('HH:mm:ss').toString(),
            }
            console.log(data);

            const res = await update(dataSettings?._id, data);
            console.log(res);

            if (res.ok) {
                success('Berhasil', 'Berhasil mengubah data')
                fetchData();
            }
        } catch (err) {
            error('Error', err)
        } finally {
            setSubmitLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchData();
        }
    }, [user]);


    const panduanCOlumn = [
        {
            title: 'No',
            dataIndex: 'index',
            render: (text, record, index) => index + 1,
            width: '5%'
        },
        {
            title: 'Visi',
            dataIndex: 'visi',
            key: 'visi',
            render: (_, record) => (
                <>
                    <Button
                        onClick={() => {
                            setInfoModal({
                                title: 'Informasi Visi',
                                trigger: true,
                                type: 'desc',
                                data: [
                                    {
                                        key: 'visi',
                                        label: 'Visi',
                                        children: record.visi.name
                                    }
                                ],
                                isLoading: false,
                                onClose: () => setInfoModal({ ...infoModal, trigger: false, data: null })
                            });
                        }}
                        icon={<SearchOutlined />}
                    >
                        Info
                    </Button>
                </>
            )
        },
        {
            title: 'Misi',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.length - b.name.length
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="small">
                    <Button
                        onClick={() => {
                            setInfoModal({
                                title: 'Informasi Misi',
                                trigger: true,
                                type: 'desc',
                                data: [
                                    {
                                        key: 'visi',
                                        label: 'Visi',
                                        children: record.visi.name
                                    },
                                    {
                                        key: 'misi',
                                        label: 'Misi',
                                        children: record.name
                                    }
                                ],
                                isLoading: false,
                                onClose: () => setInfoModal({ ...infoModal, trigger: false, data: null })
                            });
                        }}
                        // type='primary'
                        size="middle"
                        variant="outlined"
                        icon={<EyeOutlined />}
                    />
                    <Button
                        onClick={() => setModal({ formFields: panduanFields, trigger: true, modalData: { ...record, visi: record.visi._id }, title: `Edit Misi ${record._id}`, type: 'edit' })}
                        // type='primary'
                        size="middle"
                        variant="outlined"
                        color="primary"
                        icon={<EditOutlined />}
                    />

                    <Button
                        onClick={() => setModal({ formFields: panduanFields, trigger: true, modalData: { ...record, visi: record.visi._id }, title: `Edit Misi ${record._id}`, type: 'delete' })}
                        // type='primary'
                        size="middle"
                        danger
                        icon={<DeleteOutlined />}
                    />
                </Space>
            )
        }
    ];

    const panduanFields = [

        {
            label: 'Nama Panduan',
            name: 'panduan_name',
            type: 'text',
            rules: [
                {
                    required: true,
                    message: 'Field nama panduan wajib di isi'
                }
            ],
        },
        {
            label: 'File Panduan',
            name: 'files',
            type: 'upload'
        },
    ];

    const fetchData = async () => {
        try {
            const data = await get();
            if (data && data.data) {
                const values = {
                    ...data.data,
                    istirahat_start: dayjs(`${dayjs().format("YYYY-MM-DD")} ${data.data.istirahat_start}`, "YYYY-MM-DD HH:mm:ss"),
                    istirahat_end: dayjs(`${dayjs().format("YYYY-MM-DD")} ${data.data.istirahat_end}`, "YYYY-MM-DD HH:mm:ss"),
                    harian_start: dayjs(`${dayjs().format("YYYY-MM-DD")} ${data.data.harian_start}`, "YYYY-MM-DD HH:mm:ss"),
                    harian_end: dayjs(`${dayjs().format("YYYY-MM-DD")} ${data.data.harian_end}`, "YYYY-MM-DD HH:mm:ss")
                };

                setDataSettings(data.data);
                form.setFieldsValue(values);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };


    return (
        <div className="w-full flex flex-col gap-y-4">
            <Card className="">
                <Tabs defaultActiveKey="1" tabPosition="left" className="min-h-screen">
                    <Tabs.Items tab="Admin Setting" key="1">
                        <Form form={form} layout="vertical" className="flex flex-col gap-y-2 mt-6" onFinish={submitFinish}>
                            <Form.Item name="admin_id" label="Admin ID" className="m-0">
                                <Input size="large" placeholder="Masukan admin ID" />
                            </Form.Item>
                            <Form.Item name="total_feedback" label="Total Feedback" className="m-0">
                                <InputNumber size="large" placeholder="masukan total feedback" className="w-full" />
                            </Form.Item>
                            <Form.Item name="total_time" label="Total Waktu (Menit)" className="m-0">
                                <InputNumber size="large" placeholder="masukan total waktu" className="w-full" />
                            </Form.Item>
                            <Form.Item name="harian_start" label="Harian Mulai (Jam)" className="m-0">
                                <TimePicker size="large" className="w-full" />
                            </Form.Item>
                            <Form.Item name="harian_end" label="Harian Akhir (Jam)" className="m-0">
                                <TimePicker size="large" className="w-full" />
                            </Form.Item>
                            <Form.Item name="istirahat_start" label="Istrahat Mulai (Jam)" className="m-0">
                                <TimePicker size="large" className="w-full" />
                            </Form.Item>
                            <Form.Item name="istirahat_end" label="Istrahat Mulai (Jam)" className="m-0">
                                <TimePicker size="large" className="w-full" />
                            </Form.Item>

                            <Form.Item className="m-0 mt-6">
                                <Button type="primary" htmlType="submit" loading={submitLoading}>
                                    Simpan
                                </Button>
                            </Form.Item>
                        </Form>
                    </Tabs.Items>
                    <Tabs.Items tab="Panduan" key="2">
                        <div className="flex items-center justify-between mb-4">
                            <Typography.Title className="mt-2" level={5}>
                                Data Misi
                            </Typography.Title>
                            <div>
                                <Button type="primary" icon={<PlusOutlined />} onClick={() => setModal({ modalData: null, title: 'Tambah Data', trigger: true, type: 'create', formFields: panduanFields })}>
                                    Tambah
                                </Button>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <DataTable columns={panduanCOlumn} data={dummyMisi} />
                        </div>
                        <CrudModal isLoading={submitLoading} title={modal.title} isModalOpen={modal.trigger} data={modal.modalData} onSubmit={() => { }} onClose={() => setModal({ trigger: false, modalData: null })} formFields={modal.formFields} type={modal.type} />
                    </Tabs.Items>
                </Tabs>
            </Card>
        </div>
    );
};

export default page;
