interface RequestOptions {
    method: string;
    headers: HeadersInit;
    body?: string;
}

interface Response {
    status: number;
    msg: string;
    data: any;
    ok: boolean;
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const apiKey = process.env.NEXT_PUBLIC_API_KEY as string;

if (!apiUrl) {
    throw new Error('Please define the NEXT_PUBLIC_API_URL environment variable inside .env.local');
}

if (!apiKey) {
    throw new Error('Please define the NEXT_PUBLIC_API_KEY environment variable inside .env.local');
}

async function apiRequest<T>(url: string, options: RequestOptions): Promise<T> {
    const response = await fetch(`${apiUrl}${url}`, options);
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Something went wrong');
    }
    return response.json();
}

export async function get<T>(url: string): Promise<T> {
    const options: RequestOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': `Bearer ${apiKey}`
        }
    };
    return apiRequest<T>(url, options);
}

export async function post<T>(url: string, data: unknown): Promise<T> {
    const options: RequestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
            'x-api-key': apiKey
        },
        body: JSON.stringify(data)
    };
    return apiRequest<T>(url, options);
}

export async function put<T>(url: string, data: unknown): Promise<T> {
    const options: RequestOptions = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
            'x-api-key': apiKey
        },
        body: JSON.stringify(data)
    };
    return apiRequest<T>(url, options);
}

export async function del<T>(url: string): Promise<T> {
    const options: RequestOptions = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
            'x-api-key': apiKey
        }
    };
    return apiRequest<T>(url, options);
}

export function createResponse(status: number, message: string, data: any, ok: boolean = false): Response {
    return {
        status,
        msg: message,
        data,
        ok,
    };
}
