'use client';
import { Menu, Skeleton } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { DashboardLink } from '@/data';
import { useRouter } from 'next/navigation';
import Sider from 'antd/es/layout/Sider';
import useFetchData from '@/hooks/useFetchData';
import { getData } from '@/controller/AuthorizationController';
import { getAll as getAllUmpeg, getByUnitId as getUmpegByUnit } from '@/controller/UMPEGController';
import { get } from '@/controller/SettingsController';
import { getAll, getByUnitId } from '@/controller/VerifikasiController';
import { getPermision } from '@/controller/MiddlewareController';

const DashboardSider = ({ collapsed }) => {
    const router = useRouter();
    const { data: user } = useFetchData(getData);
    const [filteredMenu, setFilteredMenu] = useState([]);

    const fetchData = useCallback(async () => {
        if (!user) return;

        try {
            const data = await getPermision();

            const permissions = new Set(data.data);
            const updatedMenu = DashboardLink.map((item) => {
                const filteredChildren = item.children?.filter((child) => child.permission?.some((perm) => permissions.has(perm))) || [];

                if (!item.permission?.some((p) => permissions.has(p)) && filteredChildren.length === 0) {
                    return null;
                }

                return {
                    key: item.path || item.label,
                    icon: item.icon ? React.createElement(item.icon) : null,
                    label: item.label,
                    onClick: item.children ? undefined : () => router.push(item.path),
                    children: filteredChildren.length
                        ? filteredChildren.map((child) => ({
                            key: child.path,
                            label: child.label,
                            onClick: () => router.push(child.path)
                        }))
                        : undefined
                };
            }).filter(Boolean);

            setFilteredMenu(updatedMenu);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }, [user, router]);
    
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <Sider theme="light" breakpoint="lg" trigger={null} collapsed={collapsed} collapsedWidth="0" onBreakpoint={(broken) => { }} onCollapse={(collapsed, type) => { }}>
            <div className="w-full flex items-center justify-center mb-6">
                <div className="w-12 flex items-center justify-center gap-x-2 mt-4">
                    <img src="/ekinerja_pohuwato.png" alt="" />
                </div>
            </div>
            {filteredMenu === null ? (
                <Skeleton.Button active />
            ) : (
                <Menu
                    className="px-2 font-semibold"
                    theme="light"
                    mode="inline"
                    items={filteredMenu} // Filter out null values
                />
            )}

        </Sider>
    );
};

export default DashboardSider;
