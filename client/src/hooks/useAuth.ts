import { useState, useEffect, useCallback } from "react";
import { loginUser, signupUser, getCurrentUser, User, AuthResponse } from "../api";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  // Load auth state from localStorage on mount
  useEffect(() => {
    const loadAuth = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (token) {
          // Verify token is still valid by fetching current user
          const response = await getCurrentUser(token);
          if (response.success) {
            setAuthState({
              user: response.user,
              token,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          } else {
            // Token invalid, clear it
            localStorage.removeItem("authToken");
            setAuthState((prev) => ({ ...prev, isLoading: false }));
          }
        } else {
          setAuthState((prev) => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        // Token invalid or expired
        localStorage.removeItem("authToken");
        setAuthState((prev) => ({ ...prev, isLoading: false }));
      }
    };

    loadAuth();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const response: AuthResponse = await loginUser(email, password);
      if (response.success) {
        localStorage.setItem("authToken", response.token);
        setAuthState({
          user: response.user,
          token: response.token,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        return { success: true };
      } else {
        throw new Error(response.message || "Login failed");
      }
    } catch (error: any) {
      const errorMessage = error.message || "Login failed. Please try again.";
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      return { success: false, error: errorMessage };
    }
  }, []);

  const signup = useCallback(async (email: string, password: string, name?: string) => {
    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const response: AuthResponse = await signupUser(email, password, name);
      if (response.success) {
        localStorage.setItem("authToken", response.token);
        setAuthState({
          user: response.user,
          token: response.token,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        return { success: true };
      } else {
        throw new Error(response.message || "Signup failed");
      }
    } catch (error: any) {
      const errorMessage = error.message || "Signup failed. Please try again.";
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      return { success: false, error: errorMessage };
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("authToken");
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  }, []);

  const refreshUser = useCallback(async () => {
    const token = authState.token || localStorage.getItem("authToken");
    if (!token) return;

    try {
      const response = await getCurrentUser(token);
      if (response.success) {
        setAuthState((prev) => ({
          ...prev,
          user: response.user,
        }));
      }
    } catch (error) {
      console.error("Failed to refresh user:", error);
    }
  }, [authState.token]);

  return {
    ...authState,
    login,
    signup,
    logout,
    refreshUser,
  };
}

