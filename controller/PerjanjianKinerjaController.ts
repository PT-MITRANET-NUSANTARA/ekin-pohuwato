import { apiRequest } from '@/utils/apiRequest';
const path: string = 'perjanjianKinerja';

// Helper to ensure proper data formatting before sending
const prepareData = (data: any) => {
    // Make a deep copy to avoid reference issues
    const preparedData = JSON.parse(JSON.stringify(data));
    
    // Ensure file_perjanjian is properly formatted
    if (preparedData.file_perjanjian) {
        // If it's a string that looks like an array, parse it
        if (typeof preparedData.file_perjanjian === 'string' && 
            preparedData.file_perjanjian.trim().startsWith('[')) {
            try {
                preparedData.file_perjanjian = JSON.parse(preparedData.file_perjanjian);
            } catch (e) {
                console.error("Error parsing file_perjanjian:", e);
            }
        }
        
        // Ensure it's an array
        if (!Array.isArray(preparedData.file_perjanjian)) {
            preparedData.file_perjanjian = [];
        }
    }
    
    return preparedData;
};

// Fetch a single PerjanjianKinerja record by ID
export const getById = async (id: string) => {
    const response = await apiRequest(`/api/${path}/${id}`, {
        method: 'GET'
    });
    return response;
};

// Fetch PerjanjianKinerja records by PeriodeRKT ID
export const getByPeriodeRKTId = async (periodeRKT_id: string, page: number, limit: number, filters: Object) => {
    const filtersWithPeriodeRKT = { ...filters, periodeRKT: periodeRKT_id };
    const filtersString = encodeURIComponent(JSON.stringify(filtersWithPeriodeRKT));
    const url = `/api/${path}?page=${page}&limit=${limit}&filters=${filtersString}`;
    const response = await apiRequest(url, {
        method: 'GET'
    });
    return response;
};

// Fetch PerjanjianKinerja records by Unit ID
export const getByUnitId = async (unit_id: string, page: number, limit: number, filters: Object) => {
    const filtersWithUnit = { ...filters, 'unit.id': unit_id };
    const filtersString = encodeURIComponent(JSON.stringify(filtersWithUnit));
    const url = `/api/${path}?page=${page}&limit=${limit}&filters=${filtersString}`;
    const response = await apiRequest(url, {
        method: 'GET'
    });
    return response;
};

// Fetch all PerjanjianKinerja records
export const getAll = async (page: number, limit: number, filters: Object) => {
    const filtersString = encodeURIComponent(JSON.stringify(filters));
    const url = `/api/${path}?page=${page}&limit=${limit}&filters=${filtersString}`;
    const response = await apiRequest(url, {
        method: 'GET'
    });
    return response;
};

// Create a new PerjanjianKinerja record
export const store = async (data: any) => {
    const preparedData = prepareData(data);
    console.log("Sending data to API:", JSON.stringify(preparedData, null, 2));
    
    const response = await apiRequest(`/api/${path}`, {
        method: 'POST',
        body: preparedData
    });
    return response;
};

// Update an existing PerjanjianKinerja record by ID
export const update = async (id: string, data: any) => {
    const preparedData = prepareData(data);
    console.log("Updating data:", JSON.stringify(preparedData, null, 2));
    
    const response = await apiRequest(`/api/${path}/${id}`, {
        method: 'PUT',
        body: preparedData
    });
    return response;
};

// Delete a PerjanjianKinerja record by ID
export const destroy = async (id: string) => {
    const response = await apiRequest(`/api/${path}/${id}`, {
        method: 'DELETE'
    });
    return response;
}; 