'use client';

import { CrudModal, DataLoading, DataTable, FilterField, InfoModal } from '@/components';
import { Alert, Breadcrumb, Button, Card, List, Modal, Space, Typography, Upload, Select, Form, Tabs, Collapse } from 'antd';
import { PlusOutlined, EditOutlined, EyeOutlined, DeleteOutlined, UploadOutlined, DownloadOutlined, OrderedListOutlined, SearchOutlined } from '@ant-design/icons';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { dateFormatter } from '@/utils';
import { getAll, store, update, destroy, getByPeriodeRKTId, getByUnitId } from '@/controller/PerjanjianKinerjaController';
import { getAll as getAllPeriodeRKT, getByUnitId as getPeriodeRKTByUnitId } from '@/controller/PeriodeRKTController';
import { getData } from '@/controller/AuthorizationController';
import { getById as getSubUnitById } from '@/controller/IDSN/UnitController';
import useFetchData from '@/hooks/useFetchData';
import { formatDateToDayMonthYear } from '@/utils/util';
import useNotification from '@/app/hook/useNotification';

const { Title } = Typography;
const { Panel } = Collapse;
const { TabPane } = Tabs;

// Helper function to flatten unit hierarchy
const flattenUnits = (unit, result = []) => {
    if (!unit) return result;
    
    // Add the current unit
    result.push({
        id: unit.id,
        namaUnor: unit.namaUnor,
        namaJabatan: unit.namaJabatan,
        eselonNama: unit.eselonNama,
        induk: unit.induk
    });
    
    // Process all bawahan units recursively
    if (unit.bawahan && unit.bawahan.length > 0) {
        unit.bawahan.forEach(bawahanUnit => {
            flattenUnits(bawahanUnit, result);
        });
    }
    
    return result;
};

