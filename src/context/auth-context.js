import { createContext } from "react";

/**
 * Context object only. Kept in its own module so the provider file can export
 * a component and nothing else (keeps react-refresh / fast refresh working).
 */
export const AuthContext = createContext(null);
