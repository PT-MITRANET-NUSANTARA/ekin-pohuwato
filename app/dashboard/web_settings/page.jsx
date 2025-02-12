'use client';
import { Breadcrumb, Card, Form, Tabs, Input, Button, TimePicker, InputNumber } from 'antd';
import React, { useState } from 'react';

const page = () => {
    const [submitLoading, setSubmitLoading] = useState()
    const submitFinish = (values) => {
        setSubmitLoading(false)
        console.log(values)
        setSubmitLoading(true)
    }
    return (
        <div className="w-full flex flex-col gap-y-4">
            <Card className="">
                <Tabs defaultActiveKey="1" tabPosition="left" className="min-h-screen">
                    <Tabs.Items tab="Admin Setting" key="1">
                        <Form layout='vertical' className="flex flex-col gap-y-2 mt-6" onFinish={submitFinish}>
                            <Form.Item name="admin_id" label="Admin ID" className='m-0'>
                                <Input size='large' placeholder='Masukan admin ID' />
                            </Form.Item>
                            <Form.Item name="feedback" label="Total Feedback" className='m-0'>
                                <InputNumber size='large'  placeholder='masukan total feedback' className='w-full'/>
                            </Form.Item>
                            <Form.Item name="time" label="Total Waktu" className='m-0'>
                                <InputNumber size='large' placeholder='masukan total waktu' className='w-full' />
                            </Form.Item>
                            <Form.Item name="harian_start" label="Harian Mulai" className='m-0'>
                                <TimePicker size='large' className='w-full' />
                            </Form.Item>
                            <Form.Item name="harian_end" label="Harian Akhir" className='m-0'>
                                <TimePicker size='large' className='w-full' />
                            </Form.Item>
                            <Form.Item name="istrahat_start" label="Istrahat Mulai" className='m-0'>
                                <TimePicker size='large' className='w-full' />
                            </Form.Item>
                            <Form.Item name="istrahat_end" label="Istrahat Mulai" className='m-0'>
                                <TimePicker size='large' className='w-full' />
                            </Form.Item>

                            <Form.Item className='m-0 mt-6'>
                                <Button type='primary' htmlType='submit' loading={submitLoading}>
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
