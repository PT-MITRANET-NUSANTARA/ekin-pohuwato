'use client';
import { getData } from '@/controller/AuthorizationController';
import { get, update } from '@/controller/SettingsController';
import useFetchData from '@/hooks/useFetchData';
import { Breadcrumb, Card, Form, Tabs, Input, Button, TimePicker, InputNumber } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';

const page = () => {
    const [submitLoading, setSubmitLoading] = useState();
    const { data: user, setData: setUser } = useFetchData(getData);
    const [data, setData] = useState(null);

    const submitFinish = async (values) => {
        setSubmitLoading(false);
        console.log(values);
        setSubmitLoading(true);
        const data = {
            ...values
        }

        const res = await update(data._id, data);
        if (res.ok) {
            fetchData()
        }
    };

    useEffect(() => {
        if (user) {
            fetchData();
        }
    }, [user]);

    const fetchData = async () => {
        try {
            const data = await get();
            const values = {
                ...data.data,
                istirahat_start: dayjs(`${dayjs().format("YYYY-MM-DD")} ${data.data.istirahat_start}`, "YYYY-MM-DD HH:mm:ss"),
                istirahat_end: dayjs(`${dayjs().format("YYYY-MM-DD")} ${data.data.istirahat_end}`, "YYYY-MM-DD HH:mm:ss"),
                harian_start: dayjs(`${dayjs().format("YYYY-MM-DD")} ${data.data.harian_start}`, "YYYY-MM-DD HH:mm:ss"),
                harian_end: dayjs(`${dayjs().format("YYYY-MM-DD")} ${data.data.harian_end}`, "YYYY-MM-DD HH:mm:ss")
            };
            console.log(values);
            
            setData(values);
        } catch (error) {
            console.log(error);
        }
    };

    if (!data) {
        return <></>
    }
    return (
        <div className="w-full flex flex-col gap-y-4">
            <Card className="">
                <Tabs defaultActiveKey="1" tabPosition="left" className="min-h-screen">
                    <Tabs.Items tab="Admin Setting" key="1">
                        <Form layout="vertical" className="flex flex-col gap-y-2 mt-6" onFinish={submitFinish}>
                            <Form.Item name="admin_id" label="Admin ID" className="m-0">
                                <Input size="large" placeholder="Masukan admin ID" />
                            </Form.Item>
                            <Form.Item name="feedback" label="Total Feedback" className="m-0" initialValue={data}>
                                <InputNumber size="large" placeholder="masukan total feedback" className="w-full" />
                            </Form.Item>
                            <Form.Item name="time" label="Total Waktu" className="m-0" initialValue={data}>
                                <InputNumber size="large" placeholder="masukan total waktu" className="w-full" />
                            </Form.Item>
                            <Form.Item name="harian_start" label="Harian Mulai" className="m-0" initialValue={data}>
                                <TimePicker size="large" className="w-full" />
                            </Form.Item>
                            <Form.Item name="harian_end" label="Harian Akhir" className="m-0" initialValue={data}>
                                <TimePicker size="large" className="w-full" />
                            </Form.Item>
                            <Form.Item name="istrahat_start" label="Istrahat Mulai" className="m-0" initialValue={data}>
                                <TimePicker size="large" className="w-full" />
                            </Form.Item>
                            <Form.Item name="istrahat_end" label="Istrahat Mulai" className="m-0" initialValue={data}>
                                <TimePicker size="large" className="w-full" />
                            </Form.Item>

                            <Form.Item className="m-0 mt-6">
                                <Button type="primary" htmlType="submit" loading={submitLoading}>
                                    Simpan
                                </Button>
                            </Form.Item>
                        </Form>
                    </Tabs.Items>
                </Tabs>
            </Card>
        </div>
    );
};

export default page;
