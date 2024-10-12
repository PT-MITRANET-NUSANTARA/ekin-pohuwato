import { apiRequest } from '@/utils/apiRequest';

// Fetch a single PeriodeRKT record by ID
export const getById = async (id: string) => {
    const response = await apiRequest(`/api/periodeRKT?id=${id}`, {
        method: 'GET',
    });
    return response;
};

// Fetch all PeriodeRKT records
export const getAll = async () => {
    const response = await apiRequest('/api/periodeRKT', {
        method: 'GET',
    });
    return response;
};

// Create a new PeriodeRKT record
export const store = async (data: any) => {
    const response = await apiRequest('/api/periodeRKT', {
        method: 'POST',
        body: data, // Convert data to JSON format
        
    });
    return response;
};

export const getByUnitId = async (unitId: string) => {
    const response = await apiRequest(`/api/periodeRKT?unitId=${unitId}`, {
        method: 'GET',
    });
    return response;
}

// Update an existing PeriodeRKT record by ID
export const update = async (id: string, data: any) => {
    const response = await apiRequest(`/api/periodeRKT?id=${id}`, {
        method: 'PUT',
        body: data // Convert data to JSON format
       
    });
    return response;
};

// Delete a PeriodeRKT record by ID
export const destroy = async (id: string) => {
    const response = await apiRequest(`/api/periodeRKT?id=${id}`, {
        method: 'DELETE',
    });
    return response;
};
