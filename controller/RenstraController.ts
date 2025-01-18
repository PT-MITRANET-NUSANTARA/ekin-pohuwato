import { apiRequest } from "@/utils/apiRequest";

// Fetch a single Renstra record by ID
export const getById = async (id: string) => {
    const response = await apiRequest(`/api/renstra?id=${id}`, {
        method: 'GET',
    });
    return response;
}

// Fetch all Renstra records
export const getAll =  async (page: number, limit: number, filters: Object) => {
    const filtersString = encodeURIComponent(JSON.stringify(filters));
    const url = `/api/renstra?page=${page}&limit=${limit}&filters=${filtersString}`;
    const response = await apiRequest(url, {
        method: 'GET',
    });

    return response;
}

// Create a new Renstra record
export const store = async (data: any) => {
    const response = await apiRequest('/api/renstra', {
        method: 'POST',
        body: data,
    });
    return response;
}

// Update an existing Renstra record by ID
export const update = async (id: string, data: any) => {
    const response = await apiRequest(`/api/renstra?id=${id}`, {
        method: 'PUT',
        body: data,
    });
    return response;
}

// Delete a Renstra record by ID
export const destroy = async (id: string) => {
    const response = await apiRequest(`/api/renstra?id=${id}`, {
        method: 'DELETE',
    });
    return response;
}
