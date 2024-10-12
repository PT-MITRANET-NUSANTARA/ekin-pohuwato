'use client';
import { Menu } from 'antd';
import React from 'react';
import { DashboardLink } from '@/data';
import { useRouter } from 'next/navigation';
import Sider from 'antd/es/layout/Sider';

const DashboardSider = ({ collapsed }) => {
    const router = useRouter();


    return (
        <Sider
            theme="light"
            breakpoint="lg"
            trigger={null}
            collapsed={collapsed}
            collapsedWidth="0"
            onBreakpoint={(broken) => {
                console.log(broken);
            }}
            onCollapse={(collapsed, type) => {
                console.log(collapsed, type);
            }}
        >
            <div className="w-full flex items-center justify-center mb-6">
                <div className="w-20 flex items-center justify-center gap-x-2 mt-4">
                    <img src="/brand.png" alt="" />
                </div>
            </div>
            <Menu
                className="px-2 font-semibold"
                theme="light"
                mode="inline"
                items={DashboardLink.map((item) => {
                    // If item has children, do not set a path for the parent
                    const hasChildren = !!item.children;

                    return {
                        key: item.path , // Use path or label as key
                        icon: item.icon ? React.createElement(item.icon) : null,
                        label: item.label,
                        onClick: hasChildren ? undefined : () => router.push(item.path), // Only allow navigation if no children
                        children: hasChildren
                            ? item.children.map((child) => {
                                  return {
                                      key: child.path,
                                      label: child.label,
                                      onClick: () => router.push(child.path),
                                  };
                              })
                            : undefined,
                    };
                }).filter(Boolean)} // Filter out null values
            />
        </Sider>
    );
};

export default DashboardSider;
