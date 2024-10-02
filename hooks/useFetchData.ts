import { log } from 'console';
import { useState, useEffect } from 'react';

const useFetchData = <T, F extends () => Promise<T>>(fetchFunction: F) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [status, setStatus] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchFunction();
        setData(response.data);
        setMsg(response.msg);
        setStatus(response.status); 
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return {  data, setData, loading , msg, status };
};

export default useFetchData;
