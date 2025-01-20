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

export const getBySKP = async (id: string) => {
    try {

        const response = await apiRequest('/api/skp', {
            method: 'GET',
            headers: {
                'skp-id': id,
            },
        });
        
        return response;
    } catch (error) {
        console.error("Error fetching by user ID:", error);
        throw error; // rethrow the error to handle it further up the call stack
    }
}

export const getByUserIdAndPeriode = async (id: string, periode: string) => {
    try {

        const response = await apiRequest('/api/skp', {
            method: 'GET',
            headers: {
                'user-id': id,
                'periode-id': periode,
            },
        });
        
        return response;
    } catch (error) {
        console.error("Error fetching by user ID:", error);
        throw error; // rethrow the error to handle it further up the call stack
    }
}

export const getBySKPAndPeriode = async (id: string, periode: string, skp: string) => {
    try {

        const response = await apiRequest('/api/skp', {
            method: 'GET',
            headers: {
                'user-id': id,
                'periode-id': periode,
                'skp-id' : skp,
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

export const getAll = async (page: number, limit: number, filters: Object) => {
    const filtersString = encodeURIComponent(JSON.stringify(filters));
    const url = `/api/skp?page=${page}&limit=${limit}&filters=${filtersString}`;
    const response = await apiRequest(url, {
        method: 'GET',
    });

    return response;
}

export const store = async (id: string, data: any, atasan: any) => {
    try {
        const response = await apiRequest(`/api/skp?atasan=${atasan}`, {
            method: 'POST',
            body: data,
            headers: {
                'user-id': id,
            },
        });
        return response;
    } catch (error) {
        console.error("Error storing SKP:", error);
        throw error; // rethrow the error to handle it further up the call stack
    }
}

export const update = async (id: string, data: any) => {
    
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
