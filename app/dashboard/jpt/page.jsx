'use client';

import { Alert, Breadcrumb, Button, Card, Empty, Select, Skeleton, Tag, Typography, Result } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { dummySkp } from '@/data';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { CrudModal, FilterField } from '@/components';
import { useRouter } from 'next/navigation';
import useFetchData from '@/hooks/useFetchData';
import { getData } from '@/controller/AuthorizationController';
import { destroy, getAll, store, update, getByUserId } from '@/controller/SKPController';
import { getAllPosjabByUnit, getByNIP } from '@/controller/IDSN/JabatanController';
import { formatDateToDayMonthYear } from '@/utils/util';
import { getAll as getAllRenstra } from '@/controller/RenstraController';
import { getByUnitId } from '@/controller/PeriodeRKTController';
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
    const [skp, setSKP] = useState(null);
    const [jabatan, setJabatan] = useState(null);
    const [resntra, setRenstra] = useState(null);
    const [periodeRKT, setPeriodeRKT] = useState(null);
    const [isJT, setIsJT] = useState(false);
    const [isAtasan, setIsAtasan] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const [errorData, setErrorData] = useState({ show: false, message: '' });
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
            // const jabatan = await getByNIP(data.token, data.user.nipBaru);
            // const selectedJabatan = jabatan.mapData.data[0];
            // const isJT = cekJT(struktur.mapData[0], selectedJabatan.nama_jabatan);
            // const isAtasan = cekJabatan(struktur.mapData[0], selectedJabatan.nama_jabatan);
            // setIsJT(isJT);
            // setIsAtasan(isAtasan);
            const struktur = await getById(user.token, user.jabatan.unor.induk.id);
            const jpt = struktur.mapData[0];
            console.log(jpt);

            const unit = await getAllPosjabByUnit(user.token, user.jabatan.unor.induk.id);
            console.log(unit);

            const jt = unit.mapData.data.find((item) => {
                console.log("HERE", item);
                return item.nama_jabatan.toLowerCase() === jpt.namaJabatan.toLowerCase(); // Add return statement
            });
            const skp = await getByUserId(jt.nip_asn);


            const resntra = await getAllRenstra();
            const periodeRKT = await getByUnitId(user.jabatan.unor.induk.id);
            setRenstra(resntra.data);
            setPeriodeRKT(periodeRKT.data);
            setJabatan(jt);
            setSKP(skp.data);
            setLoadingData(false);
        } catch (error) {
            setLoadingData(false);
            setErrorData({ show: true, message: error.message });
        }
    };

    const onSubmit = async (values, type, id) => {
        try {
            let response;
            let dt = values;
            dt = { ...dt, jabatan: [jabatan], user_id: data.user.idASN, isJPT: isJT };
            switch (type) {
                case 'create':
                    response = await store(data.user.idASN, dt, '1');
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

            if (response.ok) {
                const newData = await getByUserId(data.user.idASN);
                setSKP(newData.data);
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
            extra: { maxDate: dayjs('2019-08-01', 'YYYY-MM-DD') },
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


    const handleClose = () => {
        setModal({ trigger: false, modalData: null });
    };

    return (
        <div className="w-full flex flex-col gap-y-4">
            {alert.show !== false && <Alert message={alert.message} description={alert.description} type={alert.type} showIcon closable />}
            <Card>
                <div className="flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                        <Title className="mt-2" level={5}>
                            Data SKP
                        </Title>
                    </div>

                    {loadingData ? (
                        <Skeleton active />
                    ) : errorData.show ? (
                        <Result status="500" title="Oops! Something went wrong" subTitle={errorData.message} />
                    ) : (
                        <div className="flex flex-col gap-y-4">
                            {skp?.length > 0 ? (
                                skp.map((item) => (
                                    <Card key={item._id} type="inner" title={<Tag color="blue">{item._id}</Tag>}>
                                        <div className="w-full flex flex-col gap-y-4">
                                            <div className="flex w-full items-center gap-x-2 ">
                                                <Button onClick={() => router.push(window.location.pathname + `/${item.id}/detail`)}>Detail SKP</Button>
                                                <Button onClick={() => router.push(window.location.pathname + `/${item.id}/periode`)}>Penilaian</Button>
                                                <Button onClick={() => router.push(window.location.pathname + `/${item.id}/monitoring_kinerja`)}>Monitoring Kinerja</Button>
                                                <Button onClick={() => router.push(window.location.pathname + `/${item.id}/aktivitas`)}>Aktivitas</Button>
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
                                                    <span className="uppercase font-semibold">Nama Pegawai</span>
                                                    <p className="text-right uppercase">{item.jabatan.at(-1).nama_asn}</p>
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
                                        </div>
                                    </Card>
                                ))
                            ) : (
                                <Empty className="mb-6" />
                            )}
                        </div>
                    )}
                </div>
            </Card>
            <CrudModal width={800} isModalOpen={modal.trigger} title={modal.title} data={modal.modalData} onSubmit={onSubmit} formFields={formFields} onClose={handleClose} type={modal.type}>
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
                                    <p className="text-right">{jabatan?.unor.nama}</p>
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
