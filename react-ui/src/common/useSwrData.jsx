import { useEffect, useState } from 'react';
import useSWR from 'swr';

import useAuthState from './useAuthState';
import useCache from './useCache';

const getOptions = (key) => {
  switch (key) {
    case '/init':
      return {
        dedupingInterval: 10 * 60 * 1000, // 10 minutes
      };
    default: {
      return {};
    }
  }
};

const useSwrData = (key, revalidateOnMount = true) => {
  const [{ accessToken, isLoggedIn, refreshToken }] = useAuthState();
  const { data, error, mutate } = useSWR([key, { accessToken, refreshToken }], {
    ...getOptions(key),
    revalidateOnMount,
  });
  const [prevLoggedIn, setLoggedIn] = useState(isLoggedIn);
  const [getData, updateCache, clearCache] = useCache(key);
  const [isFetched, setFetched] = useState(!!data);

  useEffect(() => {
    if (revalidateOnMount || !data) {
      return;
    }

    updateCache(data);
  }, [data]);

  useEffect(() => {
    if (isLoggedIn === prevLoggedIn) {
      return;
    }
    clearCache();
    setLoggedIn(isLoggedIn);
  }, [isLoggedIn]);

  if (!revalidateOnMount) {
    const cachedData = getData();
    if (cachedData) {
      if (!data) {
        mutate(cachedData, false);
      }
      return { data: cachedData };
    }

    if (!isFetched) {
      setFetched(true);
      setTimeout(async () => {
        const response = await mutate();
        if (response) {
          updateCache(response);
        }
      }, 200);
    }
  }

  return { data: data || {}, error: error?.response };
};

export default useSwrData;
