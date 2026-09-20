import { useMemo, useState } from "react";

import { profileScore } from "../utils/adminUsers";

export const SORTS = {
  newest: {
    label: "Newest first",
    compare: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  },
  oldest: {
    label: "Oldest first",
    compare: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
  },
  name: {
    label: "Name (A-Z)",
    compare: (a, b) => (a.name ?? "").localeCompare(b.name ?? ""),
  },
  profile: {
    label: "Most complete profile",
    compare: (a, b) => profileScore(b) - profileScore(a),
  },
};

const PAGE_SIZE = 10;

const matchesQuery = (user, query) => {
  if (!query) return true;

  return [user.name, user.email, user.headline, user.location, user.phone]
    .filter(Boolean)
    .some((value) => value.toLowerCase().includes(query));
};

const matchesStatus = (user, status) => {
  if (status === "all") return true;
  if (status === "active") return user.isActive !== false;
  if (status === "inactive") return user.isActive === false;
  if (status === "verified") return Boolean(user.isEmailVerified);
  if (status === "unverified") return !user.isEmailVerified;

  return true;
};

/** Search, filter, sort and page the admin user table -- all client side,
 *  because /api/auth/users returns the whole directory in one call. */
export function useUserDirectory(users) {
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("all");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();

    const filtered = users.filter(
      (user) =>
        matchesQuery(user, needle) &&
        (role === "all" || user.role === role) &&
        matchesStatus(user, status),
    );

    const compare = (SORTS[sort] ?? SORTS.newest).compare;

    return [...filtered].sort(compare);
  }, [users, query, role, status, sort]);

  const pageCount = Math.max(1, Math.ceil(results.length / PAGE_SIZE));

  // A filter change can leave the stored page past the end of the new list,
  // so the page is clamped on read rather than corrected in an effect.
  const safePage = Math.min(page, pageCount);
  const start = (safePage - 1) * PAGE_SIZE;
  const visible = results.slice(start, start + PAGE_SIZE);

  const activeFilters =
    (query.trim() ? 1 : 0) +
    (role === "all" ? 0 : 1) +
    (status === "all" ? 0 : 1);

  const reset = () => {
    setQuery("");
    setRole("all");
    setStatus("all");
    setPage(1);
  };

  return {
    query,
    setQuery: (value) => {
      setQuery(value);
      setPage(1);
    },
    role,
    setRole: (value) => {
      setRole(value);
      setPage(1);
    },
    status,
    setStatus: (value) => {
      setStatus(value);
      setPage(1);
    },
    sort,
    setSort,
    reset,
    activeFilters,
    results,
    visible,
    page: safePage,
    pageCount,
    setPage,
    rangeStart: results.length === 0 ? 0 : start + 1,
    rangeEnd: Math.min(start + PAGE_SIZE, results.length),
  };
}

export default useUserDirectory;
