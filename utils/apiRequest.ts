export interface RequestOptions extends RequestInit {
    headers?: HeadersInit;
    body?: any;
}

export const apiRequest = async <T>(url: string, options: RequestOptions = {}): Promise<T> => {
    const { headers, body, ...restOptions } = options;

    try {
        const defaultHeaders: HeadersInit = {
            'Content-Type': 'application/json',
            ...headers
        };
    
        const requestBody = typeof body === 'object' && body !== null ? JSON.stringify(body) : body;
    
        const response = await fetch(url, {
            ...restOptions,
            headers: defaultHeaders,
            body: requestBody
        });
    
        // if (!response.ok) {
        //     console.log(response);
    
        //     // const errorResponse = await response.json();
        // }
        
        const responseData = await response.json();
        return responseData as T;
    } catch (error) {
        throw new Error( 'API request failed');
        
    }
  
};
