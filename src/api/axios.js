import axios from "axios";

import { getErrorMessage } from "../utils/getErrorMessage";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

const api = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 15000,
});

// Endpoints that must never trigger a refresh-and-retry: they either are the
// refresh itself, or a 401 from them is a real answer (bad credentials), not
// an expired session.
const NO_REFRESH = [
  "/auth/refresh",
  "/auth/login",
  "/auth/register",
  "/auth/logout",
  "/auth/forgot-password",
];

const skipsRefresh = (url = "") =>
  NO_REFRESH.some((path) => url.includes(path));

// The access cookie lives ~15 minutes while the refresh cookie lives 7 days.
// One shared promise means ten parallel 401s trigger a single refresh call.
let refreshRequest = null;

const refreshSession = () => {
  refreshRequest ??= api.post("/auth/refresh").finally(() => {
    refreshRequest = null;
  });

  return refreshRequest;
};

// ---------------------------------------------------------------------------
// CSRF (double-submit cookie)
//
// The API's csrfMiddleware rejects every POST/PUT/PATCH/DELETE unless the
// request carries an X-CSRF-Token header that matches the `csrfToken` cookie
// set by GET /csrf-token. GET/HEAD/OPTIONS are exempt server-side, so only
// mutating requests need the header.
// ---------------------------------------------------------------------------

const SAFE_METHODS = new Set(["get", "head", "options"]);

let csrfToken = null;
let csrfRequest = null;

const fetchCsrfToken = () => {
  csrfRequest ??= api
    .get("/csrf-token")
    .then(({ data }) => {
      csrfToken = data?.csrfToken ?? null;
      return csrfToken;
    })
    .finally(() => {
      csrfRequest = null;
    });

  return csrfRequest;
};

// Attach the token to every unsafe request, fetching one first if we don't
// have it cached yet (e.g. first mutation after a page load).
api.interceptors.request.use(async (config) => {
  const method = (config.method || "get").toLowerCase();

  if (SAFE_METHODS.has(method)) return config;

  if (!csrfToken) {
    await fetchCsrfToken();
  }

  if (csrfToken) {
    config.headers = config.headers ?? {};
    config.headers["X-CSRF-Token"] = csrfToken;
  }

  return config;
});

// Single place where API failures are normalised. Every caller can read
// `error.friendlyMessage` instead of digging through error.response.data.
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const request = error.config;

    // The cached token can go stale (cookie expired, or this is the very
    // first load and the guess above was wrong) -- refetch once and retry
    // before giving up.
    const invalidCsrf =
      error.response?.status === 403 &&
      request &&
      !request._csrfRetried &&
      /csrf/i.test(error.response?.data?.message || "");

    if (invalidCsrf) {
      request._csrfRetried = true;
      csrfToken = null;

      try {
        await fetchCsrfToken();

        if (csrfToken) {
          request.headers = request.headers ?? {};
          request.headers["X-CSRF-Token"] = csrfToken;
        }

        return await api(request);
      } catch {
        // Refetching the token failed too -- fall through to the normal
        // error handling below.
      }
    }

    const expiredSession =
      error.response?.status === 401 &&
      request &&
      !request._retried &&
      !skipsRefresh(request.url);

    if (expiredSession) {
      request._retried = true;

      try {
        await refreshSession();
        return await api(request);
      } catch {
        // Refresh failed too -- the session is genuinely over. Fall through
        // and let the caller handle the original 401.
      }
    }

    if (!axios.isCancel(error)) {
      error.friendlyMessage = getErrorMessage(error);
    }

    return Promise.reject(error);
  },
);

export default api;
