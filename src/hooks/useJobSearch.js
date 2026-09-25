import { useCallback, useEffect, useRef, useState } from "react";

import api from "../api/axios";
import { mapApiJobToBoardJob } from "../data/jobs";

const EMPTY = {
  keyword: "",
  location: "",
  workModes: [],
  types: [],
  levels: [],
};

// FilterRail toggles the display labels from data/jobs.js -- translate
// those into the enum values the backend's queryPlanner.js expects.
const WORK_MODE_PARAMS = {
  Remote: "REMOTE",
  Hybrid: "HYBRID",
  "On-site": "ONSITE",
};

const EMPLOYMENT_TYPE_PARAMS = {
  "Full-time": "FULL_TIME",
  "Part-time": "PART_TIME",
  Contract: "CONTRACT",
  Internship: "INTERNSHIP",
};

const toggleInArray = (list, value) =>
  list.includes(value)
    ? list.filter((item) => item !== value)
    : [...list, value];

// Typing in the search/location boxes -- or clicking a facet -- shouldn't
// fire a request per keystroke/click, so the actual fetch waits for a short
// pause. The very first load skips this (see isFirstRun below).
const DEBOUNCE_MS = 350;

/**
 * All landing-page search state in one place: text, facets and sort order.
 * Filters are sent straight to GET /jobs (see the backend's queryPlanner.js)
 * so the DB does the filtering and sorting, not the browser -- this hook's
 * job is just to keep the request in sync with the current filters/sort.
 */
export function useJobSearch() {
  const [filters, setFilters] = useState(EMPTY);
  const [sort, setSort] = useState("recent");
  const [jobs, setJobs] = useState([]);
  const [filteredTotal, setFilteredTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadToken, setReloadToken] = useState(0);
  const isFirstRun = useRef(true);

  // Grand total of every active job, independent of the current filters --
  // fetched once (and on refetch) so "3 of 40 roles" still means something
  // once you start filtering, instead of collapsing to the filtered count.
  const [grandTotal, setGrandTotal] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    api
      .get("/jobs", { params: { limit: 1 }, signal: controller.signal })
      .then(({ data }) => setGrandTotal(data?.total ?? 0))
      .catch(() => {
        // Non-critical -- the "X of Y" copy just falls back to the
        // filtered count below.
      });

    return () => controller.abort();
  }, [reloadToken]);

  useEffect(() => {
    const controller = new AbortController();
    const delay = isFirstRun.current ? 0 : DEBOUNCE_MS;
    isFirstRun.current = false;

    const timer = window.setTimeout(() => {
      setLoading(true);
      setError(null);

      const params = { limit: 100, sort };

      if (filters.keyword.trim()) params.keyword = filters.keyword.trim();
      if (filters.location.trim()) params.location = filters.location.trim();

      const workModeParams = filters.workModes
        .map((label) => WORK_MODE_PARAMS[label])
        .filter(Boolean);
      if (workModeParams.length) params.workMode = workModeParams.join(",");

      const typeParams = filters.types
        .map((label) => EMPLOYMENT_TYPE_PARAMS[label])
        .filter(Boolean);
      if (typeParams.length) params.employmentType = typeParams.join(",");

      if (filters.levels.length) params.level = filters.levels.join(",");

      api
        .get("/jobs", { params, signal: controller.signal })
        .then(({ data }) => {
          const list = Array.isArray(data?.jobs) ? data.jobs : [];
          setJobs(list.map(mapApiJobToBoardJob));
          setFilteredTotal(data?.total ?? list.length);
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
        .finally(() => setLoading(false));
    }, delay);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [filters, sort, reloadToken]);

  const refetch = useCallback(() => setReloadToken((token) => token + 1), []);

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
    results: jobs,
    activeCount,
    total: grandTotal ?? filteredTotal,
    loading,
    error,
    refetch,
  };
}

export default useJobSearch;
