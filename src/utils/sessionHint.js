/**
 * A tiny client-side breadcrumb that answers "is it worth asking the server
 * who I am?".
 *
 * The real session lives in an httpOnly cookie that JavaScript cannot read, so
 * without a hint the app has to call /auth/me on every page load -- including
 * right after a logout, where it can only ever come back 401. This flag holds
 * no identity and grants no access; it only decides whether that request is
 * made at all.
 *
 * Every access is guarded: localStorage throws in private/blocked-storage
 * contexts, and a missing hint must degrade to "just ask the server".
 */
const STORAGE_KEY = "auth:has-session";

export function hasSessionHint() {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    // Storage unavailable: fall back to asking the server.
    return true;
  }
}

export function rememberSession() {
  try {
    window.localStorage.setItem(STORAGE_KEY, "1");
  } catch {
    // Nothing to do -- the app still works, it just re-checks on load.
  }
}

export function forgetSession() {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignored for the same reason as above.
  }
}
