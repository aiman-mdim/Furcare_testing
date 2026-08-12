import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { getTranslation } from "../translations/i18n";
import { AdoptionListing, PetSpecies } from "../types";
import {
  Heart,
  X,
  Check,
  Filter,
  Sparkles,
  MapPin,
  ShieldCheck,
  Award,
  Info,
  CheckCircle2,
  SlidersHorizontal,
} from "lucide-react";

export const PetAdoptionPage: React.FC = () => {
  const { language, adoptionListings, addToast, setActivePage } = useApp();

  // Survey preference state
  const [selectedSpecies, setSelectedSpecies] = useState<PetSpecies | "all">("all");
  const [selectedBreed, setSelectedBreed] = useState<string>("all");
  const [selectedColor, setSelectedColor] = useState<string>("all");
  const [selectedBehaviour, setSelectedBehaviour] = useState<string>("all");
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<string>("all");

  // Tinder Swipe Card State
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(null);
  const [selectedPetForModal, setSelectedPetForModal] = useState<AdoptionListing | null>(null);
  const [adoptionSubmitted, setAdoptionSubmitted] = useState<boolean>(false);

  // Filter listings based on survey criteria
  const filteredListings = adoptionListings.filter((pet) => {
    if (selectedSpecies !== "all" && pet.species !== selectedSpecies) return false;
    if (selectedBreed !== "all" && pet.breed !== selectedBreed) return false;
    if (selectedColor !== "all" && pet.color !== selectedColor) return false;
    if (selectedBehaviour !== "all" && pet.behaviour !== selectedBehaviour) return false;
    if (selectedAgeGroup === "young" && pet.ageMonths > 12) return false;
    if (selectedAgeGroup === "adult" && pet.ageMonths <= 12) return false;
    return true;
  });

  const currentPet = filteredListings[currentIndex];

  const handleSwipe = (direction: "left" | "right") => {
    setSwipeDirection(direction);

    if (direction === "right" && currentPet) {
      addToast(
        language === "bn"
          ? `❤️ "${currentPet.name}" দত্তকের জন্য পছন্দ হয়েছে (ID: ${currentPet.pet_id})`
          : `❤️ Saved "${currentPet.name}" for adoption approval! (ID: ${currentPet.pet_id})`,
        "success"
      );
      setSelectedPetForModal(currentPet);
    }

    setTimeout(() => {
      setSwipeDirection(null);
      if (currentIndex < filteredListings.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        setCurrentIndex(0); // Loop or reset
      }
    }, 300);
  };

  const handleConfirmAdoption = () => {
    setAdoptionSubmitted(true);
    setTimeout(() => {
      setAdoptionSubmitted(false);
      setSelectedPetForModal(null);
      addToast(getTranslation(language, "adoptedSuccess"), "success");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 space-y-10">
      
      {/* Title */}
      <div className="max-w-4xl mx-auto text-center space-y-2">
        <span className="px-3 py-1 bg-rose-100 text-rose-700 text-xs font-extrabold uppercase rounded-full">
          Tinder Style Adoption
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 font-display">
          {getTranslation(language, "adoptionHeader")}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          {language === "bn"
            ? "নিচের ফিল্টারের মাধ্যমে আপনার পছন্দ টিউন করুন। পছন্দ হলে ডানে সোয়াইপ করুন, এড়িয়ে যেতে বামে সোয়াইপ করুন।"
            : "Use the survey controls below to match desirable pet criteria. Swipe Right to adopt, Swipe Left to skip."}
        </p>
      </div>

      {/* Preference Survey Horizontal Option Boxes */}
      <div className="max-w-5xl mx-auto bg-white rounded-3xl p-6 shadow-md border border-slate-200 space-y-4" id="adoption-survey-boxes">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
            <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
            <span>{language === "bn" ? "পছন্দের বৈশিষ্ট্য নির্বাচন করুন (Survey Preferences)" : "Pet Desirable Preference Survey"}</span>
          </div>
          <span className="text-[11px] font-semibold text-emerald-600">
            {language === "bn" ? `ম্যাচ করা পেট সংখ্যা: ${filteredListings.length}` : `Matched Pets: ${filteredListings.length}`}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
          {/* Species */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700 block text-[11px]">{language === "bn" ? "প্রাণীর ধরন" : "Pet Type"}</label>
            <select
              value={selectedSpecies}
              onChange={(e) => {
                setSelectedSpecies(e.target.value as any);
                setCurrentIndex(0);
              }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
            >
              <option value="all">{language === "bn" ? "সব (কুকুর/বিড়াল/খরগোশ)" : "All Pets"}</option>
              <option value="dog">{language === "bn" ? "কুকুর (Dog)" : "Dog"}</option>
              <option value="cat">{language === "bn" ? "বিড়াল (Cat)" : "Cat"}</option>
              <option value="rabbit">{language === "bn" ? "খরগোশ (Rabbit)" : "Rabbit"}</option>
            </select>
          </div>

          {/* Breed */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700 block text-[11px]">{language === "bn" ? "ব্রিড" : "Breed"}</label>
            <select
              value={selectedBreed}
              onChange={(e) => {
                setSelectedBreed(e.target.value);
                setCurrentIndex(0);
              }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
            >
              <option value="all">{getTranslation(language, "adoptionFilterBreed")}</option>
              <option value="Golden Retriever">Golden Retriever</option>
              <option value="Persian Classic">Persian Classic</option>
              <option value="Holland Lop">Holland Lop</option>
              <option value="German Shepherd">German Shepherd</option>
            </select>
          </div>

          {/* Color */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700 block text-[11px]">{language === "bn" ? "রঙ" : "Color"}</label>
            <select
              value={selectedColor}
              onChange={(e) => {
                setSelectedColor(e.target.value);
                setCurrentIndex(0);
              }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
            >
              <option value="all">{getTranslation(language, "adoptionFilterColor")}</option>
              <option value="Golden Brown">Golden Brown</option>
              <option value="Pure White">Pure White</option>
              <option value="Cream White">Cream White</option>
              <option value="White & Caramel">White & Caramel</option>
              <option value="Black & Tan">Black & Tan</option>
            </select>
          </div>

          {/* Behavior */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700 block text-[11px]">{language === "bn" ? "আচরণ" : "Behavior"}</label>
            <select
              value={selectedBehaviour}
              onChange={(e) => {
                setSelectedBehaviour(e.target.value);
                setCurrentIndex(0);
              }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
            >
              <option value="all">{language === "bn" ? "সকল আচরণ" : "All Behaviors"}</option>
              <option value="friendly">Friendly (বন্ধুভাবাপন্ন)</option>
              <option value="calm">Calm (শান্ত)</option>
              <option value="playful">Playful (চঞ্চল)</option>
              <option value="energetic">Energetic (কর্মঠ)</option>
            </select>
          </div>

          {/* Age Group */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700 block text-[11px]">{language === "bn" ? "বয়স" : "Age Group"}</label>
            <select
              value={selectedAgeGroup}
              onChange={(e) => {
                setSelectedAgeGroup(e.target.value);
                setCurrentIndex(0);
              }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
            >
              <option value="all">{language === "bn" ? "সকল বয়স" : "All Ages"}</option>
              <option value="young">Junior / Pup (≤ 1 yr)</option>
              <option value="adult">Adult (&gt; 1 yr)</option>
            </select>
          </div>
        </div>

        {/* Matched IDs Bar */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-[11px]">
          <span className="font-bold text-slate-600">{getTranslation(language, "matchedPetTitle")}:</span>
          {filteredListings.length > 0 ? (
            filteredListings.map((p) => (
              <span
                key={p.pet_id}
                onClick={() => setSelectedPetForModal(p)}
                className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-md font-mono font-bold cursor-pointer hover:bg-emerald-100"
              >
                #{p.pet_id} ({p.name})
              </span>
            ))
          ) : (
            <span className="text-rose-500 font-semibold">No pets matched this criteria. Reset filters.</span>
          )}
        </div>
      </div>

      {/* Tinder Card Swipe Interface */}
      <div className="max-w-md mx-auto relative h-[520px] flex flex-col items-center justify-center">
        {currentPet ? (
          <div
            className={`relative w-full h-full bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 transition-all duration-300 transform ${
              swipeDirection === "left"
                ? "-translate-x-32 -rotate-12 opacity-0"
                : swipeDirection === "right"
                ? "translate-x-32 rotate-12 opacity-0"
                : "translate-x-0 rotate-0 opacity-100"
            }`}
          >
            {/* Pet Image */}
            <img
              src={currentPet.image}
              alt={currentPet.name}
              className="w-full h-3/5 object-cover"
            />

            {/* Badge Overlay */}
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 bg-slate-900/80 text-white backdrop-blur-md rounded-full text-xs font-bold font-mono">
                ID: {currentPet.pet_id}
              </span>
            </div>

            <div className="absolute top-4 right-4">
              <span className="px-3 py-1 bg-emerald-600 text-white rounded-full text-xs font-bold shadow-sm">
                {currentPet.vaccinated ? "Vaccinated: Yes" : "Vaccinated: No"}
              </span>
            </div>

            {/* Card Info */}
            <div className="p-5 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 font-display">
                    {currentPet.name},{" "}
                    <span className="text-base font-normal text-slate-600">
                      {currentPet.ageMonths} months
                    </span>
                  </h3>
                  <p className="text-xs font-semibold text-emerald-700">
                    {currentPet.breed} • {currentPet.color}
                  </p>
                </div>
                <span className="capitalize px-2.5 py-1 bg-amber-100 text-amber-900 font-bold text-[10px] rounded-lg">
                  {currentPet.behaviour}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                <span>
                  {currentPet.location}, {currentPet.city}
                </span>
              </div>

              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {language === "bn" ? currentPet.descriptionBn : currentPet.descriptionEn}
              </p>
            </div>

            {/* Floating Action Buttons (Left Discard / Right Approve) */}
            <div className="absolute bottom-4 left-0 right-0 px-6 flex items-center justify-around">
              <button
                onClick={() => handleSwipe("left")}
                className="w-14 h-14 rounded-full bg-slate-100 hover:bg-rose-100 text-slate-600 hover:text-rose-600 border border-slate-300 flex items-center justify-center shadow-lg transition-transform active:scale-95"
                title="Discard / Skip"
              >
                <X className="w-7 h-7" />
              </button>

              <button
                onClick={() => setSelectedPetForModal(currentPet)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-2xl shadow-md"
              >
                {language === "bn" ? "প্রোফাইল দেখুন" : "View Info"}
              </button>

              <button
                onClick={() => handleSwipe("right")}
                className="w-14 h-14 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center shadow-lg shadow-rose-500/30 transition-transform active:scale-95"
                title="Approve Adoption"
              >
                <Heart className="w-7 h-7 fill-current animate-pulse" />
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center p-8 bg-white rounded-3xl shadow-md border border-slate-200">
            <Heart className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">No more matching pets in list.</p>
            <button
              onClick={() => {
                setSelectedSpecies("all");
                setSelectedBreed("all");
                setCurrentIndex(0);
              }}
              className="mt-4 px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl"
            >
              Reset Survey Filters
            </button>
          </div>
        )}
      </div>

      {/* Swipe Guide Label */}
      <div className="flex items-center justify-center gap-8 text-xs font-bold text-slate-500 max-w-sm mx-auto">
        <span className="flex items-center gap-1 text-slate-600">
          <X className="w-4 h-4 text-slate-400" />
          <span>{getTranslation(language, "swipeLeftToPass")}</span>
        </span>
        <span className="flex items-center gap-1 text-rose-600">
          <Heart className="w-4 h-4 fill-current text-rose-500" />
          <span>{getTranslation(language, "swipeRightToAdopt")}</span>
        </span>
      </div>

      {/* Adoption Request Approval Modal */}
      {selectedPetForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setSelectedPetForModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4">
              <img
                src={selectedPetForModal.image}
                alt={selectedPetForModal.name}
                className="w-20 h-20 rounded-2xl object-cover ring-2 ring-emerald-500"
              />
              <div>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 rounded-md">
                  ID: #{selectedPetForModal.pet_id}
                </span>
                <h3 className="text-xl font-black text-slate-900 font-display mt-0.5">
                  {selectedPetForModal.name}
                </h3>
                <p className="text-xs text-slate-600 font-medium">
                  {selectedPetForModal.breed} • {selectedPetForModal.ageMonths} months
                </p>
              </div>
            </div>

            <div className="space-y-2 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              <p><strong>Location:</strong> {selectedPetForModal.location}, {selectedPetForModal.city}</p>
              <p><strong>Color:</strong> {selectedPetForModal.color}</p>
              <p><strong>Vaccinated:</strong> {selectedPetForModal.vaccinated ? "Yes" : "No"}</p>
              <p><strong>Description:</strong> {selectedPetForModal.descriptionEn}</p>
            </div>

            {adoptionSubmitted ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center text-xs font-bold text-emerald-800 flex items-center justify-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Adoption Request Approved & Sent!</span>
              </div>
            ) : (
              <button
                onClick={handleConfirmAdoption}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Heart className="w-4 h-4 fill-current" />
                <span>{getTranslation(language, "adoptNowBtn")}</span>
              </button>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
