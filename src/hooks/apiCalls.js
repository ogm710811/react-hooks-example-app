import { useCallback, useState } from "react";

const useHttp = () => {
  const [reqIdentifier, setReqIdentifier] = useState(null);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = useCallback(
    (url, method, body, reqExtra, reqIdentifier) => {
      setReqIdentifier(reqIdentifier);
      setIsLoading(true);
      setError(null);
      fetch(url, {
        method: method,
        body: body,
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          return response.json();
        })
        .then((responseData) => {
          setIsLoading(false);
          if (!responseData && reqExtra) {
            setData({ id: reqExtra });
          } else if (responseData && reqExtra){
            setData({ ...reqExtra, id: responseData.name });
          } else {
            setData(responseData)
          }
        })
        .catch((error) => {
          setIsLoading(false);
          setError("Failed to fetch data");
        });
    },
    []
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isLoading,
    data,
    error,
    fetchData,
    reqIdentifier,
    clearError,
  };
};

export default useHttp;
