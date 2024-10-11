export const getById = async (id: string) => {
    try {
        const response = await fetch(`/api/dokumen?id=${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Error fetching document by ID: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching document by ID:", error);
        throw error;
    }
};

export const getAll = async () => {
    try {
        const response = await fetch('/api/dokumen', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Error fetching all documents: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching all documents:", error);
        throw error;
    }
};

export const store = async (data: FormData) => {
    try {
        const response = await fetch('/api/dokumen', {
            method: 'POST',
            body: data, // FormData contains the file and other form data
        });

        if (!response.ok) {
            throw new Error(`Error storing document: ${response.statusText}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error storing document:", error);
        throw error;
    }
};

export const update = async (id: string, data: FormData) => {
    try {
        const response = await fetch(`/api/dokumen?id=${id}`, {
            method: 'PUT',
            body: data, // Menggunakan FormData untuk upload file baru jika ada
        });

        if (!response.ok) {
            throw new Error(`Error updating document: ${response.statusText}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error updating document:", error);
        throw error;
    }
};

export const destroy = async (id: string) => {
    try {
        const response = await fetch(`/api/dokumen?id=${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error(`Error deleting document: ${response.statusText}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error deleting document:", error);
        throw error;
    }
};
