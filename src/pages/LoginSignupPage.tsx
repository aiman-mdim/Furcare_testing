import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { getTranslation } from "../translations/i18n";
import { UserRole } from "../types";
import {
  User,
  Lock,
  Mail,
  ShieldCheck,
  Stethoscope,
  Scissors,
  Home,
  CheckCircle2,
} from "lucide-react";

export const LoginSignupPage: React.FC = () => {
  const { language, setCurrentUser, setActivePage, addToast } = useApp();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [role, setRole] = useState<UserRole>("owner");
  const [name, setName] = useState("Tanvir Rahman");
  const [email, setEmail] = useState("tanvir@furcare.bd");
  const [phone, setPhone] = useState("+880 1711-223344");
  const [city, setCity] = useState("Dhaka");
  const [password, setPassword] = useState("••••••••");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setCurrentUser({
      id: "USR-" + Math.floor(100 + Math.random() * 900),
      name,
      email,
      phone,
      role,
      city,
    });

    addToast(
      language === "bn"
        ? `স্বাগতম ${name}! ${role.toUpperCase()} হিসেবে লগইন হয়েছে।`
        : `Welcome back, ${name}! Logged in as ${role.toUpperCase()}.`,
      "success"
    );

    setActivePage("dashboard");
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-2xl border border-slate-200 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black text-xl font-display mx-auto">
            FC
          </div>
          <h1 className="text-2xl font-black text-slate-900 font-display">
            {mode === "login" ? getTranslation(language, "loginTitle") : "Create FurCare Account"}
          </h1>
          <p className="text-xs text-slate-500">
            Smart Pet Healthcare & Services Portal Bangladesh
          </p>
        </div>

        {/* Role Selector */}
        <div className="space-y-1.5 text-xs">
          <label className="font-bold text-slate-700 block">Select Account Role:</label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: "owner", label: "Pet Owner", icon: <User className="w-3.5 h-3.5" /> },
              { id: "vet", label: "Vet Doctor", icon: <Stethoscope className="w-3.5 h-3.5" /> },
              { id: "groomer", label: "Groomer", icon: <Scissors className="w-3.5 h-3.5" /> },
              { id: "shelter", label: "Shelter / Hotel", icon: <Home className="w-3.5 h-3.5" /> },
            ].map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setRole(r.id as any)}
                className={`p-2.5 rounded-xl font-bold border flex items-center justify-center gap-1.5 transition-all ${
                  role === r.id
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                {r.icon}
                <span>{r.label}</span>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          {mode === "signup" && (
            <div>
              <label className="font-bold text-slate-700 block mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          )}

          <div>
            <label className="font-bold text-slate-700 block mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all"
          >
            {mode === "login" ? getTranslation(language, "loginBtn") : "Register Account"}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100">
          <button
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
            className="text-xs text-emerald-700 font-bold hover:underline"
          >
            {mode === "login" ? "Don't have an account? Sign Up" : "Already registered? Sign In"}
          </button>
        </div>

      </div>
    </div>
  );
};
