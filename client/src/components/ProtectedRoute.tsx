import React, { useState } from "react";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { AuthModal } from "./AuthModal";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-purple-950/20 to-black">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-purple-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-purple-950/20 to-black">
        <div className="text-center max-w-md p-8 bg-gradient-to-br from-purple-900/30 to-blue-900/30 border border-purple-500/30 rounded-2xl backdrop-blur-sm">
          <h2 className="text-2xl font-bold text-purple-100 mb-4">Authentication Required</h2>
          <p className="text-gray-300 mb-6">
            Please log in to access this feature. You'll need an account to train models and earn rewards.
          </p>
          <Button
            onClick={() => setAuthModalOpen(true)}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 border border-purple-400/30 shadow-lg shadow-purple-500/20"
          >
            Log In to Continue
          </Button>
          <AuthModal open={authModalOpen} onClose={() => setAuthModalOpen(false)} defaultMode="login" />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

