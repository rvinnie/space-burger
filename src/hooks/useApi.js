import axios from 'axios';
import { useState, useEffect } from 'react';

const useApi = (url) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setError(null);
    (async () => {
      try {
        setLoading(true);
        const response = await axios.get(url);
        setResults(response.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    })();
  }, [url]);

  return { results, loading, error };
};

export default useApi;
