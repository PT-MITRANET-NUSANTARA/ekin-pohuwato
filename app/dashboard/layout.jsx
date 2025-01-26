'use client';
import React, { useEffect, useState } from 'react';
import { DashboardSider, DashboardFooter } from '../../components';
import { LogoutOutlined, MenuOutlined, UserOutlined, SettingOutlined, BellOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Avatar, Badge, Breadcrumb, Button, Card, Dropdown, Layout, message, Modal, Space, theme } from 'antd';
import { useRouter } from 'next/navigation';
import { getData, logOut } from '@/controller/AuthorizationController';
import useFetchData from '@/hooks/useFetchData';
import { getFotoByNIP } from '@/controller/IDSN/DataUtamaController';
import Image from 'next/image';
const { Header, Content } = Layout;

const layout = ({ children }) => {
    const [modal, setModal] = useState({ trigger: false, title: "" })
    const router = useRouter();
    message.config({
        duration: 5,
        maxCount: 1
    });
    const { data, loading } = useFetchData(getData); // Assuming getData is the function fetching the token and NIP
    const [foto, setFoto] = useState(null);

    useEffect(() => {
        if (data) {
            fetchData(); // You're fetching data when `data` changes
        }
    }, [data]);

    const fetchData = async () => {
        try {
            const foto = await getFotoByNIP(data?.token, data?.user.nipBaru);
            console.log(foto);

            setFoto(foto);
        } catch (error) {
            console.log(error);
        }
    };

    console.log(foto);

    const items = [
        {
            key: '1',
            label: (
                <button className="flex items-center gap-x-2 min-w-32" onClick={() => router.push('/dashboard/profil')}>
                    <UserOutlined />
                    Profil
                </button>
            )
        },
        {
            key: '2',
            label: (
                <button className="flex items-center gap-x-2  min-w-32" onClick={() => router.push('/dashboard/web_settings')}>
                    <SettingOutlined />
                    Settings
                </button>
            )
        },
        {
            key: '3',
            label: (
                <button onClick={async () => {
                    const res = await logOut();
                    console.log(res);

                    if (res.ok) {
                        message.success('Berhasil Keluar');
                        router.push('/login');
                    }
                }} className="flex items-center gap-x-2 text-red-500 min-w-32">
                    <LogoutOutlined />
                    Logout
                </button>
            )
        },
    ];

    const notificationItems = [
        {
            key: '1',
            label: (
                <div className='inline-flex items-center gap-x-4 max-w-60' onClick={() => setModal({ trigger: true, title: "Ini isi dengan head notif" })}>
                    <ExclamationCircleOutlined className='text-blue-500 text-lg' />
                    <div>
                        <b className='turncate'>lorem ipsum dolor sit amet Naruto Shipuden ultimate ninja storm</b>
                        <p className='turncate'>Lorem ipsum Dolor Sit Amet Naruto Shipuden ultimate ninja storm</p>
                    </div>
                </div>

            )
        },
        {
            key: '2',
            label: (
                <div className='inline-flex items-center gap-x-4 max-w-60' onClick={() => setModal({ trigger: true, title: "Ini isi dengan head notif" })}>
                    <ExclamationCircleOutlined className='text-blue-500 text-lg' />
                    <div>
                        <b className='turncate'>lorem ipsum dolor sit amet Naruto Shipuden ultimate ninja storm</b>
                        <p className='turncate'>Lorem ipsum Dolor Sit Amet Naruto Shipuden ultimate ninja storm</p>
                    </div>
                </div>

            )
        }
    ]
    const [collapsed, setCollapsed] = useState(false);

    return (
        <Layout className="min-h-screen">
            <DashboardSider collapsed={collapsed} />
            <Layout>
                <Header className="bg-blue-500 p-0">
                    <div className="w-full h-full flex px-4 items-center justify-between">
                        <Button className="text-white " type="text" icon={<MenuOutlined />} onClick={() => setCollapsed(!collapsed)} color="default"></Button>
                        <div className="flex items-center gap-x-4">
                            <Dropdown menu={{ items: notificationItems }}>
                                {notificationItems.length > 0 ? (
                                    <Badge size="small" count={notificationItems.length}>
                                        <BellOutlined style={{ fontSize: '24px', color: "#fff" }} />
                                    </Badge>
                                ) : (
                                    <BellOutlined style={{ fontSize: '24px', color: "#fff" }} />
                                )}
                            </Dropdown>
                            <Dropdown menu={{ items }}>
                                <a onClick={(e) => e.preventDefault()}>
                                    <Space>
                                        <Avatar className="bg-color-primary-100 text-color-primary-500 font-semibold">
                                            {foto ? <Image src={foto} alt="Foto Profil" width={30} height={30} /> : 'A'}
                                        </Avatar>
                                        {/* <DownOutlined /> */}
                                    </Space>
                                </a>
                            </Dropdown>

                        </div>
                    </div>
                </Header>
                <Modal open={modal.trigger} onCancel={() => setModal({ trigger: false })} title={modal.title} footer={false} >
                    <Card>
                        Isi Pesan notifikasi
                    </Card>

                    <div className='mt-4 inline-flex gap-x-2'>
                        <Button color='primary' variant='solid'>
                            Tandai telah dibaca
                        </Button>
                        <Button onClick={() => setModal({trigger: false})}>
                            Batal
                        </Button>

                    </div>
                </Modal>

                <Content
                    style={{
                        margin: '24px 16px 0'
                    }}
                >
                    {/* <Breadcrumb style={{ margin: '16px 0' }}>
                        <Breadcrumb.Item>Home</Breadcrumb.Item>
                        <Breadcrumb.Item>List</Breadcrumb.Item>
                        <Breadcrumb.Item>App</Breadcrumb.Item>
                    </Breadcrumb> */}

                    {children}
                </Content>

                <DashboardFooter />
            </Layout>
        </Layout>
    );
};

export default layout;
