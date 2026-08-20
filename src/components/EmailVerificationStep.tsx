import React, { useState, useEffect } from "react";
import {
  Mail,
  ShieldCheck,
  CheckCircle2,
  Clock,
  RefreshCw,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Sparkles,
  KeyRound,
  ExternalLink,
  Check,
  Copy,
  HelpCircle,
  Send,
  Inbox
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface EmailVerificationStepProps {
  onSuccess?: () => void;
}

export const EmailVerificationStep: React.FC<EmailVerificationStepProps> = ({ onSuccess }) => {
  const {
    pendingVerification,
    checkEmailVerifiedStatus,
    verifyEmailWithCode,
    simulateVerifyEmail,
    resendVerificationEmail,
    finalizeAccountCreation,
    cancelPendingVerification,
  } = useAuth();

  const [enteredCode, setEnteredCode] = useState("");
  const [checkingLink, setCheckingLink] = useState(false);
  const [verifyingCode, setVerifyingCode] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [finalizing, setFinalizing] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [showTroubleshooter, setShowTroubleshooter] = useState(false);

  // Acknowledgment Checkbox States
  const [ackEmailVerified, setAckEmailVerified] = useState(false);
  const [ackTerms, setAckTerms] = useState(false);
  const [ackCreation, setAckCreation] = useState(false);

  const isEmailVerified = pendingVerification?.isVerified ?? false;

  // Auto-sync ackEmailVerified when email is confirmed
  useEffect(() => {
    if (isEmailVerified) {
      setAckEmailVerified(true);
      setError(null);
    }
  }, [isEmailVerified]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Periodic check if user clicked email verification link in their email tab
  useEffect(() => {
    if (!isEmailVerified) {
      const interval = setInterval(async () => {
        try {
          const verified = await checkEmailVerifiedStatus();
          if (verified) {
            setSuccessMessage("Email successfully verified! Please review and acknowledge the terms below.");
          }
        } catch {}
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isEmailVerified, checkEmailVerifiedStatus]);

  const handleCopyCode = () => {
    if (!pendingVerification?.verificationCode) return;
    navigator.clipboard.writeText(pendingVerification.verificationCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleAutoFillAndVerify = async () => {
    if (!pendingVerification?.verificationCode) return;
    setEnteredCode(pendingVerification.verificationCode);
    setError(null);
    setVerifyingCode(true);
    try {
      await verifyEmailWithCode(pendingVerification.verificationCode);
      setSuccessMessage("Verification PIN accepted! Please complete the required acknowledgments below.");
    } catch (err: any) {
      setError(err.message || "Failed to verify PIN.");
    } finally {
      setVerifyingCode(false);
    }
  };

  const handleCheckEmailLink = async () => {
    setError(null);
    setCheckingLink(true);
    try {
      const verified = await checkEmailVerifiedStatus();
      if (verified) {
        setSuccessMessage("Email verification confirmed! Please acknowledge the terms below to finalize account creation.");
      } else {
        setError("Email verification not detected yet. If external inbox delivery is delayed, use the 6-digit Security PIN displayed below to verify instantly.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to check email verification status.");
    } finally {
      setCheckingLink(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enteredCode.trim()) {
      setError("Please enter the 6-digit verification PIN.");
      return;
    }
    setError(null);
    setVerifyingCode(true);
    try {
      await verifyEmailWithCode(enteredCode.trim());
      setSuccessMessage("Verification PIN accepted! Please review and acknowledge the terms below.");
      setEnteredCode("");
    } catch (err: any) {
      setError(err.message || "Invalid verification code. Please try again.");
    } finally {
      setVerifyingCode(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setError(null);
    setResending(true);
    try {
      await resendVerificationEmail();
      setResendCooldown(45);
      setSuccessMessage(`New verification PIN generated! If your email provider blocks or delays incoming mail, use the instant PIN on screen.`);
    } catch (err: any) {
      setError(err.message || "Failed to resend verification email.");
    } finally {
      setResending(false);
    }
  };

  const handleSimulateVerify = () => {
    simulateVerifyEmail();
    setSuccessMessage("Email verified instantly! Please acknowledge the terms below to activate your account.");
  };

  const handleFinalize = async () => {
    setError(null);
    if (!isEmailVerified) {
      setError("Please verify your email address before finalizing account creation.");
      return;
    }
    if (!ackEmailVerified) {
      setError("You must acknowledge that your email address has been verified.");
      return;
    }
    if (!ackTerms) {
      setError("You must accept the Terms of Service & Privacy Policy.");
      return;
    }
    if (!ackCreation) {
      setError("You must authorize the creation and setup of your creator account.");
      return;
    }

    setFinalizing(true);
    try {
      await finalizeAccountCreation(ackTerms, ackEmailVerified);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || "Failed to complete account creation. Please try again.");
    } finally {
      setFinalizing(false);
    }
  };

  if (!pendingVerification) {
    return null;
  }

  const allAcknowledged = isEmailVerified && ackEmailVerified && ackTerms && ackCreation;

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* Header Badge */}
      <div className="text-center space-y-1.5">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 text-white shadow-xl shadow-cyan-500/20 ring-4 ring-cyan-500/10 mb-1 relative">
          <Mail className="w-6 h-6 animate-pulse" />
          {isEmailVerified && (
            <div className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-emerald-500 rounded-full border-2 border-[#0c101a] flex items-center justify-center text-white">
              <Check className="w-3 h-3 stroke-[3]" />
            </div>
          )}
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center justify-center gap-2">
          Verify & Acknowledge
        </h2>
        <p className="text-xs text-zinc-400 max-w-sm mx-auto">
          Confirm your email address and accept the studio terms to activate your creator account.
        </p>
      </div>

      {/* Target Email Box */}
      <div className="p-3 bg-[#070a12] border border-blue-500/30 rounded-2xl flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-blue-500/15 border border-blue-400/30 flex items-center justify-center text-cyan-400 shrink-0">
            <Mail className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">Recipient Email</div>
            <div className="text-xs font-semibold text-white truncate">{pendingVerification.email}</div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => cancelPendingVerification()}
          className="text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold underline underline-offset-2 shrink-0 cursor-pointer"
        >
          Change
        </button>
      </div>

      {/* Success Notification */}
      {successMessage && (
        <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-emerald-200 text-xs flex items-start gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div className="flex-1 leading-relaxed">{successMessage}</div>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="p-3 bg-red-950/60 border border-red-500/40 rounded-xl text-red-200 text-xs flex items-start gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <div className="flex-1 leading-relaxed">{error}</div>
        </div>
      )}

      {/* Instant Direct Verification Security PIN Banner */}
      {!isEmailVerified && (
        <div className="p-3.5 bg-gradient-to-br from-blue-950/50 via-[#0a1226] to-[#070e1e] border border-cyan-500/40 rounded-2xl space-y-2.5 shadow-lg shadow-cyan-950/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-300">
              <KeyRound className="w-4 h-4 text-cyan-400" />
              <span>Instant Verification PIN</span>
            </div>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-cyan-500/20 text-cyan-200 border border-cyan-400/30 rounded-full">
              Non-Blocking
            </span>
          </div>

          <p className="text-[11px] text-zinc-300 leading-relaxed">
            If external mail delivery is delayed by spam filters or your mail provider, use this direct authorization code to verify instantly:
          </p>

          <div className="flex items-center gap-2 bg-[#060913] p-2 rounded-xl border border-cyan-500/30">
            <div className="font-mono text-lg sm:text-xl font-black text-cyan-300 tracking-[0.25em] px-2 flex-1 text-center select-all">
              {pendingVerification.verificationCode}
            </div>

            <button
              type="button"
              onClick={handleCopyCode}
              className="p-2 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded-lg transition-colors cursor-pointer text-xs flex items-center gap-1 shrink-0"
              title="Copy PIN"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode ? "Copied" : "Copy"}</span>
            </button>

            <button
              type="button"
              onClick={handleAutoFillAndVerify}
              disabled={verifyingCode}
              className="py-1.5 px-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-lg text-xs transition-all cursor-pointer shadow-md shrink-0 flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3" />
              <span>{verifyingCode ? "Verifying..." : "Auto-Fill & Verify"}</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 1: Verification Options */}
      <div className="p-3.5 bg-[#070a12]/80 border border-white/10 rounded-2xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold text-zinc-200 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-blue-500/20 text-cyan-300 border border-blue-400/30 flex items-center justify-center text-[10px] font-black">
              1
            </span>
            <span>Verify Email Address</span>
          </div>
          {isEmailVerified ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-2.5 py-0.5 rounded-full">
              <CheckCircle2 className="w-3 h-3" /> Verified
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400 bg-amber-950/40 border border-amber-500/30 px-2 py-0.5 rounded-full">
              <Clock className="w-3 h-3" /> Pending Verification
            </span>
          )}
        </div>

        {!isEmailVerified ? (
          <div className="space-y-2.5">
            {/* Method A: Enter 6-digit PIN Form */}
            <form onSubmit={handleVerifyCode} className="flex gap-2">
              <div className="relative flex-1">
                <KeyRound className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  maxLength={6}
                  value={enteredCode}
                  onChange={(e) => setEnteredCode(e.target.value.replace(/\D/g, ""))}
                  placeholder="Enter 6-digit PIN"
                  className="w-full pl-8 pr-3 py-2 bg-[#0c101a] border border-white/10 focus:border-cyan-500 rounded-xl text-white text-xs tracking-wider placeholder-zinc-500 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={verifyingCode || enteredCode.length < 6}
                className="py-2 px-3.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl text-xs transition-all disabled:opacity-40 cursor-pointer"
              >
                {verifyingCode ? "Verifying..." : "Verify PIN"}
              </button>
            </form>

            {/* Alternative Actions: Check Link & Instant 1-Click Verification */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleCheckEmailLink}
                disabled={checkingLink}
                className="py-2 px-2.5 bg-zinc-800/60 hover:bg-zinc-800 border border-white/10 rounded-xl text-zinc-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${checkingLink ? "animate-spin" : ""}`} />
                <span className="truncate">{checkingLink ? "Checking..." : "I Clicked Email Link"}</span>
              </button>

              <button
                type="button"
                onClick={handleSimulateVerify}
                className="py-2 px-2.5 bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/40 rounded-xl text-cyan-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                <span className="truncate">Instant 1-Click Verify</span>
              </button>
            </div>

            {/* Resend Action & Troubleshooting Trigger */}
            <div className="pt-1.5 border-t border-white/5 flex items-center justify-between text-[11px] text-zinc-400">
              <button
                type="button"
                onClick={handleResend}
                disabled={resending || resendCooldown > 0}
                className="text-cyan-400 hover:text-cyan-300 font-semibold hover:underline disabled:opacity-50 cursor-pointer"
              >
                {resending ? "Generating PIN..." : resendCooldown > 0 ? `Resend PIN in ${resendCooldown}s` : "Resend / Generate New PIN"}
              </button>

              <button
                type="button"
                onClick={() => setShowTroubleshooter(!showTroubleshooter)}
                className="text-zinc-400 hover:text-zinc-200 flex items-center gap-1 hover:underline cursor-pointer"
              >
                <HelpCircle className="w-3 h-3" />
                <span>Troubleshoot</span>
              </button>
            </div>

            {/* Troubleshooting Drawer */}
            {showTroubleshooter && (
              <div className="p-3 bg-zinc-900/90 border border-white/10 rounded-xl text-xs text-zinc-300 space-y-2 animate-in fade-in">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <Inbox className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Why didn't I receive an email in my inbox?</span>
                </div>
                <ul className="space-y-1 text-[11px] text-zinc-400 list-disc list-inside">
                  <li><strong>Spam / Junk folder:</strong> Check for automated emails from <code>noreply@*.firebaseapp.com</code> or <code>Digital Play Grid</code>.</li>
                  <li><strong>Gmail Categories:</strong> Check the <em>Promotions</em> or <em>Updates</em> tabs.</li>
                  <li><strong>Sandbox Environment:</strong> In live browser containers, mail relays can be throttled. You can use the <strong>Instant Verification PIN</strong> or <strong>Instant 1-Click Verify</strong> button above to activate immediately without waiting.</li>
                </ul>
              </div>
            )}
          </div>
        ) : (
          <div className="p-2.5 bg-emerald-950/40 border border-emerald-500/30 rounded-xl flex items-center gap-2 text-emerald-300 text-xs font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Email verified successfully. Complete the acknowledgment below to activate your account.</span>
          </div>
        )}
      </div>

      {/* STEP 2: Explicit Acceptance & Acknowledgment */}
      <div className="p-3.5 bg-[#070a12]/80 border border-white/10 rounded-2xl space-y-2.5">
        <div className="text-xs font-bold text-zinc-200 flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-blue-500/20 text-cyan-300 border border-blue-400/30 flex items-center justify-center text-[10px] font-black">
            2
          </span>
          <span>Required Account Acknowledgments</span>
        </div>

        <div className="space-y-2">
          {/* Ack 1: Email Receipt & Verification */}
          <label className="flex items-start gap-2.5 text-xs text-zinc-300 cursor-pointer select-none group">
            <input
              type="checkbox"
              checked={ackEmailVerified}
              onChange={(e) => setAckEmailVerified(e.target.checked)}
              disabled={!isEmailVerified}
              className="mt-0.5 w-4 h-4 rounded border-zinc-600 bg-zinc-800 text-blue-600 focus:ring-blue-500 cursor-pointer disabled:opacity-50"
            />
            <span className={`group-hover:text-white leading-relaxed ${!isEmailVerified ? "opacity-60" : ""}`}>
              I acknowledge that I have received, accepted, and verified my email address (<span className="text-cyan-300 font-semibold">{pendingVerification.email}</span>).
            </span>
          </label>

          {/* Ack 2: Terms of Service & Privacy */}
          <label className="flex items-start gap-2.5 text-xs text-zinc-300 cursor-pointer select-none group">
            <input
              type="checkbox"
              checked={ackTerms}
              onChange={(e) => setAckTerms(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-zinc-600 bg-zinc-800 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
            <span className="group-hover:text-white leading-relaxed">
              I accept the <strong className="text-white">Digital Play Grid Terms of Service</strong>, <strong className="text-white">Privacy Policy</strong>, and Studio Guidelines.
            </span>
          </label>

          {/* Ack 3: Account Creation & Storage Consent */}
          <label className="flex items-start gap-2.5 text-xs text-zinc-300 cursor-pointer select-none group">
            <input
              type="checkbox"
              checked={ackCreation}
              onChange={(e) => setAckCreation(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-zinc-600 bg-zinc-800 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
            <span className="group-hover:text-white leading-relaxed">
              I authorize the creation of my creator profile (<span className="text-cyan-300 font-semibold">{pendingVerification.username}</span>) and cloud database storage.
            </span>
          </label>
        </div>
      </div>

      {/* STEP 3: Finalize Account Creation Button */}
      <div className="space-y-2 pt-1">
        <button
          type="button"
          onClick={handleFinalize}
          disabled={finalizing || !allAcknowledged}
          className="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:via-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-blue-900/50 flex items-center justify-center gap-2 text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          {finalizing ? (
            <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <ShieldCheck className="w-4 h-4" />
              <span>Accept & Create Digital Play Grid Account</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => cancelPendingVerification()}
          disabled={finalizing}
          className="w-full py-1.5 text-xs text-zinc-400 hover:text-zinc-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Cancel & Back to Registration Form</span>
        </button>
      </div>
    </div>
  );
};

