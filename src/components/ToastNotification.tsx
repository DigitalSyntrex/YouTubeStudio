import React, { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { HardDrive, CheckCircle2, X } from "lucide-react";

export interface ToastData {
  id: number;
  title: string;
  subtitle?: string;
  timestamp?: string;
  type?: "save" | "info" | "success";
}

interface ToastNotificationProps {
  toast: ToastData | null;
  onClose: () => void;
}

export const ToastNotification: React.FC<ToastNotificationProps> = ({ toast, onClose }) => {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 2800);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          key={toast.id}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 15, scale: 0.95 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="fixed bottom-5 right-5 z-[100] max-w-sm pointer-events-auto"
        >
          <div className="bg-[#09090b]/95 border border-emerald-500/30 text-zinc-100 shadow-2xl shadow-emerald-950/30 backdrop-blur-xl rounded-2xl p-3.5 flex items-start gap-3 relative overflow-hidden group">
            {/* Subtle glow ambient background */}
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />

            {/* Icon */}
            <div className="p-2 bg-emerald-500/15 border border-emerald-500/20 rounded-xl text-emerald-400 shrink-0 mt-0.5">
              {toast.type === "info" ? (
                <HardDrive className="w-4 h-4" />
              ) : (
                <CheckCircle2 className="w-4 h-4" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 pr-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-300 tracking-wide uppercase">
                  {toast.title}
                </span>
                {toast.timestamp && (
                  <span className="text-[10px] text-zinc-500 font-mono">
                    {toast.timestamp}
                  </span>
                )}
              </div>
              {toast.subtitle && (
                <p className="text-xs text-zinc-400 mt-0.5 line-clamp-2 leading-relaxed">
                  {toast.subtitle}
                </p>
              )}
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="text-zinc-500 hover:text-zinc-300 p-1 rounded-lg hover:bg-white/5 transition-colors shrink-0"
              title="Dismiss notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            {/* Subtle bottom progress indicator bar */}
            <motion.div
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: 2.8, ease: "linear" }}
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500/50 origin-left"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
