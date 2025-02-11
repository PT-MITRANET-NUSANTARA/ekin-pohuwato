'use client';

import { CrudModal, DataTable, InfoModal } from '@/components';
import { Alert, Breadcrumb, Button, Card, Collapse, Form, List, Modal, Progress, Skeleton, Space, Tag, Typography } from 'antd';
import {
    CheckCircleFilled,
    CheckCircleOutlined,
    CloseCircleFilled,
    CloseCircleOutlined,
    CloseOutlined,
    DeleteOutlined,
    DownloadOutlined,
    EditOutlined,
    ExclamationCircleFilled,
    ExclamationOutlined,
    EyeOutlined,
    FileAddOutlined,
    OrderedListOutlined,
    SearchOutlined,
    XOutlined
} from '@ant-design/icons';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { dummyAktivitas, dummyfileList } from '@/data/dummyData';
import { getData } from '@/controller/AuthorizationController';
import { destroy, getAll, store, update, getByUserId, getByUserIdAbsence, getByAtasanId } from '@/controller/HarianController';
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
    const [infoModal, setInfoModal] = useState({ trigger: false, title: '', onClose: () => {}, data: null, type: '', isLoading: false, column: [] });
    const [fileModal, setFileModal] = useState({ trigger: false, modalData: [] });
    const { data, setData } = useState(null);
    const [periksa, setPeriksa] = useState(null);
    const [tolak, setTolak] = useState(null);
    const [terima, setTerima] = useState(null);
    const [periode, setPeriode] = useState(null);
    const [loading, setLoading] = useState(true);
    const [bawahan, setBawahan] = useState(null);

    const [form] = Form.useForm();
    const [messageValue, setMessageValue] = useState('');
    const [alert, setAlert] = useState({ show: false, message: null, description: null, type: 'info' });
    const { data: user, setData: setUser } = useFetchData(getData);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, filters: {}, total: 0 });
    useEffect(() => {
        if (user) {
            fetchData();
        }
    }, [user, pagination.page, pagination.limit]);

    const fetchData = async () => {
        try {
            const data = await getByAtasanId(IdSkp);
            console.log(data);

            setTerima(data.data.filter((item) => item.status === 'approved'));
            setPeriksa(data.data.filter((item) => item.status === 'submitted'));
            setTolak(data.data.filter((item) => item.status === 'rejected'));

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
                            Info
                        </Button>
                    </>
                )
            },
            {
                title: 'NIP',
                dataIndex: 'IdASN',
                key: 'IdASN',
                sorter: (a, b) => a.IdASN.length - b.IdASN.length,
                render: (_, record) => record.absence.jabatan.nip_asn
            },
            {
                title: 'Nama',
                dataIndex: 'name',
                key: 'name',
                sorter: (a, b) => a.name.length - b.name.length,
                render: (_, record) => record.absence.jabatan.nama_asn
            },
            {
                title: 'Tanggal',
                dataIndex: 'date',
                key: 'date',
                sorter: (a, b) => a.date.length - b.date.length,
                render: (record) => dateFormatter(record)
            },

            {
                title: 'Status',
                dataIndex: 'msg',
                key: 'msg',
                render: (_, record) => <Tag color={record.status === 'submitted' ? 'blue' : record.status === 'approved' ? 'green' : 'yellow'}>{record.status}</Tag>
            },
            {
                title: 'Bukti',
                dataIndex: 'file',
                key: 'file',
                render: (_, record) => (
                    <>
                        <Button size="middle" color="default" onClick={() => setFileModal({ trigger: true, modalData: record.files })} icon={<OrderedListOutlined />} />
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
                    </>
                ),
                width: '240px'
            },
            {
                title: 'Action',
                key: 'action',
                render: (_, record) => (
                    <Space size="small">
                        {record.status !== 'approved' && (
                            <Button
                                onClick={() => {
                                    confirm({
                                        title: `Setujui laporan aktivitas ini?`,
                                        icon: <CheckCircleFilled style={{ color: '#3b82f6' }} />,
                                        content: <span>Klik ok untuk menerima laporan aktivitas ini</span>,
                                        async onOk() {
                                            const dt = {
                                                ...record,
                                                rhk: record.rhk._id,
                                                skp: record.skp._id,
                                                absence: record.absence._id,
                                                status: 'approved'
                                            };
                                            console.log(record.rhk._id);

                                            const res = await update(record._id, dt);
                                            console.log(res);

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
                        {record.status !== 'rejected' && (
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
                                                rhk: record.rhk._id,
                                                skp: record.skp._id,
                                                absence: record.absence._id,
                                                status: 'rejected',
                                                msg: values.masukan
                                            };
                                            const res = await update(record._id, dt);
                                            console.log(res);

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
                        <Button
                            icon={<ExclamationOutlined />}
                            type="default"
                            onClick={() => {
                                setInfoModal({
                                    title: 'Informasi Harian',
                                    trigger: true,
                                    type: 'desc',
                                    data: [
                                        {
                                            key: 'title',
                                            label: 'Nama Kegiatan',
                                            children: record.namaKegiatan
                                        },
                                        {
                                            key: 'desc',
                                            label: 'Deskripsi',
                                            children: record.deskripsiKegiatan
                                        },
                                        {
                                            key: 'start_time',
                                            label: 'Waktu Mulai',
                                            children: record.startDateTime
                                        },
                                        {
                                            key: 'end_time',
                                            label: 'Waktu Selesai',
                                            children: record.endDateTime
                                        },
                                        {
                                            key: 'skp',
                                            label: 'SKP',
                                            children: record.isSKP ? 'SKP' : 'Bukan SKP'
                                        },
                                        {
                                            key: 'progress',
                                            label: 'Progress',
                                            children: <Progress type="circle" percent={record.progress} size={80} />
                                        }
                                    ],
                                    isLoading: false,
                                    onClose: () => setInfoModal({ ...infoModal, trigger: false, data: null })
                                });
                                console.log(record);
                            }}
                        />
                    </Space>
                )
            }
        ];

        // if (status === 'Tolak') {
        //     columns.push({
        //         title: 'Feedback',
        //         dataIndex: 'message',
        //         key: 'message',
        //         render: (_, record) => <span>{record.msg.message}</span>
        //     });
        // }

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
            label: 'Klasisf ikasi',
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
            <InfoModal close={infoModal.onClose} data={infoModal.data} isModalOpen={infoModal.trigger} title={infoModal.title} columns={infoModal.column} isLoading={infoModal.isLoading} type={infoModal.type} />
        </div>
    );
};

export default page;
