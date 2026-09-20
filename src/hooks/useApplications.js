import { useCallback, useEffect, useState } from "react";

import { getMyApplications, withdrawApplication } from "../api/applications";

export function useApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionError, setActionError] = useState("");
  const [reloadToken, setReloadToken] = useState(0);
  const [withdrawingId, setWithdrawingId] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    getMyApplications({ limit: 100, signal: controller.signal })
      .then((data) => {
        setApplications(
          Array.isArray(data?.applications) ? data.applications : [],
        );
        setError(null);
      })
      .catch((requestError) => {
        if (requestError.name === "CanceledError") return;
        setError(
          requestError.friendlyMessage ||
            requestError.response?.data?.message ||
            "Couldn't load your applications right now.",
        );
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [reloadToken]);

  const refetch = useCallback(() => {
    setError(null);
    setLoading(true);
    setReloadToken((token) => token + 1);
  }, []);

  const withdraw = useCallback(async (id) => {
    setWithdrawingId(id);
    setActionError("");
    try {
      const { application } = await withdrawApplication(id);
      setApplications((current) =>
        current.map((item) => (item._id === id ? application : item)),
      );
    } catch (requestError) {
      setActionError(
        requestError.friendlyMessage ||
          requestError.response?.data?.message ||
          "Couldn't withdraw that application.",
      );
    } finally {
      setWithdrawingId(null);
    }
  }, []);

  return {
    applications,
    loading,
    error,
    refetch,
    withdraw,
    withdrawingId,
    actionError,
  };
}

export default useApplications;
