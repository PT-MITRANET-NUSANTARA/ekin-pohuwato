import { apiRequest } from "@/utils/apiRequest";

const path = 'rencanaAksi'
// Fetch a single Periode record by ID
export const getById = async (id: string) => {
    const response = await apiRequest(`/api/${path}?id=${id}`, {
        method: 'GET',
    });
    return response;
}

// Fetch all Periode records
export const getAll = async (page: number, limit: number, filters: Object) => {
    const filtersString = encodeURIComponent(JSON.stringify(filters));
    const url = `/api/${[path]}?page=${page}&limit=${limit}&filters=${filtersString}`;
    const response = await apiRequest(url, {
        method: 'GET',
    });

    return response;
}


// Create a new Periode record
export const store = async (data: any) => {
    const response = await apiRequest(`/api/${path}`, {
        method: 'POST',
        body: data,
    });
    return response;
}

// Update an existing Periode record by ID
export const update = async (id: string, data: any) => {
    const response = await apiRequest(`/api/${path}?id=${id}`, {
        method: 'PUT',
        body: data,
    });
    return response;
}

// Delete a Periode record by ID
export const destroy = async (id: string) => {
    const response = await apiRequest(`/api/${path}?id=${id}`, {
        method: 'DELETE',
    });
    return response;
}
