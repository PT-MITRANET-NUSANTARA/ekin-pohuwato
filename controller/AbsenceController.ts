import { apiRequest } from "@/utils/apiRequest";

// Mengambil data Absence berdasarkan user_id
export const getByUserId = async (id: string) => {
    try {
        const response = await apiRequest('/api/absence', {
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

// Mengambil data Absence berdasarkan user_id dan status absence
export const getByUserIdStatus = async (id: string, status: string) => {
    try {
        const response = await apiRequest(`/api/absence?status=${status}`, {
            method: 'GET',
            headers: {
                'user-id': id,
            },
        });
        return response;
    } catch (error) {
        console.error("Error fetching by user ID and status:", error);
        throw error;
    }
}

// Mengambil data Absence berdasarkan ID
export const getById = async (id: string) => {
    try {
        const response = await apiRequest(`/api/absence?id=${id}`, {
            method: 'GET',
        });
        return response;
    } catch (error) {
        console.error("Error fetching by ID:", error);
        throw error;
    }
}

// Mengambil semua data Absence
export const getAll = async () => {
    try {
        const response = await apiRequest('/api/absence', {
            method: 'GET',
        });
        return response;
    } catch (error) {
        console.error("Error fetching all records:", error);
        throw error;
    }
}

// Menyimpan data Absence
export const store = async (id: string, data: any) => {
    try {
        const response = await apiRequest('/api/absence', {
            method: 'POST',
            headers: {
                'user-id': id,
            },
            body: data,
        });
        return response;
    } catch (error) {
        console.error("Error storing record:", error);
        throw error;
    }
}

// Mengupdate data Absence
export const update = async (id: string, data: any) => {
    try {
        const response = await apiRequest(`/api/absence?id=${id}`, {
            method: 'PUT',
            body: data,
        });
        return response;
    } catch (error) {
        console.error("Error updating record:", error);
        throw error;
    }
}

// Menghapus data Absence berdasarkan ID
export const destroy = async (id: string) => {
    try {
        const response = await apiRequest(`/api/absence?id=${id}`, {
            method: 'DELETE',
        });
        return response;
    } catch (error) {
        console.error("Error deleting record:", error);
        throw error;
    }
}
