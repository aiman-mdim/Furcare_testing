import React, { useEffect, useRef, useState } from "react";
import { useApp, PageName } from "../context/AppContext";
import { getTranslation } from "../translations/i18n";
import { authApi } from "../services/auth";

import {
  Heart,
  ShoppingCart,
  User as UserIcon,
  Bot,
  Stethoscope,
  Scissors,
  Hotel,
  Store,
  ShieldCheck,
  Search,
  Crown,
  LayoutDashboard,
  LogOut,
  ChevronDown,
} from "lucide-react";

export const Header: React.FC = () => {
  const {
    language,
    setLanguage,
    activePage,
    setActivePage,
    currentUser,
    setCurrentUser,
    cart,
    setIsAiModalOpen,
    addToast,
  } = useApp();

  // ============================================
  // USER MENU STATE
  // ============================================

  const [isUserMenuOpen, setIsUserMenuOpen] =
    useState(false);

  const userMenuRef = useRef<HTMLDivElement | null>(
    null
  );

  // ============================================
  // CLOSE USER MENU WHEN CLICKING OUTSIDE
  // ============================================

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(
          event.target as Node
        )
      ) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  // ============================================
  // CART COUNT
  // ============================================

  const totalCartCount = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  // ============================================
  // NAVIGATION ITEMS
  // ============================================

  const navItems: {
    id: PageName;
    labelKey: any;
    icon: React.ReactNode;
  }[] = [
    {
      id: "home",
      labelKey: "navHome",
      icon: (
        <Heart className="w-4 h-4 text-pink-500" />
      ),
    },
    {
      id: "adoption",
      labelKey: "navAdoption",
      icon: (
        <Heart className="w-4 h-4 text-rose-500" />
      ),
    },
    {
      id: "vet",
      labelKey: "navVet",
      icon: (
        <Stethoscope className="w-4 h-4 text-blue-500" />
      ),
    },
    {
      id: "grooming",
      labelKey: "navGrooming",
      icon: (
        <Scissors className="w-4 h-4 text-purple-500" />
      ),
    },
    {
      id: "hotel",
      labelKey: "navHotel",
      icon: (
        <Hotel className="w-4 h-4 text-amber-500" />
      ),
    },
    {
      id: "store",
      labelKey: "navStore",
      icon: (
        <Store className="w-4 h-4 text-emerald-500" />
      ),
    },
    {
      id: "vaccines",
      labelKey: "navVaccine",
      icon: (
        <ShieldCheck className="w-4 h-4 text-teal-500" />
      ),
    },
    {
      id: "lostfound",
      labelKey: "navLostFound",
      icon: (
        <Search className="w-4 h-4 text-indigo-500" />
      ),
    },
    {
      id: "premium",
      labelKey: "navPremium",
      icon: (
        <Crown className="w-4 h-4 text-amber-400" />
      ),
    },
  ];

  // ============================================
  // LOGOUT
  // ============================================

  const handleLogout = async () => {
    try {
      // Call backend logout endpoint
      await authApi.logout();

      // Clear user from React context
      setCurrentUser(null);

      // Close user dropdown
      setIsUserMenuOpen(false);

      // Go back to homepage
      setActivePage("home");

      // Show success message
      addToast(
        language === "bn"
          ? "আপনি সফলভাবে লগআউট করেছেন।"
          : "You have been logged out.",
        "success"
      );
    } catch (error) {
      console.error(
        "Logout failed:",
        error
      );

      addToast(
        language === "bn"
          ? "লগআউট ব্যর্থ হয়েছে। আবার চেষ্টা করুন।"
          : "Logout failed. Please try again.",
        "warning"
      );
    }
  };

  // ============================================
  // OPEN DASHBOARD
  // ============================================

  const handleDashboard = () => {
    setActivePage("dashboard");
    setIsUserMenuOpen(false);
  };

  // ============================================
  // OPEN LOGIN
  // ============================================

  const handleLogin = () => {
    setActivePage("login");
  };

  // ============================================
  // UI
  // ============================================

  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ========================================
            TOP HEADER
        ======================================== */}

        <div className="flex items-center justify-between h-20">

          {/* ======================================
              LOGO & BRAND
          ====================================== */}

          <div
            onClick={() =>
              setActivePage("home")
            }
            className="flex items-center gap-3 cursor-pointer group select-none"
            id="brand-logo"
          >
            <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-500 p-0.5 shadow-md group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">

                {/* SVG LOGO */}
                <svg
                  className="w-7 h-7 text-emerald-600 fill-current"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>

              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5">

                <span className="text-2xl font-black tracking-tight text-slate-900 font-display">
                  Fur
                  <span className="text-emerald-600">
                    Care
                  </span>
                </span>

                <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 rounded-md">
                  Smart AI
                </span>

              </div>

              <p className="text-[11px] font-medium text-slate-500 line-clamp-1 hidden sm:block">
                {getTranslation(
                  language,
                  "tagline"
                )}
              </p>
            </div>
          </div>

          {/* ======================================
              RIGHT ACTION BAR
          ====================================== */}

          <div className="flex items-center gap-2 sm:gap-3">

            {/* ====================================
                LANGUAGE SWITCHER
            ==================================== */}

            <div
              className="flex items-center bg-slate-100/90 p-1 rounded-xl border border-slate-200"
              id="language-switcher"
            >
              <button
                onClick={() =>
                  setLanguage("en")
                }
                className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                  language === "en"
                    ? "bg-white text-emerald-700 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
                title="Switch to English"
              >
                <span>🇬🇧</span>

                <span className="hidden md:inline">
                  {getTranslation(
                    language,
                    "langEn"
                  )}
                </span>
              </button>

              <button
                onClick={() =>
                  setLanguage("bn")
                }
                className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                  language === "bn"
                    ? "bg-white text-emerald-700 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
                title="বাংলায় পরিবর্তন করুন"
              >
                <span>🇧🇩</span>

                <span className="hidden md:inline">
                  {getTranslation(
                    language,
                    "langBn"
                  )}
                </span>
              </button>
            </div>

            {/* ====================================
                AI ASSISTANT
            ==================================== */}

            <button
              onClick={() =>
                setIsAiModalOpen(true)
              }
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 rounded-xl transition-all shadow-2xs"
              id="ai-assistant-header-btn"
            >
              <Bot className="w-4 h-4 text-emerald-600 animate-pulse" />

              <span className="hidden sm:inline">
                AI Doctor
              </span>
            </button>

            {/* ====================================
                SHOPPING CART
            ==================================== */}

            <button
              onClick={() =>
                setActivePage("cart")
              }
              className={`relative p-2.5 rounded-xl transition-all border ${
                activePage === "cart"
                  ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                  : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
              }`}
              id="header-cart-btn"
              title="Shopping Cart"
            >
              <ShoppingCart className="w-5 h-5" />

              {totalCartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 bg-rose-500 text-white text-[11px] font-extrabold rounded-full flex items-center justify-center shadow-xs animate-bounce">
                  {totalCartCount}
                </span>
              )}
            </button>

            {/* ====================================
                USER / LOGIN
            ==================================== */}

            {currentUser ? (
              <div
                ref={userMenuRef}
                className="relative"
              >

                {/* USER BUTTON */}

                <button
                  onClick={() =>
                    setIsUserMenuOpen(
                      (prev) => !prev
                    )
                  }
                  className={`flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-xl border transition-all ${
                    activePage === "dashboard"
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                      : "bg-slate-900 text-white border-slate-900 hover:bg-slate-800"
                  }`}
                  id="header-user-dashboard-btn"
                  title="User menu"
                >
                  {/* USER AVATAR */}

                  {currentUser.avatarUrl ? (
                    <img
                      src={
                        currentUser.avatarUrl
                      }
                      alt={
                        currentUser.name
                      }
                      className="w-6 h-6 rounded-full object-cover ring-1 ring-white/50"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                      <UserIcon className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}

                  {/* USER NAME */}

                  <span className="text-xs font-bold truncate max-w-[100px] hidden md:inline">
                    {currentUser.name}
                  </span>

                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform ${
                      isUserMenuOpen
                        ? "rotate-180"
                        : ""
                    }`}
                  />
                </button>

                {/* ==================================
                    USER DROPDOWN
                ================================== */}

                {isUserMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden z-50">

                    {/* USER INFORMATION */}

                    <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">

                      <p className="text-sm font-bold text-slate-900 truncate">
                        {currentUser.name}
                      </p>

                      <p className="text-xs text-slate-500 truncate mt-0.5">
                        {currentUser.email}
                      </p>

                    </div>

                    {/* DASHBOARD */}

                    <button
                      onClick={
                        handleDashboard
                      }
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4" />

                      <span>
                        Dashboard
                      </span>
                    </button>

                    {/* LOGOUT */}

                    <button
                      onClick={
                        handleLogout
                      }
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-colors border-t border-slate-100"
                    >
                      <LogOut className="w-4 h-4" />

                      <span>
                        {language === "bn"
                          ? "লগআউট"
                          : "Logout"}
                      </span>
                    </button>

                  </div>
                )}
              </div>
            ) : (
              /* ==================================
                 LOGIN / SIGNUP
              ================================== */

              <button
                onClick={handleLogin}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all shadow-xs"
                id="header-login-btn"
              >
                <UserIcon className="w-4 h-4" />

                <span>
                  {getTranslation(
                    language,
                    "loginSignup"
                  )}
                </span>
              </button>
            )}

          </div>
        </div>

        {/* ========================================
            CATEGORY NAVIGATION
        ======================================== */}

        <nav
          className="flex items-center gap-1 overflow-x-auto pb-2.5 pt-1 scrollbar-none border-t border-slate-100"
          id="main-nav-bar"
        >
          {navItems.map((item) => {
            const isActive =
              activePage === item.id;

            return (
              <button
                key={item.id}
                onClick={() =>
                  setActivePage(item.id)
                }
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                {item.icon}

                <span>
                  {getTranslation(
                    language,
                    item.labelKey
                  )}
                </span>
              </button>
            );
          })}
        </nav>

      </div>
    </header>
  );
}; 
