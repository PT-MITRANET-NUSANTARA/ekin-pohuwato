import { apiRequest } from "@/utils/apiRequest";
const API_URL = process.env.NEXT_PUBLIC_API_REPORT_URL;

export const getPerjanjianKinerja = async (data:Object) => {
    try {
        const response:any = await apiRequest(`${API_URL}/perjanjian_kinerja`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
        })

        return response.blob();
    } catch (error) {
        console.error("Error fetching Perjanjian Kinerja:", error);
        throw error;
    }
}