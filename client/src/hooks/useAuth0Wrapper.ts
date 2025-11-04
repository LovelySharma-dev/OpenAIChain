import { useAuth0 } from "@auth0/auth0-react";
import { useState, useEffect } from "react";

// Check if Auth0 is configured
const isAuth0Configured = () => {
  const domain = import.meta.env.VITE_AUTH0_DOMAIN || "dev-xxx.us.auth0.com";
  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID || "your-client-id";
  return domain !== "dev-xxx.us.auth0.com" && clientId !== "your-client-id";
};

// Mock Auth0 hook for development
function useAuth0Mock() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const demoAuth = localStorage.getItem("demoAuth");
    if (demoAuth === "true") {
      setIsAuthenticated(true);
      setUser({ 
        email: "demo@openaichain.com", 
        name: "Demo User",
        sub: "auth0|demo"
      });
    }
  }, []);

  const loginWithRedirect = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      localStorage.setItem("demoAuth", "true");
      setIsAuthenticated(true);
      setUser({ 
        email: "demo@openaichain.com", 
        name: "Demo User",
        sub: "auth0|demo"
      });
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = (options?: { logoutParams?: { returnTo?: string } }) => {
    localStorage.removeItem("demoAuth");
    setIsAuthenticated(false);
    setUser(null);
    if (options?.logoutParams?.returnTo) {
      window.location.href = options.logoutParams.returnTo;
    }
  };

  const getAccessTokenSilently = async () => {
    return "demo-token";
  };

  return {
    isAuthenticated,
    isLoading,
    user,
    error,
    loginWithRedirect,
    logout,
    getAccessTokenSilently,
  };
}

// Wrapper hook that uses real Auth0 if configured, otherwise mock
export function useAuth0Wrapper() {
  if (isAuth0Configured()) {
    try {
      return useAuth0();
    } catch (error) {
      console.warn("Auth0 hook error, using mock:", error);
      return useAuth0Mock();
    }
  }
  return useAuth0Mock();
}

