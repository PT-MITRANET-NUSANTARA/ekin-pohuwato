'use client';

import { CrudModal, DataTable } from '@/components';
import { Alert, Breadcrumb, Button, Card, Collapse, Form, Modal, Skeleton, Space, Tag, Typography } from 'antd';
import { CheckCircleFilled, CheckCircleOutlined, CloseCircleFilled, CloseCircleOutlined, CloseOutlined, DeleteOutlined, EditOutlined, ExclamationCircleFilled, EyeOutlined, FileAddOutlined, SearchOutlined, XOutlined } from '@ant-design/icons';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { dummyAktivitas } from '@/data/dummyData';
import { getData } from '@/controller/AuthorizationController';
import { destroy, getAll, store, update, getByUserId, getByUserIdAbsence } from '@/controller/HarianController';
import { getAllPosjabByUnit, getByNIP } from '@/controller/IDSN/JabatanController';
import useFetchData from '@/hooks/useFetchData';
import { useParams } from 'next/navigation';
import TextArea from 'antd/es/input/TextArea';
import { useRouter } from 'next/navigation';
import { dateFormatter } from '@/utils';

const { Title } = Typography;
const { confirm } = Modal;
const page = () => {
    const router = useRouter();
    const { IdSkp } = useParams();
    const [modal, setModal] = useState({ trigger: false, modalData: null, title: '', formFields: [], onSubmit: () => {} });
    const { data, setData } = useFetchData(getData);
    const [periksa, setPeriksa] = useState(null);
    const [tolak, setTolak] = useState(null);
    const [terima, setTerima] = useState(null);
    const [periode, setPeriode] = useState(null);
    const [loading, setLoading] = useState(true);
    const [bawahan, setBawahan] = useState(null);

    const [form] = Form.useForm();
    const [messageValue, setMessageValue] = useState('');
    const [alert, setAlert] = useState({ show: false, message: null, description: null, type: 'info' });

    useEffect(() => {
        if (data) {
            fetchData();
        }
    }, [data]);

    const fetchData = async () => {
        try {
            const jabatan = await getByNIP(data.token, data.user.nipBaru);
            const selectedJabatan = jabatan.mapData.data[0];

            const unit = await getAllPosjabByUnit(data.token, selectedJabatan.unor.induk.id);

            // Filter data bawahan
            const bawahan = unit.mapData.data.filter((item) => (item.unor.id === selectedJabatan.unor.id && item.nama_jabatan !== selectedJabatan.nama_jabatan) || item.unor.atasan?.unor_id === selectedJabatan.unor.id);

            const allHarian = [];

            for (let item of bawahan) {
                const response = await getByUserId(item.id_asn);

                if (Array.isArray(response.data)) {
                    allHarian.push(...response.data);
                } else {
                    allHarian.push(response.data);
                }
            }

            const harianBawahan = allHarian.filter((item) => {
                const skpArray = item.rhk?.skp?.skp; // Pastikan skp adalah array
                const lastSkp = skpArray?.[skpArray.length - 1]; // Ambil elemen terakhir
                return lastSkp?._id === IdSkp; // Bandingkan dengan IdSkp
            });

            setBawahan(bawahan);
            setTerima(harianBawahan.filter((item) => item.msg?.status === 'Terima'));
            setPeriksa(harianBawahan.filter((item) => item.msg?.status === 'Periksa'));
            setTolak(harianBawahan.filter((item) => item.msg?.status === 'Tolak'));

            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    };

    console.log(periksa);


    const generateColumns = (status) => {
        const columns = [
            {
                title: 'No',
                dataIndex: 'index',
                render: (text, record, index) => index + 1,
                width: '5%'
            },
            {
                title: 'RHK',
                dataIndex: 'rhk',
                key: 'rhk',
                render: (_, record) => (
                    <>
                        <Button onClick={() => setModal({ formFields: rhkFields, trigger: true, modalData: record.rhk, title: `Lihat Visi ${record.rhk._id}`, type: 'show' })} icon={<SearchOutlined />}>
                            {record.rhk._id}
                        </Button>
                    </>
                )
            },
            {
                title: 'IdASN',
                dataIndex: 'IdASN',
                key: 'IdASN',
                sorter: (a, b) => a.IdASN.length - b.IdASN.length,
                render: (_, record) => bawahan?.find((item) => item.userId === record.user_id)?.userId
            },
            {
                title: 'Nama',
                dataIndex: 'name',
                key: 'name',
                sorter: (a, b) => a.name.length - b.name.length,
                render: (_, record) => bawahan?.find((item) => item.userId === record.user_id)?.nama_asn
            },
            {
                title: 'Tanggal',
                dataIndex: 'date',
                key: 'date',
                sorter: (a, b) => a.date.length - b.date.length,
            },
            {
                title: 'Deskripsi Kegiatan',
                dataIndex: 'deskripsiKegiatan',
                key: 'deskripsiKegiatan',
                sorter: (a, b) => a.deskripsiKegiatan.length - b.deskripsiKegiatan.length,
            },
            {
                title: 'Nama Kegiatan',
                dataIndex: 'namaKegiatan',
                key: 'namaKegiatan',
                sorter: (a, b) => a.namaKegiatan.length - b.namaKegiatan.length,
            },
            {
                title: 'Waktu Mulai',
                dataIndex: 'startDateTime',
                key: 'startDateTime',
                sorter: (a, b) => a.startDateTime.length - b.startDateTime.length,
                render: (record) => dateFormatter(record)
            },
            {
                title: 'Waktu Selesai',
                dataIndex: 'endDateTime',
                key: 'endDateTime',
                sorter: (a, b) => a.endDateTime.length - b.endDateTime.length,
                render: (record) => dateFormatter(record)

            },
            {
                title: 'Status',
                dataIndex: 'msg',
                key: 'msg',
                render: (_, record) => <Tag color={record.msg.status === 'Periksa' ? 'blue' : record.msg.status === 'Terima' ? 'green' : 'yellow'}>{record.msg.status}</Tag>
            },
            {
                title: 'Tautan',
                dataIndex: 'tautan',
                key: 'tautan',
                render: (_, record) => (
                    <Button variant="link" color="primary" onClick={() => window.open(`${record.tautan}`, '_blank')}>
                        {record.tautan}
                    </Button>
                ),
                width: '240px'
            },
            {
                title: 'Progress',
                dataIndex: 'progress',
                key: 'progress',
                render: (_, record) => <span>{record.progress} %</span>,
                width: '240px'
            },
            {
                title: 'Bukti',
                dataIndex: 'file',
                key: 'file',
                render: (_, record) => (
                    <li className="flex flex-col gap-y-1 w-full">
                        {record.files.map((item) => (
                            <li>
                                <Button
                                    variant="link"
                                    color="primary"
                                    onClick={() => {
                                        if (item.type === 'image/jpeg' || item.type === 'image/png') {
                                            window.open(`/document/fileViewer/${item.fileId}`, '_blank');
                                        } else {
                                            window.open(`/document/fileViewer/${item.fileId}`, '_blank');
                                        }
                                    }}
                                >
                                    {item.name}
                                </Button>
                            </li>
                        ))}
                    </li>
                ),
                width: '240px'
            },
            {
                title: 'Action',
                key: 'action',
                render: (_, record) => (
                    <Space size="small">
                        {record.msg.status !== 'Terima' && (
                            <Button
                                onClick={() => {
                                    confirm({
                                        title: `Setujui laporan aktivitas ini?`,
                                        icon: <CheckCircleFilled style={{ color: '#3b82f6' }} />,
                                        content: <span>Klik ok untuk menerima laporan aktivitas ini</span>,
                                        async onOk() {
                                            const dt = {
                                                ...record,
                                                msg: {
                                                    status: 'Terima',
                                                    message: ''
                                                },
                                                rhk: record.rhk._id,
                                                user_id: String(record.user_id)
                                            };
                                            const res = await update(record._id, dt);
                                            if (res.ok) {
                                                fetchData();
                                            }
                                        },
                                        onCancel() {
                                            console.log('Cancel');
                                        }
                                    });
                                }}
                                size="middle"
                                icon={<CheckCircleOutlined />}
                            />
                        )}
                        {record.msg.status !== 'Tolak' && (
                            <Button
                                onClick={() => {
                                    confirm({
                                        title: `Tolak laporan aktivitas ini?`,
                                        icon: <CloseCircleFilled style={{ color: '#ef4444' }} />,
                                        content: (
                                            <Form
                                                form={form} // Bind form instance
                                                layout="vertical"
                                                className="flex flex-col gap-y-2"
                                            >
                                                <Form.Item
                                                    label="Kirim Masukan"
                                                    name="masukan"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: 'Field periode wajib di isi'
                                                        }
                                                    ]}
                                                >
                                                    <TextArea />
                                                </Form.Item>
                                            </Form>
                                        ),
                                        async onOk() {
                                            // Pastikan menggunakan nilai terbaru dari messageValue
                                            const values = await form.validateFields();
                                            const dt = {
                                                ...record,
                                                msg: {
                                                    status: 'Tolak',
                                                    message: values.masukan // Use form's field value
                                                },
                                                rhk: record.rhk._id,
                                                user_id: String(record.user_id)
                                            };
                                            const res = await update(record._id, dt);
                                            if (res.ok) {
                                                fetchData();
                                                setAlert({
                                                    show: true,
                                                    message: 'Berhasil',
                                                    description: 'Laporan aktivitas berhasil ditolak',
                                                    type: 'success'
                                                });
                                            }
                                        },
                                        onCancel() {
                                            console.log('Cancel');
                                        }
                                    });
                                }}
                                size="middle"
                                icon={<CloseCircleOutlined />}
                            />
                        )}
                    </Space>
                )
            }
        ];

        if (status === 'Tolak') {
            columns.push({
                title: 'Feedback',
                dataIndex: 'message',
                key: 'message',
                render: (_, record) => <span>{record.msg.message}</span>
            });
        }

        return columns;
    };

    const rhkFields = [
        {
            label: 'Deksripsi',
            name: 'desc',
            type: 'longtext'
        },
        {
            label: 'Jenis',
            name: 'jenis',
            type: 'text'
        },
        {
            label: 'Klasisfikasi',
            name: 'klasifikasi',
            type: 'text'
        }
    ];

    return (
        <div className="w-full flex flex-col gap-y-4">
            {alert.show !== false && <Alert message={alert.message} description={alert.description} type={alert.type} showIcon closable />}
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
                <div className="flex flex-col">
                    <div className="flex items-center justify-between mb-12">
                        <Title className="mt-2" level={5}>
                            Data Aktivitas SKP
                        </Title>
                    </div>
                    {/* <DataTable columns={Column} data={dummyAktivitas} loading={false} /> */}
                    {loading ? (
                        <Skeleton active />
                    ) : (
                        <div className="overflow-x-auto">
                            <Collapse bordered>
                                <Collapse.Panel key="1" header="Periksa">
                                    <div className="overflow-x-auto">
                                        <DataTable columns={generateColumns('Periksa')} data={periksa} loading={false} />
                                    </div>
                                </Collapse.Panel>
                                <Collapse.Panel key="2" header={<div className="text-blue-500">Terima</div>}>
                                    <div className="overflow-x-auto">
                                        <DataTable columns={generateColumns('Terima')} data={terima} loading={false} />
                                    </div>
                                </Collapse.Panel>
                                <Collapse.Panel key="3" header={<div className="text-red-500">Tolak</div>}>
                                    <div className="overflow-x-auto">
                                        <DataTable columns={generateColumns('Tolak')} data={tolak} loading={false} />
                                    </div>
                                </Collapse.Panel>
                            </Collapse>
                        </div>
                    )}
                </div>
            </Card>
            <CrudModal title={modal.title} isModalOpen={modal.trigger} data={modal.modalData} onSubmit={() => {}} onClose={() => setModal({ trigger: false, modalData: null })} formFields={modal.formFields} type={modal.type} />
        </div>
    );
};

export default page;
