'use client';

import { Alert, Breadcrumb, Button, Card, Empty, Select, Skeleton, Tag, Typography, Result, Pagination } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { dummySkp } from '@/data';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { CrudModal, FilterField } from '@/components';
import { useRouter } from 'next/navigation';
import useFetchData from '@/hooks/useFetchData';
import { getData } from '@/controller/AuthorizationController';
import { destroy, getAll, store, update, getByUserId, storeAtasan } from '@/controller/SKPController';
import { getByNIP } from '@/controller/IDSN/JabatanController';
import { formatDateToDayMonthYear } from '@/utils/util';
import { getAll as getAllRenstra, getByUnitId as getRenstraByUnit } from '@/controller/RenstraController';
import { getByUnitId as getPeriodeByUnit } from '@/controller/PeriodeRKTController';
import { cekJabatan, cekJT } from '@/utils/jabatanUtils';
import { getById } from '@/controller/IDSN/UnitController';
import { dateFormatter } from '@/utils';
import dayjs from 'dayjs';

const { Title } = Typography;

const page = () => {
    const router = useRouter();
    const [modal, setModal] = useState({ trigger: false, modalData: null, title: '', type: '' });
    const { Option } = Select;
    const [alert, setAlert] = useState({ show: false, message: null, description: null, type: 'info' });
    const [resntra, setRenstra] = useState(null);
    const [periodeRKT, setPeriodeRKT] = useState(null);
    const [isJT, setIsJT] = useState(false);
    const [isAtasan, setIsAtasan] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const [errorData, setErrorData] = useState({ show: false, message: '' });
    const [submitLoading, setSubmitLoading] = useState(false);
    const { data: user, setData: setUser } = useFetchData(getData);
    const [data, setData] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, filters: {}, total: 0 });

    useEffect(() => {
        if (user) {
            fetchData();
        }
    }, [user, pagination.page, pagination.limit]);

    const fetchData = async () => {
        try {
            const data = await getByUserId(user.user.idASN, pagination.page, pagination.limit, pagination.filters);
            setData(data.data.data);
            console.log('here', data);

            setPagination({ ...pagination, page: data.data.pagination.currentPage, limit: data.data.pagination.pageSize, total: data.data.pagination.totalItems });
            const selectedJabatan = user.jabatan;
            const struktur = await getById(user.token, selectedJabatan.unor.induk.id);

            const isJT = cekJT(struktur.mapData[0], selectedJabatan.nama_jabatan);
            const isAtasan = cekJabatan(struktur.mapData[0], selectedJabatan.nama_jabatan);
            setIsJT(isJT);
            setIsAtasan(isAtasan);
            const resntra = await getRenstraByUnit(selectedJabatan.unor.induk.id);
            const periodeRKT = await getPeriodeByUnit(selectedJabatan.unor.induk.id);
            setRenstra(resntra.data);
            setPeriodeRKT(periodeRKT.data);
            setLoadingData(false);
        } catch (error) {
            setLoadingData(false);
            setErrorData({ show: true, message: error.message });
        }
    };

    const onSubmit = async (values, type, id) => {
        setSubmitLoading(true);
        try {
            let response;
            let dt = values;
            dt = { ...dt, jabatan: [user.jabatan], user_id: user.user.idASN, unit: user.jabatan.unor.induk };
            dt.periodeRKT = [values.periodeRKT]

            switch (type) {
                case 'create':
                    response = await storeAtasan('1', dt);
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
                    description: type === 'delete' ? 'Berhasil Menghapus SKP' : type === 'edit' ? 'Berhasil Mengedit SKP' : 'Berhasil Menambahkan SKP',
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

        console.log('Operation completed');
        setSubmitLoading(false);

        handleClose();
    };

    const formFields = [
        {
            label: 'Renstra',
            name: 'renstra',
            type: 'select',
            rules: [
                {
                    required: true,
                    message: 'Field renstra wajib di isi'
                }
            ],
            options: resntra?.map((item) => ({
                label: dateFormatter(item.periode_start) + ' - ' + dateFormatter(item.periode_end),
                value: item._id
            }))
        },
        {
            label: 'Periode RKT',
            name: 'periodeRKT',
            type: 'select',
            rules: [
                {
                    required: true,
                    message: 'Field periode rkt wajib di isi'
                }
            ],
            options: periodeRKT?.map((item) => ({
                label: dateFormatter(item.periode_start) + ' - ' + dateFormatter(item.periode_end),
                value: item._id
            }))
        },
        {
            label: 'Periode Mulai',
            name: 'periode_awal',
            type: 'date',
            rules: [
                {
                    required: true,
                    message: 'Field periode mulai wajib di isi'
                }
            ]
        },
        {
            label: 'Periode Akhir',
            name: 'periode_akhir',
            type: 'date',
            rules: [
                {
                    required: true,
                    message: 'Field periode selesai wajib di isi'
                }
            ]
        },
        {
            label: 'Pendekatan',
            name: 'pendekatan',
            type: 'select',
            rules: [
                {
                    required: true,
                    message: 'Field pendekatan wajib di isi'
                }
            ],
            options: [
                {
                    label: 'Kuantitatif',
                    value: 'kuantitatif'
                },
                {
                    label: 'Kualitatif',
                    value: 'kualitatif'
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
            label: 'Renstra',
            name: 'renstra',
            type: 'select',
            filter: 'eq',
            options: resntra?.map((item) => ({ value: item._id, label: dateFormatter(item.periode_start) + ' - ' + dateFormatter(item.periode_end) }))
        },
        {
            label: 'Periode RKT',
            name: 'periodeRKT',
            type: 'select',
            filter: 'eq',
            options: periodeRKT?.map((item) => ({ value: item._id, label: dateFormatter(item.periode_start) + ' - ' + dateFormatter(item.periode_end) }))
        },
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

            <Card>
                <div className="flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                        <Title className="mt-2" level={5}>
                            Data SKP
                        </Title>
                        <div>
                            {isJT && (
                                <Button type="primary" icon={<PlusOutlined />} onClick={() => setModal({ modalData: null, title: 'Tambah Data', trigger: true, type: 'create' })}>
                                    Tambah
                                </Button>
                            )}
                        </div>
                    </div>
                    <div className="w-full">
                        <FilterField fields={filterFileds} onSubmit={onFilter}></FilterField>
                    </div>
                    <div className="w-full mb-4">{/* <FilterField fields={filterFileds}></FilterField> */}</div>
                    {loadingData ? (
                        <Skeleton active />
                    ) : errorData.show ? (
                        <Result status="500" title="Oops! Something went wrong" subTitle={errorData.message} />
                    ) : (
                        <div className="flex flex-col gap-y-4">
                            {data?.length > 0 ? (
                                data.map((item) => (
                                    <Card key={item._id} type="inner" title={<Tag color="blue">{item._id}</Tag>}>
                                        <div className="w-full flex flex-col gap-y-4">
                                            <div className="flex w-full items-center gap-x-2 ">
                                                <Button onClick={() => router.push(`/dashboard/skp/${item._id}/detail`)}>Detail SKP</Button>
                                                <Button onClick={() => router.push(`/dashboard/skp/${item._id}/matriks_peran_hasil`)}>Matriks Peran Hasil</Button>
                                                <Button onClick={() => router.push(`/dashboard/skp/${item._id}/skp_bawahan`)}>SKP Bawahan</Button>
                                                <Button onClick={() => router.push(`/dashboard/skp/${item._id}/periode_penilaian`)}>Penilaian</Button>
                                                {isJT === false && <Button onClick={() => router.push(`/dashboard/skp/${item._id}/nilai`)}>Nilai</Button>}
                                                <Button onClick={() => router.push(`/dashboard/skp/${item._id}/monitoring_kinerja`)}>Monitoring Kinerja</Button>
                                                <Button onClick={() => router.push(`/dashboard/skp/${item._id}/aktivitas`)}>Aktivitas</Button>
                                            </div>

                                            <div className="grid grid-flow-row divide-y text-xs">
                                                <div className="flex items-center justify-between py-2">
                                                    <span className="uppercase font-semibold">periode</span>
                                                    <Tag color="blue" className="capitalize">
                                                        {formatDateToDayMonthYear(item.periode_awal)} - {formatDateToDayMonthYear(item.periode_akhir)}
                                                    </Tag>
                                                </div>
                                                <div className="flex items-center justify-between py-2">
                                                    <span className="uppercase font-semibold">pendekatan</span>
                                                    <Tag color="blue" className="capitalize">
                                                        {item.pendekatan}
                                                    </Tag>
                                                </div>
                                                <div className="flex items-center justify-between py-2">
                                                    <span className="uppercase font-semibold">unit kerja</span>
                                                    <p className="text-right uppercase">{item.jabatan.at(-1).unor.nama}</p>
                                                </div>
                                                <div className="flex items-center justify-between py-2">
                                                    <span className="uppercase font-semibold">keterangan jabatan</span>
                                                    <p className="text-right capitalize">{item.jabatan.at(-1).nama_jabatan}</p>
                                                </div>
                                                <div className="flex items-center justify-between py-2">
                                                    <span className="uppercase font-semibold">jenis pegawai</span>
                                                    <p className="text-right capitalize">{isAtasan ? 'Pimpinan' : 'Bawahan'}</p>
                                                </div>
                                            </div>

                                            <div className="flex w-full items-center justify-end gap-x-2 ">
                                                <Button
                                                    type="primary"
                                                    icon={<EditOutlined />}
                                                    onClick={() =>
                                                        setModal({ modalData: { ...item, periode_awal: dateFormatter(item.periode_awal), periode_akhir: dateFormatter(item.periode_akhir) }, title: `Edit ${item.skp}`, trigger: true, type: 'edit' })
                                                    }
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    onClick={() =>
                                                        setModal({ modalData: { ...item, periode_awal: dateFormatter(item.periode_awal), periode_akhir: dateFormatter(item.periode_akhir) }, title: `Hapus ${item.skp}`, trigger: true, type: 'delete' })
                                                    }
                                                    danger
                                                    variant="filled"
                                                    type="primary"
                                                    icon={<DeleteOutlined />}
                                                >
                                                    Hapus
                                                </Button>
                                            </div>
                                        </div>
                                    </Card>
                                ))
                            ) : (
                                <Empty className="mb-6" />
                            )}
                            <Pagination />
                        </div>
                    )}
                </div>
            </Card>
            <CrudModal isLoading={submitLoading} width={800} isModalOpen={modal.trigger} title={modal.title} data={modal.modalData} onSubmit={onSubmit} formFields={formFields} onClose={handleClose} type={modal.type}>
                <CrudModal.Extra>
                    <div className="flex flex-col">
                        <Card className="mt-12 bg-blue-500 text-white mb-6">
                            <p className="text-xs">
                                Cek terlebih dahulu data Unit Kerja dan Atasan sebelum membuat SKP. Jika terdapat kesalahan bisa dilakukan perubahan pada menu <b>Profil</b>.
                            </p>
                        </Card>
                        {modal.type === 'create' && (
                            <div className="grid grid-flow-row divide-y text-xs px-4 mb-6">
                                <div className="flex items-center justify-between py-2">
                                    <span className="uppercase font-semibold">unit kerja</span>
                                    <p className="text-right">{user.jabatan?.unor.nama}</p>
                                </div>
                                <div className="flex items-center justify-between py-2">
                                    <span className="uppercase font-semibold">jenis pegawai</span>
                                    <Tag color="blue">Pimpinan</Tag>
                                </div>
                                {/* <div className="flex items-center justify-between py-2">
                                    <span className="uppercase font-semibold">atasan</span>
                                    <div className="flex flex-col gap-y-1">
                                        <p className="text-right">SUPRATMAN NENTO</p>
                                        <p className="text-right">BIDANG PENGADAAN, PEMBERHENTIAN DAN INFORMASI KEPEGAWAIAN</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between py-2">
                                    <span className="uppercase font-semibold">unit kerja atasan</span>
                                    <p className="text-right">BADAN KEPEGAWAIAN DAN PENGEMBANGAN SUMBER DAYA MANUSIA</p>
                                </div> */}
                            </div>
                        )}

                        <Card className=" bg-blue-500 text-white">
                            <p className="text-xs">
                                Periode Rencana SKP yang dibuat pada menu ini adalah <b>TAHUNAN</b>. Periode Penilaian Periodik (BULANAN / TRIWULANAN) dan FINAL dibuat di menu Penilaian.
                            </p>
                        </Card>
                    </div>
                </CrudModal.Extra>
            </CrudModal>
        </div>
    );
};

export default page;
