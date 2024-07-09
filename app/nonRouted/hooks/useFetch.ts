// hooks/useFetch.ts
import { useState, useCallback } from "react";

interface FetchHookResult<T> {
  data: T | null;
  error: string | null;
  status: number | null;
  loading: boolean;
  sendRequest: (method?: string, body?: any) => void;
}

const useFetch = <T>(url: string): FetchHookResult<T> => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const sendRequest = useCallback(
    async (method: string = "GET", body: any = null) => {
      setLoading(true);
      try {
        const options: RequestInit = {
          method,
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
          },
        };

        if (body) {
          options.body = JSON.stringify(body);
        }

        const response = await fetch(url, options);

        const result = await response.json();

        if (response.ok) {
          setData(result);
          setStatus(response.status);
        } else {
          setError(result.message);
          setStatus(response.status);
        }
      } catch (error) {
        setError("Error fetching data");
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    },
    [url]
  );

  return { data, error, status, loading, sendRequest };
};

export default useFetch;
