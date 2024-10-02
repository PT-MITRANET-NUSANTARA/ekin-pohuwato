import { apiRequest } from "@/utils/apiRequest";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getByNIP = async (token: string, nip:string) => {
    try {
        const response = await apiRequest(`${API_URL}/aparatur/cari/nip//${nip}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}}`
            },

        });
        return response;
    } catch (error) {
        console.error("Error fetching all records:", error);
        throw error; // rethrow the error to handle it further up the call stack
    }
}