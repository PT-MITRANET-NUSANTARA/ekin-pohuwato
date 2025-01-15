'use client';

import { Button, Card, Descriptions, List, Menu, Modal, Progress, Tag, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';

import React, { useState } from 'react';

const menuItem = [
    {
        key: 'user1',
        icon: <UserOutlined />,
        label: 'Atasan 1',
        children: [
            {
                key: 'user2',
                label: "Bawahan 1",
                children: [
                    {
                        key: 'user3',
                        label: "Sub Bawahan 1"
                    }
                ]
            }
        ]
    },
    {
        key: 'useruser1',
        icon: <UserOutlined />,
        label: 'Atasan 2',
        children: [
            {
                key: 'useruser2',
                label: "Bawahan 2",
                children: [
                    {
                        key: 'useruser3',
                        label: "Sub Bawahan 2"
                    }
                ]
            }
        ]
    }
];


const page = () => {
    const [activeKey, setActiveKey] = useState('');
    const [fileModal, setFileModal] = useState({ trigger: false, modalData: [] });


    const enhanceMenuItems = (items) => {
        return items.map((item) => {
            if (item.children) {
                return {
                    ...item,
                    onTitleClick: () => {
                        console.log(`Item dengan key '${item.key}' (toplevel) diklik!`);
                        setActiveKey(item.key);
                    },
                    children: enhanceMenuItems(item.children),
                };
            }
            return {
                ...item,
                onClick: () => {
                    console.log(`Item dengan key '${item.key}' (tanpa nested) diklik!`);
                    setActiveKey(item.key);
                },
            };
        });
    };

    const enhancedMenuItems = enhanceMenuItems(menuItem);

    const data = Array.from({ length: 2 }).map((_, i) => ({
        href: 'https://ant.design',
        title: `ant design part ${i}`,
        description:
            'Ant Design, a design language for background applications, is refined by Ant UED Team.',
        content:
            'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
    }));

    return (
        <div className="w-full flex flex-col gap-y-4">
            <Card>
                <div className="flex flex-col gap-y-4 mb-6">
                    <div className="w-full flex items-center justify-between">
                        <Typography.Title className="mt-2" level={5}>
                            Judul Halaman
                        </Typography.Title>
                    </div>
                    <div className="grid grid-flow-row divide-y text-xs">
                        <div className="flex items-center justify-between py-2">
                            <span className="uppercase font-semibold">periode</span>
                            <Tag color="blue" className="capitalize">
                                {/* {data?.periode_awal && data?.periode_akhir ? dateFormatter(data.periode_awal) + '-' + dateFormatter(data.periode_akhir) : 'Tanggal tidak tersedia'} */}
                            </Tag>
                        </div>
                        <div className="flex items-center justify-between py-2">
                            <span className="uppercase font-semibold">pendekatan</span>
                            <Tag color="blue" className="capitalize">
                                {/* {data?.pendekatan} */}
                            </Tag>
                        </div>
                        <div className="flex items-center justify-between py-2">
                            <span className="uppercase font-semibold">status</span>
                            <Tag color="green" className="capitalize">
                                {/* {data?.status} */}
                            </Tag>
                        </div>
                        <div className="flex items-center justify-between py-2">
                            <span className="uppercase font-semibold">Model SKP</span>
                            <p className="text-right capitalize">JAJF</p>
                        </div>
                        <div className="flex items-center justify-between py-2">
                            <span className="uppercase font-semibold">jenis pegawai</span>
                            <p className="text-right capitalize">pemimpin</p>
                        </div>
                    </div>
                </div>
            </Card>
            <div className='grid grid-cols-12 gap-4'>
                <div className='p-2 rounded-md col-span-3 bg-white h-fit'>
                    <Menu
                        className='col-span-3'
                        mode='inline'
                        items={enhancedMenuItems}
                        selectedKeys={[activeKey]}
                    />
                </div>
                <Card className='col-span-6 flex flex-col gap-y-2'>
                    <List
                        itemLayout='vertical'
                        size='large'
                        dataSource={data}
                        renderItem={(item) => (
                            <List.Item
                                key={item.title}
                            >
                                <div className='w-full grid grid-cols-12 gap-2'>
                                    <div className='col-span-6 p-2'>
                                        <Typography.Title level={5}>{item.title}</Typography.Title>
                                        <Typography.Paragraph>{item.description}</Typography.Paragraph>
                                        <Button variant="solid" color='primary' onClick={() => setFileModal({ trigger: true })}>
                                            Detail
                                        </Button>

                                    </div>
                                    <div className='col-span-6 p-2'>
                                        <Descriptions size='small' layout='vertical' column={1} bordered>
                                            <Descriptions.Item label="Nama">
                                                Mohamad Rafiq Daud
                                            </Descriptions.Item>
                                            <Descriptions.Item label="Progress">
                                                <Progress percent={60} />
                                            </Descriptions.Item>
                                        </Descriptions>
                                    </div>
                                </div>
                            </List.Item>
                        )}
                    />
                </Card>
                <Card className='col-span-3 h-fit'>
                    <Descriptions title="Detail Bukti Dukung" column={1} bordered layout='vertical'>
                        <Descriptions.Item label="Nama">
                            Mohamad Rafiq Daud
                        </Descriptions.Item>
                        <Descriptions.Item label="Progress">
                            <Progress percent={60} />
                        </Descriptions.Item>
                    </Descriptions>
                </Card>
            </div>
            <Modal open={fileModal.trigger} onCancel={() => setFileModal({ modalData: null, trigger: false })} footer={null}>
                <List
                    className="my-6"
                    itemLayout="horizontal"
                    dataSource={fileModal.modalData}
                    renderItem={(item) => (
                        <List.Item>
                            <div className="w-full flex justify-between items-center">
                                <div>
                                    <p>{item.name}</p>
                                    <small>{item.fileId}</small>
                                </div>
                                <div>
                                    <Button
                                        size="small"
                                        icon={<DownloadOutlined />}
                                        onClick={() => {
                                            const a = document.createElement('a');
                                            a.href = process.env.NEXT_PUBLIC_API_IMAGE_URL + '/' + item.fileId;
                                            a.download = item.name;
                                            a.click();
                                        }}
                                    />
                                </div>
                            </div>
                        </List.Item>
                    )}
                />
            </Modal>
        </div>
    );
};

export default page;
