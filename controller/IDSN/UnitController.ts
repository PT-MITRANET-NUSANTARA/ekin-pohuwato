import { apiRequest } from "@/utils/apiRequest";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getAll = async (token: string) => {
    try {
        const response = await apiRequest(`${API_URL}/unor/all`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },

        });
        return response;
    } catch (error) {
        console.error("Error fetching all records:", error);
        throw error; // rethrow the error to handle it further up the call stack
    }
}

export const getById = async (token: string, id:string) => {
    try {
        const response = await apiRequest(`${API_URL}/unor/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },

        });
        return response;
    } catch (error) {
        console.error("Error fetching all records:", error);
        throw error; // rethrow the error to handle it further up the call stack
    }
}

export const getActive = async (token: string, active: boolean = true) => {
    try {
        const response = await apiRequest(`${API_URL}/unor/${active? 'active' : 'inactive'}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },

        });
        return response;
    } catch (error) {
        console.error("Error fetching all records:", error);
        throw error; // rethrow the error to handle it further up the call stack
    }
}