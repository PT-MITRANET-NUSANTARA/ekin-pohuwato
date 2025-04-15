'use client';

import { Alert, Breadcrumb, Button, Card, Empty, Select, Skeleton, Tag, Typography, Result, Pagination, Tooltip, Modal, List, Upload, Form } from 'antd';
import { ExclamationCircleFilled, PlusOutlined, ReloadOutlined, UploadOutlined, DownloadOutlined } from '@ant-design/icons';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { dummySkp } from '@/data';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { CrudModal, FilterField } from '@/components';
import { useParams, useRouter } from 'next/navigation';
import useFetchData from '@/hooks/useFetchData';
import { getData } from '@/controller/AuthorizationController';
import { destroy, getAll, store, update, getByUserId, storeAtasan, getById } from '@/controller/SKPController';
import { getByNIP } from '@/controller/IDSN/JabatanController';
import { formatDateToDayMonthYear } from '@/utils/util';
import { getAll as getAllRenstra, getByUnitId as getRenstraByUnit } from '@/controller/RenstraController';
import { getByUnitId as getPeriodeByUnit } from '@/controller/PeriodeRKTController';
import { cekJabatan, cekJT } from '@/utils/jabatanUtils';
import { getById as getUnitById } from '@/controller/IDSN/UnitController';
import { dateFormatter, renderStatusTag } from '@/utils';
import dayjs from 'dayjs';
import useNotification from '@/app/hook/useNotification';
import { store as storePerjanjianKinerja, update as updatePerjanjianKinerja, destroy as destroyPerjanjianKinerja, getAll as getAllPerjanjianKinerja } from '@/controller/PerjanjianKinerjaController';
import { getPerjanjianKinerja } from '@/controller/ReportController';
import { getById as getRKTById } from '@/controller/RKTController';
import { getById as getKegiatanById } from '@/controller/KegiatanController';
import { getById as getTujuanById } from '@/controller/TujuanController';

const { Title } = Typography;

