'use client';

import { useState, useEffect } from 'react';
import { Alert, Breadcrumb, Button, Card, Space, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Line } from 'react-chartjs-2';
import Link from 'next/link';
import React from 'react';
import { Data, dummyHasilPenilaian } from '@/data/dummyData';
import { CategoryScale, LinearScale, PointElement, LineElement, Title as ChartTitle, Tooltip, Legend, Chart } from 'chart.js';
import { DataTable } from '@/components';
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, ChartTitle, Tooltip, Legend);

const { Title } = Typography;

const page = () => {
    const [penilaianChart, setPenilaianChart] = useState({
        labels: [],
        datasets: []
    });

    useEffect(() => {
        // Prepare data for the chart
        const labels = Data.map((item) => item.year);
        const userGains = Data.map((item) => item.userGain);
        const userLosses = Data.map((item) => item.userLost);

        setPenilaianChart({
            labels: labels,
            datasets: [
                {
                    label: 'User Gain',
                    data: userGains,
                    borderColor: '#93c5fd',
                    backgroundColor: 'rgba(147, 197, 253, 0.2)',
                    fill: true
                },
                {
                    label: 'User Lost',
                    data: userLosses,
                    borderColor: '#fca5a5',
                    backgroundColor: 'rgba(252, 165, 165, 0.2)',
                    fill: true
                }
            ]
        });
    }, []);

    const Column = [
        {
            title: 'NIP',
            dataIndex: 'nip',
            key: 'nip',
            sorter: (a, b) => a.nip.length - b.nip.length,
            width: '10%'
        },
        {
            title: 'Visi',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.length - b.name.length,
            width: '10%',
        },
        {
            title: 'Penilaian',
            dataIndex: 'penilaian',
            key: 'penilaian',
            sorter: (a, b) => a.penilaian.length - b.penilaian.length,
            width: '30%'
        },
      
    ];

    return (
        <div className="w-full flex flex-col gap-y-4">
            <Breadcrumb
                items={[
                    {
                        title: 'Dashboard'
                    },
                    {
                        title: <Link href="/dashboard/renstra">Renstra</Link>
                    }
                ]}
            />
            <Card>
                <div className="flex flex-col gap-y-4">
                    <div className="flex items-center justify-between mb-12">
                        <Title className="mt-2" level={5}>
                            Data Misi
                        </Title>
                    </div>
                    <div className="">
                        <Card>
                            <Line data={penilaianChart} />
                        </Card>
                    </div>
                    <div>
                        <Card>
                            <DataTable columns={Column} data={dummyHasilPenilaian} loading={false}></DataTable>
                        </Card>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default page;
