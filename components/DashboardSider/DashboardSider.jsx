'use client';
import { Menu } from 'antd';
import React from 'react';
import { DashboardLink } from '@/data';
import { useRouter } from 'next/navigation';
import Sider from 'antd/es/layout/Sider';

const DashboardSider = ({ collapsed }) => {
    const router = useRouter();
    const user = { role: "user" };
    const filteredMenu = DashboardLink.map((item) => {
        const hasChildren = Array.isArray(item.children);

        const filteredChildren = hasChildren
            ? item.children.filter((child) =>
                child.permission?.includes(user.role)
            )
            : [];

        if (
            (item.permission && !item.permission.includes(user.role)) &&
            filteredChildren.length === 0
        ) {
            return null;
        }

        return {
            key: item.path || item.label, 
            icon: item.icon ? React.createElement(item.icon) : null,
            label: item.label,
            onClick: hasChildren ? undefined : () => router.push(item.path),
            children:
                filteredChildren.length > 0
                    ? filteredChildren.map((child) => ({
                        key: child.path,
                        label: child.label,
                        onClick: () => router.push(child.path),
                    }))
                    : undefined,
        };
    }).filter(Boolean); 


    return (
        <Sider
            theme="light"
            breakpoint="lg"
            trigger={null}
            collapsed={collapsed}
            collapsedWidth="0"
            onBreakpoint={(broken) => {
            }}
            onCollapse={(collapsed, type) => {
            }}
        >
            <div className="w-full flex items-center justify-center mb-6">
                <div className="w-12 flex items-center justify-center gap-x-2 mt-4">
                    <img src="/ekinerja_pohuwato.png" alt="" />
                </div>
            </div>
            <Menu
                className="px-2 font-semibold"
                theme="light"
                mode="inline"
                items={filteredMenu} // Filter out null values
            />
        </Sider>
    );
};

export default DashboardSider;
