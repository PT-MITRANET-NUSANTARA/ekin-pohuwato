import { apiRequest } from "@/utils/apiRequest";

// Fetch a single RKT record by ID
export const getById = async (id: string) => {
    const response = await apiRequest(`/api/rkt?id=${id}`, {
        method: 'GET',
    });
    return response;
}

// Fetch all RKT records
export const getAll = async () => {
    const response = await apiRequest('/api/rkt', {
        method: 'GET',
    });
    return response;
}

export const getByUnitId = async (unitId: string) => {
    const response = await apiRequest(`/api/rkt?unitId=${unitId}`, {
        method: 'GET',
    });
    return response;
}

// Create a new RKT record
export const store = async (data: any) => {
    const response = await apiRequest('/api/rkt', {
        method: 'POST',
        body: data,
    });
    return response;
}

// Update an existing RKT record by ID
export const update = async (id: string, data: any) => {
    
    const response = await apiRequest(`/api/rkt?id=${id}`, {
        method: 'PUT',
        body: data,
    });
    return response;
}

// Delete an RKT record by ID
export const destroy = async (id: string) => {
    const response = await apiRequest(`/api/rkt?id=${id}`, {
        method: 'DELETE',
    });
    return response;
}
