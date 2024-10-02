"use client"
import { Menu } from 'antd';
import React, { useState } from 'react'
import { DashboardLink } from '../../data/Link';
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
            <div className="w-16 h-16 flex items-center justify-center gap-x-2">
              Brand
            </div>
          </div>
          <Menu
            className="px-2 font-semibold"
            theme="light"
            mode="inline"
            defaultSelectedKeys={["0"]}
            items={DashboardLink.map((item, index) => ({
              key: item.path, // Gunakan path sebagai key agar unik
              icon: React.createElement(item.icon), // Pastikan ikonnya di-render dengan benar
              label: item.label,
              onClick: () => router.push(item.path), // Gunakan router.push langsung
            }))}
          />
        </Sider>
  )
}

export default DashboardSider