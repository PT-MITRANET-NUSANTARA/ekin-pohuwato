'use client';
import { Breadcrumb, Card, Form, Tabs, Input, Button } from 'antd';
import Link from 'next/link';
import React from 'react';

const page = () => {
    return (
        <div className="w-full flex flex-col gap-y-4">
            <Breadcrumb
                items={[
                    {
                        title: 'Dashboard'
                    },
                    {
                        title: <Link href="/dashboard/renstra">Settings</Link>
                    }
                ]}
            />
            <Card className="">
                <Tabs defaultActiveKey="1" tabPosition="left" className="min-h-screen">
                    <Tabs.Items tab="Jumlah Menit" key="1">
                        <Form layout='vertical' className="flex flex-col gap-y-2 mt-6">
                            <Form.Item name="menit" label="Jumlah Menit" className='m-0'>
                                <Input size='large'/>
                            </Form.Item>
                            <Form.Item className='m-0 mt-6'>
                                <Button type='primary'>
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
