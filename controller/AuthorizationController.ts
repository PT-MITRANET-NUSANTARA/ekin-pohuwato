import { apiRequest } from "@/utils/apiRequest";
import { NextRequest } from "next/server";

export const setToken = async (token: any) => {
    try {
        const response = await fetch('/api/authorization', {
            method: 'PUT',
            body: JSON.stringify({ token: token}) // Assuming match[1] contains your token
        });
        return response
    } catch (error) {
        console.error('Failed to set token:', error);
        throw error;
    }
};

export const verifyToken = async (token: any, req: NextRequest) => {
    try {
        const baseUrl = req.nextUrl.origin;
        const response = await fetch(`${baseUrl}/api/authorization`, {
            method: 'POST',
            body: JSON.stringify({ token: token})
        });
        return response;
    } catch (error) {
        console.error('Failed to verify token:', error);
        throw error;
    }
}


export const getData = async () => {
    try {
        const response = await apiRequest('/api/authorization', {
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.error('Failed to get data:', error);
        throw error;
    }
}