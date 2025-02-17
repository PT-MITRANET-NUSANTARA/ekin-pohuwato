'use client';

import { useState, useEffect } from 'react';
import { Alert, Breadcrumb, Button, Card, Space, Tooltip, Typography } from 'antd';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { Line } from 'react-chartjs-2';
import Link from 'next/link';
import React from 'react';
import { Data, dummyHasilPenilaian } from '@/data/dummyData';
import { CategoryScale, LinearScale, PointElement, LineElement, Title as ChartTitle, Legend, Chart } from 'chart.js';
import { DataTable, FilterField } from '@/components';
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, ChartTitle, Legend);

const { Title } = Typography;

const page = () => {
    const [penilaianChart, setPenilaianChart] = useState({
        labels: [],
        datasets: []
    });

    useEffect(() => {
        // Prepare data for the chart
        const labels = ['Sangat Kurang', 'Kurang', 'Butuh Perbaikan', 'Baik', 'Sangat Baik'];
        const userGains = Data.map((item) => item.userGain);
        const userLosses = Data.map((item) => item.userLost);

        setPenilaianChart({
            labels: labels,
            datasets: [
                {
                    label: 'Ideal',
                    data: userGains,
                    borderColor: '#50C878',
                    backgroundColor: 'rgba(147, 197, 253, 0.2)',
                    fill: true
                },
                {
                    label: 'Realita',
                    data: userLosses,
                    borderColor: '#FF5733',
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

    const filterFileds = [
        {
            label: 'Tipe',
            name: 'tipe',
            type: 'select',
            options: [
                {
                    label: 'Ideal untuk capaian kinerja organisasi istimewa',
                    value: 'ideal untuk capaian kinerja organisasi istimewa'
                },
                {
                    label: 'Ideal untuk capaian kinerja organisasi baik',
                    value: 'ideal untuk capaian kinerja organisasi baik'
                },
                {
                    label: 'Ideal untuk capaian kinerja organisasi butuh perbaikan',
                    value: 'ideal untuk capaian kinerja organisasi butuh perbaikan'
                },
                {
                    label: 'Ideal untuk capaian kinerja organisasi kurang',
                    value: 'ideal untuk capaian kinerja organisasi kurang'
                },
                {
                    label: 'Ideal untuk capaian kinerja organisasi sangat kurang',
                    value: 'ideal untuk capaian kinerja organisasi sangat kurang'
                },
            ],
            filter: 'eq'
        },
    ];

    const onFilter = async (values) => {
        filterFileds.forEach((field) => {
            let value = values[field.name];
            if (value !== undefined && value !== null) {
                switch (field.type) {
                    case 'date':
                        value = dateFormatter(value);
                        break;

                    default:
                        value = value;
                        break;
                }

                switch (field.filter) {
                    case 'gte':
                        pagination.filters[field.name] = { $gte: value };
                        break;
                    case 'lte':
                        pagination.filters[field.name] = { $lte: value };
                        break;
                    case 'gt':
                        pagination.filters[field.name] = { $gt: value };
                        break;
                    case 'lt':
                        pagination.filters[field.name] = { $lt: value };
                        break;
                    case 'eq':
                        pagination.filters[field.name] = value; // Equality
                        break;
                    case 'ne':
                        pagination.filters[field.name] = { $ne: value };
                        break;
                    case 'in':
                        pagination.filters[field.name] = { $in: Array.isArray(value) ? value : [value] };
                        break;
                    case 'nin':
                        pagination.filters[field.name] = { $nin: Array.isArray(value) ? value : [value] };
                        break;
                    case 'regex':
                        pagination.filters[field.name] = { $regex: value, $options: 'i' }; // Case-insensitive regex
                        break;
                    case 'exists':
                        pagination.filters[field.name] = { $exists: Boolean(value) };
                        break;
                    default:
                        console.warn(`Unsupported filter type: ${field.filter}`);
                }
            } else {
                if (pagination.filters.hasOwnProperty(field.name)) {
                    delete pagination.filters[field.name];
                }
            }
        });
        fetchData();
    };

    return (
        <div className="w-full flex flex-col gap-y-4">

            <Card>
                <div className="flex flex-col gap-y-4">
                    <div className="flex items-center justify-between mb-12">
                        <Title className="mt-2" level={5}>
                            Data Kurva Penilaian Bawahan
                        </Title>
                        <div>
                            <Tooltip title="Refresh Data">
                                <Button icon={<ReloadOutlined />} onClick={() => fetchData()} />
                            </Tooltip>
                        </div>
                    </div>
                    <div className="w-full">
                        <FilterField fields={filterFileds} onSubmit={onFilter}></FilterField>
                    </div>
                    <div className="">
                        <Card>
                            <Line data={penilaianChart} />
                        </Card>
                    </div>
                    <div>
                            <DataTable columns={Column} data={dummyHasilPenilaian} loading={false}></DataTable>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default page;