const page = () => {
    const router = useRouter();
    const [modal, setModal] = useState({ trigger: false, modalData: null, title: '', formFields: [], onSubmit: () => { } });
    const [infoModal, setInfoModal] = useState({ trigger: false, title: '', onClose: () => { }, data: null, type: '', isLoading: false, column: [] });
    const { success, error } = useNotification();
    const [submitLoading, setSubmitLoading] = useState(false);
    const [fileModal, setFileModal] = useState({ 
        trigger: false, 
        modalData: [],
        perjanjianKinerjaid: null
    });
    const [uploadModal, setUploadModal] = useState({ 
        visible: false, 
        periodeRKT: null, 
        unit: null,
        currentFiles: []
    });
    const [deletingFiles, setDeletingFiles] = useState({});
    const { data: user, setData: setUser } = useFetchData(getData);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, filters: {}, total: 0 });
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [periodeRKTList, setPeriodeRKTList] = useState([]);
    const [unitList, setUnitList] = useState([]);
    const [selectedPeriodeRKT, setSelectedPeriodeRKT] = useState(null);
    const [perjanjianData, setPerjanjianData] = useState({});
    const [fileList, setFileList] = useState([]);
    const [form] = Form.useForm();
    const [dokument_url, setDokumentUrl] = useState(process.env.NEXT_PUBLIC_API_IMAGE_URL);

    useEffect(() => {
        if (user) {
        fetchData();
        }
    }, [user, pagination.page, pagination.limit]);

    useEffect(() => {
        if (selectedPeriodeRKT) {
            fetchPerjanjianData();
        }
    }, [selectedPeriodeRKT]);

    const fetchData = async () => {
        try {
            setLoading(true);
            
            // Get all periodeRKT records
            const periodeRKTData = await getPeriodeRKTByUnitId(user.jabatan?.unor?.induk.id);
            setPeriodeRKTList(periodeRKTData.data);
            
            // Get the unit hierarchy
            const subUnitRes = await getSubUnitById(user?.token, user.jabatan?.unor?.induk.id);
            const subUnit = subUnitRes.mapData[0];
            
            // Flatten the units for easier display
            const allUnits = flattenUnits(subUnit);
            setUnitList(allUnits);
            
            // Get all perjanjian kinerja records
            const perjanjianData = await getByUnitId(user.jabatan?.unor?.induk.id, pagination.page, pagination.limit, pagination.filters);
            setData(perjanjianData.data.data);
            setPagination({ 
                ...pagination, 
                filters: pagination.filters, 
                page: perjanjianData.data.pagination.currentPage, 
                limit: perjanjianData.data.pagination.pageSize, 
                total: perjanjianData.data.pagination.totalItems 
            });
            
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchPerjanjianData = async () => {
        if (!selectedPeriodeRKT) return;
        
        try {
            // Get all perjanjian kinerja for the selected periodeRKT
            const response = await getByPeriodeRKTId(selectedPeriodeRKT, 1, 100, {});
            
            // Organize data by unit
            const perjanjianByUnit = {};
            
            if (response.ok && response.data.data && response.data.data.length > 0) {
                response.data.data.forEach(perjanjian => {
                    if (perjanjian.unit && perjanjian.unit.id) {
                        perjanjianByUnit[perjanjian.unit.id] = perjanjian;
                    }
                });
            }
            
            setPerjanjianData(perjanjianByUnit);
        } catch (error) {
            console.error("Error fetching perjanjian data:", error);
        }
    };

    const onSubmit = async (values, type, id, formData) => {
        try {
            let response;
            let dt = values;
            
            // Add the unit data
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

            if (response.ok) {
                fetchData();
                if (selectedPeriodeRKT) {
                    fetchPerjanjianData();
                }
                success('Berhasil', type === 'delete' ? 'Berhasil Menghapus Perjanjian Kinerja' : type === 'edit' ? 'Berhasil Mengedit Perjanjian Kinerja' : 'Berhasil Menambahkan Perjanjian Kinerja');
            } else {
                if (Array.isArray(response.data)) {
                    response.data.forEach((err) => {
                        error('Gagal', err);
                    });
                } else {
                    error('Gagal', response.data);
                }
            }
        } catch (err) {
            error('Gagal', err.message);
        }
        setSubmitLoading(false);
        handleClose();
    };

    const handleFileUpload = async () => {
        if (!uploadModal.periodeRKT || !uploadModal.unit) {
            error("Gagal", "Pilih periode RKT dan unit terlebih dahulu");
            return;
        }

        // Log the fileList for debugging
        console.log("File list before upload:", fileList);

        try {
            setSubmitLoading(true);
            
            // Process the file list - only use files that have a fileId (successfully uploaded)
            const files = fileList
                .filter(file => file.fileId) // Only include files that have been uploaded
                .map(file => ({
                    fileId: file.fileId,
                    name: file.name,
                    type: file.type || 'application/octet-stream', // Default type if missing
                    uid: file.uid
                }));
            
            console.log("Processed files:", files);
            
            if (files.length === 0) {
                error("Gagal", "Tidak ada file yang berhasil diunggah");
                setSubmitLoading(false);
                return;
            }
            
            // Check if there's an existing record for this unit and periodeRKT
            const existingPerjanjian = perjanjianData[uploadModal.unit.id];
            let response;
            
            if (existingPerjanjian) {
                // Update existing record - Make sure file_perjanjian is sent as an array of objects
                const existingFiles = Array.isArray(existingPerjanjian.file_perjanjian) ? existingPerjanjian.file_perjanjian : [];
                
                const updatedData = {
                    ...existingPerjanjian,
                    file_perjanjian: [...existingFiles, ...files],
                    periodeRKT: uploadModal.periodeRKT // Ensure we're sending the ID, not the object
                };
                
                // Make sure _id is not included in nested objects to avoid MongoDB errors
                if (updatedData._id) {
                    updatedData._id = updatedData._id.toString();
                }
                
                // Make sure we're not sending a stringified version of file_perjanjian
                if (typeof updatedData.file_perjanjian === 'string') {
                    try {
                        updatedData.file_perjanjian = JSON.parse(updatedData.file_perjanjian);
                    } catch (e) {
                        console.error("Error parsing file_perjanjian:", e);
                    }
                }
                
                console.log("Updating existing perjanjian:", JSON.stringify(updatedData, null, 2));
                response = await update(existingPerjanjian._id, updatedData);
            } else {
                // Create new record
                const newPerjanjian = {
                    periodeRKT: uploadModal.periodeRKT,
                    unit: uploadModal.unit,
                    file_perjanjian: files
                };
                
                console.log("Creating new perjanjian:", JSON.stringify(newPerjanjian, null, 2));
                response = await store(newPerjanjian);
            }
            
            if (response.ok) {
                success("Berhasil", "Berhasil mengunggah file perjanjian kinerja");
                setUploadModal({ visible: false, periodeRKT: null, unit: null, currentFiles: [] });
                setFileList([]);
                
                // Refresh data
                if (selectedPeriodeRKT) {
                    fetchPerjanjianData();
                }
                fetchData();
            } else {
                console.error("Response error:", response);
                if (Array.isArray(response.data)) {
                    response.data.forEach((err) => {
                        error('Gagal', err);
                    });
                } else {
                    error('Gagal', response.data);
                }
            }
        } catch (err) {
            console.error("Upload error:", err);
            error("Gagal", err.message);
        } finally {
            setSubmitLoading(false);
        }
    };

    const handlePeriodeChange = (value) => {
        setSelectedPeriodeRKT(value);
    };

    const Column = [
        {
            title: 'No',
            dataIndex: 'index',
            render: (text, record, index) => index + 1,
            width: '5%'
        },
        {
            title: 'Periode RKT',
            dataIndex: 'periodeRKT',
            key: 'periodeRKT',
            render: (periodeRKT) => (
                periodeRKT ? 
                    `${formatDateToDayMonthYear(periodeRKT.periode_start)} - ${formatDateToDayMonthYear(periodeRKT.periode_end)}` 
                    : '-'
            )
        },
        {
            title: 'Unit',
            dataIndex: 'unit',
            key: 'unit',
            render: (unit) => unit?.namaUnor || '-'
        },
        {
            title: 'File Perjanjian',
            dataIndex: 'file_perjanjian',
            key: 'file_perjanjian',
            render: (files, record) => (
                <Button 
                    size="small" 
                    onClick={() => setFileModal({ 
                        trigger: true, 
                        modalData: files || [],
                        perjanjianKinerjaid: record._id
                    })}
                >
                    {files?.length || 0} file
                </Button>
            )
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="small">
                    <Button 
                        icon={<UploadOutlined />} 
                        onClick={() => {
                            setUploadModal({
                                visible: true,
                                periodeRKT: record.periodeRKT._id,
                                unit: record.unit,
                                currentFiles: record.file_perjanjian || []
                            });
                            // Initialize fileList with existing files
                            const existingFiles = record.file_perjanjian || [];
                            // Don't add already uploaded files to the fileList to avoid duplicate uploads
                            setFileList([]);
                        }}
                    />
                    <Button
                        onClick={() => 
                            setModal({
                                trigger: true,
                                modalData: { ...record, periodeRKT: record.periodeRKT._id },
                                title: `Edit Perjanjian Kinerja`,
                                type: 'edit',
                                formFields: perjanjianFields,
                                onSubmit: onSubmit
                            })
                        }
                        size="middle"
                        icon={<EditOutlined />}
                    />
                    <Button
                        onClick={() =>
                            setModal({
                                trigger: true,
                                modalData: { ...record, periodeRKT: record.periodeRKT._id },
                                title: `Hapus Perjanjian Kinerja`,
                                type: 'delete',
                                formFields: perjanjianFields,
                                onSubmit: onSubmit
                            })
                        }
                        size="middle"
                        danger
                        icon={<DeleteOutlined />}
                    />
                </Space>
            )
        }
    ];

    const perjanjianFields = [
        {
            label: 'Periode RKT',
            name: 'periodeRKT',
            type: 'select',
            rules: [
                {
                    required: true,
                    message: 'Field periode RKT wajib di isi'
                }
            ],
            options: periodeRKTList?.map((item) => ({ 
                value: item._id, 
                label: formatDateToDayMonthYear(item.periode_start) + ' - ' + formatDateToDayMonthYear(item.periode_end) 
            }))
        }
    ];

    const filterFields = [
        {
            label: 'Periode RKT',
            name: 'periodeRKT',
            type: 'select',
            filter: 'eq',
            options: periodeRKTList?.map((item) => ({ 
                value: item._id, 
                label: formatDateToDayMonthYear(item.periode_start) + ' - ' + formatDateToDayMonthYear(item.periode_end) 
            }))
        }
    ];

    const onFilter = async (values) => {
        filterFields.forEach((field) => {
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

    const handleClose = () => {
        setModal({ trigger: false, modalData: null });
    };

    const handleUpload = async ({ file, onSuccess, onError }) => {
        const formData = new FormData();
        formData.append('document', file);

        try {
            const response = await fetch(`${dokument_url}`, {
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            console.log("Server response:", data);

            // Extract fileId from the response - might be in different paths
            const fileId = data.fileId || (data.data && data.data.id) || data.id;
            
            if (response.ok && fileId) {
                success(`${file.name} file uploaded successfully.`);

                // Store the fileId directly in the file object
                file.fileId = fileId;
                
                // Update the file list with the fileId
                setFileList(prevList => {
                    // Find if file already exists in the list
                    const fileExists = prevList.some(item => item.uid === file.uid);
                    
                    if (fileExists) {
                        // Update existing file
                        const newList = prevList.map(item => 
                            item.uid === file.uid 
                                ? { ...item, fileId: fileId, status: 'done' } 
                                : item
                        );
                        console.log("Updated file list:", newList);
                        return newList;
                    } else {
                        // Add new file to list
                        const newFile = { 
                            uid: file.uid, 
                            name: file.name, 
                            status: 'done', 
                            fileId: fileId,
                            type: file.type
                        };
                        const newList = [...prevList, newFile];
                        console.log("Added new file:", newFile);
                        console.log("New file list:", newList);
                        return newList;
                    }
                });

                onSuccess('OK');
            } else {
                console.error("Upload response not OK or missing fileId:", data);
                error(`${file.name} file upload failed.`);
                onError(new Error('Upload failed'));
            }
        } catch (err) {
            console.error("Upload error:", err);
            error(`${file.name} file upload failed.`);
            onError(err);
        }
    };

    const uploadProps = {
        name: 'document',
        customRequest: handleUpload,
        onChange(info) {
            console.log("Upload onChange event:", info);
            
            // Don't update the fileList here, it's managed in the handleUpload function
            const { status } = info.file;
            if (status === 'done') {
                success('Success', `${info.file.name} file uploaded successfully.`);
                // We don't need to update fileList here as it's already updated in handleUpload
            } else if (status === 'error') {
                error('Error', `${info.file.name} file upload failed.`);
            }
        },
        onRemove(file) {
            // If the file has already been uploaded (has fileId), delete it from the server
            if (file.fileId) {
                const confirmDelete = window.confirm(`Apakah Anda yakin ingin menghapus file ${file.name}?`);
                if (confirmDelete) {
                    // We're removing a file that's already on the server
                    try {
                        fetch(`${dokument_url}/${file.fileId}`, {
                            method: 'DELETE'
                        }).then(response => {
                            if (response.ok) {
                                success(`${file.name} berhasil dihapus dari server.`);
                            } else {
                                error(`Gagal menghapus ${file.name} dari server.`);
                            }
                        }).catch(err => {
                            console.error("Error deleting file:", err);
                            error(`Gagal menghapus ${file.name}: ${err.message}`);
                        });
                    } catch (err) {
                        console.error("Error deleting file:", err);
                        error(`Gagal menghapus ${file.name}: ${err.message}`);
                    }
                } else {
                    // User cancelled deletion
                    return false; // prevent removal
                }
            }
            
            // Remove from fileList state regardless
            setFileList(prev => prev.filter(item => item.uid !== file.uid));
            return true; // allow removal from upload list
        },
        fileList
    };

    const renderUnitTree = (unit) => {
        if (!unit) return null;
        
        // Check if this unit has a perjanjian kinerja for selected periode
        const hasPerjanjian = perjanjianData[unit.id];
        const fileCount = hasPerjanjian?.file_perjanjian?.length || 0;
        
        return (
            <div className="p-3 border rounded mb-2">
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="font-semibold">{unit.namaUnor}</h3>
                        <p className="text-sm text-gray-500">{unit.namaJabatan} - {unit.eselonNama}</p>
                    </div>
                    <div className="flex gap-2">
                    <Button
                            type="primary" 
                            icon={<UploadOutlined />}
                        onClick={() => {
                                setUploadModal({
                                    visible: true,
                                    periodeRKT: selectedPeriodeRKT,
                                    unit: unit,
                                    currentFiles: hasPerjanjian?.file_perjanjian || []
                                });
                                // Initialize fileList with existing files
                                const existingFiles = hasPerjanjian?.file_perjanjian || [];
                                // Don't add already uploaded files to the fileList to avoid duplicate uploads
                                setFileList([]);
                            }}
                        >
                            Upload
                        </Button>
                        {fileCount > 0 && (
                    <Button
                                onClick={() => setFileModal({ 
                                    trigger: true, 
                                    modalData: hasPerjanjian?.file_perjanjian || [],
                                    perjanjianKinerjaid: hasPerjanjian?._id
                                })}
                            >
                                Lihat {fileCount} file
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    // Function to handle file deletion
    const handleFileDelete = async (file, perjanjianKinerjaid) => {
        // Set loading state for this specific file
        setDeletingFiles(prev => ({ ...prev, [file.fileId]: true }));
        
        // Get the existing perjanjian kinerja record - without relying on uploadModal.unit
        let existingPerjanjian = null;
        
        // If we have a perjanjianKinerjaid, try to find the record directly
        if (perjanjianKinerjaid) {
            existingPerjanjian = data.find(item => item._id === perjanjianKinerjaid);
        } 
        // If we have an active uploadModal with unit data, try to get record from perjanjianData
        else if (uploadModal.unit && uploadModal.unit.id) {
            existingPerjanjian = perjanjianData[uploadModal.unit.id];
        }
        
        if (!existingPerjanjian) {
            error("Gagal", "Tidak dapat menemukan data perjanjian kinerja");
            setDeletingFiles(prev => ({ ...prev, [file.fileId]: false }));
            return;
        }
        
        try {
            // First delete the file from the server
            const fileId = file.fileId;
            if (!fileId) {
                error(`Tidak dapat menemukan fileId untuk file ${file.name}`);
                setDeletingFiles(prev => ({ ...prev, [file.fileId]: false }));
                return;
            }
            
            const response = await fetch(`${dokument_url}/${fileId}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                // Then update the perjanjian kinerja record
                const updatedFiles = existingPerjanjian.file_perjanjian.filter(
                    item => item.fileId !== fileId
                );
                
                const updatedData = {
                    ...existingPerjanjian,
                    file_perjanjian: updatedFiles,
                    periodeRKT: existingPerjanjian.periodeRKT._id || existingPerjanjian.periodeRKT
                };
                
                const updateResponse = await update(existingPerjanjian._id, updatedData);
                
                if (updateResponse.ok) {
                    success("Berhasil", `File ${file.name} berhasil dihapus`);
                    
                    // Update UI state
                    setFileList(prev => prev.filter(item => item.fileId !== fileId));
                    
                    // If we're viewing the file modal, update that too
                    if (fileModal.trigger) {
                        setFileModal({
                            ...fileModal,
                            modalData: fileModal.modalData.filter(item => item.fileId !== fileId)
                        });
                    }
                    
                    // Refresh data
                    if (selectedPeriodeRKT) {
                        fetchPerjanjianData();
                    }
                    fetchData();
                } else {
                    error("Gagal", "Gagal memperbarui data perjanjian kinerja");
                }
            } else {
                const errorData = await response.json();
                error("Gagal", `Gagal menghapus file: ${errorData.message || 'Unknown error'}`);
            }
        } catch (err) {
            console.error("Error deleting file:", err);
            error("Gagal", `Gagal menghapus file: ${err.message}`);
        } finally {
            // Clear loading state for this file
            setDeletingFiles(prev => ({ ...prev, [file.fileId]: false }));
        }
    };

    // Update the Modal component to include file deletion feature with loading state
    const renderFileList = () => (
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
                        <div className="flex gap-2">
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
                            <Button
                                size="small"
                                danger
                                icon={<DeleteOutlined />}
                                loading={deletingFiles[item.fileId]}
                                disabled={deletingFiles[item.fileId]}
                                onClick={() => handleFileDelete(item, fileModal.perjanjianKinerjaid)}
                            />
                        </div>
                    </div>
                </List.Item>
            )}
            locale={{ emptyText: "Tidak ada file" }}
        />
    );

    return (
        <div className="w-full flex flex-col gap-y-4">
            {loading ? (
                <DataLoading loadingData={loading} />
            ) : (
                <>
                    <Card className="mb-4">
                    <div className="flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                            <Title className="mt-2" level={5}>
                                    Manajemen Perjanjian Kinerja Berdasarkan Sub Unit
                            </Title>
                            </div>
                            <div className="mb-4">
                                <Form layout="inline">
                                    <Form.Item label="Periode RKT" className="mb-4">
                                        <Select
                                            style={{ width: 300 }}
                                            placeholder="Pilih Periode RKT"
                                            onChange={handlePeriodeChange}
                                            options={periodeRKTList?.map((item) => ({ 
                                                value: item._id, 
                                                label: formatDateToDayMonthYear(item.periode_start) + ' - ' + formatDateToDayMonthYear(item.periode_end) 
                                            }))}
                                        />
                                    </Form.Item>
                                </Form>
                            </div>
                            
                            {selectedPeriodeRKT ? (
                                <div className="mt-4">
                                    <Collapse defaultActiveKey={['1']}>
                                        <Panel header={user.jabatan?.unor?.induk.nama || "Semua Unit"} key="1">
                                            {unitList.map(unit => (
                                                <div key={unit.id}>
                                                    {renderUnitTree(unit)}
                                                </div>
                                            ))}
                                        </Panel>
                                    </Collapse>
                                </div>
                            ) : (
                                <Alert 
                                    message="Pilih periode RKT terlebih dahulu untuk melihat perjanjian kinerja unit" 
                                    type="info" 
                                    showIcon 
                                />
                            )}
                        </div>
                    </Card>

                    <Card>
                        <div className="flex flex-col">
                            <div className="flex items-center justify-between mb-4">
                                <Title className="mt-2" level={5}>
                                    Daftar Semua Perjanjian Kinerja
                                </Title>
                        </div>
                        <div className="w-full">
                                <FilterField fields={filterFields} onSubmit={onFilter}></FilterField>
                        </div>
                        <div className="overflow-x-auto">
                            <DataTable columns={Column} data={data} pagination={pagination} setPagination={setPagination} />
                        </div>
                    </div>
                </Card>
                </>
            )}

            <CrudModal 
                isLoading={submitLoading} 
                title={modal.title} 
                isModalOpen={modal.trigger} 
                data={modal.modalData} 
                onSubmit={modal.onSubmit} 
                onClose={handleClose} 
                formFields={modal.formFields} 
                type={modal.type} 
            />
            
            <Modal 
                open={fileModal.trigger} 
                onCancel={() => setFileModal({ modalData: null, trigger: false })} 
                footer={null}
                title="Daftar File Perjanjian Kinerja"
            >
                {renderFileList()}
            </Modal>

            <Modal
                title="Upload File Perjanjian Kinerja"
                open={uploadModal.visible}
                onOk={handleFileUpload}
                onCancel={() => {
                    setUploadModal({ visible: false, periodeRKT: null, unit: null, currentFiles: [] });
                    setFileList([]);
                }}
                confirmLoading={submitLoading}
            >
                <div className="mb-4">
                    <p className="font-semibold">Periode RKT:</p>
                    <p>
                        {periodeRKTList?.find(p => p._id === uploadModal.periodeRKT)
                            ? `${formatDateToDayMonthYear(periodeRKTList.find(p => p._id === uploadModal.periodeRKT).periode_start)} - 
                              ${formatDateToDayMonthYear(periodeRKTList.find(p => p._id === uploadModal.periodeRKT).periode_end)}`
                            : '-'
                        }
                    </p>
                </div>
                <div className="mb-4">
                    <p className="font-semibold">Unit:</p>
                    <p>{uploadModal.unit?.namaUnor || '-'}</p>
                </div>
                
                <div className="mb-4">
                    <p className="font-semibold">Status Upload:</p>
                    <p>Total file dalam antrian: {fileList.length}</p>
                    <p>File dengan fileId: {fileList.filter(f => f.fileId).length}</p>
                </div>
                
                <Upload.Dragger 
                    {...uploadProps}
                    multiple={true}
                    listType="picture"
                    beforeUpload={(file) => {
                        console.log("Before upload:", file);
                        return true;
                    }}
                    onRemove={(file) => {
                        setFileList(prev => prev.filter(item => item.uid !== file.uid));
                    }}
                >
                    <p className="ant-upload-drag-icon">
                        <UploadOutlined />
                    </p>
                    <p className="ant-upload-text">Klik atau seret file ke area ini untuk mengunggah</p>
                    <p className="ant-upload-hint">
                        Mendukung pengunggahan file tunggal atau massal.
                    </p>
                </Upload.Dragger>
                
                {uploadModal.currentFiles?.length > 0 && (
                    <div className="mt-4">
                        <p className="font-semibold">File yang sudah diunggah:</p>
                        <List
                            size="small"
                            dataSource={uploadModal.currentFiles}
                            renderItem={(item) => (
                                <List.Item>
                                    <a 
                                        href={process.env.NEXT_PUBLIC_API_IMAGE_URL + '/' + item.fileId} 
                                        target="_blank" 
                                        rel="noreferrer"
                                    >
                                        {item.name}
                                    </a>
                                </List.Item>
                            )}
                        />
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default page;
