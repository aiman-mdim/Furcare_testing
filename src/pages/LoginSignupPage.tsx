import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { authApi } from "../services/auth";
import { UserRole } from "../types";

export const LoginSignupPage: React.FC = () => {
  const {
    language,
    setCurrentUser,
    setActivePage,
    addToast,
  } = useApp();

  // ============================================
  // LOGIN / SIGNUP MODE
  // ============================================

  const [mode, setMode] =
    useState<"login" | "signup">("login");

  // ============================================
  // USER ROLE
  // ============================================
  //
  // IMPORTANT:
  // Use "pet_owner" instead of "owner".
  // This must match the UserRole type in types.ts.
  // ============================================

  const [role, setRole] =
    useState<UserRole>("pet_owner");

  // ============================================
  // FORM STATES
  // ============================================

  const [name, setName] = useState("");

  const [email, setEmail] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [city, setCity] =
    useState("");

  const [password, setPassword] =
    useState("");

  // ============================================
  // UI STATES
  // ============================================

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  // ============================================
  // FORM SUBMIT
  // ============================================

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      let result;

      // ========================================
      // LOGIN
      // ========================================

      if (mode === "login") {
        result = await authApi.login(
          email.trim(),
          password
        );
      }

      // ========================================
      // SIGNUP
      // ========================================

      else {
        result = await authApi.register({
          name: name.trim(),
          email: email.trim(),
          password,
          phone: phone.trim(),
          city: city.trim(),
          role,
        });
      }

      // ========================================
      // SET AUTHENTICATED USER
      // ========================================

      setCurrentUser(result.user);

      // ========================================
      // SUCCESS MESSAGE
      // ========================================

      addToast(
        mode === "login"
          ? `Welcome back, ${result.user.name}!`
          : `Welcome to FurCare, ${result.user.name}!`,
        "success"
      );

      // ========================================
      // GO TO DASHBOARD
      // ========================================

      setActivePage("dashboard");
    } catch (err: any) {
      console.error(
        "Authentication error:",
        err
      );

      const message =
        err?.message ||
        "Authentication failed. Please try again.";

      setError(message);

      addToast(
        message,
        "warning"
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // SWITCH LOGIN / SIGNUP
  // ============================================

  const handleModeSwitch = () => {
    setMode((currentMode) =>
      currentMode === "login"
        ? "signup"
        : "login"
    );

    setError("");
  };

  // ============================================
  // UI
  // ============================================

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 flex items-center justify-center">

      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-2xl border border-slate-200">

        {/* ======================================
            HEADER
        ====================================== */}

        <div className="text-center mb-8">

          <div className="w-14 h-14 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-black text-xl mx-auto mb-4">
            FC
          </div>

          <h1 className="text-2xl font-black text-slate-900">
            {mode === "login"
              ? "Welcome Back"
              : "Create FurCare Account"}
          </h1>

          <p className="text-sm text-slate-500 mt-2">
            Smart Pet Healthcare & Services
          </p>

        </div>

        {/* ======================================
            ERROR MESSAGE
        ====================================== */}

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* ======================================
            ROLE
        ====================================== */}

        <div className="mb-5">

          <label className="block text-sm font-bold mb-2">
            Account Role
          </label>

          <select
            value={role}
            onChange={(e) =>
              setRole(
                e.target.value as UserRole
              )
            }
            disabled={loading}
            className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 disabled:opacity-50"
          >

            <option value="pet_owner">
              Pet Owner
            </option>

            <option value="vet">
              Vet Doctor
            </option>

            <option value="groomer">
              Groomer
            </option>

            <option value="shelter">
              Shelter / Hotel
            </option>

          </select>

        </div>

        {/* ======================================
            FORM
        ====================================== */}

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          {/* ====================================
              NAME
          ==================================== */}

          {mode === "signup" && (
            <div>

              <label className="block text-sm font-bold mb-1">
                Full Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                required
                minLength={2}
                disabled={loading}
                autoComplete="name"
                className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 disabled:opacity-50"
                placeholder="Your full name"
              />

            </div>
          )}

          {/* ====================================
              EMAIL
          ==================================== */}

          <div>

            <label className="block text-sm font-bold mb-1">
              Email Address
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
              disabled={loading}
              autoComplete="email"
              className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 disabled:opacity-50"
              placeholder="you@example.com"
            />

          </div>

          {/* ====================================
              PHONE
          ==================================== */}

          {mode === "signup" && (
            <div>

              <label className="block text-sm font-bold mb-1">
                Phone
              </label>

              <input
                type="tel"
                value={phone}
                onChange={(e) =>
                  setPhone(e.target.value)
                }
                disabled={loading}
                autoComplete="tel"
                className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 disabled:opacity-50"
                placeholder="+880..."
              />

            </div>
          )}

          {/* ====================================
              CITY
          ==================================== */}

          {mode === "signup" && (
            <div>

              <label className="block text-sm font-bold mb-1">
                City
              </label>

              <input
                type="text"
                value={city}
                onChange={(e) =>
                  setCity(e.target.value)
                }
                disabled={loading}
                autoComplete="address-level2"
                className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 disabled:opacity-50"
                placeholder="Chattogram"
              />

            </div>
          )}

          {/* ====================================
              PASSWORD
          ==================================== */}

          <div>

            <label className="block text-sm font-bold mb-1">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
              minLength={8}
              disabled={loading}
              autoComplete={
                mode === "login"
                  ? "current-password"
                  : "new-password"
              }
              className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 disabled:opacity-50"
              placeholder="Minimum 8 characters"
            />

          </div>

          {/* ====================================
              SUBMIT BUTTON
          ==================================== */}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-colors"
          >

            {loading
              ? "Please wait..."
              : mode === "login"
              ? "Sign In"
              : "Create Account"}

          </button>

        </form>

        {/* ======================================
            SWITCH LOGIN / SIGNUP
        ====================================== */}

        <div className="text-center mt-6 pt-5 border-t border-slate-200">

          <button
            type="button"
            onClick={handleModeSwitch}
            disabled={loading}
            className="text-emerald-700 hover:text-emerald-800 font-bold text-sm disabled:opacity-50"
          >

            {mode === "login"
              ? "Don't have an account? Sign Up"
              : "Already have an account? Sign In"}

          </button>

        </div>

      </div>

    </div>
  );
}; 
