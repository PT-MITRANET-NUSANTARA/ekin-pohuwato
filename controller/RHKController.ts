import { apiRequest } from '@/utils/apiRequest';

const path = 'rhk';

// Fetch a single Visi record by ID
export const getById = async (id: string) => {
    try {
        const response = await apiRequest(`/api/${path}/${id}`, {
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.error(`Error fetching RHK with ID ${id}:`, error);
        throw error;
    }
};

export const getRealisasi = async (id: string, jenis: string, aspek: string, periode: string) => {
    const response = await apiRequest(`/api/${path}/${id}/realisasi?jenis=${jenis}&aspek=${aspek}&periode=${periode}`, {
        method: 'GET'
    });
    return response;
};

export const getBukti = async (id: string, periode: string) => {
    const response = await apiRequest(`/api/${path}/${id}/bukti?periode=${periode}`, {
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
    try {
        const filtersString = encodeURIComponent(JSON.stringify(filters));
        const response = await apiRequest(`/api/${path}?page=${page}&limit=${limit}&filters=${filtersString}`, {
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.error('Error fetching RHKs:', error);
        throw error;
    }
};

export const getByRHK = async (id: string) => {
    try {
        const response = await apiRequest(`/api/${path}/rhk/${id}`, {
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.error(`Error fetching RHKs with parent RHK ID ${id}:`, error);
        throw error;
    }
};

// Create a new Visi record
export const store = async (data: Object) => {
    try {
        const response = await apiRequest(`/api/${path}`, {
            method: 'POST',
            body: data
        });
        return response;
    } catch (error) {
        console.error('Error creating RHK:', error);
        throw error;
    }
};

export const update = async (id: string, data: Object) => {
    try {
        const response = await apiRequest(`/api/${path}/${id}`, {
            method: 'PUT',
            body: data
        });
        return response;
    } catch (error) {
        console.error(`Error updating RHK with ID ${id}:`, error);
        throw error;
    }
};

// Delete a Visi record by ID
export const destroy = async (id: string) => {
    try {
        const response = await apiRequest(`/api/${path}/${id}`, {
            method: 'DELETE'
        });
        return response;
    } catch (error) {
        console.error(`Error deleting RHK with ID ${id}:`, error);
        throw error;
    }
};

export const getByRKT = async (id: string) => {
    try {
        const response = await apiRequest(`/api/${path}/rkt/${id}`, {
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.error(`Error fetching RHKs with RKT ID ${id}:`, error);
        throw error;
    }
};

export const getBySkp = async (id: string) => {
    try {
        const response = await apiRequest(`/api/${path}/skp/${id}`, {
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.error(`Error fetching RHKs with SKP ID ${id}:`, error);
        throw error;
    }
};

// New methods for UserRHK handling
export const getByUserRHK = async (userRHKId: string) => {
    try {
        const filters = { userRHK: userRHKId };
        const response = await getAll(1, 100, filters);
        return response;
    } catch (error) {
        console.error(`Error fetching RHKs with UserRHK ID ${userRHKId}:`, error);
        throw error;
    }
};

export const getByPeriodePenilaian = async (periodePenilaianId: string) => {
    try {
        const filters = { periodePenilaian: periodePenilaianId };
        const response = await getAll(1, 100, filters);
        return response;
    } catch (error) {
        console.error(`Error fetching RHKs with Periode Penilaian ID ${periodePenilaianId}:`, error);
        throw error;
    }
};

export const getByUserRHKAndPeriode = async (userRHKId: string, periodePenilaianId: string) => {
    try {
        const filters = { 
            userRHK: userRHKId,
            periodePenilaian: periodePenilaianId
        };
        const response = await getAll(1, 100, filters);
        return response;
    } catch (error) {
        console.error(`Error fetching RHKs with UserRHK ID ${userRHKId} and Periode Penilaian ID ${periodePenilaianId}:`, error);
        throw error;
    }
};
