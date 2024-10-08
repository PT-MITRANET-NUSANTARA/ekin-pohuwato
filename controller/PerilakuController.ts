import { apiRequest } from "@/utils/apiRequest";

// Fetch a single Perilaku record by ID
export const getById = async (id: string) => {
    const response = await apiRequest(`/api/perilaku?id=${id}`, {
        method: 'GET',
    });
    return response;
}

// Fetch all Perilaku records
export const getAll = async () => {
    const response = await apiRequest('/api/perilaku', {
        method: 'GET',
    });
    return response;
}

// Fetch all Perilaku records by SKP ID (or any relevant field if needed)
export const getBySkpId = async (id: string) => {
    const response = await apiRequest(`/api/perilaku`, {
        method: 'GET',
        headers: {
            'skp-id': id,
        }
    });
    return response;
}

// Create a new Perilaku record
export const store = async (data: any) => {
    const response = await apiRequest('/api/perilaku', {
        method: 'POST',
        body: data,
    });
    return response;
}

// Update an existing Perilaku record by ID
export const update = async (id: string, data: any) => {
    const response = await apiRequest(`/api/perilaku?id=${id}`, {
        method: 'PUT',
        body: data,
    });
    return response;
}

// Delete a Perilaku record by ID
export const destroy = async (id: string) => {
    const response = await apiRequest(`/api/perilaku?id=${id}`, {
        method: 'DELETE',
    });
    return response;
}
