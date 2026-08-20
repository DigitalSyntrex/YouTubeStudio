import React, { useState } from "react";
import {
  Gamepad2,
  Lock,
  User,
  Mail,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Eye,
  EyeOff,
  Tv,
  Film,
  Layers,
  Info
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { TopStudioLogoBanner } from "./TopStudioLogoBanner";
import { AboutModal } from "./AboutModal";
import { EmailVerificationStep } from "./EmailVerificationStep";

interface AuthModalProps {
  initialMode?: "login" | "register";
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  initialMode = "login",
  onSuccess,
}) => {
  const { login, register, initiateRegistrationWithVerification, pendingVerification } = useAuth();
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAboutModal, setShowAboutModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim()) {
      setError("Please enter a username.");
      return;
    }

    if (mode === "register") {
      if (!email.trim() || !email.includes("@")) {
        setError("Please enter a valid email address to receive your account verification link.");
        return;
      }
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (mode === "register" && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      if (mode === "login") {
        await login(username, password);
        if (onSuccess) onSuccess();
      } else {
        await initiateRegistrationWithVerification(username, email, password, displayName || username);
        // UI will now automatically transition to EmailVerificationStep
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      let msg = err.message || "Failed to authenticate.";
      if (err.code === "auth/invalid-credential" || err.code === "auth/wrong-password" || err.code === "auth/user-not-found") {
        msg = "Invalid username or password. Please check your credentials.";
      } else if (err.code === "auth/email-already-in-use") {
        msg = "This username or email is already registered. Please login instead.";
      } else if (err.code === "auth/weak-password") {
        msg = "Password is too weak. Please use at least 6 characters.";
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      await login("creator_demo", "demo123456");
      if (onSuccess) onSuccess();
    } catch (err: any) {
      try {
        await register("creator_demo", "creator_demo@playthrough.app", "demo123456", "Demo Creator");
        if (onSuccess) onSuccess();
      } catch (regErr: any) {
        setError(regErr.message || "Demo login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] flex flex-col items-center justify-between relative overflow-hidden">
      {/* Top Banner on Auth screen */}
      <TopStudioLogoBanner />

      {/* Ambient background glows */}
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-cyan-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="my-auto w-full max-w-md p-4 z-10">
        <div className="w-full bg-[#0c101a]/95 border border-blue-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-blue-950/60 backdrop-blur-2xl relative">
          
          {/* If there's an active pending email verification session, show the verification step */}
          {pendingVerification ? (
            <EmailVerificationStep onSuccess={onSuccess} />
          ) : (
            <>
              {/* App Logo & Header */}
              <div className="text-center space-y-2 mb-6">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 ring-4 ring-blue-500/10 mb-2">
                  <Gamepad2 className="w-7 h-7" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center justify-center gap-2">
                  Digital Play Grid
                  <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-blue-500/20 text-cyan-300 border border-blue-400/30">
                    Cloud
                  </span>
                </h1>
                <p className="text-xs sm:text-sm text-zinc-400">
                  {mode === "login"
                    ? "Sign in to access your personal playthrough dashboard"
                    : "Create an account to start managing your gaming series"}
                </p>
              </div>

              {/* Mode Toggle Tabs */}
              <div className="grid grid-cols-2 p-1 bg-[#070a12] border border-white/10 rounded-xl mb-6">
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setError(null);
                  }}
                  className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    mode === "login"
                      ? "bg-blue-600 text-white shadow-md shadow-blue-900/50"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode("register");
                    setError(null);
                  }}
                  className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    mode === "register"
                      ? "bg-blue-600 text-white shadow-md shadow-blue-900/50"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  Create Account
                </button>
              </div>

              {/* Error Alert */}
              {error && (
                <div className="mb-5 p-3.5 bg-red-950/60 border border-red-500/40 rounded-xl text-red-200 text-xs flex items-start gap-2.5 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <div className="flex-1">{error}</div>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    Username <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="e.g. gamer_pro"
                      className="w-full pl-10 pr-4 py-2.5 bg-[#070a12] border border-white/10 focus:border-blue-500 rounded-xl text-white text-sm placeholder-zinc-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {mode === "register" && (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                        Display Name (Optional)
                      </label>
                      <div className="relative">
                        <Sparkles className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                          placeholder="e.g. Alexander Plays"
                          className="w-full pl-10 pr-4 py-2.5 bg-[#070a12] border border-white/10 focus:border-blue-500 rounded-xl text-white text-sm placeholder-zinc-500 focus:outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-semibold text-zinc-300">
                          Email Address <span className="text-red-400">*</span>
                        </label>
                        <span className="text-[10px] text-cyan-400 font-medium">Verification required</span>
                      </div>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@example.com"
                          className="w-full pl-10 pr-4 py-2.5 bg-[#070a12] border border-white/10 focus:border-blue-500 rounded-xl text-white text-sm placeholder-zinc-500 focus:outline-none transition-colors"
                        />
                      </div>
                      <p className="mt-1 text-[11px] text-zinc-400">
                        A verification email with confirmation link and PIN will be sent to this email address.
                      </p>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    Password <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-2.5 bg-[#070a12] border border-white/10 focus:border-blue-500 rounded-xl text-white text-sm placeholder-zinc-500 focus:outline-none transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {mode === "register" && (
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                      Confirm Password <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-4 py-2.5 bg-[#070a12] border border-white/10 focus:border-blue-500 rounded-xl text-white text-sm placeholder-zinc-500 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-blue-900/50 flex items-center justify-center gap-2 text-sm transition-all disabled:opacity-50 cursor-pointer"
                >
                  {loading ? (
                    <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      {mode === "login" ? (
                        <>
                          <span>Sign In to Studio</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      ) : (
                        <>
                          <Mail className="w-4 h-4" />
                          <span>Send Verification Email & Continue</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </>
                  )}
                </button>
              </form>

              {/* Fast Demo Login */}
              <div className="mt-5 pt-4 border-t border-white/10 flex flex-col items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleDemoLogin}
                  disabled={loading}
                  className="text-xs text-cyan-300 hover:text-cyan-200 font-semibold flex items-center gap-1.5 py-1 px-3 rounded-lg hover:bg-cyan-950/50 border border-cyan-500/20 transition-all cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Quick Demo Login (Instant Creator Access)
                </button>
                <div className="flex items-center gap-3 text-[11px] text-zinc-400">
                  <div className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Multi-User Cloud Sync</span>
                  </div>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={() => setShowAboutModal(true)}
                    className="text-cyan-400 hover:text-cyan-300 font-bold hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <Info className="w-3 h-3" />
                    <span>About Digital Play Grid</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* About Modal */}
      <AboutModal
        isOpen={showAboutModal}
        onClose={() => setShowAboutModal(false)}
      />
    </div>
  );
};



