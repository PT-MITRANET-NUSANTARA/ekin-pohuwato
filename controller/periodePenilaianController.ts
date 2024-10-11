import { apiRequest } from "@/utils/apiRequest";

// Fetch a single PeriodePenilaian record by ID
export const getById = async (id: string) => {
    const response = await apiRequest(`/api/periodePenilaian?id=${id}`, {
        method: 'GET',
    });
    return response;
}

// Fetch all PeriodePenilaian records
export const getAll = async () => {
    const response = await apiRequest('/api/periodePenilaian', {
        method: 'GET',
    });
    return response;
}

// Create a new PeriodePenilaian record
export const store = async (data: any) => {
    const response = await apiRequest('/api/periodePenilaian', {
        method: 'POST',
        body: data, // Convert data to JSON format
    });
    return response;
}

// Update an existing PeriodePenilaian record by ID
export const update = async (id: string, data: any) => {
    const response = await apiRequest(`/api/periodePenilaian?id=${id}`, {
        method: 'PUT',
        body: data, // Convert data to JSON format
      
    });
    return response;
}

// Delete a PeriodePenilaian record by ID
export const destroy = async (id: string) => {
    const response = await apiRequest(`/api/periodePenilaian?id=${id}`, {
        method: 'DELETE',
    });
    return response;
}
