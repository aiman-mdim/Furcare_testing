import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { getTranslation } from "../translations/i18n";
import { mockGroomingServices } from "../data/mockData";
import { GroomingService, Product } from "../types";
import {
  Scissors,
  Search,
  Home,
  Building,
  CheckCircle2,
  ShoppingCart,
  Clock,
  Sparkles,
  MapPin,
} from "lucide-react";

export const GroomingPage: React.FC = () => {
  const { language, addToCart, setActivePage } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [groomingType, setGroomingType] = useState<"center" | "home">("home");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredServices = mockGroomingServices.filter((s) => {
    const matchesSearch =
      s.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.nameBn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.descriptionEn.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || s.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddToCartService = (service: GroomingService) => {
    // Map grooming service into a cart product representation
    const productRepresentation: Product = {
      product_id: service.id,
      nameEn: `${service.nameEn} (${groomingType === "home" ? "Doorstep Home Grooming" : "Grooming Center"})`,
      nameBn: `${service.nameBn} (${groomingType === "home" ? "হোম গ্রুমিং" : "গ্রুমিং সেন্টার"})`,
      category: "grooming",
      targetSpecies: "all",
      priceTk: service.priceTk + (groomingType === "home" ? 200 : 0), // 200 Tk home travel fee
      rating: 4.9,
      reviewsCount: 50,
      image: service.image,
      descriptionEn: service.descriptionEn,
      descriptionBn: service.descriptionBn,
      stock: 99,
    };

    if (!addToCart(productRepresentation, 1, "grooming_service", { groomingType })) return;
    setActivePage("cart");
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 space-y-10">
      
      {/* Title */}
      <div className="max-w-4xl mx-auto text-center space-y-2">
        <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-extrabold uppercase rounded-full">
          Pet Care & Styling
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 font-display">
          {getTranslation(language, "groomingTitle")}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto">
          {getTranslation(language, "groomingSub")}
        </p>
      </div>

      {/* Mode Switcher: Center vs Home Grooming */}
      <div className="max-w-md mx-auto bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200 flex items-center">
        <button
          onClick={() => setGroomingType("home")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-xl transition-all ${
            groomingType === "home"
              ? "bg-purple-600 text-white shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Home className="w-4 h-4" />
          <span>{getTranslation(language, "homeGrooming")} (+৳200 travel)</span>
        </button>

        <button
          onClick={() => setGroomingType("center")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-xl transition-all ${
            groomingType === "center"
              ? "bg-purple-600 text-white shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Building className="w-4 h-4" />
          <span>{getTranslation(language, "centerGrooming")}</span>
        </button>
      </div>

      {/* Search & Category Filter */}
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center gap-3">
        <div className="flex-1 bg-white p-2.5 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-2 w-full">
          <Search className="w-4 h-4 text-slate-400 ml-2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search bathing, hair cutting, nail trimming, flea treatment..."
            className="flex-1 text-xs text-slate-800 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1">
          {["all", "bathing", "hair_cutting", "nail_trimming", "flea_treatment", "full_package"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-2 text-[11px] font-bold rounded-xl whitespace-nowrap capitalize border transition-all ${
                selectedCategory === cat
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
              }`}
            >
              {cat.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredServices.map((service) => (
          <div
            key={service.id}
            className="bg-white rounded-3xl p-6 shadow-md border border-slate-200 hover:shadow-xl transition-all flex flex-col sm:flex-row items-center gap-6"
          >
            <img
              src={service.image}
              alt={service.nameEn}
              className="w-full sm:w-36 h-36 rounded-2xl object-cover shrink-0"
            />

            <div className="flex-1 space-y-3 w-full">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-base font-display">
                    {language === "bn" ? service.nameBn : service.nameEn}
                  </h3>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 mt-0.5">
                    <Clock className="w-3.5 h-3.5 text-purple-600" />
                    <span>{service.durationMins} Mins duration</span>
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-lg font-black text-slate-900 font-display">
                    ৳{service.priceTk + (groomingType === "home" ? 200 : 0)}
                  </p>
                  <p className="text-[10px] text-slate-500">
                    {groomingType === "home" ? "Includes home visit" : "Center visit"}
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {language === "bn" ? service.descriptionBn : service.descriptionEn}
              </p>

              <button
                onClick={() => handleAddToCartService(service)}
                className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>{getTranslation(language, "addToCartBtn")}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
      
    </div>
  );
};
