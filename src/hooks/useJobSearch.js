import { useCallback, useEffect, useMemo, useState } from "react";

import api from "../api/axios";
import { filterJobs, mapApiJobToBoardJob, sortJobs, SORTS } from "../data/jobs";

const EMPTY = {
  keyword: "",
  location: "",
  workModes: [],
  types: [],
  levels: [],
};

// The backend caps `limit` at 100 per page (see getAllJobs in
// jobController.js) — this mirrors that real ceiling rather than guessing.
const PAGE_SIZE = 100;

// Whatever sort options data/jobs.js defines, the first one is the default —
// so this never drifts out of sync with SORTS itself.
const DEFAULT_SORT = Object.keys(SORTS)[0];

const toggleInArray = (list, value) =>
  list.includes(value)
    ? list.filter((item) => item !== value)
    : [...list, value];

/**
 * All landing-page search state in one place: text, facets and sort order.
 * Jobs are fetched from the live API — following every page the backend
 * reports via `totalPages`, not a fixed guess — and filtering/sorting then
 * runs against that in-memory list, so results still update instantly.
 */
export function useJobSearch() {
  const [filters, setFilters] = useState(EMPTY);
  const [sort, setSort] = useState(DEFAULT_SORT);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    const fetchAllPages = async () => {
      const first = await api.get("/jobs", {
        params: { page: 1, limit: PAGE_SIZE },
        signal: controller.signal,
      });

      const pages = [first.data];
      const totalPages = first.data?.totalPages ?? 1;

      if (totalPages > 1) {
        const rest = await Promise.all(
          Array.from({ length: totalPages - 1 }, (_, index) =>
            api.get("/jobs", {
              params: { page: index + 2, limit: PAGE_SIZE },
              signal: controller.signal,
            }),
          ),
        );
        pages.push(...rest.map((response) => response.data));
      }

      return pages.flatMap((page) =>
        Array.isArray(page?.jobs) ? page.jobs : [],
      );
    };

    fetchAllPages()
      .then((list) => {
        setJobs(list.map(mapApiJobToBoardJob));
        setError(null);
      })
      .catch((requestError) => {
        if (
          api.isCancel?.(requestError) ||
          requestError.name === "CanceledError"
        ) {
          return;
        }
        setError(
          requestError.friendlyMessage ||
            requestError.response?.data?.message ||
            "Couldn't load jobs right now.",
        );
      })
      .finally(() => {
        setLoading(false);
      });

    return () => controller.abort();
  }, [reloadToken]);

  const refetch = useCallback(() => {
    setError(null);
    setLoading(true);
    setReloadToken((token) => token + 1);
  }, []);

  const setText = useCallback((event) => {
    const { name, value } = event.target;
    setFilters((previous) => ({ ...previous, [name]: value }));
  }, []);

  const setKeyword = useCallback((keyword) => {
    setFilters((previous) => ({ ...previous, keyword }));
  }, []);

  const toggleFacet = useCallback((facet, value) => {
    setFilters((previous) => ({
      ...previous,
      [facet]: toggleInArray(previous[facet], value),
    }));
  }, []);

  const clearAll = useCallback(() => setFilters(EMPTY), []);

  const results = useMemo(
    () => sortJobs(filterJobs(jobs, filters), sort),
    [jobs, filters, sort],
  );

  const activeCount =
    (filters.keyword.trim() ? 1 : 0) +
    (filters.location.trim() ? 1 : 0) +
    filters.workModes.length +
    filters.types.length +
    filters.levels.length;

  return {
    filters,
    sort,
    setSort,
    setText,
    setKeyword,
    toggleFacet,
    clearAll,
    results,
    activeCount,
    total: jobs.length,
    loading,
    error,
    refetch,
  };
}

export default useJobSearch;
