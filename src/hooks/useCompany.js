import { useCallback, useEffect, useState } from "react";

import { getMyCompany } from "../api/company";

/**
 * The signed-in recruiter's own company, if they've created one yet.
 * GET /company/my/company responds 400 with no company -- that is a normal
 * "not created yet" state here, not a real error.
 */
export function useCompany() {
  const [company, setCompany] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    getMyCompany({ signal: controller.signal })
      .then((data) => {
        setCompany(data?.company ?? null);
        setNotFound(false);
      })
      .catch((requestError) => {
        if (requestError.name === "CanceledError") return;

        if (requestError.response?.status === 400) {
          setNotFound(true);
          return;
        }

        setError(
          requestError.friendlyMessage ||
            requestError.response?.data?.message ||
            "Couldn't load your company right now.",
        );
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [reloadToken]);

  const refetch = useCallback(() => {
    setLoading(true);
    setError(null);
    setNotFound(false);
    setReloadToken((token) => token + 1);
  }, []);

  return { company, notFound, loading, error, refetch };
}

export default useCompany;
