import { apiRequest } from "@/utils/apiRequest";

export const getByUserId = async (id: string) => {
    try {
        const response = await apiRequest('/api/harian', {
            method: 'GET',
            headers: {
                'user-id': id,
            },
        });
        return response;
    } catch (error) {
        console.error("Error fetching by user ID:", error);
        throw error; // rethrow the error to handle it further up the call stack
    }
}

export const getById = async (id: string) => {
    try {
        const response = await apiRequest(`/api/harian?id=${id}`, {
            method: 'GET',
        });
        return response;
    } catch (error) {
        console.error("Error fetching by ID:", error);
        throw error; // rethrow the error to handle it further up the call stack
    }
}

export const getAll = async () => {
    try {
        const response = await apiRequest('/api/harian', {
            method: 'GET',
        });
        return response;
    } catch (error) {
        console.error("Error fetching all records:", error);
        throw error; // rethrow the error to handle it further up the call stack
    }
}

export const store = async (id: string, data: any) => {
    try {
        const response = await apiRequest('/api/harian', {
            method: 'POST',
            headers: {
                'user-id': id,
            },
            body: JSON.stringify(data),
        });
        return response;
    } catch (error) {
        console.error("Error storing record:", error);
        throw error; // rethrow the error to handle it further up the call stack
    }
}

export const update = async (id: string, data: any) => {
    try {
        const response = await apiRequest(`/api/harian?id=${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
        return response;
    } catch (error) {
        console.error("Error updating record:", error);
        throw error; // rethrow the error to handle it further up the call stack
    }
}

export const destroy = async (id: string) => {
    try {
        const response = await apiRequest(`/api/harian?id=${id}`, {
            method: 'DELETE',
        });
        return response;
    } catch (error) {
        console.error("Error deleting record:", error);
        throw error; // rethrow the error to handle it further up the call stack
    }
}
