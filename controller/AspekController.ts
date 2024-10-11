import { apiRequest } from "@/utils/apiRequest";

// Fetch a single record by ID
export const getById = async (id: string) => {
    const response = await apiRequest(`/api/aspek?id=${id}`, {
        method: 'GET',
    });
    return response;
}

// Fetch all records
export const getAll = async () => {
    const response = await apiRequest('/api/aspek', {
        method: 'GET',
    });
    return response;
}

// Fetch all records by RHK (or any relevant field if needed)
export const getByRhkId = async (id: string) => {
    const response = await apiRequest(`/api/aspek`, {
        method: 'GET',
        headers: {
            'rhk-id': id,
        }
    });
    return response;
}

// Create a new record
export const store = async (data: any) => {
    const response = await apiRequest('/api/aspek', {
        method: 'POST',
        body: data,
    });
    return response;
}

// Update an existing record by ID
export const update = async (id: string, data: any) => {
    const response = await apiRequest(`/api/aspek?id=${id}`, {
        method: 'PUT',
        body: data,
    });
    return response;
}

// Delete a record by ID
export const destroy = async (id: string) => {
    const response = await apiRequest(`/api/aspek?id=${id}`, {
        method: 'DELETE',
    });
    return response;
}
