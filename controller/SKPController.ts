import { apiRequest } from '@/utils/apiRequest';
const path: string = 'skp';
// Fetch a single Visi record by ID
export const getById = async (id: string) => {
    const response = await apiRequest(`/api/${path}/${id}`, {
        method: 'GET'
    });
    return response;
};

export const getByUnitId = async (unit_id: string, page: number, limit: number, filters: Object) => {
    const filtersString = encodeURIComponent(JSON.stringify(filters));
    const url = `/api/${path}/unit/${unit_id}?page=${page}&limit=${limit}&filters=${filtersString}`;
    const response = await apiRequest(url, {
        method: 'GET'
    });
    return response;
};

export const getByUserId = async (user_id: string, page: number, limit: number, filters: Object) => {
    const filtersString = encodeURIComponent(JSON.stringify(filters));
    const url = `/api/${path}/user/${user_id}?page=${page}&limit=${limit}&filters=${filtersString}`;
    const response = await apiRequest(url, {
        method: 'GET'
    });
    return response;
};

export const getBySKPId = async (skp_id: string, page: number, limit: number, filters: Object) => {
    const filtersString = encodeURIComponent(JSON.stringify(filters));
    const url = `/api/${path}/skp/${skp_id}?page=${page}&limit=${limit}&filters=${filtersString}`;
    const response = await apiRequest(url, {
        method: 'GET'
    });
    return response;
};


// Fetch all Visi records
export const getAll = async (page: number, limit: number, filters: Object) => {
    const filtersString = encodeURIComponent(JSON.stringify(filters));
    const url = `/api/${path}?page=${page}&limit=${limit}&filters=${filtersString}`;
    const response = await apiRequest(url, {
        method: 'GET'
    });
    return response;
};

// Create a new Visi record
export const store = async (data: any) => {
    const response = await apiRequest(`/api/${path}`, {
        method: 'POST',
        body: data
    });
    return response;
};

export const storeAtasan = async (skp: string, data: any) => {
    const response = await apiRequest(`/api/${path}?skp=${skp}`, {
        method: 'POST',
        body: data
    });
    return response;
};

export const storeBawahan = async (skp: string, data: any) => {
    const response = await apiRequest(`/api/${path}/skp/${skp}`, {
        method: 'POST',
        body: data
    });
    return response;
};

// Update an existing Visi record by ID
export const updateBawahan = async (id: string, data: any) => {
    const response = await apiRequest(`/api/${path}/${id}`, {
        method: 'PUT',
        body: data
    });
    return response;
};

export const update = async (id: string, data: any) => {
    const response = await apiRequest(`/api/${path}/${id}`, {
        method: 'PUT',
        body: data
    });
    return response;
};

// Delete a Visi record by ID
export const destroy = async (id: string) => {
    const response = await apiRequest(`/api/${path}/${id}`, {
        method: 'DELETE'
    });
    return response;
};
