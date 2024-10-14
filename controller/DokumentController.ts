const dokument_url = process.env.NEXT_PUBLIC_API_IMAGE_URL

export const get = async (id: string, ) => {
    try {
        const response = await fetch(`${dokument_url}/${id}`, {
            method: 'get',
        });

        if (!response.ok) {
            throw new Error(`Error updating document: ${response.statusText}`);
        }

        return response;
    } catch (error) {
        console.error("Error updating document:", error);
        throw error;
    }
};

