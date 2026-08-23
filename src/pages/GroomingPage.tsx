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
  ShoppingCart,
  Clock,
} from "lucide-react";

export const GroomingPage: React.FC = () => {
  // ============================================
  // APP CONTEXT
  // ============================================

  const {
    language,
    addToCart,
    setActivePage,
    addToast,
  } = useApp();

  // ============================================
  // STATE
  // ============================================

  const [searchQuery, setSearchQuery] =
    useState<string>("");

  const [groomingType, setGroomingType] =
    useState<"center" | "home">("home");

  const [selectedCategory, setSelectedCategory] =
    useState<string>("all");

  // ============================================
  // FILTER SERVICES
  // ============================================

  const filteredServices =
    mockGroomingServices.filter((service) => {
      const search =
        searchQuery.toLowerCase().trim();

      const matchesSearch =
        service.nameEn
          .toLowerCase()
          .includes(search) ||
        service.nameBn
          .toLowerCase()
          .includes(search) ||
        service.descriptionEn
          .toLowerCase()
          .includes(search) ||
        service.descriptionBn
          .toLowerCase()
          .includes(search);

      const matchesCategory =
        selectedCategory === "all" ||
        service.category === selectedCategory;

      return (
        matchesSearch &&
        matchesCategory
      );
    });

  // ============================================
  // ADD GROOMING SERVICE TO CART
  // ============================================

  const handleAddToCartService = (
    service: GroomingService
  ) => {
    // --------------------------------------------
    // Calculate final price
    // --------------------------------------------

    const homeTravelFee =
      groomingType === "home"
        ? 200
        : 0;

    const finalPrice =
      service.priceTk +
      homeTravelFee;

    // --------------------------------------------
    // Convert grooming service to Product format
    // --------------------------------------------

    const productRepresentation: Product = {
      product_id:
        `GROOMING-${service.id}-${groomingType}`,

      nameEn:
        `${service.nameEn} (${
          groomingType === "home"
            ? "Doorstep Home Grooming"
            : "Grooming Center"
        })`,

      nameBn:
        `${service.nameBn} (${
          groomingType === "home"
            ? "হোম গ্রুমিং"
            : "গ্রুমিং সেন্টার"
        })`,

      category:
        "grooming",

      targetSpecies:
        "all",

      priceTk:
        finalPrice,

      rating:
        4.9,

      reviewsCount:
        50,

      image:
        service.image,

      descriptionEn:
        service.descriptionEn,

      descriptionBn:
        service.descriptionBn,

      stock:
        99,
    };

    // --------------------------------------------
    // Add to cart
    // --------------------------------------------

    const added =
      addToCart(
        productRepresentation,
        1,
        "grooming_service",
        {
          // --------------------------------------
          // Grooming booking information
          // --------------------------------------

          groomingType,

          serviceId:
            service.id,

          serviceName:
            service.nameEn,

          serviceNameBn:
            service.nameBn,

          durationMins:
            service.durationMins,

          basePriceTk:
            service.priceTk,

          homeTravelFee,

          priceTk:
            finalPrice,

          bookingDate:
            new Date()
              .toISOString()
              .split("T")[0],

          bookingStatus:
            "pending",
        }
      );

    // --------------------------------------------
    // If authentication failed
    // --------------------------------------------

    if (!added) {
      return;
    }

    // --------------------------------------------
    // Success notification
    // --------------------------------------------

    addToast(
      language === "bn"
        ? "গ্রুমিং সার্ভিস Cart-এ যোগ হয়েছে।"
        : "Grooming service added to cart. Complete payment to confirm.",
      "success"
    );

    // --------------------------------------------
    // Go to cart
    // --------------------------------------------

    setActivePage("cart");
  };

  // ============================================
  // CATEGORY LABEL
  // ============================================

  const getCategoryLabel = (
    category: string
  ): string => {
    if (language === "bn") {
      switch (category) {
        case "all":
          return "সব";

        case "bathing":
          return "গোসল";

        case "hair_cutting":
          return "চুল কাটা";

        case "nail_trimming":
          return "নখ কাটা";

        case "flea_treatment":
          return "ফ্লি ট্রিটমেন্ট";

        case "full_package":
          return "ফুল প্যাকেজ";

        default:
          return category.replace(
            "_",
            " "
          );
      }
    }

    return category === "all"
      ? "All"
      : category.replace(
          /_/g,
          " "
        );
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 space-y-10">

      {/* ========================================
          HEADER
      ======================================== */}

      <div className="max-w-4xl mx-auto text-center space-y-2">

        <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 text-xs font-extrabold uppercase rounded-full">
          <Scissors className="w-3.5 h-3.5" />
          Pet Care & Styling
        </span>

        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 font-display">
          {getTranslation(
            language,
            "groomingTitle"
          )}
        </h1>

        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto">
          {getTranslation(
            language,
            "groomingSub"
          )}
        </p>

      </div>

      {/* ========================================
          GROOMING TYPE SWITCHER
      ======================================== */}

      <div className="max-w-md mx-auto bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200 flex items-center">

        {/* HOME GROOMING */}

        <button
          type="button"
          onClick={() =>
            setGroomingType("home")
          }
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-xl transition-all ${
            groomingType === "home"
              ? "bg-purple-600 text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Home className="w-4 h-4" />

          <span>
            {getTranslation(
              language,
              "homeGrooming"
            )}{" "}
            (+৳200 travel)
          </span>
        </button>

        {/* CENTER GROOMING */}

        <button
          type="button"
          onClick={() =>
            setGroomingType("center")
          }
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-xl transition-all ${
            groomingType === "center"
              ? "bg-purple-600 text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Building className="w-4 h-4" />

          <span>
            {getTranslation(
              language,
              "centerGrooming"
            )}
          </span>
        </button>

      </div>

      {/* ========================================
          SEARCH + CATEGORY
      ======================================== */}

      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center gap-3">

        {/* SEARCH */}

        <div className="flex-1 bg-white p-2.5 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-2 w-full">

          <Search className="w-4 h-4 text-slate-400 ml-2" />

          <input
            type="text"
            value={searchQuery}
            onChange={(event) =>
              setSearchQuery(
                event.target.value
              )
            }
            placeholder={
              language === "bn"
                ? "গোসল, চুল কাটা, নখ কাটা, ফ্লি ট্রিটমেন্ট খুঁজুন..."
                : "Search bathing, hair cutting, nail trimming, flea treatment..."
            }
            className="flex-1 text-xs text-slate-800 focus:outline-none bg-transparent"
          />

        </div>

        {/* CATEGORY FILTER */}

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1">

          {[
            "all",
            "bathing",
            "hair_cutting",
            "nail_trimming",
            "flea_treatment",
            "full_package",
          ].map((category) => (

            <button
              key={category}
              type="button"
              onClick={() =>
                setSelectedCategory(
                  category
                )
              }
              className={`px-3 py-2 text-[11px] font-bold rounded-xl whitespace-nowrap capitalize border transition-all ${
                selectedCategory === category
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
              }`}
            >
              {getCategoryLabel(
                category
              )}
            </button>

          ))}

        </div>

      </div>

      {/* ========================================
          SERVICE COUNT
      ======================================== */}

      <div className="max-w-6xl mx-auto flex items-center justify-between">

        <p className="text-xs font-bold text-slate-500">
          {language === "bn"
            ? `${filteredServices.length}টি সার্ভিস পাওয়া গেছে`
            : `${filteredServices.length} grooming service${
                filteredServices.length !== 1
                  ? "s"
                  : ""
              } found`}
        </p>

        <div className="flex items-center gap-1.5 text-xs font-semibold text-purple-600">
          {groomingType === "home" ? (
            <>
              <Home className="w-3.5 h-3.5" />
              <span>
                {language === "bn"
                  ? "হোম সার্ভিস"
                  : "Home Service"}
              </span>
            </>
          ) : (
            <>
              <Building className="w-3.5 h-3.5" />
              <span>
                {language === "bn"
                  ? "সেন্টার সার্ভিস"
                  : "Center Service"}
              </span>
            </>
          )}
        </div>

      </div>

      {/* ========================================
          SERVICES GRID
      ======================================== */}

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">

        {filteredServices.length > 0 ? (

          filteredServices.map(
            (service) => {

              const homeTravelFee =
                groomingType === "home"
                  ? 200
                  : 0;

              const finalPrice =
                service.priceTk +
                homeTravelFee;

              return (
                <div
                  key={service.id}
                  className="bg-white rounded-3xl p-6 shadow-md border border-slate-200 hover:shadow-xl transition-all flex flex-col sm:flex-row items-center gap-6"
                >

                  {/* SERVICE IMAGE */}

                  <img
                    src={service.image}
                    alt={service.nameEn}
                    className="w-full sm:w-36 h-36 rounded-2xl object-cover shrink-0"
                  />

                  {/* SERVICE DETAILS */}

                  <div className="flex-1 space-y-3 w-full">

                    {/* NAME + PRICE */}

                    <div className="flex items-start justify-between gap-4">

                      <div>

                        <h3 className="font-bold text-slate-900 text-base font-display">
                          {language === "bn"
                            ? service.nameBn
                            : service.nameEn}
                        </h3>

                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 mt-0.5">

                          <Clock className="w-3.5 h-3.5 text-purple-600" />

                          <span>
                            {service.durationMins}{" "}
                            {language === "bn"
                              ? "মিনিট"
                              : "mins"}{" "}
                            {language === "bn"
                              ? "সময়কাল"
                              : "duration"}
                          </span>

                        </span>

                      </div>

                      <div className="text-right shrink-0">

                        <p className="text-lg font-black text-slate-900 font-display">
                          ৳{finalPrice}
                        </p>

                        <p className="text-[10px] text-slate-500">

                          {groomingType ===
                          "home"
                            ? language ===
                              "bn"
                              ? "হোম ভিজিটসহ"
                              : "Includes home visit"
                            : language ===
                              "bn"
                            ? "সেন্টার ভিজিট"
                            : "Center visit"}

                        </p>

                      </div>

                    </div>

                    {/* DESCRIPTION */}

                    <p className="text-xs text-slate-600 leading-relaxed">

                      {language === "bn"
                        ? service.descriptionBn
                        : service.descriptionEn}

                    </p>

                    {/* PRICE BREAKDOWN */}

                    {groomingType ===
                      "home" && (
                      <div className="flex items-center justify-between text-[10px] text-slate-500 bg-purple-50 rounded-lg px-3 py-2">

                        <span>
                          {language ===
                          "bn"
                            ? "সার্ভিস মূল্য"
                            : "Service price"}
                        </span>

                        <span>
                          ৳
                          {
                            service.priceTk
                          }
                        </span>

                        <span>
                          +
                        </span>

                        <span>
                          {language ===
                          "bn"
                            ? "হোম ভিজিট"
                            : "Home visit"}
                        </span>

                        <span>
                          ৳200
                        </span>

                      </div>
                    )}

                    {/* ADD TO CART */}

                    <button
                      type="button"
                      onClick={() =>
                        handleAddToCartService(
                          service
                        )
                      }
                      className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
                    >

                      <ShoppingCart className="w-4 h-4" />

                      <span>
                        {getTranslation(
                          language,
                          "addToCartBtn"
                        )}
                      </span>

                    </button>

                  </div>

                </div>
              );
            }
          )

        ) : (

          /* ======================================
             NO SERVICES
          ====================================== */

          <div className="md:col-span-2 bg-white rounded-3xl p-10 shadow-sm border border-slate-200 text-center">

            <Scissors className="w-12 h-12 text-slate-300 mx-auto mb-4" />

            <h3 className="text-lg font-bold text-slate-800">
              {language === "bn"
                ? "কোনো সার্ভিস পাওয়া যায়নি"
                : "No grooming services found"}
            </h3>

            <p className="text-xs text-slate-500 mt-2">
              {language === "bn"
                ? "আপনার সার্চ বা ক্যাটাগরি পরিবর্তন করে আবার চেষ্টা করুন।"
                : "Try changing your search or category filter."}
            </p>

            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory(
                  "all"
                );
              }}
              className="mt-5 px-5 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800"
            >
              {language === "bn"
                ? "ফিল্টার রিসেট করুন"
                : "Reset Filters"}
            </button>

          </div>

        )}

      </div>

      {/* ========================================
          BOOKING INFORMATION
      ======================================== */}

      <div className="max-w-4xl mx-auto">

        <div className="bg-purple-50 border border-purple-100 rounded-2xl p-4">

          <div className="flex items-start gap-3">

            <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0">

              {groomingType === "home" ? (
                <Home className="w-4 h-4" />
              ) : (
                <Building className="w-4 h-4" />
              )}

            </div>

            <div>

              <h4 className="text-xs font-extrabold text-purple-900">
                {language === "bn"
                  ? "কীভাবে বুকিং করবেন?"
                  : "How grooming booking works"}
              </h4>

              <p className="text-[11px] text-purple-800 mt-1 leading-relaxed">

                {language === "bn"
                  ? "আপনার পছন্দের সার্ভিস Cart-এ যোগ করুন। এরপর Cart থেকে Checkout করে payment সম্পন্ন করুন। Payment সম্পন্ন হলে আপনার grooming booking confirm হবে।"
                  : "Add your preferred grooming service to the Cart. Then proceed to Checkout and complete payment. Your grooming booking will be confirmed after payment."}

              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}; 