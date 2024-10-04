import { apiRequest } from "@/utils/apiRequest";

// Fetch a single Kegiatan record by ID
export const getById = async (id: string) => {
    const response = await apiRequest(`/api/kegiatan?id=${id}`, {
        method: 'GET',
    });
    return response;
}

export const getByProgramId = async (id: string) => {
    const response = await apiRequest(`/api/kegiatan`, {
        method: 'GET',
        headers: {
            'program-id': id,
        }
    });
    return response;
}

// Fetch all Kegiatan records
export const getAll = async () => {
    const response = await apiRequest('/api/kegiatan', {
        method: 'GET',
    });
    return response;
}

// Create a new Kegiatan record
export const store = async (data: any) => {
    const response = await apiRequest('/api/kegiatan', {
        method: 'POST',
        body: data,
    });
    return response;
}

// Update an existing Kegiatan record by ID
export const update = async (id: string, data: any) => {
    const response = await apiRequest(`/api/kegiatan?id=${id}`, {
        method: 'PUT',
        body: data,
    });
    return response;
}

// Delete a Kegiatan record by ID
export const destroy = async (id: string) => {
    const response = await apiRequest(`/api/kegiatan?id=${id}`, {
        method: 'DELETE',
    });
    return response;
}
