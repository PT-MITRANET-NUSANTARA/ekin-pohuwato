import { apiRequest } from "@/utils/apiRequest";
const API_URL = process.env.NEXT_PUBLIC_API_REPORT_URL;

export const getPerjanjianKinerja = async (data:Object) => {
    try {
        const response:any = await fetch(`${API_URL}/perjanjian_kinerja`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
        })
        console.log("HERE", response);
        return response.blob();
    } catch (error) {
        console.error("Error fetching Perjanjian Kinerja:", error);
        throw error;
    }
}

export const getHasilSkp = async (data:Object) => {
    try {
        const response:any = await fetch(`${API_URL}/hasil_skp`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
        })
        console.log("HERE", response);
        return response.blob();
    } catch (error) {
        console.error("Error fetching Hasil SKP:", error);
        throw error;
    }
}

export const getFormPenilaian = async (data:Object) => {
    try {
        const response:any = await fetch(`${API_URL}/form_penilaian`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
        })
        console.log("HERE", response);
        return response.blob();
    } catch (error) {
        console.error("Error fetching Form Penilaian:", error);
        throw error;
    }
}

export const getEvaluasiKinerja = async (data:Object) => {
    try {
        const response:any = await fetch(`${API_URL}/evaluasi_kinerja`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
        })
        console.log("HERE", response);
        return response.blob();
    } catch (error) {
        console.error("Error fetching Form Penilaian:", error);
        throw error;
    }
}