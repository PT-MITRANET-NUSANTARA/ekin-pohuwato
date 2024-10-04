import { useEffect, useState } from "react";

interface ApiResponse<T> {
  data: T;
  msg: string;
  status: number;
}

const useFetchData = <T, F extends () => Promise<ApiResponse<T>>>(fetchFunction: F) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<string>('Loading...'); // Initialize with a default message
  const [status, setStatus] = useState<number>(0);
  const [error, setError] = useState<string | null>(null); // Track errors

  useEffect(() => {
    const abortController = new AbortController(); // Create an AbortController to cancel fetch if needed

    const fetchData = async () => {
      try {
        const response = await fetchFunction();
        console.log(response);

        if (!abortController.signal.aborted) {
          setData(response.data);
          setMsg(response.msg);
          setStatus(response.status);
        }
      } catch (error) {
        if (!abortController.signal.aborted) {
          console.error('Failed to fetch data:', error);
          setError('Failed to fetch data.');
          setMsg('Error occurred during fetch');
          setStatus(500); // Set to some appropriate error code
        }
      } finally {
        if (!abortController.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      abortController.abort(); // Cancel fetch on component unmount
    };
  }, [fetchFunction]);

  return { data, setData, loading, msg, status, error }; // Return error state for additional handling
};

export default useFetchData;
