import { apiRequest } from "@/utils/apiRequest";

// Fetch a single UMPEG record by ID
export const getById = async (id: string) => {
    const response = await apiRequest(`/api/umpeg?id=${id}`, {
        method: 'GET',
    });
    return response;
}

// Fetch all UMPEG records
export const getAll = async () => {
    const response = await apiRequest('/api/umpeg', {
        method: 'GET',
    });
    return response;
}

// Fetch UMPEG records by Unit ID
export const getByUnitId = async (unitId: string) => {
    const response = await apiRequest(`/api/umpeg?unitId=${unitId}`, {
        method: 'GET',
    });
    return response;
}

// Create a new UMPEG record
export const store = async (data: any) => {
    const response = await apiRequest('/api/umpeg', {
        method: 'POST',
        body: data,
    });
    return response;
}

// Update an existing UMPEG record by ID
export const update = async (id: string, data: any) => {
    const response = await apiRequest(`/api/umpeg?id=${id}`, {
        method: 'PUT',
        body: data,
    });
    return response;
}

// Delete a UMPEG record by ID
export const destroy = async (id: string) => {
    const response = await apiRequest(`/api/umpeg?id=${id}`, {
        method: 'DELETE',
    });
    return response;
}
