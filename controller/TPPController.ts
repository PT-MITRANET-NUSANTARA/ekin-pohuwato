import { apiRequest } from "@/utils/apiRequest";

// Fetch TPP data by user ID
export const getByUserId = async (id: string) => {
    try {
        const response = await apiRequest('/api/tpp', {
            method: 'GET',
            headers: {
                'user-id': id,
            },
        });
        return response;
    } catch (error) {
        console.error("Error fetching TPP by user ID:", error);
        throw error; // Re-throw the error for higher-level handling
    }
};

export const getByUnitId = async (id: string) => {
    try {
        const response = await apiRequest('/api/tpp', {
            method: 'GET',
            headers: {
                'unit-id': id,
            },
        });
        return response;
    } catch (error) {
        console.error("Error fetching TPP by unit ID:", error);
        throw error; // Re-throw the error for higher-level handling
    }
}

// Fetch TPP data by user ID and PeriodeRKT
export const getByUserIdAndPeriode = async (userId: string, periodeRKT: string) => {
    try {
        const response = await apiRequest('/api/tpp', {
            method: 'GET',
            headers: {
                'user-id': userId,
                'periodeRKT': periodeRKT,
            },
        });
        return response;
    } catch (error) {
        console.error("Error fetching TPP by user ID and PeriodeRKT:", error);
        throw error; // Re-throw the error for higher-level handling
    }
};

// Fetch TPP data by ID
export const getById = async (id: string) => {
    try {
        const response = await apiRequest(`/api/tpp?id=${id}`, {
            method: 'GET',
        });
        return response;
    } catch (error) {
        console.error("Error fetching TPP by ID:", error);
        throw error; // Re-throw the error for higher-level handling
    }
};

// Fetch all TPP data
export const getAll = async () => {
    try {
        const response = await apiRequest('/api/tpp', {
            method: 'GET',
        });
        return response;
    } catch (error) {
        console.error("Error fetching all TPP data:", error);
        throw error; // Re-throw the error for higher-level handling
    }
};

// Store a new TPP record
export const store = async (data: any) => {
    try {
        const response = await apiRequest('/api/tpp', {
            method: 'POST',
            body: data,
        });
        return response;
    } catch (error) {
        console.error("Error storing TPP:", error);
        throw error; // Re-throw the error for higher-level handling
    }
};

// Update an existing TPP record
export const update = async (id: string, data: any) => {
    try {
        const response = await apiRequest(`/api/tpp?id=${id}`, {
            method: 'PUT',
            body: data,
        });
        return response;
    } catch (error) {
        console.error("Error updating TPP:", error);
        throw error; // Re-throw the error for higher-level handling
    }
};

// Delete a TPP record
export const destroy = async (id: string) => {
    try {
        const response = await apiRequest(`/api/tpp?id=${id}`, {
            method: 'DELETE',
        });
        return response;
    } catch (error) {
        console.error("Error deleting TPP:", error);
        throw error; // Re-throw the error for higher-level handling
    }
};
