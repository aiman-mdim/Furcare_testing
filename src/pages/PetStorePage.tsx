import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { getTranslation } from "../translations/i18n";
import {
  AdoptionListing,
  PetSpecies,
  Product,
} from "../types";

import {
  Heart,
  X,
  MapPin,
  CheckCircle2,
  SlidersHorizontal,
} from "lucide-react";

export const PetAdoptionPage: React.FC = () => {
  const {
    language,
    adoptionListings,
    addToast,
    setActivePage,
    requireAuth,
    addToCart,
  } = useApp();

  // ============================================
  // SURVEY PREFERENCE STATE
  // ============================================

  const [selectedSpecies, setSelectedSpecies] =
    useState<PetSpecies | "all">("all");

  const [selectedBreed, setSelectedBreed] =
    useState<string>("all");

  const [selectedColor, setSelectedColor] =
    useState<string>("all");

  const [selectedBehaviour, setSelectedBehaviour] =
    useState<string>("all");

  const [selectedAgeGroup, setSelectedAgeGroup] =
    useState<string>("all");

  // ============================================
  // OPTIONS
  // ============================================

  const speciesOptions = [
    {
      value: "all",
      label:
        language === "bn"
          ? "সব"
          : "All",
    },
    {
      value: "dog",
      label: "Dog",
    },
    {
      value: "cat",
      label: "Cat",
    },
    {
      value: "rabbit",
      label: "Rabbit",
    },
    {
      value: "bird",
      label: "Bird",
    },
  ];

  const behaviourOptions = [
    {
      value: "all",
      label:
        language === "bn"
          ? "যেকোন"
          : "Any",
    },
    {
      value: "playful",
      label: "Playful",
    },
    {
      value: "calm",
      label: "Calm",
    },
    {
      value: "energetic",
      label: "Energetic",
    },
    {
      value: "gentle",
      label: "Gentle",
    },
    {
      value: "curious",
      label: "Curious",
    },
    {
      value: "friendly",
      label: "Friendly",
    },
    {
      value: "loyal",
      label: "Loyal",
    },
    {
      value: "shy",
      label: "Shy",
    },
  ];

  const colorOptions = [
    {
      value: "all",
      label:
        language === "bn"
          ? "যেকোন"
          : "Any",
    },
    {
      value: "Golden",
      label: "Golden",
    },
    {
      value: "Black",
      label: "Black",
    },
    {
      value: "White",
      label: "White",
    },
    {
      value: "Brown",
      label: "Brown",
    },
    {
      value: "Tri-color",
      label: "Tri-color",
    },
    {
      value: "Orange Tabby",
      label: "Orange Tabby",
    },
    {
      value: "Black & Tan",
      label: "Black & Tan",
    },
  ];

  const ageOptions = [
    {
      value: "all",
      label:
        language === "bn"
          ? "যেকোন বয়স"
          : "Any",
    },
    {
      value: "young-0-6",
      label: "0–6 Months",
    },
    {
      value: "young-6-12",
      label: "6–12 Months",
    },
    {
      value: "adult-1-2",
      label: "1–2 Years",
    },
    {
      value: "adult-2plus",
      label: "2+ Years",
    },
  ];

  // ============================================
  // SWIPE CARD STATE
  // ============================================

  const [currentIndex, setCurrentIndex] =
    useState<number>(0);

  const [swipeDirection, setSwipeDirection] =
    useState<
      "left" | "right" | null
    >(null);

  const [
    selectedPetForModal,
    setSelectedPetForModal,
  ] = useState<AdoptionListing | null>(
    null
  );

  const [adoptionSubmitted, setAdoptionSubmitted] =
    useState<boolean>(false);

  // ============================================
  // FILTER LISTINGS
  // ============================================

  const filteredListings =
    adoptionListings.filter((pet) => {
      if (
        selectedSpecies !== "all" &&
        pet.species !== selectedSpecies
      ) {
        return false;
      }

      if (
        selectedBreed !== "all" &&
        pet.breed !== selectedBreed
      ) {
        return false;
      }

      if (
        selectedColor !== "all" &&
        pet.color !== selectedColor
      ) {
        return false;
      }

      if (
        selectedBehaviour !== "all" &&
        pet.behaviour !== selectedBehaviour
      ) {
        return false;
      }

      if (
        selectedAgeGroup === "young" &&
        pet.ageMonths > 12
      ) {
        return false;
      }

      if (
        selectedAgeGroup === "adult" &&
        pet.ageMonths <= 12
      ) {
        return false;
      }

      if (
        selectedAgeGroup === "young-0-6" &&
        pet.ageMonths > 6
      ) {
        return false;
      }

      if (
        selectedAgeGroup === "young-6-12" &&
        (
          pet.ageMonths <= 6 ||
          pet.ageMonths > 12
        )
      ) {
        return false;
      }

      if (
        selectedAgeGroup === "adult-1-2" &&
        (
          pet.ageMonths <= 12 ||
          pet.ageMonths > 24
        )
      ) {
        return false;
      }

      if (
        selectedAgeGroup === "adult-2plus" &&
        pet.ageMonths <= 24
      ) {
        return false;
      }

      return true;
    });

  // ============================================
  // CURRENT PET
  // ============================================

  const currentPet =
    filteredListings[currentIndex];

  // ============================================
  // SWIPE HANDLER
  // ============================================

  const handleSwipe = (
    direction: "left" | "right"
  ) => {
    setSwipeDirection(direction);

    if (
      direction === "right" &&
      currentPet
    ) {
      addToast(
        language === "bn"
          ? `❤️ "${currentPet.name}" দত্তকের জন্য পছন্দ হয়েছে (ID: ${currentPet.pet_id})`
          : `❤️ Saved "${currentPet.name}" for adoption approval! (ID: ${currentPet.pet_id})`,
        "success"
      );

      setSelectedPetForModal(
        currentPet
      );
    }

    setTimeout(() => {
      setSwipeDirection(null);

      if (
        currentIndex <
        filteredListings.length - 1
      ) {
        setCurrentIndex(
          (prev) => prev + 1
        );
      } else {
        setCurrentIndex(0);
      }
    }, 300);
  };

  // ============================================
  // CONFIRM ADOPTION
  // ============================================

  const handleConfirmAdoption = () => {
    // ------------------------------------------
    // REQUIRE LOGIN
    // ------------------------------------------

    if (!requireAuth()) {
      return;
    }

    // ------------------------------------------
    // CHECK SELECTED PET
    // ------------------------------------------

    if (!selectedPetForModal) {
      addToast(
        language === "bn"
          ? "অনুগ্রহ করে প্রথমে একটি পেট নির্বাচন করুন।"
          : "Please select a pet first.",
        "warning"
      );

      return;
    }

    // ------------------------------------------
    // SELECTED PET
    // ------------------------------------------

    const pet =
      selectedPetForModal;

    // ------------------------------------------
    // CREATE ADOPTION PRODUCT
    //
    // Adoption is represented as a zero-price
    // cart item.
    //
    // No payment is required for adoption.
    // ------------------------------------------

    const adoptionProduct: Product = {
      product_id:
        `ADOPTION-${pet.pet_id}`,

      nameEn:
        `Adoption Request - ${pet.name}`,

      nameBn:
        `দত্তক আবেদন - ${pet.name}`,

      category:
        "healthcare",

      targetSpecies:
        pet.species,

      priceTk: 0,

      rating: 5,

      reviewsCount: 0,

      image:
        pet.image,

      descriptionEn:
        `Adoption request for ${pet.name}. No payment is required.`,

      descriptionBn:
        `${pet.name}-কে দত্তক নেওয়ার আবেদন। কোনো টাকা প্রদান করতে হবে না।`,

      stock: 1,
    };

    // ------------------------------------------
    // ADD ADOPTION REQUEST TO CART
    // ------------------------------------------

    const added =
      addToCart(
        adoptionProduct,
        1,
        "adoption",
        {
          petId:
            pet.pet_id,

          petName:
            pet.name,

          species:
            pet.species,

          breed:
            pet.breed,

          color:
            pet.color,

          location:
            pet.location,

          city:
            pet.city,

          vaccinated:
            pet.vaccinated,

          adoptionStatus:
            "pending",
        }
      );

    // ------------------------------------------
    // STOP IF CART ADD FAILED
    // ------------------------------------------

    if (!added) {
      return;
    }

    // ------------------------------------------
    // SUCCESS
    // ------------------------------------------

    setAdoptionSubmitted(true);

    addToast(
      language === "bn"
        ? `${pet.name}-এর দত্তক আবেদন Cart-এ যোগ হয়েছে।`
        : `${pet.name}'s adoption request was added to your cart.`,
      "success"
    );

    // ------------------------------------------
    // CLOSE MODAL
    // ------------------------------------------

    setTimeout(() => {
      setAdoptionSubmitted(false);

      setSelectedPetForModal(
        null
      );

      // ----------------------------------------
      // GO TO CART
      // ----------------------------------------

      setActivePage("cart");
    }, 800);
  };

  // ============================================
  // RESET FILTERS
  // ============================================

  const resetFilters = () => {
    setSelectedSpecies("all");
    setSelectedBreed("all");
    setSelectedColor("all");
    setSelectedBehaviour("all");
    setSelectedAgeGroup("all");
    setCurrentIndex(0);
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="min-h-screen bg-[#F8F7F3] py-10 px-4 sm:px-6 lg:px-8 space-y-10">

      {/* ======================================
          TITLE
      ======================================= */}

      <div className="max-w-4xl mx-auto text-center space-y-2">
        <span
          className="px-3 py-1 text-xs font-extrabold uppercase rounded-full"
          style={{
            background: "#FFF4D6",
            color: "#A54A00",
          }}
        >
          Adoption
        </span>

        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 font-display">
          {getTranslation(
            language,
            "adoptionHeader"
          )}
        </h1>

        <p className="text-xs sm:text-sm text-slate-600">
          {language === "bn"
            ? "নিচের ফিল্টারের মাধ্যমে আপনার পছন্দ টিউন করুন। পছন্দ হলে ডানে সোয়াইপ করুন, এড়িয়ে যেতে বামে সোয়াইপ করুন।"
            : "Use the survey controls below to match desirable pet criteria. Swipe Right to adopt, Swipe Left to skip."}
        </p>
      </div>

      {/* ======================================
          PREFERENCE SURVEY
      ======================================= */}

      <div
        className="max-w-4xl mx-auto rounded-3xl p-5 shadow-md border border-[#E8E1D5] space-y-4"
        id="adoption-survey-boxes"
        style={{
          background: "#F7F1E8",
        }}
      >
        {/* Survey Header */}

        <div className="flex items-center justify-between border-b border-[#E8E1D5] pb-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[#2D241D]">
            <SlidersHorizontal className="w-4 h-4 text-[#2D241D]" />

            <span>
              {language === "bn"
                ? "পছন্দের বৈশিষ্ট্য নির্বাচন করুন (Survey Preferences)"
                : "Pet Desirable Preference Survey"}
            </span>
          </div>

          <span className="text-[11px] font-semibold text-[#2D241D]">
            {language === "bn"
              ? `ম্যাচ করা পেট সংখ্যা: ${filteredListings.length}`
              : `Matched Pets: ${filteredListings.length}`}
          </span>
        </div>

        {/* ====================================
            PET TYPE
        ===================================== */}

        <div className="space-y-5 text-xs">

          <div>
            <div className="mb-3 flex items-center justify-between">
              <span className="font-bold text-slate-900">
                {language === "bn"
                  ? "প্রাণীর ধরন"
                  : "Pet Type"}
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {speciesOptions.map(
                (option) => (
                  <button
                    key={
                      option.value
                    }
                    type="button"
                    onClick={() => {
                      setSelectedSpecies(
                        option.value as
                          | PetSpecies
                          | "all"
                      );

                      setCurrentIndex(
                        0
                      );
                    }}
                    className={`rounded-full px-4 py-2 text-[11px] font-semibold transition-colors duration-200 ${
                      selectedSpecies ===
                      option.value
                        ? "bg-[#F3EEE6] text-[#2D241D] border border-[#D7C8AE] shadow-[0_1px_0_rgba(0,0,0,0.03)] hover:bg-[#F0E9DF]"
                        : "bg-white text-[#374151] border border-[#E8E1D5] hover:bg-[#F7F1E8]"
                    }`}
                  >
                    {
                      option.label
                    }
                  </button>
                )
              )}
            </div>
          </div>

          {/* ====================================
              BEHAVIOR
          ===================================== */}

          <div>
            <div className="mb-3 flex items-center justify-between">
              <span className="font-bold text-slate-900">
                {language === "bn"
                  ? "আচরণ"
                  : "Behavior"}
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {behaviourOptions.map(
                (option) => (
                  <button
                    key={
                      option.value
                    }
                    type="button"
                    onClick={() => {
                      setSelectedBehaviour(
                        option.value
                      );

                      setCurrentIndex(
                        0
                      );
                    }}
                    className={`rounded-full px-4 py-2 text-[11px] font-semibold transition-colors duration-200 ${
                      selectedBehaviour ===
                      option.value
                        ? "bg-[#F3EEE6] text-[#2D241D] border border-[#D7C8AE] shadow-[0_1px_0_rgba(0,0,0,0.03)] hover:bg-[#F0E9DF]"
                        : "bg-white text-[#374151] border border-[#E8E1D5] hover:bg-[#F7F1E8]"
                    }`}
                  >
                    {
                      option.label
                    }
                  </button>
                )
              )}
            </div>
          </div>

          {/* ====================================
              COLOR
          ===================================== */}

          <div>
            <div className="mb-3 flex items-center justify-between">
              <span className="font-bold text-slate-900">
                {language === "bn"
                  ? "রঙ"
                  : "Color"}
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {colorOptions.map(
                (option) => (
                  <button
                    key={
                      option.value
                    }
                    type="button"
                    onClick={() => {
                      setSelectedColor(
                        option.value
                      );

                      setCurrentIndex(
                        0
                      );
                    }}
                    className={`rounded-full px-4 py-2 text-[11px] font-semibold transition-colors duration-200 ${
                      selectedColor ===
                      option.value
                        ? "bg-[#F3EEE6] text-[#2D241D] border border-[#D7C8AE] shadow-[0_1px_0_rgba(0,0,0,0.03)] hover:bg-[#F0E9DF]"
                        : "bg-white text-[#374151] border border-[#E8E1D5] hover:bg-[#F7F1E8]"
                    }`}
                  >
                    {
                      option.label
                    }
                  </button>
                )
              )}
            </div>
          </div>

          {/* ====================================
              AGE
          ===================================== */}

          <div>
            <div className="mb-3 flex items-center justify-between">
              <span className="font-bold text-slate-900">
                {language === "bn"
                  ? "বয়স"
                  : "Age"}
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {ageOptions.map(
                (option) => (
                  <button
                    key={
                      option.value
                    }
                    type="button"
                    onClick={() => {
                      setSelectedAgeGroup(
                        option.value
                      );

                      setCurrentIndex(
                        0
                      );
                    }}
                    className={`rounded-full px-4 py-2 text-[11px] font-semibold transition-colors duration-200 ${
                      selectedAgeGroup ===
                      option.value
                        ? "bg-[#F3EEE6] text-[#2D241D] border border-[#D7C8AE] shadow-[0_1px_0_rgba(0,0,0,0.03)] hover:bg-[#F0E9DF]"
                        : "bg-white text-[#374151] border border-[#E8E1D5] hover:bg-[#F7F1E8]"
                    }`}
                  >
                    {
                      option.label
                    }
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ======================================
          TINDER CARD
      ======================================= */}

      <div className="max-w-md mx-auto relative h-[520px] flex flex-col items-center justify-center">

        {currentPet ? (
          <div
            className={`relative w-full h-full bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 transition-all duration-300 transform ${
              swipeDirection === "left"
                ? "-translate-x-32 -rotate-12 opacity-0"
                : swipeDirection ===
                  "right"
                ? "translate-x-32 rotate-12 opacity-0"
                : "translate-x-0 rotate-0 opacity-100"
            }`}
          >

            {/* Pet Image */}

            <img
              src={
                currentPet.image
              }
              alt={
                currentPet.name
              }
              className="w-full h-3/5 object-cover"
            />

            {/* Pet ID */}

            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 bg-slate-900/80 text-white backdrop-blur-md rounded-full text-xs font-bold font-mono">
                ID:{" "}
                {
                  currentPet.pet_id
                }
              </span>
            </div>

            {/* Vaccination */}

            <div className="absolute top-4 right-4">
              <span className="px-3 py-1 bg-[#355E3B] text-white rounded-full text-xs font-bold shadow-sm">
                {currentPet.vaccinated
                  ? "Vaccinated: Yes"
                  : "Vaccinated: No"}
              </span>
            </div>

            {/* Card Info */}

            <div className="p-5 space-y-2">

              <div className="flex items-center justify-between">

                <div>
                  <h3 className="text-2xl font-black text-slate-900 font-display">
                    {
                      currentPet.name
                    }
                    ,{" "}
                    <span className="text-base font-normal text-slate-600">
                      {
                        currentPet.ageMonths
                      }{" "}
                      months
                    </span>
                  </h3>

                  <p className="text-xs font-semibold text-emerald-700">
                    {
                      currentPet.breed
                    }{" "}
                    •{" "}
                    {
                      currentPet.color
                    }
                  </p>
                </div>

                <span className="capitalize px-2.5 py-1 bg-amber-100 text-amber-900 font-bold text-[10px] rounded-lg">
                  {
                    currentPet.behaviour
                  }
                </span>
              </div>

              {/* Location */}

              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <MapPin className="w-4 h-4 text-rose-500 shrink-0" />

                <span>
                  {
                    currentPet.location
                  }
                  ,{" "}
                  {
                    currentPet.city
                  }
                </span>
              </div>

              {/* Description */}

              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {language ===
                "bn"
                  ? currentPet.descriptionBn
                  : currentPet.descriptionEn}
              </p>
            </div>

            {/* Action Buttons */}

            <div className="absolute bottom-4 left-0 right-0 px-6 flex items-center justify-around">

              {/* Skip */}

              <button
                onClick={() =>
                  handleSwipe(
                    "left"
                  )
                }
                className="w-14 h-14 rounded-full bg-slate-100 hover:bg-rose-100 text-slate-600 hover:text-rose-600 border border-slate-300 flex items-center justify-center shadow-lg transition-transform active:scale-95"
                title="Discard / Skip"
              >
                <X className="w-7 h-7" />
              </button>

              {/* View Info */}

              <button
                onClick={() =>
                  setSelectedPetForModal(
                    currentPet
                  )
                }
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-2xl shadow-md"
              >
                {language ===
                "bn"
                  ? "প্রোফাইল দেখুন"
                  : "View Info"}
              </button>

              {/* Approve */}

              <button
                onClick={() =>
                  handleSwipe(
                    "right"
                  )
                }
                className="w-14 h-14 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center shadow-lg shadow-rose-500/30 transition-transform active:scale-95"
                title="Approve Adoption"
              >
                <Heart className="w-7 h-7 fill-current animate-pulse" />
              </button>
            </div>
          </div>
        ) : (
          // ==================================
          // NO MATCHING PETS
          // ==================================

          <div className="text-center p-8 bg-white rounded-3xl shadow-md border border-slate-200">

            <Heart className="w-12 h-12 text-slate-300 mx-auto mb-2" />

            <p className="text-sm font-bold text-slate-700">
              {language ===
              "bn"
                ? "এই তালিকায় আর কোনো মিল পাওয়া যায়নি।"
                : "No more matching pets in list."}
            </p>

            <button
              onClick={
                resetFilters
              }
              className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl"
            >
              {language ===
              "bn"
                ? "ফিল্টার রিসেট করুন"
                : "Reset Survey Filters"}
            </button>
          </div>
        )}
      </div>

      {/* ======================================
          SWIPE GUIDE
      ======================================= */}

      <div className="flex items-center justify-center gap-8 text-xs font-bold text-slate-500 max-w-sm mx-auto">

        <span className="flex items-center gap-1 text-slate-600">
          <X className="w-4 h-4 text-slate-400" />

          <span>
            {getTranslation(
              language,
              "swipeLeftToPass"
            )}
          </span>
        </span>

        <span className="flex items-center gap-1 text-rose-600">
          <Heart className="w-4 h-4 fill-current text-rose-500" />

          <span>
            {getTranslation(
              language,
              "swipeRightToAdopt"
            )}
          </span>
        </span>
      </div>

      {/* ======================================
          ADOPTION MODAL
      ======================================= */}

      {selectedPetForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">

          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-slate-200 relative">

            {/* Close */}

            <button
              onClick={() => {
                setSelectedPetForModal(
                  null
                );

                setAdoptionSubmitted(
                  false
                );
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Pet Header */}

            <div className="flex items-center gap-4">

              <img
                src={
                  selectedPetForModal.image
                }
                alt={
                  selectedPetForModal.name
                }
                className="w-20 h-20 rounded-2xl object-cover ring-2 ring-emerald-500"
              />

              <div>

                <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 rounded-md">
                  ID: #
                  {
                    selectedPetForModal.pet_id
                  }
                </span>

                <h3 className="text-xl font-black text-slate-900 font-display mt-0.5">
                  {
                    selectedPetForModal.name
                  }
                </h3>

                <p className="text-xs text-slate-600 font-medium">
                  {
                    selectedPetForModal.breed
                  }{" "}
                  •{" "}
                  {
                    selectedPetForModal.ageMonths
                  }{" "}
                  months
                </p>
              </div>
            </div>

            {/* Pet Details */}

            <div className="space-y-2 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200/80">

              <p>
                <strong>
                  Location:
                </strong>{" "}
                {
                  selectedPetForModal.location
                }
                ,{" "}
                {
                  selectedPetForModal.city
                }
              </p>

              <p>
                <strong>
                  Color:
                </strong>{" "}
                {
                  selectedPetForModal.color
                }
              </p>

              <p>
                <strong>
                  Vaccinated:
                </strong>{" "}
                {
                  selectedPetForModal.vaccinated
                    ? "Yes"
                    : "No"
                }
              </p>

              <p>
                <strong>
                  Description:
                </strong>{" "}
                {
                  language === "bn"
                    ? selectedPetForModal.descriptionBn
                    : selectedPetForModal.descriptionEn
                }
              </p>
            </div>

            {/* Adoption Confirmation */}

            {adoptionSubmitted ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center text-xs font-bold text-emerald-800 flex items-center justify-center gap-2">

                <CheckCircle2 className="w-5 h-5 text-emerald-600" />

                <span>
                  {language ===
                  "bn"
                    ? "দত্তক আবেদন Cart-এ যোগ হয়েছে!"
                    : "Adoption Request Added to Cart!"}
                </span>
              </div>
            ) : (
              <button
                onClick={
                  handleConfirmAdoption
                }
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Heart className="w-4 h-4 fill-current" />

                <span>
                  {getTranslation(
                    language,
                    "adoptNowBtn"
                  )}
                </span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}; 
