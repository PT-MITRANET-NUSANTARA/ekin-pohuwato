'use client';

import { CrudModal, DataLoading, DataTable, FilterField } from '@/components';
import { dummyfileList, dummyPeriodePenilaian } from '@/data/dummyData';
import { Alert, Breadcrumb, Button, Card, List, Modal, Space, Typography, Upload } from 'antd';
import { PlusOutlined, EditOutlined, EyeOutlined, DeleteOutlined, DatabaseOutlined, UploadOutlined, DownloadOutlined, OrderedListOutlined } from '@ant-design/icons';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { destroy, getAll, store, update, getByUnitId, getById } from '@/controller/PeriodeRKTController';
import useFetchData from '@/hooks/useFetchData';
const { Title } = Typography;
import { store as upload } from '@/controller/DokumentController';
import { getData } from '@/controller/AuthorizationController';
import { getByNIP } from '@/controller/IDSN/JabatanController';
import { dateFormatter } from '@/utils';
import { getPerjanjianKinerja } from '@/controller/ReportController';
const page = () => {
    const router = useRouter();
    const [modal, setModal] = useState({ trigger: false, modalData: null, title: '', formFields: [], onSubmit: () => {} });
    const [alert, setAlert] = useState({ show: false, message: null, description: null, type: 'info' });

    const [submitLoading, setSubmitLoading] = useState(false);
    const [fileModal, setFileModal] = useState({ trigger: false, modalData: [] });
    const { data: user, setData: setUser } = useFetchData(getData);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, filters: {}, total: 0 });
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);

    useEffect(() => {
        if (user) {
            const updatedFilters = {
                ...pagination.filters,
                unit: user.jabatan?.unor?.induk
            };
            setPagination({ ...pagination, filters: updatedFilters });
            fetchData();
        }
    }, [user, pagination.page, pagination.limit]);

    const fetchData = async () => {
        try {
            const data = await getAll(pagination.page, pagination.limit, pagination.filters);
            setData(data.data.data);

            setPagination({ ...pagination, filters: updatedFilters, page: data.data.pagination.currentPage, limit: data.data.pagination.pageSize, total: data.data.pagination.totalItems });
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (values, type, id, formData) => {
        try {
            let response;
            let dt = values;
            dt = { ...dt, unit: user.jabatan.unor.induk };
            setSubmitLoading(true);
            switch (type) {
                case 'create':
                    response = await store(dt);
                    break;

                case 'edit':
                    response = await update(id, dt);
                    break;

                case 'delete':
                    response = await destroy(id);
                    break;

                default:
                    throw new Error('Tipe operasi tidak valid');
            }
            console.log(response);

            if (response.ok) {
                fetchData();
                setAlert({
                    show: true,
                    message: response.msg,
                    description: type === 'delete' ? 'Berhasil Menghapus Periode RKT' : type === 'edit' ? 'Berhasil Mengedit Periode RKT' : 'Berhasil Menambahkan Periode RKT',
                    type: 'success'
                });
            } else {
                setAlert({
                    show: true,
                    message: 'Gagal',
                    description: response.msg,
                    type: 'error'
                });
            }
        } catch (error) {
            setAlert({
                show: true,
                message: 'Error',
                description: error.message,
                type: 'error'
            });
        }
        setSubmitLoading(false);

        console.log('Operation completed');
        handleClose();
    };

    const customSubmit = async (values, type, id, formData) => {
        console.log(values);
        console.log(id);
        const res = await getById(id);

        const periode = res.data;
        const uniqueRkts = periode.RKTS.filter((item, index, self) => index === self.findIndex((rkt) => rkt._id === item._id));

        let allSubKegiatan = uniqueRkts.map((rkt) => rkt.subKegiatan);

        const uniqueSubKegiatan = allSubKegiatan.filter((item, index, self) => index === self.findIndex((sub) => sub._id === item._id));

        let allKegiatan = uniqueSubKegiatan.map((sub) => sub.kegiatan);

        const uniqueKegiatan = allKegiatan.filter((item, index, self) => index === self.findIndex((kegiatan) => kegiatan._id === item._id));

        let allProgram = uniqueKegiatan.map((kegiatan) => kegiatan.program);

        const uniqueProgram = allProgram.filter((item, index, self) => index === self.findIndex((program) => program._id === item._id));

        let allTujuan = uniqueProgram.map((program) => program.tujuan);

        const uniqueTujuan = allTujuan.filter((item, index, self) => index === self.findIndex((tujuan) => tujuan._id === item._id));

        console.log(uniqueProgram);
        console.log(uniqueTujuan);

        const query = {
            nama_pihak_pertama: values.nama_pihak_pertama,
            jabatan_pihak_pertama: values.jabatan_pihak_pertama,
            nama_pihak_kedua: values.nama_pihak_kedua,
            jabatan_pihak_kedua: values.jabatan_pihak_kedua,
            tanggal: dateFormatter(values.tanggal),
            program: uniqueProgram,
            tujuan: uniqueTujuan,
        };
        console.log('data', query);

        const pdfBlob = await getPerjanjianKinerja(query);

        console.log(pdfBlob);

        // const url = window.URL.createObjectURL(pdfBlob);
        // const a = document.createElement('a');
        // a.href = url;
        // a.download = 'perjanjian_kinerja.pdf'; // Filename
        // document.body.appendChild(a);
        // a.click();
        // a.remove();
        // window.URL.revokeObjectURL(url);

        // const query = new URLSearchParams(values).toString();
        // router.push(`/document/${id}/perjanjian_kinerja?${query}`);
    };

    const perjanjianSubmit = async (values, type, id, listImage, fileList) => {
        console.log('SUBMIT', listImage, fileList);

        const updatedListImage = listImage.map((img) => {
            const matchingFile = fileList.find((file) => file.uid === img.uid);

            if (matchingFile) {
                return {
                    ...img,
                    name: matchingFile.name,
                    type: matchingFile.type
                };
            }

            return img;
        });
        handleClose();

        console.log(updatedListImage);

        const periode = data.find((item) => item._id === id);
        periode.perjanjianKinerja = updatedListImage;
        console.log('HERE', periode);

        const response = await update(id, periode);
        console.log(response);

        if (response.ok) {
            fetchData();
            setAlert({
                show: true,
                message: response.msg,
                description: 'Berhasil Mengupload Perjanjian Kinerja',
                type: 'success'
            });
        } else {
            setAlert({
                show: true,
                message: 'Gagal',
                description: response.msg,
                type: 'error'
            });
        }
        handleClose();
    };

    const Column = [
        {
            title: 'No',
            dataIndex: 'index',
            render: (text, record, index) => index + 1,
            width: '5%'
        },
        {
            title: 'Periode Mulai',
            dataIndex: 'periode_start',
            key: 'periode_start',
            sorter: (a, b) => new Date(a.periode_start) - new Date(b.periode_start),

            render: (record) => dateFormatter(record)
        },
        {
            title: 'Periode Selesai',
            dataIndex: 'periode_end',
            key: 'periode_end',
            sorter: (a, b) => new Date(a.periode_end) - new Date(b.periode_end),

            render: (record) => dateFormatter(record)
        },
        {
            title: 'Perjanjian Kinerja',
            dataIndex: 'perjanjianKinerja',
            key: 'perjanjianKinerja',
            render: (_, record) => (
                <>
                    {console.log(record)}
                    <Space size="small">
                        <Button icon={<UploadOutlined />} onClick={() => setModal({ trigger: true, modalData: record, title: `Upload ${record._id}`, type: 'edit', formFields: perjanjianFields, onSubmit: perjanjianSubmit })}></Button>
                        <Button
                            size="middle"
                            color="default"
                            onClick={() => setModal({ trigger: true, modalData: record, title: `Upload ${record._id}`, type: 'edit', formFields: formPerjanjian, onSubmit: customSubmit })}
                            icon={<DownloadOutlined />}
                        />
                        <Button size="middle" color="default" onClick={() => setFileModal({ trigger: true, modalData: record.perjanjianKinerja })} icon={<OrderedListOutlined />} />
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
                    </Space>
                </>
            )
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="small">
                    <Button
                        onClick={() =>
                            setModal({
                                trigger: true,
                                modalData: { ...record, periode_start: dateFormatter(record.periode_start), periode_end: dateFormatter(record.periode_end) },
                                title: `Edit Periode RKT ${record._id}`,
                                type: 'edit',
                                formFields: rktFields,
                                onSubmit: onSubmit
                            })
                        }
                        // type='primary'
                        size="middle"
                        color="primary"
                        variant="outlined"
                        icon={<EditOutlined />}
                    />

                    <Button
                        onClick={() =>
                            setModal({
                                trigger: true,
                                modalData: { ...record, periode_start: dateFormatter(record.periode_start), periode_end: dateFormatter(record.periode_end) },
                                title: `Delete Periode RKT ${record._id}`,
                                type: 'delete',
                                formFields: rktFields,
                                onSubmit: onSubmit
                            })
                        }
                        // type='primary'
                        size="middle"
                        danger
                        icon={<DeleteOutlined />}
                    />
                </Space>
            )
        }
    ];

    const rktFields = [
        {
            label: 'Periode Mulai',
            name: 'periode_start',
            type: 'date',
            rules: [
                {
                    required: true,
                    message: 'Field periode mulai wajib di isi'
                }
            ]
        },
        {
            label: 'Periode Selesai',
            name: 'periode_end',
            type: 'date',
            rules: [
                {
                    required: true,
                    message: 'Field periode selesai wajib di isi'
                }
            ]
        }
    ];

    const perjanjianFields = [
        {
            label: 'Perjanjian Kinerja',
            name: 'perjanjianKinerja',
            type: 'upload',
            rules: [
                {
                    required: true,
                    message: 'Field perjanjian kinerja mulai wajib di isi'
                }
            ]
        }
    ];

    const formPerjanjian = [
        {
            label: 'Nama pihak pertama',
            name: 'nama_pihak_pertama',
            type: 'text',
            rules: [
                {
                    required: true,
                    message: 'Field nama pihak pertama wajib di isi'
                }
            ]
        },
        {
            label: 'Jabatan pihak pertama',
            name: 'jabatan_pihak_pertama',
            type: 'text',
            rules: [
                {
                    required: true,
                    message: 'Field jabatan pihak pertama wajib di isi'
                }
            ]
        },
        {
            label: 'Nama pihak kedua',
            name: 'nama_pihak_kedua',
            type: 'text',
            rules: [
                {
                    required: true,
                    message: 'Field nama pihak kedua wajib di isi'
                }
            ]
        },
        {
            label: 'Jabatan pihak kedua',
            name: 'jabatan_pihak_kedua',
            type: 'text',
            rules: [
                {
                    required: true,
                    message: 'Field jabatan pihak kedua wajib di isi'
                }
            ]
        },
        {
            label: 'Tanggal',
            name: 'tanggal',
            type: 'date',
            rules: [
                {
                    required: true,
                    message: 'Field tanggal wajib di isi'
                }
            ]
        },
        {
            label: 'Tempat',
            name: 'tempat',
            type: 'text',
            rules: [
                {
                    required: true,
                    message: 'Field tempat wajib di isi'
                }
            ]
        }
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

    const filterFileds = [
        {
            label: 'Periode Mulai',
            name: 'periode_mulai',
            type: 'date',
            filter: 'gte'
        },
        {
            label: 'Periode Selesai',
            name: 'periode_selesai',
            type: 'date',
            filter: 'lte'
        }
    ];

    const handleClose = () => {
        setModal({ trigger: false, modalData: null });
    };

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
            {loading ? (
                <DataLoading loadingData={loading} />
            ) : (
                <Card className="">
                    <div className="flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                            <Title className="mt-2" level={5}>
                                Data Periode RKT
                            </Title>
                            <div>
                                <Button type="primary" icon={<PlusOutlined />} onClick={() => setModal({ modalData: null, title: 'Tambah Data', trigger: true, type: 'create', formFields: rktFields, onSubmit: onSubmit })}>
                                    Tambah
                                </Button>
                            </div>
                        </div>
                        <div className="w-full">
                            <FilterField fields={filterFileds} onSubmit={onFilter}></FilterField>
                        </div>
                        <div className="overflow-x-auto">
                            <DataTable columns={Column} data={data} setPagination={setPagination} pagination={pagination} />
                        </div>
                        <CrudModal isLoading={submitLoading} title={modal.title} onSubmit={modal.onSubmit} isModalOpen={modal.trigger} onClose={handleClose} data={modal.modalData} formFields={modal.formFields} type={modal.type} />
                    </div>
                </Card>
            )}
        </div>
    );
};

export default page;
