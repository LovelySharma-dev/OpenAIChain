import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Loader2, Mail, Lock, User, AlertCircle } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  defaultMode?: "login" | "signup";
}

export function AuthModal({ open, onClose, defaultMode = "login" }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "signup">(defaultMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { login, signup, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === "login") {
      const result = await login(email, password);
      if (result.success) {
        onClose();
        setEmail("");
        setPassword("");
      } else {
        setError(result.error || "Login failed");
      }
    } else {
      const result = await signup(email, password, name || undefined);
      if (result.success) {
        onClose();
        setEmail("");
        setPassword("");
        setName("");
      } else {
        setError(result.error || "Signup failed");
      }
    }
  };

  const switchMode = () => {
    setMode(mode === "login" ? "signup" : "login");
    setError(null);
    setEmail("");
    setPassword("");
    setName("");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-gradient-to-br from-purple-950 via-blue-950 to-purple-950 border-purple-500/30 text-gray-100">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-purple-100">
            {mode === "login" ? "Welcome Back" : "Create Account"}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            {mode === "login"
              ? "Log in to train models and earn OAC tokens"
              : "Sign up to get started with 1000 free OAC tokens"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {mode === "signup" && (
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-300">
                Name (Optional)
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 bg-purple-900/20 border-purple-500/30 text-gray-100 placeholder:text-gray-500"
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-300">
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-10 bg-purple-900/20 border-purple-500/30 text-gray-100 placeholder:text-gray-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-300">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="pl-10 bg-purple-900/20 border-purple-500/30 text-gray-100 placeholder:text-gray-500"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-900/20 border border-red-500/30 text-red-300 text-sm">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 border border-purple-400/30 shadow-lg shadow-purple-500/20 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {mode === "login" ? "Logging in..." : "Creating account..."}
              </>
            ) : (
              mode === "login" ? "Log In" : "Sign Up"
            )}
          </Button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={switchMode}
            className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
          >
            {mode === "login" ? (
              <>Don't have an account? <span className="font-semibold">Sign up</span></>
            ) : (
              <>Already have an account? <span className="font-semibold">Log in</span></>
            )}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

