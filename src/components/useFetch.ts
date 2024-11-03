import { useState, useEffect } from 'react';

interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
  body?: BodyInit | null;
}

interface UseFetchResult<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

const useFetch = <T>(url: string, options: FetchOptions = {}): UseFetchResult<T> => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(url, options);
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, options]);

  return { data, error, loading };
};

export default useFetch;
