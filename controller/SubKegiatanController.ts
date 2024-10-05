import { apiRequest } from "@/utils/apiRequest";

// Fetch a single SubKegiatan record by ID
export const getById = async (id: string) => {
    const response = await apiRequest(`/api/subkegiatan?id=${id}`, {
        method: 'GET',
    });
    return response;
}

export const getByKegiatanId = async (id: string) => {
    const response = await apiRequest(`/api/kegiatan`, {
        method: 'GET',
        headers: {
            'kegiatan-id': id,
        }
    });
    return response;
}

// Fetch all SubKegiatan records
export const getAll = async () => {
    const response = await apiRequest('/api/subkegiatan', {
        method: 'GET',
    });
    return response;
}

// Create a new SubKegiatan record
export const store = async (data: any) => {
    const response = await apiRequest('/api/subkegiatan', {
        method: 'POST',
        body: data,
    });
    return response;
}

// Update an existing SubKegiatan record by ID
export const update = async (id: string, data: any) => {
    const response = await apiRequest(`/api/subkegiatan?id=${id}`, {
        method: 'PUT',
        body: data,
    });
    return response;
}

// Delete a SubKegiatan record by ID
export const destroy = async (id: string) => {
    const response = await apiRequest(`/api/subkegiatan?id=${id}`, {
        method: 'DELETE',
    });
    return response;
}
