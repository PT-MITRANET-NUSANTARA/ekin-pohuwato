import { apiRequest } from '@/utils/apiRequest';
import { NextRequest } from 'next/server';

export const getPermision = async () => {
    try {
        const response = await apiRequest('/api/middleware/permission', {
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.error('Failed to get data:', error);
        throw error;
    }
};

// export const getPermisionMiddleware = async (req: NextRequest) => {
//     try {
//         const baseUrl = req.nextUrl.origin;
//         const response = await apiRequest(`${baseUrl}/api/middleware/permission`, {
//             method: 'GET'
//         });
//         return response;
//     } catch (error) {
//         console.error('Failed to get data:', error);
//         throw error;
//     }
// };
export const getPermisionMiddleware = async (req: NextRequest) => {
    try {
        const baseUrl = req.nextUrl.origin;
        const response = await fetch(`${baseUrl}/api/middleware/permission`, {
            method: 'GET',
            // Teruskan cookie dari request asli agar API bisa mengenali autentikasi
            headers: {
                cookie: req.headers.get('cookie') || ''
            }
        });

        console.log('RESPONSE status:', response.status);
        console.log('RESPONSE content-type:', response.headers.get('content-type'));

        // Pastikan responsnya berupa JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            const text = await response.text();
            console.error('Response is not JSON:', text);
            throw new Error('Response is not JSON');
        }

        return response;
    } catch (error: any) {
        console.error('Failed to fetch permission middleware:', error.message);
        throw error;
    }
};
