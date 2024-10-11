import { apiRequest } from "@/utils/apiRequest";

// Fetch a single Misi record by ID
export const getById = async (id: string) => {
    const response = await apiRequest(`/api/misi?id=${id}`, {
        method: 'GET',
    });
    return response;
}

// Fetch all Misi records
export const getAll = async () => {
    const response = await apiRequest('/api/misi', {
        method: 'GET',
    });
    return response;
}

// Create a new Misi record
export const store = async (data: any) => {
    const response = await apiRequest('/api/misi', {
        method: 'POST',
        body: data,
    });
    return response;
}

// Update an existing Misi record by ID
export const update = async (id: string, data: any) => {
    const response = await apiRequest(`/api/misi?id=${id}`, {
        method: 'PUT',
        body: data,
    });
    return response;
}

// Delete a Misi record by ID
export const destroy = async (id: string) => {
    const response = await apiRequest(`/api/misi?id=${id}`, {
        method: 'DELETE',
    });
    return response;
}
