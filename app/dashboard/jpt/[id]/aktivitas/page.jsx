'use client';

import { CrudModal, DataLoading, DataTable, InfoModal } from '@/components';
import { Alert, Breadcrumb, Button, Card, Collapse, Form, List, Modal, Progress, Skeleton, Space, Tag, Tooltip, Typography } from 'antd';
import { CheckCircleFilled, CheckCircleOutlined, CloseCircleFilled, CloseCircleOutlined, DownloadOutlined, ExclamationOutlined, HistoryOutlined, LinkOutlined, OrderedListOutlined, ReloadOutlined, SearchOutlined, SendOutlined } from '@ant-design/icons';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { getData } from '@/controller/AuthorizationController';
import { update, getByAtasanId } from '@/controller/HarianController';
import useFetchData from '@/hooks/useFetchData';
import { useParams } from 'next/navigation';
import TextArea from 'antd/es/input/TextArea';
import { useRouter } from 'next/navigation';
import { dateFormatter, renderStatusTag } from '@/utils';
import useNotification from '@/app/hook/useNotification';

const { Title } = Typography;
const { confirm } = Modal;
const page = () => {
    const router = useRouter();
    const { id } = useParams();
    const [modal, setModal] = useState({ trigger: false, modalData: null, title: '', formFields: [], onSubmit: () => { } });
    const [infoModal, setInfoModal] = useState({ trigger: false, title: '', onClose: () => { }, data: null, type: '', isLoading: false, column: [] });
    const [fileModal, setFileModal] = useState({ trigger: false, modalData: [] });
    const [data, setData] = useState(null);
    const [periode, setPeriode] = useState(null);
    const [loading, setLoading] = useState(true);
    const [bawahan, setBawahan] = useState(null);
    const [selectedFeedback, setSelectedFeedback] = useState(null);
    const [feedBackModal, setFeedbackModal] = useState({ trigger: false, modalData: [] });
    const { success, error } = useNotification();

    const [form] = Form.useForm();
    const [messageValue, setMessageValue] = useState('');
    const { data: user, setData: setUser } = useFetchData(getData);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, filters: {}, total: 0 });
    useEffect(() => {
        if (user) {
            fetchData();
        }
    }, [user, pagination.page, pagination.limit]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const data = await getByAtasanId(id);
            console.log(data);

            setData(data.data);
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    const columns = [
        {
            title: 'No',
            dataIndex: 'index',
            render: (text, record, index) => index + 1
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
            render: (_, record) => (
                <div className="inline-flex items-center">
                    {renderStatusTag(record.status)}
                    <Button
                        variant="link"
                        icon={<HistoryOutlined />}
                        color="default"
                        onClick={() => {
                            setFeedbackModal({ trigger: true, modalData: record.messageHarian });
                        }}
                    />
                    {console.log(record)}
                    <Modal open={feedBackModal.trigger} onCancel={() => setFeedbackModal({ modalData: null, trigger: false })} footer={null} width={800}>
                        <div className="w-full grid grid-cols-12 items-start gap-4">
                            <List
                                className="w-full col-span-6 mt-6"
                                itemLayout="horizontal"
                                dataSource={feedBackModal.modalData}
                                renderItem={(item) => (
                                    <List.Item>
                                        <button className="inline-flex items-center justify-between w-full hover:bg-gray-100 p-3 rounded-md" onClick={() => setSelectedFeedback(item)}>
                                            <div className="inline-flex gap-x-2 items-center">
                                                <HistoryOutlined />
                                                <b>{dateFormatter(item.createdAt)}</b>
                                            </div>
                                            {renderStatusTag(item.status)}
                                        </button>
                                    </List.Item>
                                )}
                            />
                            <div className="col-span-6 w-full p-6 border border-gray-300 mt-6 h-80 rounded-lg flex flex-col justify-between">
                                <div className="flex flex-col gap-y-2">
                                    {selectedFeedback ? <div className="p-3 rounded-md border border-gray-300 text-sm">{selectedFeedback.status}</div> : <div className="text-gray-400 text-sm">Pilih feedback untuk melihat status</div>}
                                </div>
                                <div className="w-full grid grid-cols-12 gap-4">
                                    <TextArea placeholder="Masukkan feedback" className="col-span-10" />
                                    {/* <Button disabled={!selectedFeedback?.length} icon={<SendOutlined />} variant="solid" color="primary" className="col-span-2" /> */}
                                </div>
                            </div>
                        </div>
                    </Modal>
                </div>
            )
        },
        {
            title: 'Tautan',
            dataIndex: 'tautan',
            key: 'tautan',
            render: (_, record) => <Button variant="solid" onClick={() => window.open(record.tautan, '_blank', 'noopener,noreferrer')} icon={<LinkOutlined />} />
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
            )
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

                                        const res = await update(record._id, dt);
                                        console.log(res);

                                        if (res.ok) {
                                            fetchData();
                                            success('Berhasil', 'Laporan aktivitas berhasil ditolak');
                                        }
                                    },

                                    onCancel() { }
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

                                        if (res.ok) {
                                            fetchData();
                                            success('Berhasil', 'Laporan aktivitas berhasil ditolak');
                                        }
                                    },
                                    onCancel() { }
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
                        }}
                    />
                </Space>
            )
        }
    ];

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
            {loading ? (
                <DataLoading loadingData={loading} />
            ) : (
                <>
                    <Card>
                        <div className="flex flex-col">
                            <div className="flex items-center justify-between mb-12">
                                <Title className="mt-2" level={5}>
                                    Data Aktivitas SKP
                                </Title>
                                <div>
                                    <Tooltip title="Refresh Data">
                                        <Button icon={<ReloadOutlined />} onClick={() => fetchData()} />
                                    </Tooltip>
                                </div>
                            </div>
                            {/* <DataTable columns={Column} data={dummyAktivitas} loading={false} /> */}
                            {loading ? (
                                <Skeleton active />
                            ) : (
                                <div className="overflow-x-auto">
                                    <DataTable columns={columns} data={data} loading={loading} />
                                </div>
                            )}
                        </div>
                    </Card>
                    <CrudModal title={modal.title} isModalOpen={modal.trigger} data={modal.modalData} onSubmit={() => { }} onClose={() => setModal({ trigger: false, modalData: null })} formFields={modal.formFields} type={modal.type} />
                    <InfoModal close={infoModal.onClose} data={infoModal.data} isModalOpen={infoModal.trigger} title={infoModal.title} columns={infoModal.column} isLoading={infoModal.isLoading} type={infoModal.type} />
                </>
            )}
        </div>
    );
};

export default page;
