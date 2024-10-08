import { apiRequest } from "@/utils/apiRequest";

export const getById = async (id: string) => {
    try {
        const response = await apiRequest(`/api/images?id=${id}`, {
            method: 'GET',
        });
        return response;
    } catch (error) {
        console.error("Error fetching image by ID:", error);
        throw error; // rethrow the error to handle it further up the call stack
    }
}

export const getAll = async () => {
    try {
        const response = await apiRequest('/api/images', {
            method: 'GET',
        });
        return response;
    } catch (error) {
        console.error("Error fetching all images:", error);
        throw error; // rethrow the error to handle it further up the call stack
    }
}

export const store = async (data: FormData) => {
    try {
        console.log('HERE', data);
        const response = await fetch('/api/images', {
            method: 'POST',
            body: data, 
        });
        
        return response;
    } catch (error) {
        console.error("Error storing image:", error);
        throw error; 
    }
}

export const update = async (id: string, data: any) => {
    try {
        const response = await apiRequest(`/api/images?id=${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
        return response;
    } catch (error) {
        console.error("Error updating image:", error);
        throw error; // rethrow the error to handle it further up the call stack
    }
}

export const destroy = async (id: string) => {
    try {
        const response = await apiRequest(`/api/images?id=${id}`, {
            method: 'DELETE',
        });
        return response;
    } catch (error) {
        console.error("Error deleting image:", error);
        throw error; // rethrow the error to handle it further up the call stack
    }
}
