import { apiRequest } from "@/utils/apiRequest";

export const getByUserId = async (id: string) => {
    try {
        const response = await apiRequest('/api/skp', {
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
        const response = await apiRequest(`/api/skp?id=${id}`, {
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
        const response = await apiRequest('/api/skp', {
            method: 'GET',
        });
        return response;
    } catch (error) {
        console.error("Error fetching all SKP:", error);
        throw error; // rethrow the error to handle it further up the call stack
    }
}

export const store = async (id: string, data: any) => {
    try {
        const response = await apiRequest('/api/skp', {
            method: 'POST',
            headers: {
                'user-id': id,
            },
            body: data,
        });
        return response;
    } catch (error) {
        console.error("Error storing SKP:", error);
        throw error; // rethrow the error to handle it further up the call stack
    }
}

export const update = async (id: string, data: any) => {
    console.log(data);
    
    try {
        const response = await apiRequest(`/api/skp?id=${id}`, {
            method: 'PUT',
            body: data,
        });
    
        return response;
    } catch (error) {
        console.log(error);
        throw error; // rethrow the error to handle it further up the call stack
    }
}

export const destroy = async (id: string) => {
    try {
        const response = await apiRequest(`/api/skp?id=${id}`, {
            method: 'DELETE',
        });
        return response;
    } catch (error) {
        console.error("Error deleting SKP:", error);
        throw error; // rethrow the error to handle it further up the call stack
    }
}
