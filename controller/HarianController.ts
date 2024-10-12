import { apiRequest } from "@/utils/apiRequest";
import { store as storeImages } from "@/controller/DokumentController"; // Import fungsi store dari ImageController

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
        throw error;
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
        throw error;
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
        throw error;
    }
}

export const store = async (id: string, data: any) => {
    try {
        
        if (data.files) {
            const formData = new FormData();

            data.files.forEach((file: File) => {
                formData.append('file', file);
            });

            formData.append('title', data.title || ''); 
            formData.append('description', data.description || ''); 

            const imageResponse: any = await storeImages(formData);
            if (!imageResponse.ok) {
                throw "Image upload failed"; 
            }
            delete data.files;
            data.files = imageResponse.data;
        }
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
        throw error;
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
        throw error;
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
        throw error;
    }
}
