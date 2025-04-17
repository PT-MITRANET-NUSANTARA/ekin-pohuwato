'use client';

import { Breadcrumb, Button, Card, Checkbox, Divider, List, Modal, Space, Table, Tag, Tooltip, Typography, message } from 'antd';
import { PlusOutlined, ReloadOutlined, FileAddOutlined, CheckCircleOutlined, CheckCircleTwoTone, ArrowLeftOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CrudModal, DataLoading } from '@/components';
import { getById as getSKP } from '@/controller/SKPController';
import { getById as getPeriodePenilaian } from '@/controller/periodePenilaianController';
import { getBySKPId } from '@/controller/UserRHKController';
import { getByUserRHK, getByPeriodePenilaian, getByUserRHKAndPeriode } from '@/controller/RHKController';
import { deriveRHK } from '@/controller/UserRHKController';
import { dateFormatter } from '@/utils';
import { formatDateToDayMonthYear } from '@/utils/util';
import useNotification from '@/app/hook/useNotification';
import ItemRow from '@/components/ItemRow/ItemRow';

const { Title, Text } = Typography;

const ManagementRHKPage = () => {
    const router = useRouter();
    const { IdSkp, IdPeriode, IdRhk } = useParams();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [skp, setSKP] = useState(null);
    const [periodePenilaian, setPeriodePenilaian] = useState(null);
    const [userRHKs, setUserRHKs] = useState([]);
    const [assignedRHKs, setAssignedRHKs] = useState([]);
    const [selectedUserRHKs, setSelectedUserRHKs] = useState([]);
    const [assignmentModal, setAssignmentModal] = useState({ visible: false, title: '', data: [] });
    const { success, error } = useNotification();
    const [utama, setUtama] = useState([]);
    const [tambahan, setTambahan] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch SKP data of subordinate (IdRhk is the SKP ID of subordinate)
            const skpResponse = await getSKP(IdRhk);
            if (!skpResponse.ok || !skpResponse.data) {
                error('Error', 'Failed to fetch SKP data');
                setLoading(false);
                return;
            }
            setSKP(skpResponse.data);

            // Fetch periode penilaian data
            const periodeResponse = await getPeriodePenilaian(IdPeriode);
            if (!periodeResponse.ok || !periodeResponse.data) {
                error('Error', 'Failed to fetch Periode Penilaian data');
                setLoading(false);
                return;
            }
            setPeriodePenilaian(periodeResponse.data);

            // Fetch all UserRHKs for this subordinate's SKP
            const userRHKResponse = await getBySKPId(IdRhk, undefined, undefined, {});
            if (!userRHKResponse.ok || !userRHKResponse.data) {
                error('Error', 'Failed to fetch UserRHK data');
                setLoading(false);
                return;
            }

            console.log('UserRHK response structure:', {
                ok: userRHKResponse.ok,
                data: userRHKResponse.data,
                hasDataArray: Array.isArray(userRHKResponse.data),
                hasDataProperty: userRHKResponse.data && typeof userRHKResponse.data === 'object' && 'data' in userRHKResponse.data,
                nestedDataIsArray: userRHKResponse.data && userRHKResponse.data.data && Array.isArray(userRHKResponse.data.data)
            });
            
            // Ensure we have a proper array for userRHKs
            let userRHKsData = [];
            if (userRHKResponse.data) {
                if (Array.isArray(userRHKResponse.data)) {
                    userRHKsData = userRHKResponse.data;
                } else if (userRHKResponse.data.data && Array.isArray(userRHKResponse.data.data)) {
                    userRHKsData = userRHKResponse.data.data;
                }
            }
            
            console.log('UserRHK data:', userRHKsData);
            
            // Fetch all RHKs already assigned to this period
            const assignedRHKResponse = await getByPeriodePenilaian(IdPeriode);
            if (!assignedRHKResponse.ok) {
                error('Error', 'Failed to fetch assigned RHKs');
                setLoading(false);
                return;
            }

            console.log('Assigned RHKs response structure:', {
                ok: assignedRHKResponse.ok,
                data: assignedRHKResponse.data,
                hasDataArray: Array.isArray(assignedRHKResponse.data),
                hasDataProperty: assignedRHKResponse.data && typeof assignedRHKResponse.data === 'object' && 'data' in assignedRHKResponse.data,
                nestedDataIsArray: assignedRHKResponse.data && assignedRHKResponse.data.data && Array.isArray(assignedRHKResponse.data.data)
            });

            // Make sure we have a proper array of assigned RHKs
            let assignedRHKs = [];
            if (assignedRHKResponse.data) {
                // Check if the response has a data property containing the array
                if (Array.isArray(assignedRHKResponse.data)) {
                    assignedRHKs = assignedRHKResponse.data;
                } else if (assignedRHKResponse.data.data && Array.isArray(assignedRHKResponse.data.data)) {
                    assignedRHKs = assignedRHKResponse.data.data;
                }
            }
            
            console.log('Assigned RHKs array:', assignedRHKs);
            setAssignedRHKs(assignedRHKs);

            // Process UserRHKs to mark ones that are already assigned
            const userRHKsWithAssignmentStatus = userRHKsData.map((userRHK, index) => {
                // Log detailed info for the first item to help debug
                if (index === 0 && assignedRHKs.length > 0) {
                    console.log('First UserRHK:', {
                        id: userRHK._id,
                        description: userRHK.description
                    });
                    
                    console.log('First AssignedRHK:', {
                        id: assignedRHKs[0]._id,
                        userRHK: assignedRHKs[0].userRHK,
                        userRHKType: typeof assignedRHKs[0].userRHK,
                        hasUserRHKId: assignedRHKs[0].userRHK && assignedRHKs[0].userRHK._id ? true : false
                    });
                }

                // Check if this UserRHK is already assigned to the current period
                const isAssigned = Array.isArray(assignedRHKs) && assignedRHKs.some(rhk => {
                    if (!rhk || !rhk.userRHK) return false;
                    
                    // Handle both direct ID and object with _id property
                    const rhkUserRhkId = typeof rhk.userRHK === 'string' 
                        ? rhk.userRHK 
                        : (rhk.userRHK._id || null);
                    
                    return rhkUserRhkId === userRHK._id;
                });
                
                return {
                    ...userRHK,
                    isAssigned,
                    key: userRHK._id
                };
            });

            setUserRHKs(userRHKsWithAssignmentStatus);
            
            // Split the results into utama and tambahan for table display
            const utamaRhks = userRHKsWithAssignmentStatus.filter(rhk => rhk.jenis === 'utama');
            const tambahanRhks = userRHKsWithAssignmentStatus.filter(rhk => rhk.jenis === 'tambahan');
            
            setUtama(utamaRhks);
            setTambahan(tambahanRhks);
        } catch (err) {
            console.error('Error fetching data:', err);
            error('Error', 'Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const handleAssignRHK = async () => {
        if (selectedUserRHKs.length === 0) {
            error('Error', 'Tidak ada User RHK yang dipilih');
            return;
        }
        
        setSubmitting(true);
        
        try {
            // Create an array of promises for each selected UserRHK
            const assignmentPromises = selectedUserRHKs.map(async userRHKId => {
                // Check if already assigned
                const alreadyAssigned = Array.isArray(assignedRHKs) && assignedRHKs.some(rhk => {
                    if (!rhk || !rhk.userRHK) return false;
                    
                    // Handle both direct ID and object with _id property
                    const rhkUserRhkId = typeof rhk.userRHK === 'string' 
                        ? rhk.userRHK 
                        : (rhk.userRHK._id || null);
                    
                    return rhkUserRhkId === userRHKId;
                });
                
                if (alreadyAssigned) {
                    return { userRHKId, success: false, message: 'Sudah dikerjakan' };
                }
                
                // Call the derive API
                const deriveResponse = await deriveRHK({
                    userRHKId: userRHKId,
                    periodePenilaianId: IdPeriode,
                    skpId: IdRhk
                });
                
                return { 
                    userRHKId, 
                    success: deriveResponse.ok, 
                    data: deriveResponse.data,
                    message: deriveResponse.ok ? 'Berhasil' : 'Gagal menambahkan'
                };
            });
            
            // Wait for all assignment operations to complete
            const results = await Promise.all(assignmentPromises);
            
            // Count successes and failures
            const successCount = results.filter(result => result.success).length;
            const failureCount = results.length - successCount;
            
            if (successCount > 0) {
                success('Berhasil', `Berhasil menambahkan ${successCount} RHK`);
            }
            
            if (failureCount > 0) {
                error('Peringatan', `Gagal menambahkan ${failureCount} RHK`);
            }
            
            // Refresh data to show updated assignments
            fetchData();
        } catch (err) {
            console.error('Error assigning RHKs:', err);
            error('Error', 'Gagal menambahkan RHK');
        } finally {
            setSubmitting(false);
            setAssignmentModal({ ...assignmentModal, visible: false });
            setSelectedUserRHKs([]);
        }
    };

    const openAssignmentModal = () => {
        // Filter out already assigned UserRHKs
        const availableUserRHKs = userRHKs.filter(userRHK => !userRHK.isAssigned);
        
        if (availableUserRHKs.length === 0) {
            error('Info', 'Semua User RHK sudah dikerjakan');
            return;
        }
        
        setAssignmentModal({
            visible: true,
            title: 'Tambah RHK untuk Periode',
            data: availableUserRHKs
        });
    };

    const assignmentModalColumns = [
        {
            title: 'Pilih',
            dataIndex: 'select',
            key: 'select',
            render: (_, record) => (
                <Checkbox
                    checked={selectedUserRHKs.includes(record._id)}
                    onChange={e => {
                        if (e.target.checked) {
                            setSelectedUserRHKs([...selectedUserRHKs, record._id]);
                        } else {
                            setSelectedUserRHKs(selectedUserRHKs.filter(id => id !== record._id));
                        }
                    }}
                />
            )
        },
        {
            title: 'Deskripsi',
            dataIndex: 'description',
            key: 'description'
        },
        {
            title: 'Jenis',
            dataIndex: 'jenis',
            key: 'jenis',
            render: (text) => (
                <Tag color={text === 'utama' ? 'blue' : 'green'}>
                    {text.toUpperCase()}
                </Tag>
            )
        },
        {
            title: 'Klasifikasi',
            dataIndex: 'klasifikasi',
            key: 'klasifikasi',
            render: (text) => (
                <Tag color={text === 'organisasi' ? 'purple' : 'orange'}>
                    {text.toUpperCase()}
                </Tag>
            )
        }
    ];

    if (loading) {
        return <DataLoading loadingData={loading} />;
    }

    return (
        <>
            <style jsx>{`
                .aspect-row {
                    display: flex;
                    padding: 4px 8px;
                    border-bottom: 1px solid #e5e7eb;
                }
                .aspect-row:last-child {
                    border-bottom: none;
                }
                .aspect-row:nth-child(odd) {
                    background-color: #f9fafb;
                }
                .aspect-cell {
                    border-left: 1px solid #e5e7eb;
                }
                .category-header {
                    background-color: #e6f7ff;
                    font-weight: 600;
                    padding: 8px 16px;
                }
                .category-tambahan {
                    background-color: #f6ffed;
                }
                .normaltable th {
                    position: relative;
                }
                .normaltable th:not(:first-child)::before {
                    content: '';
                    position: absolute;
                    left: 0;
                    top: 25%;
                    height: 50%;
                    width: 1px;
                    background-color: #d9d9d9;
                }
            `}</style>
            <div className="flex flex-col gap-y-4">
                <Card>
                    <div className="flex items-center justify-between mb-6">
                        <Title className="mt-2" level={5}>
                            Kelola RHK Bawahan untuk Penilaian
                        </Title>
                        <div className="flex items-center gap-x-2">
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={openAssignmentModal}
                            >
                                Tambah RHK
                            </Button>
                            <Tooltip title="Refresh Data">
                                <Button 
                                    icon={<ReloadOutlined />} 
                                    onClick={fetchData} 
                                />
                            </Tooltip>
                            <Button
                                icon={<ArrowLeftOutlined />}
                                onClick={() => router.push(`/dashboard/skp/${IdSkp}/periode_penilaian/${IdPeriode}/penilaian`)}
                            >
                                Kembali
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <Card type="inner" title="Informasi Bawahan">
                            <List size="small">
                                <List.Item>
                                    <span className="font-semibold">Nama:</span> 
                                    <span>{skp?.jabatan?.[skp.jabatan.length - 1]?.nama_asn || 'N/A'}</span>
                                </List.Item>
                                <List.Item>
                                    <span className="font-semibold">Jabatan:</span> 
                                    <span>{skp?.jabatan?.[skp.jabatan.length - 1]?.nama_jabatan || 'N/A'}</span>
                                </List.Item>
                                <List.Item>
                                    <span className="font-semibold">Organisasi:</span> 
                                    <span>{skp?.jabatan?.[skp.jabatan.length - 1]?.unor?.nama || 'N/A'}</span>
                                </List.Item>
                            </List>
                        </Card>
                        
                        <Card type="inner" title="Periode Penilaian">
                            <List size="small">
                                <List.Item>
                                    <span className="font-semibold">Nama Periode:</span> 
                                    <span>{periodePenilaian?.name || 'N/A'}</span>
                                </List.Item>
                                <List.Item>
                                    <span className="font-semibold">Tanggal Periode:</span> 
                                    <span>{periodePenilaian?.periode_awal && periodePenilaian?.periode_akhir 
                                        ? `${formatDateToDayMonthYear(periodePenilaian.periode_awal)} - ${formatDateToDayMonthYear(periodePenilaian.periode_akhir)}` 
                                        : 'N/A'}
                                    </span>
                                </List.Item>
                                <List.Item>
                                    <span className="font-semibold">Jenis:</span> 
                                    <span className="capitalize">{periodePenilaian?.jenis || 'N/A'}</span>
                                </List.Item>
                            </List>
                        </Card>
                    </div>

                    <Card type="inner" title="Detail SKP Bawahan" className="mb-6">
                        <List size="small">
                            <List.Item>
                                <span className="font-semibold">Periode SKP:</span> 
                                <span>{skp?.periode_awal && skp?.periode_akhir 
                                    ? `${formatDateToDayMonthYear(skp.periode_awal)} - ${formatDateToDayMonthYear(skp.periode_akhir)}` 
                                    : 'N/A'}
                                </span>
                            </List.Item>
                            <List.Item>
                                <span className="font-semibold">Pendekatan:</span> 
                                <span className="capitalize">{skp?.pendekatan || 'N/A'}</span>
                            </List.Item>
                            <List.Item>
                                <span className="font-semibold">Status:</span> 
                                <Tag color={skp?.status === 'approved' ? 'green' : 'orange'}>
                                    {skp?.status?.toUpperCase() || 'N/A'}
                                </Tag>
                            </List.Item>
                        </List>
                    </Card>

                    <div className="mb-4">
                        <Text>
                            Total User RHK: <Tag color="blue">{userRHKs.length}</Tag> | 
                            Dikerjakan: <Tag color="green">{userRHKs.filter(u => u.isAssigned).length}</Tag> |
                            Tersedia: <Tag color="orange">{userRHKs.filter(u => !u.isAssigned).length}</Tag>
                        </Text>
                    </div>

                    {/* Table using the ItemRow component format */}
                    <table className="normaltable mb-6">
                        <thead>
                            <tr>
                                <th>NO</th>
                                <th style={{ maxWidth: '12rem' }}>RENCANA HASIL KERJA PIMPINAN YANG DIINTERVENSI</th>
                                <th>RENCANA HASIL KERJA</th>
                                <th className="border-l border-gray-300">ASPEK</th>
                                <th className="border-l border-gray-300">INDIKATOR KINERJA INDIVIDU</th>
                                <th className="border-l border-gray-300">TARGET</th>
                                <th className="border-l border-gray-300">STATUS</th>
                                <th className="border-l border-gray-300">AKSI</th>
                            </tr>
                        </thead>
                        <tbody className="capitalize text-sm">
                            <tr>
                                <td colSpan={8} className="text-left px-4 font-semibold bg-blue-50">
                                    <div className='w-full flex items-center justify-between px-4'>
                                        Utama
                                    </div>
                                </td>
                            </tr>
                            {utama.map((item, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td style={{ maxWidth: '12rem', padding: '8px' }}>
                                        <div className="flex flex-col gap-y-2 text-left">
                                            <p>{item.rkt ? (typeof item.rkt === 'object' ? item.rkt.name : 'RKT') : item.parentUserRHK.description}</p>
                                        </div>
                                    </td>
                                    <td style={{ maxWidth: '12rem', padding: '8px' }}>
                                        <div className="flex flex-col gap-y-2 text-left">
                                            <p>{item.description}</p>
                                            <Tag color="blue" className="w-fit">
                                                {item.klasifikasi ? item.klasifikasi.toUpperCase() : ''}
                                            </Tag>
                                        </div>
                                    </td>
                                    <td className="border-l border-gray-200">
                                        {item.aspects && item.aspects.length > 0 
                                            ? item.aspects.map((aspect, i) => (
                                                <div key={i} className="px-2 py-1 border-b border-gray-200 last:border-b-0">
                                                    <Tag color="purple">{aspect.jenis}</Tag>
                                                </div>
                                            ))
                                            : '-'}
                                    </td>
                                    <td className="border-l border-gray-200">
                                        {item.aspects && item.aspects.length > 0 
                                            ? item.aspects.map((aspect, i) => (
                                                <div key={i} className="px-2 py-1 text-left border-b border-gray-200 last:border-b-0">
                                                    {aspect.indikator || '-'}
                                                </div>
                                            ))
                                            : '-'}
                                    </td>
                                    <td className="border-l border-gray-200">
                                        {item.aspects && item.aspects.length > 0 
                                            ? item.aspects.map((aspect, i) => (
                                                <div key={i} className="px-2 py-1 border-b border-gray-200 last:border-b-0">
                                                    {aspect.target_tahunan 
                                                        ? aspect.target_tahunan.target + (aspect.target_tahunan.satuan || '') 
                                                        : '-'}
                                                </div>
                                            ))
                                            : '-'}
                                    </td>
                                    <td className="border-l border-gray-200">
                                        {item.isAssigned ? (
                                            <Tag icon={<CheckCircleOutlined />} color="success">
                                                Dikerjakan
                                            </Tag>
                                        ) : (
                                            <Tag color="default">Tersedia</Tag>
                                        )}
                                    </td>
                                    <td className="border-l border-gray-200">
                                        {item.isAssigned ? (
                                            <Button 
                                                type="default" 
                                                disabled 
                                                icon={<CheckCircleTwoTone twoToneColor="#52c41a" />}
                                                size="small"
                                            >
                                                Dikerjakan
                                            </Button>
                                        ) : (
                                            <Button
                                                type="primary"
                                                icon={<FileAddOutlined />}
                                                size="small"
                                                onClick={() => {
                                                    setSelectedUserRHKs([item._id]);
                                                    setAssignmentModal({
                                                        visible: true,
                                                        title: 'Konfirmasi Penugasan',
                                                        data: [item]
                                                    });
                                                }}
                                            >
                                                Tambah
                                            </Button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            <tr>
                                <td colSpan={8} className="text-left px-4 font-semibold bg-green-50">
                                    <div className='w-full flex items-center justify-between px-4'>
                                        Tambahan
                                    </div>
                                </td>
                            </tr>
                            {tambahan.map((item, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td style={{ maxWidth: '12rem', padding: '8px' }}>
                                        <div className="flex flex-col gap-y-2 text-left">
                                            <p>{item.rkt ? (typeof item.rkt === 'object' ? item.rkt.name || item.rkt.description : 'RKT') : ''}</p>
                                        </div>
                                    </td>
                                    <td style={{ maxWidth: '12rem', padding: '8px' }}>
                                        <div className="flex flex-col gap-y-2 text-left">
                                            <p>{item.description}</p>
                                            <Tag color="blue" className="w-fit">
                                                {item.klasifikasi ? item.klasifikasi.toUpperCase() : ''}
                                            </Tag>
                                        </div>
                                    </td>
                                    <td className="border-l border-gray-200">
                                        {item.aspects && item.aspects.length > 0 
                                            ? item.aspects.map((aspect, i) => (
                                                <div key={i} className="px-2 py-1 border-b border-gray-200 last:border-b-0">
                                                    <Tag color="purple">{aspect.jenis}</Tag>
                                                </div>
                                            ))
                                            : '-'}
                                    </td>
                                    <td className="border-l border-gray-200">
                                        {item.aspects && item.aspects.length > 0 
                                            ? item.aspects.map((aspect, i) => (
                                                <div key={i} className="px-2 py-1 text-left border-b border-gray-200 last:border-b-0">
                                                    {aspect.indikator || '-'}
                                                </div>
                                            ))
                                            : '-'}
                                    </td>
                                    <td className="border-l border-gray-200">
                                        {item.aspects && item.aspects.length > 0 
                                            ? item.aspects.map((aspect, i) => (
                                                <div key={i} className="px-2 py-1 border-b border-gray-200 last:border-b-0">
                                                    {aspect.target_tahunan 
                                                        ? aspect.target_tahunan.target + (aspect.target_tahunan.satuan || '') 
                                                        : '-'}
                                                </div>
                                            ))
                                            : '-'}
                                    </td>
                                    <td className="border-l border-gray-200">
                                        {item.isAssigned ? (
                                            <Tag icon={<CheckCircleOutlined />} color="success">
                                                Dikerjakan
                                            </Tag>
                                        ) : (
                                            <Tag color="default">Tersedia</Tag>
                                        )}
                                    </td>
                                    <td className="border-l border-gray-200">
                                        {item.isAssigned ? (
                                            <Button 
                                                type="default" 
                                                disabled 
                                                icon={<CheckCircleTwoTone twoToneColor="#52c41a" />}
                                                size="small"
                                            >
                                                Dikerjakan
                                            </Button>
                                        ) : (
                                            <Button
                                                type="primary"
                                                icon={<FileAddOutlined />}
                                                size="small"
                                                onClick={() => {
                                                    setSelectedUserRHKs([item._id]);
                                                    setAssignmentModal({
                                                        visible: true,
                                                        title: 'Konfirmasi Penugasan',
                                                        data: [item]
                                                    });
                                                }}
                                            >
                                                Tambah
                                            </Button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Card>

                <Modal
                    title={assignmentModal.title}
                    open={assignmentModal.visible}
                    onCancel={() => {
                        setAssignmentModal({ ...assignmentModal, visible: false });
                        setSelectedUserRHKs([]);
                    }}
                    onOk={handleAssignRHK}
                    okText="Tambahkan yang Dipilih"
                    cancelText="Batal"
                    okButtonProps={{ 
                        loading: submitting,
                        disabled: selectedUserRHKs.length === 0
                    }}
                    width={800}
                >
                    <div className="mb-4">
                        <Text>
                            Dipilih: <Tag color="blue">{selectedUserRHKs.length}</Tag> dari <Tag color="orange">{assignmentModal.data.length}</Tag> User RHK tersedia
                        </Text>
                    </div>

                    <div className="mb-4">
                        <Button 
                            type="default" 
                            onClick={() => {
                                // Select all available UserRHKs
                                const allIds = assignmentModal.data.map(item => item._id);
                                setSelectedUserRHKs(allIds);
                            }}
                        >
                            Pilih Semua
                        </Button>
                        <Button 
                            type="default"
                            className="ml-2"
                            onClick={() => setSelectedUserRHKs([])}
                        >
                            Hapus Pilihan
                        </Button>
                    </div>

                    <Table 
                        columns={assignmentModalColumns} 
                        dataSource={assignmentModal.data}
                        rowKey="_id"
                        pagination={{ pageSize: 5 }}
                        rowClassName={(record) => selectedUserRHKs.includes(record._id) ? 'bg-blue-50' : ''}
                    />
                </Modal>
            </div>
        </>
    );
};

export default ManagementRHKPage; 