const page = () => {
    const router = useRouter();
    const [modal, setModal] = useState({ trigger: false, modalData: null, title: '', type: '', formFields: [], extra: false });
    const { success, error } = useNotification();

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
    const [fileModal, setFileModal] = useState({
        trigger: false,
        modalData: [],
        skpId: null
    });
    const [uploadModal, setUploadModal] = useState({
        visible: false,
        periodeRKT: null,
        skpId: null,
        currentFiles: []
    });
    const [fileList, setFileList] = useState([]);
    const [deletingFiles, setDeletingFiles] = useState({});
    const [dokument_url, setDokumentUrl] = useState(process.env.NEXT_PUBLIC_API_IMAGE_URL);
    const [generateModal, setGenerateModal] = useState({
        visible: false,
        skpId: null,
        submitting: false
    });

    const [form] = Form.useForm();

    useEffect(() => {
        if (user) {
            fetchData();
        }
    }, [user, pagination.page, pagination.limit]);

    const fetchData = async () => {
        try {
            setLoadingData(true);

            // Fetch SKP data with optimized parameters
            const data = await getByUserId(user.jabatan.nip_asn, pagination.page, pagination.limit, pagination.filters);

            // Only process if we have data
            if (!data?.data?.data) {
                setData([]);
                setLoadingData(false);
                return;
            }

            const skpData = data.data.data;

            // Set pagination info early to improve perceived performance
            setPagination({
                ...pagination,
                page: data.data.pagination.currentPage,
                limit: data.data.pagination.pageSize,
                total: data.data.pagination.totalItems
            });

            // If we have no SKPs, skip enrichment
            if (!skpData || skpData.length === 0) {
                setData([]);
                setLoadingData(false);
                return;
            }

            // Use a more efficient approach for fetching related data
            // Process SKPs in batches to avoid too many concurrent requests
            const batchSize = 3;
            const enrichedData = [];

            for (let i = 0; i < skpData.length; i += batchSize) {
                const batch = skpData.slice(i, i + batchSize);
                const batchPromises = batch.map(async (skp) => {
                    // Only fetch perjanjian kinerja if we have necessary data
                    if (skp.periodeRKT?.length > 0 && skp.jabatan?.length > 0) {
                        const periodeRKTId = skp.periodeRKT[skp.periodeRKT.length - 1]._id;
                        const unitId = skp.jabatan[0].unor.id;

                        try {
                            const pkResponse = await getAllPerjanjianKinerja(1, 100, {
                                periodeRKT: periodeRKTId,
                                'unit.id': unitId
                            });

                            if (pkResponse.ok && pkResponse.data.data?.length > 0) {
                                return {
                                    ...skp,
                                    perjanjianKinerja: pkResponse.data.data[0]
                                };
                            }
                        } catch (err) {
                            console.error('Error fetching perjanjian kinerja:', err);
                        }
                    }
                    return skp;
                });

                const batchResults = await Promise.all(batchPromises);
                enrichedData.push(...batchResults);
            }

            setData(enrichedData);

            // Fetch supporting data in parallel for better performance
            const selectedJabatan = user.jabatan;
            const [struktur, resntra, periodeRKT] = await Promise.all([getUnitById(user.token, selectedJabatan.unor.induk.id), getRenstraByUnit(selectedJabatan.unor.induk.id), getPeriodeByUnit(selectedJabatan.unor.induk.id)]);

            const isJT = cekJT(struktur.mapData[0], selectedJabatan.nama_jabatan);
            const isAtasan = cekJabatan(struktur.mapData[0], selectedJabatan.nama_jabatan);

            setIsJT(isJT);
            console.log("atasan", isAtasan);
            
            setIsAtasan(isAtasan);
            setRenstra(resntra.data);
            setPeriodeRKT(periodeRKT.data);
        } catch (error) {
            console.error('Error in fetchData:', error);
            setErrorData({ show: true, message: error.message });
        } finally {
            setLoadingData(false);
        }
    };

    // Handle file upload to the server
    const handleUpload = async ({ file, onSuccess, onError }) => {
        const formData = new FormData();
        formData.append('document', file);

        try {
            const response = await fetch(`${dokument_url}`, {
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            console.log('Server response:', data);

            // Extract fileId from the response
            const fileId = data.fileId || (data.data && data.data.id) || data.id;

            if (response.ok && fileId) {
                success(`${file.name} file uploaded successfully.`);

                // Store the fileId directly in the file object
                file.fileId = fileId;

                // Update the file list with the fileId
                setFileList((prevList) => {
                    // Find if file already exists in the list
                    const fileExists = prevList.some((item) => item.uid === file.uid);

                    if (fileExists) {
                        // Update existing file
                        const newList = prevList.map((item) => (item.uid === file.uid ? { ...item, fileId: fileId, status: 'done' } : item));
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
                        return newList;
                    }
                });

                onSuccess('OK');
            } else {
                console.error('Upload response not OK or missing fileId:', data);
                error(`${file.name} file upload failed.`);
                onError(new Error('Upload failed'));
            }
        } catch (err) {
            console.error('Upload error:', err);
            error(`${file.name} file upload failed.`);
            onError(err);
        }
    };

    // Handle file upload for perjanjian kinerja
    const handleFileUpload = async () => {
        if (!uploadModal.skpId || !uploadModal.periodeRKT) {
            error('Gagal', 'Data SKP tidak lengkap');
            return;
        }

        try {
            setSubmitLoading(true);

            // Process the file list - only use files that have a fileId (successfully uploaded)
            const files = fileList
                .filter((file) => file.fileId) // Only include files that have been uploaded
                .map((file) => ({
                    fileId: file.fileId,
                    name: file.name,
                    type: file.type || 'application/octet-stream', // Default type if missing
                    uid: file.uid
                }));

            if (files.length === 0) {
                error('Gagal', 'Tidak ada file yang berhasil diunggah');
                setSubmitLoading(false);
                return;
            }

            // Find the SKP to update
            const skpToUpdate = data.find((item) => item._id === uploadModal.skpId);

            if (!skpToUpdate) {
                error('Gagal', 'SKP tidak ditemukan');
                setSubmitLoading(false);
                return;
            }

            // Get the periodeRKT ID and unit ID from the SKP
            const periodeRKTId = skpToUpdate.periodeRKT && skpToUpdate.periodeRKT.length > 0 ? skpToUpdate.periodeRKT[skpToUpdate.periodeRKT.length - 1]._id : null;
            const unitId = skpToUpdate.jabatan && skpToUpdate.jabatan.length > 0 ? skpToUpdate.jabatan[0].unor.id : null;

            if (!periodeRKTId || !unitId) {
                error('Gagal', 'Data periode RKT atau unit tidak ditemukan');
                setSubmitLoading(false);
                return;
            }

            // Check for existing perjanjian kinerja by periodeRKT and unit ID
            const pkResponse = await getAllPerjanjianKinerja(1, 100, {
                periodeRKT: periodeRKTId,
                'unit.id': unitId
            });

            let response;
            let existingPK = null;

            // If we found existing perjanjian kinerja records
            if (pkResponse.ok && pkResponse.data.data && pkResponse.data.data.length > 0) {
                existingPK = pkResponse.data.data[0]; // Use the first one

                // Update existing perjanjian kinerja record
                const existingFiles = existingPK.file_perjanjian || [];
                const updatedData = {
                    ...existingPK,
                    periodeRKT: periodeRKTId,
                    file_perjanjian: [...existingFiles, ...files]
                };

                console.log('Updating existing perjanjian kinerja:', updatedData);
                response = await updatePerjanjianKinerja(existingPK._id, updatedData);
            } else {
                // Create new perjanjian kinerja record
                const unit = skpToUpdate.jabatan[0].unor;

                const newPKData = {
                    periodeRKT: periodeRKTId,
                    unit: {
                        id: unit.id,
                        nama: unit.nama
                    },
                    file_perjanjian: files
                };

                console.log('Creating new perjanjian kinerja:', newPKData);
                response = await storePerjanjianKinerja(newPKData);
            }

            if (response.ok) {
                success('Berhasil', 'Berhasil mengunggah file perjanjian kinerja');
                setUploadModal({ visible: false, periodeRKT: null, skpId: null, currentFiles: [] });
                setFileList([]);

                // Refresh data
                fetchData();
            } else {
                console.error('Response error:', response);
                if (Array.isArray(response.data)) {
                    response.data.forEach((err) => {
                        error('Gagal', err);
                    });
                } else {
                    error('Gagal', response.data);
                }
            }
        } catch (err) {
            console.error('Upload error:', err);
            error('Gagal', err.message);
        } finally {
            setSubmitLoading(false);
        }
    };

    // Function to handle file deletion
    const handleFileDelete = async (file, skpId) => {
        // Set loading state for this specific file
        setDeletingFiles((prev) => ({ ...prev, [file.fileId]: true }));

        // Find the SKP to update
        const skpToUpdate = data.find((item) => item._id === skpId);

        if (!skpToUpdate) {
            error('Gagal', 'SKP tidak ditemukan');
            setDeletingFiles((prev) => ({ ...prev, [file.fileId]: false }));
            return;
        }

        // Get the periodeRKT ID and unit ID from the SKP
        const periodeRKTId = skpToUpdate.periodeRKT && skpToUpdate.periodeRKT.length > 0 ? skpToUpdate.periodeRKT[skpToUpdate.periodeRKT.length - 1]._id : null;
        const unitId = skpToUpdate.jabatan && skpToUpdate.jabatan.length > 0 ? skpToUpdate.jabatan[0].unor.id : null;

        if (!periodeRKTId || !unitId) {
            error('Gagal', 'Data periode RKT atau unit tidak ditemukan');
            setDeletingFiles((prev) => ({ ...prev, [file.fileId]: false }));
            return;
        }

        try {
            // Check for existing perjanjian kinerja by periodeRKT and unit ID
            const pkResponse = await getAllPerjanjianKinerja(1, 100, {
                periodeRKT: periodeRKTId,
                'unit.id': unitId
            });

            // If no perjanjian kinerja found
            if (!pkResponse.ok || !pkResponse.data.data || pkResponse.data.data.length === 0) {
                error('Gagal', 'Data perjanjian kinerja tidak ditemukan');
                setDeletingFiles((prev) => ({ ...prev, [file.fileId]: false }));
                return;
            }

            // Use the first perjanjian kinerja found
            const existingPK = pkResponse.data.data[0];

            // First delete the file from the server
            const fileId = file.fileId;
            if (!fileId) {
                error(`Tidak dapat menemukan fileId untuk file ${file.name}`);
                setDeletingFiles((prev) => ({ ...prev, [file.fileId]: false }));
                return;
            }

            const response = await fetch(`${dokument_url}/${fileId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                // Then update the perjanjian kinerja record
                const updatedFiles = (existingPK.file_perjanjian || []).filter((item) => item.fileId !== fileId);

                const updatedData = {
                    ...existingPK,
                    file_perjanjian: updatedFiles
                };

                // If there are no more files and we want to delete the entire record:
                // if (updatedFiles.length === 0) {
                //     const deleteResponse = await destroyPerjanjianKinerja(existingPK._id);
                //     // handle delete response
                // } else {
                const updateResponse = await updatePerjanjianKinerja(existingPK._id, updatedData);

                if (updateResponse.ok) {
                    success('Berhasil', `File ${file.name} berhasil dihapus`);

                    // Update UI state
                    setFileList((prev) => prev.filter((item) => item.fileId !== fileId));

                    // If we're viewing the file modal, update that too
                    if (fileModal.trigger) {
                        setFileModal({
                            ...fileModal,
                            modalData: fileModal.modalData.filter((item) => item.fileId !== fileId)
                        });
                    }

                    // Refresh data
                    fetchData();
                } else {
                    error('Gagal', 'Gagal memperbarui data perjanjian kinerja');
                }
            } else {
                const errorData = await response.json();
                error('Gagal', `Gagal menghapus file: ${errorData.message || 'Unknown error'}`);
            }
        } catch (err) {
            console.error('Error deleting file:', err);
            error('Gagal', `Gagal menghapus file: ${err.message}`);
        } finally {
            // Clear loading state for this file
            setDeletingFiles((prev) => ({ ...prev, [file.fileId]: false }));
        }
    };

    const uploadProps = {
        name: 'document',
        customRequest: handleUpload,
        onChange(info) {
            console.log('Upload onChange event:', info);

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
                        })
                            .then((response) => {
                                if (response.ok) {
                                    success(`${file.name} berhasil dihapus dari server.`);
                                } else {
                                    error(`Gagal menghapus ${file.name} dari server.`);
                                }
                            })
                            .catch((err) => {
                                console.error('Error deleting file:', err);
                                error(`Gagal menghapus ${file.name}: ${err.message}`);
                            });
                    } catch (err) {
                        console.error('Error deleting file:', err);
                        error(`Gagal menghapus ${file.name}: ${err.message}`);
                    }
                } else {
                    // User cancelled deletion
                    return false; // prevent removal
                }
            }

            // Remove from fileList state regardless
            setFileList((prev) => prev.filter((item) => item.uid !== file.uid));
            return true; // allow removal from upload list
        },
        fileList
    };

    // Render file list in the modal
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
                                    a.href = `${dokument_url}/${item.fileId}`;
                                    a.download = item.name;
                                    a.click();
                                }}
                            />
                            <Button size="small" danger icon={<DeleteOutlined />} loading={deletingFiles[item.fileId]} disabled={deletingFiles[item.fileId]} onClick={() => handleFileDelete(item, fileModal.skpId)} />
                        </div>
                    </div>
                </List.Item>
            )}
            locale={{ emptyText: 'Tidak ada file' }}
        />
    );

    const onSubmit = async (values, type, id) => {
        setSubmitLoading(true);
        try {
            let response;
            let dt = values;
            dt = { ...dt, jabatan: [user.jabatan], user_id: user.jabatan.nip_asn, posjab: [] };
            dt.periodeRKT = [values.periodeRKT];

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

            if (response.ok) {
                fetchData();
                success('Berhasil', type === 'delete' ? 'Berhasil Menghapus SKP' : type === 'edit' ? 'Berhasil Mengedit SKP' : 'Berhasil Menambahkan SKP');
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
                label: formatDateToDayMonthYear(item.periode_start) + ' - ' + formatDateToDayMonthYear(item.periode_end),
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
                label: formatDateToDayMonthYear(item.periode_start) + ' - ' + formatDateToDayMonthYear(item.periode_end),
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

    const perjanjianKinerjaFields = [
        {
            label: 'Upload Perjanjian Kinerja',
            name: 'files',
            type: 'upload'
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
            options: resntra?.map((item) => ({
                value: item._id,
                label: formatDateToDayMonthYear(item.periode_start) + ' - ' + formatDateToDayMonthYear(item.periode_end),
                id: item._id
            }))
        },
        {
            label: 'Periode RKT',
            name: 'periodeRKT',
            type: 'select',
            filter: 'eq',
            options: periodeRKT?.map((item) => ({
                value: item._id,
                label: formatDateToDayMonthYear(item.periode_start) + ' - ' + formatDateToDayMonthYear(item.periode_end),
                id_option_parent: item.renstra._id
            })),
            parentField: 'renstra'
        }
    ];

    const handleClose = () => {
        setModal({ trigger: false, modalData: null });
    };

    // Function to handle generating perjanjian kinerja document
    const handleGeneratePK = async (values) => {
        try {
            setGenerateModal((prev) => ({ ...prev, submitting: true }));
            const skpId = generateModal.skpId;

            if (!skpId) {
                error('Gagal', 'SKP ID tidak ditemukan');
                setGenerateModal((prev) => ({ ...prev, submitting: false }));
                return;
            }

            // Get the SKP data with populated rhks (UserRHK objects)
            const skpResponse = await getById(skpId);

            if (!skpResponse.ok || !skpResponse.data) {
                error('Gagal', 'Gagal mendapatkan data SKP');
                setGenerateModal((prev) => ({ ...prev, submitting: false }));
                return;
            }

            const skp = skpResponse.data;

            // Check if the SKP has UserRHKs
            if (!skp.rhks || skp.rhks.length === 0) {
                error('Gagal', 'SKP tidak memiliki data RHK');
                setGenerateModal((prev) => ({ ...prev, submitting: false }));
                return;
            }

            console.log('SKP Data with UserRHKs:', skp);

            // Get all RKT IDs from the UserRHKs
            const rktIds = skp.rhks
                .filter(userRhk => userRhk.rkt)
                .map(userRhk => userRhk.rkt);

            console.log('RKT IDs from UserRHKs:', rktIds);

            if (rktIds.length === 0) {
                error('Gagal', 'Tidak ditemukan data RKT dari UserRHK');
                setGenerateModal((prev) => ({ ...prev, submitting: false }));
                return;
            }

            // Fetch each RKT to get the populated subKegiatan data
            const rktPromises = rktIds.map(rktId => getRKTById(rktId));
            const rktResponses = await Promise.all(rktPromises);

            // Filter successful responses and get the RKT data
            const rkts = rktResponses
                .filter(response => response.ok && response.data)
                .map(response => response.data);

            console.log('Fetched RKTs from UserRHKs:', rkts);

            if (rkts.length === 0) {
                error('Gagal', 'Gagal mengambil data RKT');
                setGenerateModal((prev) => ({ ...prev, submitting: false }));
                return;
            }

            // Now we can extract the subKegiatan, kegiatan, program, and tujuan from the RKTs
            // Filter unique RKTs
            const uniqueRkts = rkts.filter((item, index, self) => index === self.findIndex((rkt) => rkt._id === item._id));

            // Extract subKegiatan
            let allSubKegiatan = uniqueRkts.filter(rkt => rkt.subKegiatan).flatMap(rkt => rkt.subKegiatan);

            console.log('allSubKegiatan', allSubKegiatan);

            // Filter unique subKegiatan
            const uniqueSubKegiatan = allSubKegiatan.filter((item, index, self) => item && index === self.findIndex((sub) => sub && sub._id === item._id));

            const kegiatanPromises = uniqueSubKegiatan.map((item) => getKegiatanById(item.kegiatan));
            const kegiatanResponses = await Promise.all(kegiatanPromises);

            const kegiatan = kegiatanResponses.filter((response) => response.ok && response.data).map((response) => response.data);

            console.log('Fetched kegiatans:', kegiatan);

            if (kegiatan.length === 0) {
                error('Gagal', 'Gagal mengambil data Kegiatan');
                setGenerateModal((prev) => ({ ...prev, submitting: false }));
                return;
            }

            // Extract program from kegiatan
            let allProgram = kegiatan.filter((kegiatan) => kegiatan && kegiatan.program).map((kegiatan) => kegiatan.program);

            // Filter unique program
            const uniqueProgram = allProgram.filter((item, index, self) => item && index === self.findIndex((program) => program && program._id === item._id));
            const tujuanPromises = uniqueProgram.map((item) => getTujuanById(item.tujuan));
            const tujuanResponses = await Promise.all(tujuanPromises);

            const tujuan = tujuanResponses.filter((response) => response.ok && response.data).map((response) => response.data);

            if (tujuan.length === 0) {
                error('Gagal', 'Gagal mengambil data Tujuan');
                setGenerateModal((prev) => ({ ...prev, submitting: false }));
                return;
            }

            console.log('Fetched tujuan:', tujuan);

            // Filter unique tujuan
            const uniqueTujuan = tujuan.filter((item, index, self) => item && index === self.findIndex((tujuan) => tujuan && tujuan._id === item._id));

            console.log('Unique Programs:', uniqueProgram);
            console.log('Unique Tujuan:', uniqueTujuan);

            // Check if we have any programs to include
            if (uniqueProgram.length === 0) {
                error('Gagal', 'Tidak ditemukan data program dari RKT');
                setGenerateModal((prev) => ({ ...prev, submitting: false }));
                return;
            }

            // Prepare the data for the perjanjian kinerja
            const query = {
                nama_pihak_pertama: values.nama_pihak_pertama,
                jabatan_pihak_pertama: values.jabatan_pihak_pertama,
                nama_pihak_kedua: values.nama_pihak_kedua,
                jabatan_pihak_kedua: values.jabatan_pihak_kedua,
                tanggal: dateFormatter(values.tanggal),
                tempat: values.tempat,
                program: uniqueProgram,
                tujuan: uniqueTujuan
            };

            console.log('Generating perjanjian kinerja with data:', query);

            // Generate the PDF
            const pdfBlob = await getPerjanjianKinerja(query);
            console.log(pdfBlob);
            
            // Reset UI state
            setGenerateModal({ visible: false, skpId: null, submitting: false });

            // Trigger download
            const url = window.URL.createObjectURL(pdfBlob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'perjanjian_kinerja.pdf';
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);

            success('Berhasil', 'Berhasil generate perjanjian kinerja');
        } catch (err) {
            console.error('Error generating perjanjian kinerja:', err);
            error('Gagal', err.message);
            setGenerateModal((prev) => ({ ...prev, submitting: false }));
        }
    };

    // Function that creates a RHK linked to its parent UserRHK
    const linkRHKToUserRHK = async (userRHK, periodePenilaianId, description = "") => {
        if (!userRHK || !userRHK._id || !periodePenilaianId) {
            console.error("Missing required data:", { userRHK, periodePenilaianId });
            return null;
        }
        
        const rhkData = {
            userRHK: userRHK._id, // Parent relationship
            periodePenilaian: periodePenilaianId,
            desc: description || userRHK.description || ""
        };
        
        console.log("Creating RHK with parent UserRHK:", rhkData);
        // Implementation would require the appropriate controller method
        // const response = await storeRHK(rhkData);
        // return response.ok ? response.data : null;
        return null;
    };

    // Function to create a new assessment period and link all UserRHKs to new RHKs
    const createPeriodAssessmentWithRHKs = async (skpId, periodData) => {
        try {
            if (!skpId || !periodData) {
                error('Gagal', 'Data tidak lengkap untuk membuat penilaian periode');
                return null;
            }

            // 1. First get the SKP data with its UserRHKs
            const skpResponse = await getById(skpId);
            if (!skpResponse.ok || !skpResponse.data) {
                error('Gagal', 'Gagal mendapatkan data SKP');
                return null;
            }

            const skp = skpResponse.data;
            if (!skp.rhks || skp.rhks.length === 0) {
                error('Gagal', 'SKP tidak memiliki data UserRHK');
                return null;
            }

            // 2. Create a new period assessment
            // const periodResponse = await storePeriodePenilaian(periodData);
            // if (!periodResponse.ok || !periodResponse.data) {
            //     error('Gagal', 'Gagal membuat periode penilaian baru');
            //     return null;
            // }
            
            // const newPeriodId = periodResponse.data._id;
            const mockPeriodId = "example_period_id"; // For demonstration only

            // 3. For each UserRHK in the SKP, create a related RHK for this period
            const rhkPromises = skp.rhks.map(userRHK => 
                linkRHKToUserRHK(userRHK, mockPeriodId)
            );
            
            // Wait for all RHKs to be created
            const results = await Promise.all(rhkPromises);
            const successCount = results.filter(r => r !== null).length;
            
            console.log(`Created ${successCount} RHKs linked to UserRHKs for period assessment`);
            
            return {
                // periodId: newPeriodId,
                periodId: mockPeriodId,
                createdRHKs: successCount,
                totalUserRHKs: skp.rhks.length
            };
        } catch (err) {
            console.error("Error creating period assessment with RHKs:", err);
            error('Gagal', `Terjadi kesalahan: ${err.message}`);
            return null;
        }
    };

    return (
        <div className="w-full flex flex-col gap-y-4">
            <Card>
                <div className="flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                        <Title className="mt-2" level={5}>
                            Data SKP
                        </Title>

                        <div className="inline-flex gap-x-2">
                            {isJT && (
                                <>
                                    <Button type="primary" icon={<PlusOutlined />} onClick={() => setModal({ modalData: null, title: 'Tambah Data', trigger: true, type: 'create', formFields: formFields, extra: true })}>
                                        Tambah
                                    </Button>
                                    {/* <Button type="primary" icon={<UploadOutlined />} onClick={() => setModal({ modalData: null, title: 'Upload Perjanjian Kinerja', trigger: true, type: 'create', formFields: perjanjianKinerjaFields, extra: false })}>
                                        Perjanjian Kinerja
                                    </Button> */}
                                </>
                            )}
                            <Tooltip title="Refresh Data">
                                <Button icon={<ReloadOutlined />} onClick={() => fetchData()} />
                            </Tooltip>
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
                                data.map((item) => {
                                    const isApprove = item.status === 'approved';
                                    return (
                                        <Card key={item._id} type="inner" title={<Tag color="blue">{item._id}</Tag>}>
                                            <div className="w-full flex flex-col gap-y-4">
                                                {!isApprove && (
                                                    <Card>
                                                        <div className="flex gap-x-2">
                                                            <ExclamationCircleFilled className="text-blue-500 text-lg" />
                                                            <p>Aksi SKP hanya tersedia ketika SKP berstatus "Disetujui". Status SKP Saat ini : {renderStatusTag(item.status)}</p>
                                                        </div>
                                                    </Card>
                                                )}
                                                <div className="flex w-full items-center gap-x-2 ">
                                                    <Button onClick={() => router.push(`/dashboard/skp/${item._id}/detail`)}>Detail SKP</Button>
                                                    <Button disabled={!isApprove} onClick={() => router.push(`/dashboard/skp/${item._id}/matriks_peran_hasil`)}>
                                                        Matriks Peran Hasil
                                                    </Button>
                                                    <Button disabled={!isApprove} onClick={() => router.push(`/dashboard/skp/${item._id}/skp_bawahan`)}>
                                                        SKP Bawahan
                                                    </Button>
                                                    <Button disabled={!isApprove} onClick={() => router.push(`/dashboard/skp/${item._id}/periode_penilaian`)}>
                                                        Penilaian
                                                    </Button>
                                                    {/* {isJT === false && <Button onClick={() => router.push(`/dashboard/skp/${item._id}/nilai`)}>Nilai</Button>} */}
                                                    <Button disabled={!isApprove} onClick={() => router.push(`/dashboard/skp/${item._id}/monitoring_kinerja`)}>
                                                        Monitoring Kinerja
                                                    </Button>
                                                    <Button disabled={!isApprove} onClick={() => router.push(`/dashboard/skp/${item._id}/aktivitas`)}>
                                                        Aktivitas
                                                    </Button>
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

                                                {/* Dedicated PK section with improved UI - only show for Pimpinan/atasan */}
                                                {isAtasan && (
                                                    <Card title="Perjanjian Kinerja" className="mt-2 border border-blue-100" headStyle={{ background: '#f0f5ff', borderBottom: '1px solid #d6e4ff' }}>
                                                        <div className="flex flex-col gap-3">
                                                            <p className="text-xs text-gray-600">Kelola dokumen perjanjian kinerja untuk SKP ini</p>
                                                            <div className="flex flex-wrap gap-2">
                                                                <Button
                                                                    type="primary"
                                                                    icon={<UploadOutlined />}
                                                                    onClick={async () => {
                                                                        try {
                                                                            // Get the periodeRKT ID and unit ID
                                                                            const periodeRKTId = item.periodeRKT && item.periodeRKT.length > 0 ? item.periodeRKT[item.periodeRKT.length - 1]._id : null;
                                                                            const unitId = item.jabatan && item.jabatan.length > 0 ? item.jabatan[0].unor.id : null;

                                                                            if (!periodeRKTId || !unitId) {
                                                                                error('Gagal', 'Data periode RKT atau unit tidak ditemukan');
                                                                                return;
                                                                            }

                                                                            // Fetch current files if any exist
                                                                            let currentFiles = [];
                                                                            try {
                                                                                const pkResponse = await getAllPerjanjianKinerja(1, 100, {
                                                                                    periodeRKT: periodeRKTId,
                                                                                    'unit.id': unitId
                                                                                });

                                                                                if (pkResponse.ok && pkResponse.data.data && pkResponse.data.data.length > 0) {
                                                                                    // Use the first perjanjian kinerja found
                                                                                    const pk = pkResponse.data.data[0];
                                                                                    currentFiles = pk.file_perjanjian || [];
                                                                                }
                                                                            } catch (e) {
                                                                                console.error('Error fetching existing files:', e);
                                                                            }

                                                                            setUploadModal({
                                                                                visible: true,
                                                                                periodeRKT: periodeRKTId,
                                                                                skpId: item._id,
                                                                                currentFiles: currentFiles
                                                                            });
                                                                            setFileList([]);
                                                                        } catch (err) {
                                                                            console.error('Error preparing upload modal:', err);
                                                                            error('Gagal', err.message);
                                                                        }
                                                                    }}
                                                                >
                                                                    Upload File PK
                                                                </Button>
                                                                <Button
                                                                    icon={<DownloadOutlined />}
                                                                    onClick={async () => {
                                                                        try {
                                                                            // Get the periodeRKT ID and unit ID
                                                                            const periodeRKTId = item.periodeRKT && item.periodeRKT.length > 0 ? item.periodeRKT[item.periodeRKT.length - 1]._id : null;
                                                                            const unitId = item.jabatan && item.jabatan.length > 0 ? item.jabatan[0].unor.id : null;

                                                                            if (!periodeRKTId || !unitId) {
                                                                                error('Gagal', 'Data periode RKT atau unit tidak ditemukan');
                                                                                return;
                                                                            }

                                                                            // Fetch perjanjian kinerja data
                                                                            const pkResponse = await getAllPerjanjianKinerja(1, 100, {
                                                                                periodeRKT: periodeRKTId,
                                                                                'unit.id': unitId
                                                                            });

                                                                            if (pkResponse.ok && pkResponse.data.data && pkResponse.data.data.length > 0) {
                                                                                // Use the first perjanjian kinerja found
                                                                                const pk = pkResponse.data.data[0];
                                                                                setFileModal({
                                                                                    trigger: true,
                                                                                    modalData: pk.file_perjanjian || [],
                                                                                    skpId: item._id
                                                                                });
                                                                            } else {
                                                                                error('Gagal', 'Data perjanjian kinerja tidak ditemukan');
                                                                            }
                                                                        } catch (err) {
                                                                            console.error('Error fetching perjanjian kinerja:', err);
                                                                            error('Gagal', err.message);
                                                                        }
                                                                    }}
                                                                >
                                                                    Lihat File PK
                                                                </Button>
                                                                <Button
                                                                    type="primary"
                                                                    icon={<DownloadOutlined />}
                                                                    onClick={() => {
                                                                        // Reset form data and show the generate modal
                                                                        form.resetFields();

                                                                        // Prefill form with some defaults if available
                                                                        const defaultValues = {
                                                                            nama_pihak_pertama: item.jabatan[0]?.nama_jabatan || '',
                                                                            jabatan_pihak_pertama: item.jabatan[0]?.unor?.nama || '',
                                                                            nama_pihak_kedua: '',
                                                                            jabatan_pihak_kedua: '',
                                                                            tanggal: dayjs(),
                                                                            tempat: ''
                                                                        };

                                                                        form.setFieldsValue(defaultValues);
                                                                        setGenerateModal({
                                                                            visible: true,
                                                                            skpId: item._id,
                                                                            submitting: false
                                                                        });
                                                                    }}
                                                                >
                                                                    Generate PK Baru
                                                                </Button>
                                                            </div>
                                                            
                                                            {/* Show existing files badge if available */}
                                                            {item.perjanjianKinerja && item.perjanjianKinerja.file_perjanjian && item.perjanjianKinerja.file_perjanjian.length > 0 && (
                                                                <div className="mt-2">
                                                                    <Tag color="green">{item.perjanjianKinerja.file_perjanjian.length} file tersedia</Tag>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </Card>
                                                )}

                                                <div className="flex w-full items-center justify-end gap-x-2 ">
                                                    <Button
                                                        type="primary"
                                                        icon={<EditOutlined />}
                                                        onClick={() =>
                                                            setModal({
                                                                modalData: {
                                                                    ...item,
                                                                    periode_awal: dateFormatter(item.periode_awal),
                                                                    periode_akhir: dateFormatter(item.periode_akhir),
                                                                    periodeRKT: item.periodeRKT?.[item.periodeRKT.length - 1]?._id || null,
                                                                    renstra: item.periodeRKT?.[item.periodeRKT.length - 1]?.renstra || null
                                                                },
                                                                title: `Edit ${item.skp}`,
                                                                trigger: true,
                                                                type: 'edit',
                                                                formFields: formFields,
                                                                extra: true
                                                            })
                                                        }
                                                    >
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        onClick={() =>
                                                            setModal({
                                                                modalData: {
                                                                    ...item,
                                                                    periode_awal: dateFormatter(item.periode_awal),
                                                                    periode_akhir: dateFormatter(item.periode_akhir),
                                                                    periodeRKT: item.periodeRKT?.[item.periodeRKT.length - 1]?._id || null,
                                                                    renstra: item.periodeRKT?.[item.periodeRKT.length - 1]?.renstra || null
                                                                },
                                                                title: `Hapus ${item.skp}`,
                                                                trigger: true,
                                                                type: 'delete',
                                                                formFields: formFields,
                                                                extra: true
                                                            })
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
                                    );
                                })
                            ) : (
                                <Empty className="mb-6" />
                            )}
                            <Pagination />
                        </div>
                    )}
                </div>
            </Card>
            <CrudModal isLoading={submitLoading} width={800} isModalOpen={modal.trigger} title={modal.title} data={modal.modalData} onSubmit={onSubmit} formFields={modal.formFields} onClose={handleClose} type={modal.type}>
                {modal.extra && (
                    <CrudModal.Extra>
                        <div className="flex flex-col">
                            <Card className="mt-12 bg-color-primary-600 text-white mb-6">
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
                                </div>
                            )}

                            <Card className=" bg-color-primary-600 text-white">
                                <p className="text-xs">
                                    Periode Rencana SKP yang dibuat pada menu ini adalah <b>TAHUNAN</b>. Periode Penilaian Periodik (BULANAN / TRIWULANAN) dan FINAL dibuat di menu Penilaian.
                                </p>
                            </Card>
                        </div>
                    </CrudModal.Extra>
                )}
            </CrudModal>

            {/* File Upload Modal */}
            <Modal
                title={
                    <div className="flex items-center gap-2">
                        <UploadOutlined />
                        <span>Upload Perjanjian Kinerja</span>
                    </div>
                }
                open={uploadModal.visible}
                onCancel={() => {
                    setUploadModal({ visible: false, periodeRKT: null, skpId: null, currentFiles: [] });
                    setFileList([]);
                }}
                footer={[
                    <Button
                        key="cancel"
                        onClick={() => {
                            setUploadModal({ visible: false, periodeRKT: null, skpId: null, currentFiles: [] });
                            setFileList([]);
                        }}
                    >
                        Batal
                    </Button>,
                    <Button key="upload" type="primary" loading={submitLoading} onClick={handleFileUpload} icon={<UploadOutlined />}>
                        Upload File
                    </Button>
                ]}
                width={650}
            >
                <div className="mb-4 p-3 bg-blue-50 rounded border border-blue-100 text-sm">
                    <p>Upload dokumen perjanjian kinerja untuk melengkapi data SKP Anda. Dokumen yang diunggah akan tersimpan dan dapat diakses kapan saja.</p>
                </div>

                <div className="my-6">
                    <Upload.Dragger {...uploadProps} multiple={true}>
                        <p className="ant-upload-drag-icon">
                            <UploadOutlined style={{ fontSize: '32px', color: '#1890ff' }} />
                        </p>
                        <p className="ant-upload-text">Klik atau seret file ke area ini untuk mengunggah</p>
                        <p className="ant-upload-hint">Mendukung pengunggahan file PDF, DOC, DOCX, XLS, XLSX</p>
                    </Upload.Dragger>
                </div>

                {uploadModal.currentFiles?.length > 0 && (
                    <div className="mt-6">
                        <div className="flex items-center mb-2">
                            <h4 className="font-semibold text-sm">Files yang telah diupload:</h4>
                            <Tag color="blue" className="ml-2">
                                {uploadModal.currentFiles.length} file
                            </Tag>
                        </div>
                        <List
                            size="small"
                            bordered
                            className="bg-gray-50"
                            dataSource={uploadModal.currentFiles}
                            renderItem={(item) => (
                                <List.Item>
                                    <div className="w-full flex justify-between items-center">
                                        <div className="flex items-center">
                                            <DownloadOutlined className="mr-2 text-blue-500" />
                                            <span>{item.name}</span>
                                        </div>
                                        <Button
                                            size="small"
                                            type="link"
                                            onClick={() => {
                                                const a = document.createElement('a');
                                                a.href = `${dokument_url}/${item.fileId}`;
                                                a.download = item.name;
                                                a.click();
                                            }}
                                        >
                                            Download
                                        </Button>
                                    </div>
                                </List.Item>
                            )}
                        />
                    </div>
                )}
            </Modal>

            {/* File List Modal */}
            <Modal
                title={
                    <div className="flex items-center gap-2">
                        <DownloadOutlined />
                        <span>Dokumen Perjanjian Kinerja</span>
                    </div>
                }
                open={fileModal.trigger}
                onCancel={() => setFileModal({ trigger: false, modalData: [], skpId: null })}
                footer={[
                    <Button key="close" onClick={() => setFileModal({ trigger: false, modalData: [], skpId: null })}>
                        Tutup
                    </Button>
                ]}
                width={650}
            >
                <div className="mb-4 p-3 bg-blue-50 rounded border border-blue-100 text-sm">
                    <p>Berikut adalah dokumen perjanjian kinerja yang telah diunggah. Anda dapat mengunduh atau menghapus dokumen sesuai kebutuhan.</p>
                </div>

                {fileModal.modalData.length > 0 ? (
                    <List
                        className="mt-4"
                        itemLayout="horizontal"
                        dataSource={fileModal.modalData}
                        renderItem={(item) => (
                            <List.Item>
                                <div className="w-full p-2 border border-gray-200 rounded flex justify-between items-center">
                                    <div className="flex items-center">
                                        <div className="bg-blue-50 p-2 rounded mr-3">
                                            {item.type && item.type.includes('pdf') ? (
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="24"
                                                    height="24"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    className="text-red-500"
                                                >
                                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                                    <polyline points="14 2 14 8 20 8"></polyline>
                                                    <path d="M9 15v-2"></path>
                                                    <path d="M12 15v-6"></path>
                                                    <path d="M15 15v-4"></path>
                                                </svg>
                                            ) : item.type && (item.type.includes('doc') || item.type.includes('word')) ? (
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="24"
                                                    height="24"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    className="text-blue-500"
                                                >
                                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                                    <polyline points="14 2 14 8 20 8"></polyline>
                                                    <line x1="16" y1="13" x2="8" y2="13"></line>
                                                    <line x1="16" y1="17" x2="8" y2="17"></line>
                                                    <polyline points="10 9 9 9 8 9"></polyline>
                                                </svg>
                                            ) : (
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="24"
                                                    height="24"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    className="text-gray-500"
                                                >
                                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                                    <polyline points="14 2 14 8 20 8"></polyline>
                                                </svg>
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-medium">{item.name}</p>
                                            <p className="text-xs text-gray-500">ID: {item.fileId.substring(0, 8)}...</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            size="small"
                                            type="primary"
                                            ghost
                                            icon={<DownloadOutlined />}
                                            onClick={() => {
                                                const a = document.createElement('a');
                                                a.href = `${dokument_url}/${item.fileId}`;
                                                a.download = item.name;
                                                a.click();
                                            }}
                                        >
                                            Unduh
                                        </Button>
                                        <Button size="small" danger icon={<DeleteOutlined />} loading={deletingFiles[item.fileId]} disabled={deletingFiles[item.fileId]} onClick={() => handleFileDelete(item, fileModal.skpId)}>
                                            Hapus
                                        </Button>
                                    </div>
                                </div>
                            </List.Item>
                        )}
                        locale={{
                            emptyText: <Empty description="Tidak ada file" />
                        }}
                    />
                ) : (
                    <Empty description="Tidak ada dokumen perjanjian kinerja" />
                )}
            </Modal>

            {/* Generate Perjanjian Kinerja Modal */}
            <Modal
                title={
                    <div className="flex items-center gap-2">
                        <DownloadOutlined />
                        <span>Generate Perjanjian Kinerja</span>
                    </div>
                }
                open={generateModal.visible}
                onCancel={() => setGenerateModal({ visible: false, skpId: null, submitting: false })}
                footer={null}
                width={600}
            >
                <div className="mb-4 p-3 bg-blue-50 rounded border border-blue-100 text-sm">
                    <p>Silakan lengkapi data berikut untuk membuat dokumen perjanjian kinerja baru.</p>
                </div>

                <Form form={form} layout="vertical" onFinish={handleGeneratePK}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <h4 className="text-sm font-semibold mb-2">Informasi Pihak Pertama</h4>
                        </div>

                        <Form.Item name="nama_pihak_pertama" label="Nama Pihak Pertama" rules={[{ required: true, message: 'Nama pihak pertama wajib diisi' }]}>
                            <input className="w-full p-2 border rounded" />
                        </Form.Item>

                        <Form.Item name="jabatan_pihak_pertama" label="Jabatan Pihak Pertama" rules={[{ required: true, message: 'Jabatan pihak pertama wajib diisi' }]}>
                            <input className="w-full p-2 border rounded" />
                        </Form.Item>

                        <div className="md:col-span-2">
                            <h4 className="text-sm font-semibold mb-2 mt-2">Informasi Pihak Kedua</h4>
                        </div>

                        <Form.Item name="nama_pihak_kedua" label="Nama Pihak Kedua" rules={[{ required: true, message: 'Nama pihak kedua wajib diisi' }]}>
                            <input className="w-full p-2 border rounded" />
                        </Form.Item>

                        <Form.Item name="jabatan_pihak_kedua" label="Jabatan Pihak Kedua" rules={[{ required: true, message: 'Jabatan pihak kedua wajib diisi' }]}>
                            <input className="w-full p-2 border rounded" />
                        </Form.Item>

                        <div className="md:col-span-2">
                            <h4 className="text-sm font-semibold mb-2 mt-2">Informasi Dokumen</h4>
                        </div>

                        <Form.Item name="tanggal" label="Tanggal" rules={[{ required: true, message: 'Tanggal wajib diisi' }]}>
                            <input type="date" className="w-full p-2 border rounded" />
                        </Form.Item>

                        <Form.Item name="tempat" label="Tempat" rules={[{ required: true, message: 'Tempat wajib diisi' }]}>
                            <input className="w-full p-2 border rounded" />
                        </Form.Item>
                    </div>

                    <div className="flex justify-end mt-6 gap-2">
                        <Button onClick={() => setGenerateModal({ visible: false, skpId: null, submitting: false })}>Batal</Button>
                        <Button type="primary" htmlType="submit" loading={generateModal.submitting} icon={<DownloadOutlined />}>
                            Generate Dokumen
                        </Button>
                    </div>
                </Form>
            </Modal>
        </div>
    );
};

export default page;
