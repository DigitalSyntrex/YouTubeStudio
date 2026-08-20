import React, { useState, useEffect } from "react";
import {
  X,
  Mail,
  Send,
  Copy,
  Check,
  Sparkles,
  MessageSquare,
  User,
  AtSign,
  FileText,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  HelpCircle,
  Bug,
  Lightbulb,
  ThumbsUp,
  Inbox,
  Loader2
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { submitContactMessage } from "../services/contactService";
import { ContactMessageTopic } from "../types";

interface ContactUsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSubject?: string;
}

const QUICK_TOPICS: { id: ContactMessageTopic; label: string; icon: any; prefix: string }[] = [
  { id: "feedback", label: "General Feedback", icon: ThumbsUp, prefix: "[Feedback] " },
  { id: "feature", label: "Feature Request", icon: Lightbulb, prefix: "[Feature Request] " },
  { id: "bug", label: "Bug Report", icon: Bug, prefix: "[Bug Report] " },
  { id: "help", label: "Question / Help", icon: HelpCircle, prefix: "[Support] " },
];

export const ContactUsModal: React.FC<ContactUsModalProps> = ({
  isOpen,
  onClose,
  initialSubject = ""
}) => {
  const { currentUser, userProfile } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<ContactMessageTopic>("general");

  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedDraft, setCopiedDraft] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submittedMessageId, setSubmittedMessageId] = useState<string | null>(null);

  const recipientEmail = "digitalplaygrid@gmail.com";

  // Pre-fill user information if available
  useEffect(() => {
    if (isOpen) {
      const defaultName = userProfile?.displayName || userProfile?.username || "DigitalSyntrex";
      const defaultEmail = currentUser?.email || userProfile?.email || "";
      
      setName(defaultName);
      setEmail(defaultEmail);
      setSubject(initialSubject || "");
      setMessage("");
      setSelectedTopic("general");
      setIsSubmitting(false);
      setSubmitSuccess(false);
      setSubmittedMessageId(null);
    }
  }, [isOpen, userProfile, currentUser, initialSubject]);

  if (!isOpen) return null;

  const handleSelectTopic = (topic: typeof QUICK_TOPICS[0]) => {
    setSelectedTopic(topic.id);
    if (!subject || QUICK_TOPICS.some(t => subject.startsWith(t.prefix))) {
      setSubject(topic.prefix);
    }
  };

  const getFormattedBody = () => {
    return `Hello Digital Play Grid Team,

${message}

--------------------------------------------------
Sender Details:
• Name: ${name || "Anonymous Creator"}
• Email: ${email || "Not specified"}
• Platform: Digital Play Grid Studio
• Sent via: In-App Contact Portal
--------------------------------------------------`;
  };

  // Direct In-App Submission (Direct to Firestore & Admin Inbox)
  const handleDirectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !message.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await submitContactMessage({
        name: name.trim() || "Anonymous Creator",
        email: email.trim(),
        subject: subject.trim() || "Digital Play Grid Inquiry",
        message: message.trim(),
        topic: selectedTopic,
        userId: currentUser?.uid,
        userEmail: currentUser?.email || userProfile?.email,
      });

      if (res.success) {
        setSubmitSuccess(true);
        setSubmittedMessageId(res.messageId);
      }
    } catch (err) {
      console.warn("Direct submission error, falling back to mail client option", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendViaEmailApp = () => {
    const formattedSubject = subject.trim() || "Message from Digital Play Grid User";
    const formattedBody = getFormattedBody();

    const mailtoUrl = `mailto:${recipientEmail}?subject=${encodeURIComponent(
      formattedSubject
    )}&body=${encodeURIComponent(formattedBody)}`;

    window.location.href = mailtoUrl;
  };

  const handleCopyDraft = () => {
    const fullDraft = `To: ${recipientEmail}\nSubject: ${subject || "Digital Play Grid Inquiry"}\n\n${getFormattedBody()}`;
    navigator.clipboard.writeText(fullDraft);
    setCopiedDraft(true);
    setTimeout(() => setCopiedDraft(false), 2500);
  };

  const handleCopyEmailAddress = () => {
    navigator.clipboard.writeText(recipientEmail);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <div
      id="contact-us-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-2xl bg-[#1c273e] border border-blue-500/35 rounded-3xl shadow-2xl shadow-blue-950/80 overflow-hidden text-zinc-100 my-8">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-28 bg-blue-500/15 blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="relative z-10 px-6 py-5 flex items-start justify-between bg-[#162136] border-b border-blue-500/30">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-500 p-0.5 shadow-lg shadow-blue-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-[#141e30] rounded-[14px] flex items-center justify-center">
                <Mail className="w-5 h-5 text-blue-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                  Contact Us
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  Direct In-App Delivery
                </span>
              </div>
              <p className="text-xs text-blue-300/90 font-medium">
                Send messages directly to the Digital Play Grid Admin Inbox
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-[#141e30] hover:bg-white/10 text-zinc-400 hover:text-white transition-all cursor-pointer border border-blue-500/30"
            title="Close Contact Form"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Direct Email Address Pill & Admin Dispatch info */}
        <div className="bg-[#141e30] px-6 py-3 border-b border-blue-500/20 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-zinc-300">
            <span className="text-zinc-400 font-medium">Recipient Inbox:</span>
            <span className="font-mono font-bold text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
              {recipientEmail}
            </span>
          </div>

          <button
            type="button"
            onClick={handleCopyEmailAddress}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-300 hover:text-white transition-colors cursor-pointer"
          >
            {copiedEmail ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Email Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-blue-400" />
                <span>Copy Email Address</span>
              </>
            )}
          </button>
        </div>

        {/* Success Confirmation View */}
        {submitSuccess ? (
          <div className="p-8 text-center space-y-5 bg-[#1c273e]">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <h3 className="text-xl font-black text-white">Message Delivered to Inbox!</h3>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                Thank you, <span className="font-bold text-white">{name}</span>! Your message has been directly saved to the Digital Play Grid Admin Inbox.
              </p>
              {submittedMessageId && (
                <div className="text-[11px] text-zinc-400 font-mono bg-[#141e30] py-1.5 px-3 rounded-lg inline-block border border-blue-500/20">
                  Tracking ID: {submittedMessageId}
                </div>
              )}
            </div>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setSubmitSuccess(false);
                  setMessage("");
                }}
                className="px-4 py-2 rounded-xl bg-[#141e30] hover:bg-white/10 text-blue-300 hover:text-white border border-blue-500/30 text-xs font-bold transition-all cursor-pointer"
              >
                Send Another Message
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-black shadow-md shadow-blue-600/30 cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* Modal Form Body */
          <form onSubmit={handleDirectSubmit} className="relative z-10 p-6 space-y-5 bg-[#1c273e] text-xs sm:text-sm">
            {/* Quick Topic Badges */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-blue-300 uppercase tracking-wider block">
                Select Inquiry Topic
              </label>
              <div className="flex flex-wrap gap-2">
                {QUICK_TOPICS.map((topic) => {
                  const Icon = topic.icon;
                  const isSelected = selectedTopic === topic.id;
                  return (
                    <button
                      key={topic.id}
                      type="button"
                      onClick={() => handleSelectTopic(topic)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                        isSelected
                          ? "bg-blue-600 text-white border-blue-400 shadow-md shadow-blue-600/30"
                          : "bg-[#141e30] text-zinc-300 border-blue-500/20 hover:border-blue-400 hover:text-white"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{topic.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2-Column: User Display Name & Email Address */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Name of User */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-blue-400" />
                  <span>Name of User (Display Name)</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DigitalSyntrex"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#141e30] border border-blue-500/30 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 rounded-xl px-3.5 py-2 text-xs font-semibold text-white placeholder-zinc-500 focus:outline-none transition-all"
                />
              </div>

              {/* User Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                  <AtSign className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Your Email Address</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. yourname@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#141e30] border border-blue-500/30 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 rounded-xl px-3.5 py-2 text-xs font-semibold text-white placeholder-zinc-500 focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Subject */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-amber-400" />
                <span>Subject</span>
              </label>
              <input
                type="text"
                required
                placeholder="What are you emailing about?"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-[#141e30] border border-blue-500/30 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 rounded-xl px-3.5 py-2 text-xs font-semibold text-white placeholder-zinc-500 focus:outline-none transition-all"
              />
            </div>

            {/* Message */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                <span>Message</span>
              </label>
              <textarea
                required
                rows={4}
                placeholder="Type your message, suggestions, questions, or bug details for Digital Play Grid..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-[#141e30] border border-blue-500/30 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 rounded-xl p-3.5 text-xs font-medium text-white placeholder-zinc-500 focus:outline-none transition-all resize-y min-h-[90px]"
              />
            </div>

            {/* Modal Actions */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-blue-500/20">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyDraft}
                  className="px-3 py-2 rounded-xl bg-[#141e30] hover:bg-white/10 text-zinc-300 hover:text-white border border-blue-500/30 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedDraft ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-blue-400" />
                      <span>Copy Draft</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleSendViaEmailApp}
                  title="Open your device's default mail app"
                  className="px-3 py-2 rounded-xl bg-[#141e30] hover:bg-white/10 text-zinc-400 hover:text-blue-300 border border-blue-500/20 text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Use Email App</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-[#141e30] hover:bg-white/10 text-zinc-400 hover:text-white border border-blue-500/20 text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-black text-xs sm:text-sm shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Sending Directly...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-cyan-200" />
                      <span>Send Message (Direct)</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Modal Footer Note */}
        <div className="px-6 py-3 bg-[#162136] border-t border-blue-500/30 flex items-center justify-between text-[11px] text-zinc-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            <span>Digital Play Grid Direct Inbox • Direct database delivery without email client</span>
          </div>
          <span className="text-zinc-500 hidden sm:inline">Protected by DPG Suite</span>
        </div>
      </div>
    </div>
  );
};
