// hooks/useFetch.ts
import { useState, useCallback } from "react";

interface FetchHookResult<T> {
  data: T | null;
  error: string | null;
  status: number | null;
  loading: boolean;
  sendRequest: (
    method?: string,
    body?: any,
    isGraphQL?: boolean,
    query?: string,
    variables?: Record<string, any>
  ) => void;
}

const useFetch = <T>(url: string): FetchHookResult<T> => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const sendRequest = useCallback(
    async (
      method: string = "GET",
      body: any = null,
      isGraphQL: boolean = false,
      query?: string,
      variables?: Record<string, any>
    ) => {
      setLoading(true);
      try {
        const options: RequestInit = {
          method,
          headers: {
            "Content-Type": "application/json",
            cache: "no-store",
          },
        };

        if (isGraphQL && query) {
          options.body = JSON.stringify({ query, variables });
        } else if (body) {
          options.body = JSON.stringify(body);
        }

        const response = await fetch(url, options);

        const result = await response.json();

        if (response.ok) {
          setData(result.data || result);
          setStatus(response.status);
        } else {
          setError(result.errors ? result.errors[0].message : result.message);
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
