import { apiRequest } from "@/utils/apiRequest";

// Fetch a single verifikasi record by ID
export const getById = async (id: string) => {
    const response = await apiRequest(`/api/verifikasi?id=${id}`, {
        method: 'GET',
    });
    return response;
}

// Fetch all verifikasi records
export const getAll = async (page: number, limit: number) => {
    const response = await apiRequest(`/api/verifikasi?page=${page}limit=${limit}`, {
        method: 'GET',
    });
    return response;
}

// Fetch verifikasi records by Unit ID
export const getByUnitId = async (unitId: string) => {
    const response = await apiRequest(`/api/verifikasi?unitId=${unitId}`, {
        method: 'GET',
    });
    return response;
}

// Create a new verifikasi record
export const store = async (data: any) => {
    const response = await apiRequest('/api/verifikasi', {
        method: 'POST',
        body: data,
    });
    return response;
}

// Update an existing verifikasi record by ID
export const update = async (id: string, data: any) => {
    const response = await apiRequest(`/api/verifikasi?id=${id}`, {
        method: 'PUT',
        body: data,
    });
    return response;
}

// Delete a verifikasi record by ID
export const destroy = async (id: string) => {
    const response = await apiRequest(`/api/verifikasi?id=${id}`, {
        method: 'DELETE',
    });
    return response;
}
