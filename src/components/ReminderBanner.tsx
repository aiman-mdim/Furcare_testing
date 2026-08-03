import React from "react";
import { useApp } from "../context/AppContext";
import { getTranslation } from "../translations/i18n";
import { Bell, Clock, AlertTriangle, ArrowRight } from "lucide-react";

export const ReminderBanner: React.FC = () => {
  const { language, appointments, setActivePage } = useApp();

  const scheduledAppt = appointments.find((a) => a.status === "scheduled");

  if (!scheduledAppt) return null;

  return (
    <div className="bg-amber-50 border-b border-amber-200/80 px-4 py-2.5 text-xs text-amber-900 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="p-1 rounded-lg bg-amber-200/80 text-amber-800 animate-pulse">
            <Bell className="w-4 h-4" />
          </span>
          <p className="font-medium">
            <strong className="font-bold">
              {language === "bn" ? "⏰ রিয়েল-টাইম রিমাইন্ডার:" : "⏰ Real-time Appointment Reminder:"}
            </strong>{" "}
            {language === "bn"
              ? `আজ ${scheduledAppt.time}-এ ${scheduledAppt.petName}-এর জন্য ${scheduledAppt.vetName}-এর সাথে অ্যাপয়েন্টমেন্ট আছে (১ ঘন্টা বাকি)`
              : `Upcoming appointment for ${scheduledAppt.petName} with ${scheduledAppt.vetName} at ${scheduledAppt.time} (${scheduledAppt.area})`}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-200/60 text-amber-900 text-[11px] font-semibold">
            <Clock className="w-3 h-3" />
            <span>1 hr alert</span>
          </span>
          <button
            onClick={() => setActivePage("vet")}
            className="flex items-center gap-1 font-bold text-amber-900 hover:text-amber-950 underline underline-offset-2"
          >
            <span>{language === "bn" ? "বিস্তারিত দেখুন" : "View Details"}</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
