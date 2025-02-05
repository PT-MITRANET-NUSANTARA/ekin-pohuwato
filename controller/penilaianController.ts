import { apiRequest } from '@/utils/apiRequest';

// Fetch a single Penilaian record by ID
export const getById = async (id: string) => {
    const response = await apiRequest(`/api/penilaian?id=${id}`, {
        method: 'GET'
    });
    return response;
};

export const getBySKPAndPeriode = async (skp: string, periode: string) => {
    const response = await apiRequest(`/api/penilaian?skp=${skp}&periode=${periode}`, {
        method: 'GET'
    });
    return response;
};

// Fetch all Penilaian records
export const getAll = async () => {
    const response = await apiRequest('/api/penilaian', {
        method: 'GET'
    });
    return response;
};

// Create a new Penilaian record
export const store = async (data: any) => {
    const response = await apiRequest('/api/penilaian', {
        method: 'POST',
        body: data // Convert data to JSON format
    });
    return response;
};

export const update = async (id: string, data: any) => {
    const response = await apiRequest(`/api/penilaian?id=${id}`, {
        method: 'PUT',
        body: data // Convert data to JSON format
    });
    return response;
};

// Delete a Penilaian record by ID
export const destroy = async (id: string) => {
    const response = await apiRequest(`/api/penilaian?id=${id}`, {
        method: 'DELETE'
    });
    return response;
};
