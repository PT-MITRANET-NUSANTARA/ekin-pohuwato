'use client';
import React, { useState } from 'react';
import { DashboardSider, DashboardFooter } from '../../components';
import { LogoutOutlined, MenuOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Breadcrumb, Button, Dropdown, Layout, Space, theme } from 'antd';
const { Header, Content } = Layout;

const items = [
    {
        key: '1',
        label: (
            <button className="flex items-center gap-x-2 min-w-32">
                <UserOutlined />
                Pengaturan Profil
            </button>
        )
    },
    {
        key: '2',
        label: (
            <button className="flex items-center gap-x-2 text-color-danger-500 min-w-32">
                <LogoutOutlined />
                Logout
            </button>
        )
    }
];

const layout = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <Layout className="min-h-screen">
            <DashboardSider collapsed={collapsed} />
            <Layout>
                <Header className="bg-blue-500 p-0">
                    <div className="w-full h-full flex px-4 items-center justify-between">
                        <Button className='text-white' type="text" icon={<MenuOutlined />} onClick={() => setCollapsed(!collapsed)} color="default"></Button>
                        <div className="flex items-center gap-x-2">
                            <Dropdown menu={{ items }}>
                                <a onClick={(e) => e.preventDefault()}>
                                    <Space>
                                        <Avatar className="bg-color-primary-100 text-color-primary-500 font-semibold">U</Avatar>
                                        {/* <DownOutlined /> */}
                                    </Space>
                                </a>
                            </Dropdown>
                        </div>
                    </div>
                </Header>

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
