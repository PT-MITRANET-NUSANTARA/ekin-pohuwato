import { apiRequest } from "@/utils/apiRequest";

const loginUrl = process.env.NEXT_PUBLIC_API_LOGIN_URL;

interface MapData {
    redirect_uri: string;
}

interface LoginResponse {
    success: string;
    message: string;
    mapData: MapData;
}

export const login = async (
    username: string, 
    password: string, 
    client_id: string = process.env.NEXT_PUBLIC_API_LOGIN_CLIENT_ID as string, 
    response_type: string = process.env.NEXT_PUBLIC_API_LOGIN_RESPONSE_TYPE as string
): Promise<LoginResponse> => {

    const body = {
        username,
        password,
    };

    const params = new URLSearchParams({
        client_id,
        response_type,
    });

    const response = await apiRequest<LoginResponse>(`${loginUrl}?${params.toString()}`, {
        method: 'POST',
        body,
    });

    return response;
};

export const setSession = async (token: string) => {
    
};
