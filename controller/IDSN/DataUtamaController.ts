import { apiRequest } from "@/utils/apiRequest";
const API_URL = process.env.NEXT_PUBLIC_API_EKIN_URL;
const API_URL2 = process.env.NEXT_PUBLIC_API_URL;
export const getByNIP = async (token: string, nip: string) => {
    try {
        const response = await apiRequest(`${API_URL}/datautama/nip/${nip}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,  // Format Authorization yang benar
            },
        });
        return response;
    } catch (error) {
        console.error("Error fetching records by NIP:", error);
        throw error; // Rethrow error for handling further up the stack
    }
};

export const getFotoByNIP = async (token: string, nip: string) => {
    try {
        const response = await fetch(`${API_URL2}/photos/${nip}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'image/jpeg' // Adjust according to the image format, e.g., image/png, image/jpg
            }
        });

        if (!response.ok) {
            throw new Error(`Error fetching image: ${response.statusText}`);
        }

        const imageBlob = await response.blob(); // Convert the response to a blob
        return URL.createObjectURL(imageBlob); // Return a URL that can be used as an image source
    } catch (error) {
        console.error("Error fetching image:", `${API_URL2}/photos/${nip}`);
        throw error; // Rethrow the error to handle it further up the call stack
    }
};
