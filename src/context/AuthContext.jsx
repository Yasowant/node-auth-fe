import { useCallback, useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import api from "../api/axios";
import {
  forgetSession,
  hasSessionHint,
  rememberSession,
} from "../utils/sessionHint";
import { AuthContext } from "./auth-context";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(hasSessionHint);

  // Existing authentication logic - unchanged
  useEffect(() => {
    if (!hasSessionHint()) return undefined;

    const controller = new AbortController();
    let active = true;

    const restoreSession = async () => {
      try {
        const { data } = await api.get("/auth/me", {
          signal: controller.signal,
        });

        const currentUser = data?.user ?? null;

        if (currentUser) {
          rememberSession();
        } else {
          forgetSession();
        }

        if (active) setUser(currentUser);
      } catch (error) {
        if (error?.code !== "ERR_CANCELED") {
          forgetSession();
        }

        if (active) setUser(null);
      } finally {
        if (active) setLoading(false);
      }
    };

    restoreSession();

    return () => {
      active = false;
      controller.abort();
    };
  }, []);

  // Existing login - unchanged
  const login = useCallback(async (email, password) => {
    const { data } = await api.post("/auth/login", {
      email,
      password,
    });

    setUser(data?.user ?? null);
    rememberSession();

    return data;
  }, []);

  // Existing register - unchanged
  const register = useCallback(
    async ({ name, email, password, workStatus }) => {
      const { data } = await api.post("/auth/register", {
        name,
        email,
        password,
        workStatus,
      });

      return data;
    },
    [],
  );

  // Existing forgot password - unchanged
  const requestPasswordReset = useCallback(async (email) => {
    const { data } = await api.post("/auth/forgot-password", {
      email,
    });

    return data;
  }, []);

  // Existing logout - unchanged
  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout request failed:", error?.friendlyMessage);
    } finally {
      setUser(null);
      forgetSession();
    }
  }, []);

  const updateProfile = useCallback(async (profileData) => {
    try {
      const { data } = await api.put("/auth/profile", profileData);

      // Update the user in AuthContext with the latest profile
      setUser(data?.user ?? null);

      return data;
    } catch (error) {
      console.error(
        "Profile update failed:",
        error?.friendlyMessage || error?.response?.data?.message,
      );

      throw error;
    }
  }, []);
  // ==========================================
  // ONLY getAllUsers uses React Query (admins only)
  // ==========================================
  const {
    data: users = [],
    isLoading: usersLoading,
    isError: usersError,
    refetch: refetchUsers,
  } = useQuery({
    queryKey: ["users"],

    queryFn: async () => {
      const { data } = await api.get("/auth/users");

      return data?.users ?? [];
    },

    // GET /auth/users is guarded by authorizeRoles("ADMIN"), so asking as a
    // candidate or recruiter would only ever return 403.
    enabled: user?.role === "ADMIN",

    retry: false,
  });

  const value = useMemo(
    () => ({
      user,
      loading,

      login,
      register,
      logout,
      requestPasswordReset,

      // Users
      users,
      usersLoading,
      usersError,
      refetchUsers,
      updateProfile,
    }),
    [
      user,
      loading,
      login,
      register,
      logout,
      requestPasswordReset,
      users,
      usersLoading,
      usersError,
      refetchUsers,
      updateProfile,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
