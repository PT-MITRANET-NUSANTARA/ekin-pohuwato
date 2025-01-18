import { apiRequest } from "@/utils/apiRequest";

// Fetch a single Program record by ID
export const getById = async (id: string) => {
    const response = await apiRequest(`/api/program?id=${id}`, {
        method: 'GET',
    });
    return response;
}

export const getByRenstraId = async (id: string) => {
    const response = await apiRequest(`/api/program`, {
        method: 'GET',
        headers: {
            'renstra-id': id,
        }
    });
    return response;
}

// Fetch all Program records
export const getAll = async (page: number, limit: number, filters: Object) => {
    const filtersString = encodeURIComponent(JSON.stringify(filters));
    const url = `/api/program?page=${page}&limit=${limit}&filters=${filtersString}`;
    const response = await apiRequest(url, {
        method: 'GET',
    });

    return response;
}


// Create a new Program record
export const store = async (data: any) => {
    const response = await apiRequest('/api/program', {
        method: 'POST',
        body: data,
    });
    return response;
}

// Update an existing Program record by ID
export const update = async (id: string, data: any) => {
    const response = await apiRequest(`/api/program?id=${id}`, {
        method: 'PUT',
        body: data,
    });
    return response;
}

// Delete a Program record by ID
export const destroy = async (id: string) => {
    const response = await apiRequest(`/api/program?id=${id}`, {
        method: 'DELETE',
    });
    return response;
}
