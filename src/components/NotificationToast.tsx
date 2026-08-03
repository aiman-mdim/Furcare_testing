import React from "react";
import { useApp } from "../context/AppContext";
import { CheckCircle2, Info, AlertTriangle, Bell, X } from "lucide-react";

export const NotificationToast: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === "success";
        const isReminder = toast.type === "reminder";
        const isWarning = toast.type === "warning";

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl shadow-xl border backdrop-blur-md transition-all animate-slide-up ${
              isSuccess
                ? "bg-emerald-900/95 text-white border-emerald-700"
                : isReminder
                ? "bg-amber-900/95 text-white border-amber-700"
                : isWarning
                ? "bg-rose-900/95 text-white border-rose-700"
                : "bg-slate-900/95 text-white border-slate-700"
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
              {isReminder && <Bell className="w-5 h-5 text-amber-400 animate-bounce" />}
              {isWarning && <AlertTriangle className="w-5 h-5 text-rose-400" />}
              {!isSuccess && !isReminder && !isWarning && (
                <Info className="w-5 h-5 text-blue-400" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold leading-relaxed">{toast.message}</p>
              {toast.time && <p className="text-[10px] opacity-60 mt-1">{toast.time}</p>}
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-white/60 hover:text-white p-1 rounded-lg hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
