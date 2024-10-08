import { apiRequest } from "@/utils/apiRequest";
const API_URL = process.env.NEXT_PUBLIC_API_EKIN_URL;

export const getByNIP = async (token: string, nip:string) => {
    try {
        const response = await apiRequest(`${API_URL}/posjab/nip/${nip}`, {
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

export const getRiwayatByNIP = async (token: string, nip:string) => {
    try {
        const response = await apiRequest(`${API_URL}/jabatan/nip/${nip}`, {
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

export const getAllPosjabByUnit = async (token: string, unitId:string) => {
    try {
        const response = await apiRequest(`${API_URL}/posjab/unor/${unitId}`, {
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

export const getAllSatuanKerja = async (token: string) => {
    try {
        const response = await apiRequest(`${API_URL}/ref/satuankerja`, {
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

export const getAllJenisKerja = async (token: string) => {
    try {
        const response = await apiRequest(`${API_URL}/ref/jenisjabatan`, {
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


export const getAllEslon = async (token: string) => {
    try {
        const response = await apiRequest(`${API_URL}/ref/eselon`, {
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

export const getAllJabatanFungsional = async (token: string) => {
    try {
        const response = await apiRequest(`${API_URL}/ref/jafung`, {
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

export const getAllJabatanJenis = async (token: string) => {
    try {
        const response = await apiRequest(`${API_URL}/ref/jabatanjenis`, {
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