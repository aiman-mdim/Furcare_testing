import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { getTranslation } from "../translations/i18n";
import { mockPetPlaces } from "../data/mockData";
import { Product } from "../types";
import {
  Crown,
  Sparkles,
  PhoneCall,
  MapPin,
  CheckCircle2,
  HeartHandshake,
  ShieldCheck,
  Zap,
  ArrowRight,
  Compass,
  Star,
} from "lucide-react";

export const PremiumFeaturesPage: React.FC = () => {
  const { language, addToCart, setActivePage } = useApp();

  const [activeTab, setActiveTab] = useState<"walking" | "emergency" | "breed" | "map">("map");
  const [selectedPlaceType, setSelectedPlaceType] = useState<string>("all");

  const filteredPlaces = mockPetPlaces.filter(
    (p) => selectedPlaceType === "all" || p.type === selectedPlaceType
  );

  const handleContinueToCart = () => {
    const premiumProduct: Product = {
      product_id: "PRM-500",
      nameEn: "FurCare VIP Extra Premium Membership (1 Month)",
      nameBn: "FurCare ভিআইপি এক্সট্রা প্রিমিয়াম মেম্বারশিপ (১ মাস)",
      category: "healthcare",
      targetSpecies: "all",
      priceTk: 500,
      rating: 5.0,
      reviewsCount: 320,
      image: "https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&w=800&q=80",
      descriptionEn: "Includes Pet Walking, 24/7 Emergency Ambulance, Genetic Breed Matching, and Full Pet-Friendly Places Map access.",
      descriptionBn: "পেট ওয়াকিং, ২৪/৭ জরুরি অ্যাম্বুলেন্স, জিনেটিক ব্রিড ম্যাচিং এবং ইন্টারেক্টিভ ম্যাপ সুবিধা।",
      stock: 999,
    };

    addToCart(premiumProduct, 1, "premium_plan");
    setActivePage("cart");
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 space-y-12">
      
      {/* Catchy Hero Presentation */}
      <div className="max-w-4xl mx-auto text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-400 text-slate-950 rounded-full font-black text-xs uppercase tracking-wider shadow-sm animate-bounce">
          <Crown className="w-4 h-4 fill-current" />
          <span>VIP Elite Healthcare Package</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 font-display tracking-tight leading-tight">
          {getTranslation(language, "premiumTitle")}
        </h1>

        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          {getTranslation(language, "premiumSub")}
        </p>

        <div className="pt-2">
          <button
            onClick={handleContinueToCart}
            className="px-8 py-4 bg-gradient-to-r from-amber-500 via-emerald-600 to-teal-600 hover:from-amber-600 hover:to-teal-700 text-white font-black text-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-0.5 flex items-center gap-2 mx-auto"
          >
            <span>{getTranslation(language, "subscribePremium")}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Premium Services Interactive Showcase Tabs */}
      <div className="max-w-5xl mx-auto bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 space-y-8">
        
        {/* Tab Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          {[
            { id: "map", label: "Pet-Friendly Map", icon: <Compass className="w-4 h-4" /> },
            { id: "walking", label: "Pet Walking Service", icon: <Zap className="w-4 h-4 text-emerald-600" /> },
            { id: "emergency", label: "24/7 Emergency Vet", icon: <PhoneCall className="w-4 h-4 text-rose-600" /> },
            { id: "breed", label: "Breed Matchmaker", icon: <HeartHandshake className="w-4 h-4 text-purple-600" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`p-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 border transition-all ${
                activeTab === tab.id
                  ? "bg-slate-900 text-white border-slate-900 shadow-md"
                  : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content Display */}
        {activeTab === "map" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl font-black text-slate-900 font-display">
                  Interactive Pet-Friendly Spots Map in Bangladesh
                </h3>
                <p className="text-xs text-slate-500">
                  Discover parks, clinics, pet cafes, and grooming centers in Dhaka, Chattogram & Sylhet.
                </p>
              </div>

              {/* Filter Pills */}
              <div className="flex items-center gap-1.5 text-xs font-bold">
                {["all", "park", "cafe", "clinic"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setSelectedPlaceType(t)}
                    className={`px-3 py-1.5 rounded-xl capitalize transition-colors ${
                      selectedPlaceType === t ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Simulated Interactive Map Display */}
            <div className="relative h-80 rounded-3xl overflow-hidden bg-slate-900 text-white p-6 border border-slate-700 flex flex-col justify-between">
              <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]" />

              <div className="relative z-10 flex items-center justify-between">
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-xs font-bold">
                  ● GPS Live Map Active (Bangladesh)
                </span>
                <span className="text-xs text-slate-400 font-mono">23.7461° N, 90.3742° E</span>
              </div>

              {/* Pins Grid */}
              <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
                {filteredPlaces.map((place) => (
                  <div
                    key={place.id}
                    className="p-3.5 bg-slate-800/90 border border-slate-700 rounded-2xl backdrop-blur-md space-y-1 text-xs"
                  >
                    <div className="flex items-center justify-between font-bold text-white">
                      <span className="truncate">{place.name}</span>
                      <span className="text-amber-400 font-mono">★ {place.rating}</span>
                    </div>
                    <p className="text-[11px] text-slate-300 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      <span className="truncate">{place.address}</span>
                    </p>
                  </div>
                ))}
              </div>

              <p className="relative z-10 text-[10px] text-slate-400 text-center">
                Upgrade to ৳500 Premium Membership to unlock turn-by-turn navigation & exclusive discounts at pet cafes.
              </p>
            </div>
          </div>
        )}

        {activeTab === "walking" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <img
              src="https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&w=800&q=80"
              alt="Pet Walking"
              className="rounded-3xl h-64 w-full object-cover"
            />
            <div className="space-y-3 text-xs text-slate-700">
              <h3 className="text-xl font-black text-slate-900 font-display">
                Doorstep Professional Pet Walking
              </h3>
              <p className="leading-relaxed">
                Background-checked, trained pet walkers take your dogs or active cats for daily exercise, leash training, and outdoor happiness.
              </p>
              <ul className="space-y-1.5 font-semibold">
                <li className="flex items-center gap-2 text-emerald-700">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Live GPS Tracking during walks</span>
                </li>
                <li className="flex items-center gap-2 text-emerald-700">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>30-min or 60-min sessions on demand</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === "emergency" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <img
              src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80"
              alt="Emergency Vet"
              className="rounded-3xl h-64 w-full object-cover"
            />
            <div className="space-y-3 text-xs text-slate-700">
              <h3 className="text-xl font-black text-slate-900 font-display">
                24/7 Emergency Vet Hotline & Ambulance
              </h3>
              <p className="leading-relaxed">
                Direct phone & video access to senior surgeons in Bangladesh. Oxygen-equipped ambulance dispatch for critical pet care.
              </p>
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-rose-900 font-bold">
                Emergency Hotline: +880 1700-FURCARE
              </div>
            </div>
          </div>
        )}

        {activeTab === "breed" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <img
              src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80"
              alt="Breed Matching"
              className="rounded-3xl h-64 w-full object-cover"
            />
            <div className="space-y-3 text-xs text-slate-700">
              <h3 className="text-xl font-black text-slate-900 font-display">
                Genetic Breed Matching & Compatibility
              </h3>
              <p className="leading-relaxed">
                Connect with verified pedigree pet owners for breeding, health compatibility analysis, and genetic disease screening.
              </p>
            </div>
          </div>
        )}

        {/* Benefits Checklist & Final CTA */}
        <div className="pt-6 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">What's included in ৳500 / month:</p>
            <div className="flex flex-wrap gap-2 text-xs font-bold text-slate-800">
              {(Array.isArray(getTranslation(language, "premiumBenefits"))
                ? (getTranslation(language, "premiumBenefits") as unknown as string[])
                : []
              ).map((b, i) => (
                <span key={i} className="px-3 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-xl">
                  ✓ {b}
                </span>
              ))}
            </div>
          </div>

          <button
            onClick={handleContinueToCart}
            className="shrink-0 px-8 py-3.5 bg-gradient-to-r from-amber-500 to-emerald-600 hover:from-amber-600 hover:to-emerald-700 text-white font-black text-xs rounded-2xl shadow-lg transition-all"
          >
            {getTranslation(language, "subscribePremium")}
          </button>
        </div>

      </div>

    </div>
  );
};
