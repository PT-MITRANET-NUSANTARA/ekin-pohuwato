'use client';

import { Button, Card, List, Popconfirm, Skeleton, Space, Tag, Tooltip, Typography } from 'antd';
import { UserOutlined, DotChartOutlined, PrinterOutlined, ReloadOutlined, SearchOutlined, EditFilled, EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { getById, update } from '@/controller/SKPController';
import { formatDateToDayMonthYear } from '@/utils/util';
import { CrudModal, DataTable, InfoModal, ItemRow } from '@/components';
import useNotification from '@/app/hook/useNotification';
import { dummyMisi } from '@/data/dummyData';
import { cekJabatan, cekJT } from '@/utils/jabatanUtils';
import { getData } from '@/controller/AuthorizationController';
import { getById as getUnitById } from '@/controller/IDSN/UnitController';
import useFetchData from '@/hooks/useFetchData';
import { getById as getStruktur } from '@/controller/IDSN/UnitController';

const { Title } = Typography;
const page = () => {
    const { success, error } = useNotification();

    const { IdSkp } = useParams();
    const router = useRouter();
    const [jabatan, setJabatan] = useState(null);
    const [skp, setSkp] = useState(null);
    const [loadingData, setLoadingData] = useState(true);
    const [modal, setModal] = useState({ trigger: false, modalData: null, title: '', formFields: [], onSubmit: () => { } });
    const [infoModal, setInfoModal] = useState({ trigger: false, title: '', onClose: () => { }, data: null, type: '', isLoading: false, column: [] });
    const [utama, setUtama] = useState(null);
    const [tambahan, setTambahan] = useState(null);
    const [rktData, setRktData] = useState([]);
    const [loadingRkt, setLoadingRkt] = useState(false);
    const [selectedRkt, setSelectedRkt] = useState(null);
    const [userRhkModal, setUserRhkModal] = useState({ trigger: false, modalData: null, title: '', formFields: [], onSubmit: () => { } });
    const [isJT, setIsJT] = useState(false);
    const { data: user, setData: setUser } = useFetchData(getData);

    useEffect(() => {
        if (user) {
        fetchData();
                        
        }
    }, [user]);

    useEffect(() => {
        if (skp && skp.jabatan && skp.jabatan.length > 0 && skp.periodeRKT) {
            fetchRktData();
            fetchUserRhkData();
        }
    }, [skp]);

    const fetchData = async () => {
        try {
            const skp = await getById(IdSkp);
            setSkp(skp.data);
            const lastJabatan = skp.data.jabatan[skp.data.jabatan.length - 1];
            setJabatan(lastJabatan);
            const selectedJabatan = user.jabatan;
            const struktur = await getStruktur(user.token, selectedJabatan.unor.induk.id);

            const isJT = cekJT(struktur.mapData[0], selectedJabatan.nama_jabatan);
            console.log(isJT);
            
            setIsJT(isJT);
            
            setUtama(skp.data.rhks.filter((item) => item.jenis === 'utama'));
            setTambahan(skp.data.rhks.filter((item) => item.jenis === 'tambahan'));
        } catch (error) {
            console.log(error);
            setLoadingData(false);
        }finally{
            setLoadingData(false);
        }
    };

    const fetchRktData = async () => {
        try {
            setLoadingRkt(true);
            // Get the unit ID from the last jabatan in the array
            const lastJabatan = skp.jabatan[skp.jabatan.length - 1];
            const unitId = lastJabatan?.unor?.id;
            
            if (!unitId) {
                error("Gagal", "Tidak dapat menemukan ID unit dari jabatan");
                setLoadingRkt(false);
                return;
            }

            // Fetch RKT data for the unit and periodeRKT
            const response = await fetch(`/api/rkt?filters=${encodeURIComponent(JSON.stringify({
                'unit.id': unitId,
                periodeRKT: skp.periodeRKT._id || skp.periodeRKT
            }))}`);
            
            const result = await response.json();
            
            if (result.ok) {
                setRktData(result.data);
            } else {
                error("Gagal", "Gagal mengambil data RKT");
            }
        } catch (err) {
            console.error("Error fetching RKT data:", err);
            error("Gagal", "Terjadi kesalahan saat mengambil data RKT");
        } finally {
            setLoadingRkt(false);
        }
    };

    const fetchUserRhkData = async () => {
        try {
            // Fetch UserRHK data for this SKP with RKT populated
            const response = await fetch(`/api/user-rhk?filters=${encodeURIComponent(JSON.stringify({
                skp: IdSkp
            }))}`);
            
            const result = await response.json();

            console.log(result);
            
            if (result.ok) {
                // Handle both array and paginated response formats
                const responseData = Array.isArray(result.data) ? result.data : 
                                   (result.data && result.data.data) ? result.data.data : [];
                
                // Split the results into utama and tambahan
                const utamaRhks = responseData.filter(rhk => rhk.jenis === 'utama');
                const tambahanRhks = responseData.filter(rhk => rhk.jenis === 'tambahan');
                
                setUtama(utamaRhks);
                setTambahan(tambahanRhks);
            } else {
                error("Gagal", "Gagal mengambil data RHK");
            }
        } catch (err) {
            console.error("Error fetching UserRHK data:", err);
            error("Gagal", "Terjadi kesalahan saat mengambil data RHK");
        }
    };

    const cetakSkpSubmit = (values) => {
        const query = new URLSearchParams(values).toString();
        router.push(`/document/${IdSkp}/1/rencana_skp?${query}`);
    };

    const rktTambahanColumn = [
        {
            title: 'No',
            dataIndex: 'index',
            render: (text, record, index) => index + 1,
            width: '5%'
        },
        {
            title: 'Nama/Deskripsi',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => (
                <div>
                    <div className="font-bold">{text || record.description || 'RKT tanpa nama'}</div>
                    {record.unit && <div className="text-sm text-gray-500">Unit: {record.unit.nama || record.unit.id}</div>}
                </div>
            ),
            sorter: (a, b) => {
                const aText = a.name || a.description || '';
                const bText = b.name || b.description || '';
                return aText.length - bText.length;
            }
        },
        {
            title: 'Action',
            key: 'action',
            width: '120px',
            render: (_, record) => (
                <Space size="small">
                    <Button
                        size="middle"
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => {
                            // Get the last jabatan for posjab
                            const lastJabatan = skp.jabatan[skp.jabatan.length - 1];
                            
                            setUserRhkModal({
                                trigger: true,
                                title: 'Tambah RHK dari RKT',
                                formFields: userRhkFields,
                                onSubmit: handleUserRhkSubmit,
                                modalData: {
                                    rkts: [record._id],
                                    description: record.description || record.name || ''
                                }
                            });
                            setInfoModal({ ...infoModal, trigger: false });
                        }}
                    >
                        Pilih
                    </Button>
                </Space>
            )
        }
    ];


    const cetakSkpFields = [
        {
            label: 'Tanggal',
            name: 'tanggal',
            type: 'date',
            rules: [
                {
                    required: true,
                    message: 'Field tanggal wajib diisi'
                }
            ]
        },
        {
            label: 'Lokasi',
            name: 'lokasi',
            type: 'text',
            rules: [
                {
                    required: true,
                    message: 'Field lokasi wajib diisi'
                }
            ]
        }
    ];

    const lampiranFields = [
        {
            label: 'Isi Lampiran',
            name: 'isi_lampiran',
            type: 'longtext',
            rules: [
                {
                    required: true,
                    message: 'Field Isi Lampiran wajib diisi'
                }
            ]
        }
    ];

    const addLampiran = async (key, values) => {
        const lampiran = skp.lampiran[key];
        lampiran.push(values);

        const dt = {
            ...skp,
            lampiran: {
                ...skp.lampiran,
                [key]: lampiran
            }
        };

        const res = await update(skp._id, skp);
        if (res.oke) {
            fetchData();
            success('Berhasil Menambahkan Lampiran');
        } else {
            error('Gagal', res.data);
        }

    };

    const userRhkFields = [
        {
            label: 'RKT',
            name: 'rkts',
            type: 'select',
            mode: 'multiple',
            options: rktData.map(rkt => ({
                label: rkt.name || rkt.description || 'RKT tanpa nama',
                value: rkt._id
            })),
            rules: [
                {
                    required: false,
                    message: 'Silakan pilih RKT'
                }
            ]
        },
        {
            label: 'RHK',
            name: 'description',
            type: 'longtext',
            rules: [
                {
                    required: true,
                    message: 'Deskripsi wajib diisi'
                }
            ]
        },
        {
            label: 'Jenis',
            name: 'jenis',
            type: 'select',
            options: [
                { label: 'Utama', value: 'utama' },
                { label: 'Tambahan', value: 'tambahan' }
            ],
            rules: [
                {
                    required: true,
                    message: 'Jenis wajib dipilih'
                }
            ]
        },
        {
            label: 'Klasifikasi',
            name: 'klasifikasi',
            type: 'select',
            options: [
                { label: 'Organisasi', value: 'organisasi' },
                { label: 'Individu', value: 'individu' }
            ],
            rules: [
                {
                    required: false
                }
            ]
        },
        {
            label: 'Penugasan',
            name: 'penugasan',
            type: 'text',
            rules: [
                {
                    required: false
                }
            ]
        }
    ];

    const handleUserRhkDelete = async (userRhkId) => {
        try {
            const response = await fetch(`/api/user-rhk/${userRhkId}`, {
                method: 'DELETE'
            });

            const result = await response.json();
            
            if (result.ok) {
                success('Berhasil', 'RHK berhasil dihapus');
                // Refresh data
                fetchUserRhkData();
            } else {
                error('Gagal', result.msg || 'Gagal menghapus RHK');
            }
        } catch (err) {
            console.error('Error deleting UserRHK:', err);
            error('Gagal', 'Terjadi kesalahan saat menghapus RHK');
        }
    };

    // Function to create aspect templates for a UserRHK
    const createAspectTemplates = async (userRhkId, pendekatan) => {
        try {
            const response = await fetch('/api/aspek/template', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userRHK: userRhkId,
                    pendekatan: pendekatan
                })
            });
            
            const result = await response.json();
            if (!result.ok) {
                console.error('Failed to create aspect templates:', result.msg);
            }
        } catch (err) {
            console.error('Error creating aspect templates:', err);
        }
    };

    const handleUserRhkSubmit = async (values, type, id) => {
        try {
            // Get the last jabatan for posjab value
            const lastJabatan = skp.jabatan[skp.jabatan.length - 1];
            
            // Ensure rkts is an array
            const rkts = values.rkts || [];
            
            // Prepare the data for creating/updating a UserRHK
            const userRhkData = {
                ...values,
                user: jabatan?.nip_asn || '', // Using the NIP as string
                skp: IdSkp,
                // Always use the posjab from lastJabatan
                posjab: lastJabatan?.nama_jabatan || '',
                // Ensure penugasan has a default value if not provided
                penugasan: values.penugasan || ''
            };

            let response;
            let method = 'POST';
            let url = '/api/user-rhk';
            
            if (type === 'edit') {
                method = 'PUT';
                url = `/api/user-rhk/${id}`;
            }

            response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userRhkData)
            });

            const result = await response.json();

            if (result.ok) {
                const successMessage = type === 'edit' ? 'RHK berhasil diperbarui' : 'RHK berhasil ditambahkan';
                success('Berhasil', successMessage);
                
                // If creating a new UserRHK, create aspect templates directly
                if (type !== 'edit' && result.data && result.data._id) {
                    await createAspectTemplates(result.data._id, skp.pendekatan);
                }
                
                setUserRhkModal({ trigger: false, modalData: null });
                // Refresh UserRHK data
                fetchUserRhkData();
            } else {
                error('Gagal', result.msg || 'Gagal ' + (type === 'edit' ? 'memperbarui' : 'menambahkan') + ' RHK');
            }
        } catch (err) {
            console.error('Error creating/updating UserRHK:', err);
            error('Gagal', 'Terjadi kesalahan saat ' + (type === 'edit' ? 'memperbarui' : 'menambahkan') + ' RHK');
        }
    };

    return (
        <div className="w-full flex flex-col gap-y-4">

            <Card>
                <div className="flex flex-col gap-y-4 mb-6">
                    <div className="w-full flex items-center justify-between">
                        <Title className="mt-2" level={5}>
                            Sasaran Kinerja Pegawai
                        </Title>
                        <div className="flex items-center gap-x-2">
                            <Button type="primary" icon={<UserOutlined />} onClick={() => router.push('/dashboard/profil')}>
                                Lihat Data Profil
                            </Button>
                            <Button type="default" icon={<DotChartOutlined />} onClick={() => router.push(`/dashboard/skp/${IdSkp}/matriks_peran_hasil`)}>
                                Lihat Matriks
                            </Button>
                            <Button type="default" icon={<PrinterOutlined />} onClick={() => setModal({ trigger: true, modalData: null, title: `Cetak Rencana SKP`, type: 'create', formFields: cetakSkpFields, onSubmit: cetakSkpSubmit })}>
                                Cetak
                            </Button>
                            <Tooltip title="Refresh Data">
                                <Button icon={<ReloadOutlined />} onClick={() => fetchData()} />
                            </Tooltip>
                        </div>
                    </div>
                </div>
                
                {loadingData ? (
                    <Skeleton active />
                ) : (
                    <>
                        <div className="w-full flex items-center justify-between mb-4">
                            <div>
                                <h2 className="text-xl font-semibold mb-2">Rencana Hasil Kerja</h2>
                                <p className="text-sm text-gray-500">Tambahkan RHK dari RKT unit</p>
                            </div>
                            <div className='inline-flex gap-x-2'>
                                {isJT ? (
                                    <>
                                        <Button 
                                            type="primary"
                                            icon={<PlusOutlined />}
                                            onClick={() => setUserRhkModal({
                                                trigger: true,
                                                title: 'Tambah RHK dari RKT',
                                                formFields: userRhkFields,
                                                onSubmit: handleUserRhkSubmit,
                                                modalData: {
                                                    rkts: []
                                                }
                                            })}
                                            loading={loadingRkt}
                                            disabled={loadingRkt || rktData.length === 0}
                                        >
                                            Tambah dari RKT
                                        </Button>
                                        <Button
                                            icon={<SearchOutlined />}
                                            onClick={() => {
                                                setInfoModal({
                                                    title: 'Daftar RKT',
                                                    trigger: true,
                                                    type: 'paragraf',
                                                    data: {
                                                        content: (
                                                            <>
                                                                <DataTable 
                                                                    columns={rktTambahanColumn} 
                                                                    data={rktData.length > 0 ? rktData : []} 
                                                                    loading={loadingRkt}
                                                                />
                                                            </>
                                                        )
                                                    },
                                                    isLoading: loadingRkt,
                                                    onClose: () => setInfoModal({ ...infoModal, trigger: false, data: null })
                                                });
                                            }}
                                        >
                                            Lihat RKT
                                        </Button>
                                    </>
                                ) : (
                                    <Card style={{ backgroundColor: '#f6ffed', border: '1px solid #b7eb8f' }} size="small">
                                        <p className="text-sm">
                                            Fitur tambah, edit, dan hapus RHK hanya tersedia untuk pengguna JPT.
                                        </p>
                                    </Card>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-flow-row divide-y text-xs mb-6">
                            <div className="flex items-center justify-between py-2">
                                <span className="uppercase font-semibold">periode</span>
                                <Tag color="blue" className="capitalize">
                                    {formatDateToDayMonthYear(skp?.periode_awal)} - {formatDateToDayMonthYear(skp?.periode_akhir)}
                                </Tag>
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <span className="uppercase font-semibold">pendekatan</span>
                                <Tag color="blue" className="capitalize">
                                    {skp?.pendekatan}
                                </Tag>
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <span className="uppercase font-semibold">status</span>
                                <Tag color="green" className="capitalize">
                                    {skp?.status}
                                </Tag>
                            </div>
                            {/* <div className="flex items-center justify-between py-2">
                            <span className="uppercase font-semibold">Model SKP</span>
                            <p className="text-right capitalize">JAJF</p>
                        </div> */}
                            {/* <div className="flex items-center justify-between py-2">
                            <span className="uppercase font-semibold">jenis pegawai</span>
                            <p className="text-right capitalize">pemimpin</p>
                        </div> */}
                        </div>
                        <div className="w-full grid grid-cols-12 gap-4 mb-6">
                            <Card type="inner" title="Pegawai Yang Dinilai" className="col-span-6 w-full">
                                <div className="grid grid-flow-row divide-y text-xs">
                                    <div className="flex items-center justify-between py-2">
                                        <span className="uppercase font-semibold">nama</span>
                                        <p color="blue" className="capitalize">
                                            {jabatan?.nama_asn}
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-between py-2">
                                        <span className="uppercase font-semibold">nip</span>
                                        <p color="blue" className="capitalize">
                                            {jabatan?.nip_asn}
                                        </p>
                                    </div>
                                    {/* <div className="flex items-center justify-between py-2">
                                <span className="uppercase font-semibold">pangkat / golongan / ruang</span>
                                <p color="green" className="capitalize">
                                    Penata Tingkat I / III/d
                                </p>
                            </div> */}
                                    <div className="flex items-center justify-between py-2">
                                        <span className="uppercase font-semibold">jabatan</span>
                                        <p className="text-right capitalize"> {jabatan?.nama_jabatan}</p>
                                    </div>
                                    <div className="flex justify-between py-2">
                                        <span className="uppercase font-semibold">unit kerja</span>
                                        <div className="flex flex-col gap-y-2 text-right items-end">
                                            <p>{jabatan?.unor.nama} </p>
                                            <small>ID : {jabatan?.unor.id}</small>
                                            {/* <Button type="primary" shape="circle" size="small" icon={<SearchOutlined />} /> */}
                                        </div>
                                    </div>
                                </div>
                            </Card>
                            <Card type="inner" title="Pegawai Yang Penilai" className="col-span-6 w-full">
                                <div className="grid grid-flow-row divide-y text-xs">
                                    <div className="flex items-center justify-between py-2">
                                        <span className="uppercase font-semibold">nama</span>
                                        <p color="blue" className="capitalize">
                                            {jabatan?.unor.atasan.asn.nama_atasan}
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-between py-2">
                                        <span className="uppercase font-semibold">nip</span>
                                        <p color="blue" className="capitalize">
                                            {jabatan?.unor.atasan.asn.nip_atasan}
                                        </p>
                                    </div>
                                    {/* <div className="flex items-center justify-between py-2">
                                <span className="uppercase font-semibold">pangkat / golongan / ruang</span>
                                <p color="green" className="capitalize">
                                    Penata Tingkat I / III/d
                                </p>
                            </div> */}
                                    <div className="flex items-center justify-between py-2">
                                        <span className="uppercase font-semibold">jabatan</span>
                                        <p className="text-right capitalize"> {jabatan?.unor.atasan.unor_jabatan}</p>
                                    </div>
                                    <div className="flex justify-between py-2">
                                        <span className="uppercase font-semibold">unit kerja</span>
                                        <div className="flex flex-col gap-y-2 text-right items-end">
                                            <p>{jabatan?.unor.atasan.unor_nama} </p>
                                            <small>ID : {jabatan?.unor.atasan.unor_id}</small>
                                            {/* <Button type="primary" shape="circle" size="small" icon={<SearchOutlined />} /> */}
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        <table className="normaltable mb-6">
                            <thead>
                                <tr>
                                    <th>NO</th>
                                    {!isJT && <th style={{ maxWidth: '12rem' }}>RENCANA HASIL KERJA PIMPINAN YANG DIINTERVENSI</th>}
                                    <th>RENCANA HASIL KERJA</th>
                                    <th>ASPEK</th>
                                    <th>INDIKATOR KINERJA INDIVIDU</th>
                                    <th>TARGET TAHUNAN</th>
                                </tr>
                            </thead>
                            <tbody className="capitalize text-sm">
                                <tr>
                                    <td colSpan={isJT ? 5 : 6} className="text-left px-4">
                                        <div className='w-full flex items-center justify-between px-4'>
                                            Utama
                                        </div>
                                    </td>
                                </tr>
                                {utama?.map((item, index) => (
                                    <ItemRow 
                                        key={index} 
                                        item={item} 
                                        index={index} 
                                        onEdit={() => {
                                            setUserRhkModal({
                                                trigger: true,
                                                title: 'Edit RHK',
                                                formFields: userRhkFields,
                                                onSubmit: handleUserRhkSubmit,
                                                modalData: {
                                                    ...item,
                                                    rkts: item.rkts?.map(rkt => rkt._id || rkt) || []
                                                },
                                                type: 'edit',
                                                id: item._id
                                            });
                                        }}
                                        onDelete={() => handleUserRhkDelete(item._id)}
                                        isJT={isJT}
                                    />
                                ))}
                                <tr>
                                    <td colSpan={isJT ? 5 : 6} className="text-left px-4">
                                        <div className='w-full flex items-center justify-between px-4'>
                                            Tambahan
                                        </div>
                                    </td>
                                </tr>
                                {tambahan?.map((item, index) => (
                                    <ItemRow 
                                        key={index} 
                                        item={item} 
                                        index={index} 
                                        onEdit={() => {
                                            setUserRhkModal({
                                                trigger: true,
                                                title: 'Edit RHK',
                                                formFields: userRhkFields,
                                                onSubmit: handleUserRhkSubmit,
                                                modalData: {
                                                    ...item,
                                                    rkts: item.rkts?.map(rkt => rkt._id || rkt) || []
                                                },
                                                type: 'edit',
                                                id: item._id
                                            });
                                        }}
                                        onDelete={() => handleUserRhkDelete(item._id)}
                                        isJT={isJT}
                                    />
                                ))}
                            </tbody>
                        </table>
                        <table className="normaltable mb-6">
                            <thead>
                                <tr className="uppercase">
                                    <th>no</th>
                                    <th>perilaku kinerja</th>
                                    <th>ekspektasi khusus pimpinan</th>
                                </tr>
                            </thead>
                            <tbody className="capitalize">
                                {skp?.perilakus?.map((item, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td style={{ padding: '8px' }}>
                                            <div className="flex flex-col gap-y-2 text-left">
                                                <b>{item.name}</b>
                                                <ol className="list-decimal list-inside">
                                                    {item.isi.map((isiItem, isiIndex) => (
                                                        <li key={isiIndex}>{isiItem}</li>
                                                    ))}
                                                </ol>
                                            </div>
                                        </td>
                                        <td>{item.espektasi || ''}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <table className="normaltable">
                            <thead>
                                <tr>
                                    <th className="text-left px-4">Lampiran</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td style={{ border: '1px solid black', padding: '8px' }}>
                                        <div className="flex flex-col gap-y-2 p-4">
                                            <b>Dukungan Sumber Daya</b>
                                            <List
                                                className="px-4"
                                                dataSource={skp?.lampiran.sumber_daya}
                                                renderItem={
                                                    (item) =>
                                                        <List.Item
                                                            actions={[
                                                                <Button
                                                                    icon={<EditOutlined />}
                                                                    onClick={() =>
                                                                        setModal({
                                                                            formFields: lampiranFields,
                                                                            modalData: item,
                                                                            onSubmit: (values) => {
                                                                                console.log('seharusnya ini mengedit lampiran')
                                                                            },
                                                                            title: 'Edit Dukungan Sumber Daya',
                                                                            trigger: true,
                                                                            type: 'edit',
                                                                        })
                                                                    }
                                                                />,
                                                                <Button
                                                                    icon={<DeleteOutlined />}
                                                                    onClick={() =>
                                                                        setModal({
                                                                            formFields: lampiranFields,
                                                                            modalData: item,
                                                                            onSubmit: (values) => {
                                                                                console.log('seharusnya ini menghapus lampiran')
                                                                            },
                                                                            title: 'Delete Dukungan Sumber Daya',
                                                                            trigger: true,
                                                                            type: 'delete',
                                                                        })
                                                                    }
                                                                />
                                                            ]}
                                                        >
                                                            {item.isi_lampiran}
                                                        </List.Item>}
                                            />
                                            <Button
                                                className="w-fit"
                                                type="primary"
                                                onClick={() =>
                                                    setModal({
                                                        formFields: lampiranFields,
                                                        onSubmit: (values) => {
                                                            addLampiran('sumber_daya', values);
                                                        },
                                                        title: 'Tambah Dukungan Sumber Daya',
                                                        trigger: true,
                                                        type: 'create',
                                                        modalData: {}
                                                    })
                                                }
                                            >
                                                Tambah
                                            </Button>
                                        </div>
                                        {/* looping through here */}
                                    </td>
                                </tr>
                                <tr>
                                    <td style={{ border: '1px solid black', padding: '8px' }}>
                                        <div className="flex flex-col gap-y-2 p-4">
                                            <b>Skema Pertanggung Jawaban</b>
                                            <List
                                                className="px-4"
                                                dataSource={skp?.lampiran.skema}
                                                renderItem={
                                                    (item) =>
                                                        <List.Item
                                                            actions={[
                                                                <Button
                                                                    icon={<EditOutlined />}
                                                                    onClick={() =>
                                                                        setModal({
                                                                            formFields: lampiranFields,
                                                                            modalData: item,
                                                                            onSubmit: (values) => {
                                                                                console.log('seharusnya ini mengedit lampiran')
                                                                            },
                                                                            title: 'Edit Dukungan Sumber Daya',
                                                                            trigger: true,
                                                                            type: 'edit',
                                                                        })
                                                                    }
                                                                />,
                                                                <Button
                                                                    icon={<DeleteOutlined />}
                                                                    onClick={() =>
                                                                        setModal({
                                                                            formFields: lampiranFields,
                                                                            modalData: item,
                                                                            onSubmit: (values) => {
                                                                                console.log('seharusnya ini menghapus lampiran')
                                                                            },
                                                                            title: 'Delete Dukungan Sumber Daya',
                                                                            trigger: true,
                                                                            type: 'delete',
                                                                        })
                                                                    }
                                                                />
                                                            ]}>
                                                            {item.isi_lampiran}
                                                        </List.Item>}
                                            />
                                            <Button
                                                className="w-fit"
                                                type="primary"
                                                onClick={() =>
                                                    setModal({
                                                        formFields: lampiranFields,
                                                        onSubmit: (values) => {
                                                            addLampiran('skema', values);
                                                        },
                                                        title: 'Edit Dukungan Sumber Daya',
                                                        trigger: true,
                                                        type: 'create',
                                                        modalData: {}
                                                    })
                                                }
                                            >
                                                Tambah
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td style={{ border: '1px solid black', padding: '8px' }}>
                                        <div className="flex flex-col gap-y-2 p-4">
                                            <p>Konsekuensi</p>
                                            <List
                                                className="px-4"
                                                dataSource={skp?.lampiran.konsekuensi}
                                                renderItem={
                                                    (item) =>
                                                        <List.Item
                                                            actions={[
                                                                <Button
                                                                    icon={<EditOutlined />}
                                                                    onClick={() =>
                                                                        setModal({
                                                                            formFields: lampiranFields,
                                                                            modalData: item,
                                                                            onSubmit: (values) => {
                                                                                console.log('seharusnya ini mengedit lampiran')
                                                                            },
                                                                            title: 'Edit Dukungan Sumber Daya',
                                                                            trigger: true,
                                                                            type: 'edit',
                                                                        })
                                                                    }
                                                                />,
                                                                <Button
                                                                    icon={<DeleteOutlined />}
                                                                    onClick={() =>
                                                                        setModal({
                                                                            formFields: lampiranFields,
                                                                            modalData: item,
                                                                            onSubmit: (values) => {
                                                                                console.log('seharusnya ini menghapus lampiran')
                                                                            },
                                                                            title: 'Delete Dukungan Sumber Daya',
                                                                            trigger: true,
                                                                            type: 'delete',
                                                                        })
                                                                    }
                                                                />
                                                            ]}>
                                                            {item.isi_lampiran}
                                                        </List.Item>}
                                            />
                                            <Button
                                                className="w-fit"
                                                type="primary"
                                                onClick={() =>
                                                    setModal({
                                                        formFields: lampiranFields,
                                                        onSubmit: (values) => {
                                                            addLampiran('konsekuensi', values);
                                                        },
                                                        title: 'Edit Dukungan Sumber Daya',
                                                        trigger: true,
                                                        type: 'edit',
                                                        modalData: {}
                                                    })
                                                }
                                            >
                                                Tambah
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </>
                )}
            </Card>
            <CrudModal title={modal.title} onSubmit={modal.onSubmit} isModalOpen={modal.trigger} onClose={() => setModal({ trigger: false, modalData: null })} data={modal.modalData} formFields={modal.formFields} type={modal.type} />
            <CrudModal 
                title={userRhkModal.title} 
                onSubmit={userRhkModal.onSubmit} 
                isModalOpen={userRhkModal.trigger && isJT} 
                onClose={() => setUserRhkModal({ trigger: false, modalData: null })} 
                data={userRhkModal.modalData} 
                formFields={userRhkModal.formFields} 
                type={userRhkModal.type || "create"} 
            />
            <InfoModal close={infoModal.onClose} data={infoModal.data} isModalOpen={infoModal.trigger} title={infoModal.title} columns={infoModal.column} isLoading={infoModal.isLoading} type={infoModal.type} />
        </div>
    );
};

export default page;
