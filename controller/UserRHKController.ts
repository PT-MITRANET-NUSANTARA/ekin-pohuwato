import { apiRequest } from '@/utils/apiRequest';

const path = 'user-rhk';

export const getAll = async (page: number, limit: number, filters: Object) => {
    try {
        const filtersString = encodeURIComponent(JSON.stringify(filters));
        const response = await apiRequest(`/api/${path}?page=${page}&limit=${limit}&filters=${filtersString}`, {
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.error('Error fetching UserRHKs:', error);
        throw error;
    }
};

export const getById = async (id: string) => {
    try {
        const response = await apiRequest(`/api/${path}/${id}`, {
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.error(`Error fetching UserRHK with ID ${id}:`, error);
        throw error;
    }
};

export const store = async (data: Object) => {
    try {
        const response = await apiRequest(`/api/${path}`, {
            method: 'POST',
            body: data
        });
        return response;
    } catch (error) {
        console.error('Error creating UserRHK:', error);
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
        console.error(`Error updating UserRHK with ID ${id}:`, error);
        throw error;
    }
};

export const destroy = async (id: string) => {
    try {
        const response = await apiRequest(`/api/${path}/${id}`, {
            method: 'DELETE'
        });
        return response;
    } catch (error) {
        console.error(`Error deleting UserRHK with ID ${id}:`, error);
        throw error;
    }
};

export const deriveRHK = async (data: {
    userRHKId: string,
    periodePenilaianId: string
}) => {
    try {
        const response = await apiRequest(`/api/${path}/derive`, {
            method: 'POST',
            body: data
        });
        return response;
    } catch (error) {
        console.error('Error deriving RHK from UserRHK:', error);
        throw error;
    }
};

export const getByUserId = async (userId: string, page: number = 1, limit: number = 10) => {
    try {
        const filters = { user: userId };
        const response = await getAll(page, limit, filters);
        return response;
    } catch (error) {
        console.error(`Error fetching UserRHKs for user ${userId}:`, error);
        throw error;
    }
}; 