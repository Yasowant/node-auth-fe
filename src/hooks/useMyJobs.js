import { useCallback, useEffect, useState } from "react";

import { getMyJobs } from "../api/jobs";

/** The signed-in recruiter's own postings, every status included. */
export function useMyJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    getMyJobs({ signal: controller.signal })
      .then((data) => setJobs(Array.isArray(data?.jobs) ? data.jobs : []))
      .catch((requestError) => {
        if (requestError.name === "CanceledError") return;
        setError(
          requestError.friendlyMessage ||
            requestError.response?.data?.message ||
            "Couldn't load your jobs right now.",
        );
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [reloadToken]);

  const refetch = useCallback(() => {
    setLoading(true);
    setError(null);
    setReloadToken((token) => token + 1);
  }, []);

  return { jobs, loading, error, refetch };
}

export default useMyJobs;
