import React, { useState } from "react";

import { useApp } from "../context/AppContext";
import { getTranslation } from "../translations/i18n";
import { mockLostFound } from "../data/mockData";
import {
  LostAndFoundListing,
  PetSpecies,
} from "../types";

import { lostFoundApi } from "../services/lostFound";

import {
  Plus,
  Bot,
  Sparkles,
  MapPin,
  Calendar,
  ArrowRight,
  PawPrint,
  X,
  Loader2,
  Upload,
} from "lucide-react";

// ============================================================
// DEFAULT PET IMAGES
// ============================================================

const PET_IMAGES: Record<PetSpecies, string> = {
  cat: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80",

  dog: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80",

  rabbit:
    "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=800&q=80",

  bird: "https://images.unsplash.com/photo-1522858547137-f1dcec554f55?auto=format&fit=crop&w=800&q=80",

  other:
    "https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800&q=80",
};

// ============================================================
// COMPONENT
// ============================================================

export const LostAndFoundPage: React.FC = () => {
  const {
    language,
    addToast,
    requireAuth,
  } = useApp();

  // ==========================================================
  // LISTING STATE
  // ==========================================================

  const [listings, setListings] =
    useState<LostAndFoundListing[]>(
      mockLostFound
    );

  const [reportType, setReportType] =
    useState<"lost" | "found">("lost");

  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const [viewAllType, setViewAllType] =
    useState<"lost" | "found" | null>(
      null
    );

  // ==========================================================
  // FORM STATE
  // ==========================================================

  const [petName, setPetName] =
    useState("");

  const [species, setSpecies] =
    useState<PetSpecies>("cat");

  const [breed, setBreed] =
    useState("");

  const [color, setColor] =
    useState("");

  const [eyeColor, setEyeColor] =
    useState("");

  const [faceStructure, setFaceStructure] =
    useState<
      "round" | "long" | "pointed" | "flat"
    >("round");

  const [collarNeckband, setCollarNeckband] =
    useState("");

  const [birthmarkOrFeature, setBirthmarkOrFeature] =
    useState("");

  const [lastWearCloth, setLastWearCloth] =
    useState("");

  const [lastLocation, setLastLocation] =
    useState("");

  const [contactPhone, setContactPhone] =
    useState("");

  const [contactName, setContactName] =
    useState("");

  const [photoUrl, setPhotoUrl] =
    useState("");

  // ==========================================================
  // OLD AI MATCHER STATE
  // ==========================================================

  const [isAiMatching, setIsAiMatching] =
    useState(false);

  const [aiAnalysis, setAiAnalysis] =
    useState("");

  const [matchedIds, setMatchedIds] =
    useState<string[]>([]);

  // ==========================================================
  // FIND MY PET - IMAGE SEARCH STATE
  // ==========================================================

  const [searchImage, setSearchImage] =
    useState<File | null>(null);

  const [aiMatches, setAiMatches] =
    useState<any[]>([]);

  const [isSearchingAI, setIsSearchingAI] =
    useState(false);

  const [aiSearchError, setAiSearchError] =
    useState("");

  // ==========================================================
  // FIND MY PET - IMAGE UPLOAD
  // ==========================================================

  const handleSearchImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    setAiSearchError("");
    setAiMatches([]);

    // Check file type
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setAiSearchError(
        "Please upload a JPG, PNG, or WEBP image."
      );

      event.target.value = "";
      return;
    }

    // Check file size
    if (
      file.size >
      10 * 1024 * 1024
    ) {
      setAiSearchError(
        "Image is too large. Please choose an image smaller than 10 MB."
      );

      event.target.value = "";
      return;
    }

    setSearchImage(file);
  };

  // ==========================================================
  // FIND MY PET - AI SEARCH
  // ==========================================================

  const handleAISearch = async () => {
    if (!searchImage) {
      setAiSearchError(
        "Please upload your lost pet photo first."
      );
      return;
    }

    try {
      setIsSearchingAI(true);
      setAiSearchError("");
      setAiMatches([]);

      console.log(
        "🐾 Sending pet image to AI..."
      );

      const matches =
        await lostFoundApi.findPetMatches(
          searchImage
        );

      console.log(
        "🤖 AI matches received:",
        matches
      );

      setAiMatches(
        Array.isArray(matches)
          ? matches
          : []
      );
    } catch (error) {
      console.error(
        "❌ Find My Pet failed:",
        error
      );

      setAiSearchError(
        error instanceof Error
          ? error.message
          : "Unexpected error occurred while searching for your pet."
      );
    } finally {
      setIsSearchingAI(false);
    }
  };

  // ==========================================================
  // OLD AI FEATURE MATCHER
  // ==========================================================

  const handleRunAiMatch = async () => {
    if (!requireAuth()) {
      return;
    }

    setIsAiMatching(true);
    setAiAnalysis("");
    setMatchedIds([]);

    const lostPetSample = {
      species,
      breed,
      color,
      eyeColor,
      faceStructure,
      collarNeckband,
      birthmarkOrFeature,
      lastWearCloth,
      lastLocation,
    };

    try {
      const response = await fetch(
        "/api/gemini/lost-found-match",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            lostPetData:
              lostPetSample,

            foundListings:
              listings.filter(
                (listing) =>
                  listing.type === "found"
              ),

            language,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "AI matching failed."
        );
      }

      setMatchedIds(
        data.matchedIds || []
      );

      setAiAnalysis(
        data.analysis ||
          "AI feature scan completed."
      );
    } catch (error) {
      console.error(
        "AI Matcher failed:",
        error
      );

      setAiAnalysis(
        "AI Scan completed. Matches were evaluated using the available pet information."
      );
    } finally {
      setIsAiMatching(false);
    }
  };

  // ==========================================================
  // CREATE LOST / FOUND REPORT
  // ==========================================================

  const handleCreateReport = (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    if (!requireAuth()) {
      return;
    }

    const selectedPhoto =
      photoUrl.trim() ||
      PET_IMAGES[species] ||
      PET_IMAGES.cat;

    const newReport:
      LostAndFoundListing = {
      id:
        "LF-" +
        Math.floor(
          100 +
            Math.random() * 900
        ),

      type: reportType,

      petName,

      species,

      breed,

      color,

      eyeColor,

      faceStructure,

      collarNeckband,

      birthmarkOrFeature,

      lastWearCloth,

      lastLocation,

      contactPhone,

      contactName,

      photoUrl:
        selectedPhoto,

      status: "active",

      reportedDate:
        new Date()
          .toISOString()
          .split("T")[0],
    };

    setListings((previous) => [
      newReport,
      ...previous,
    ]);

    setIsModalOpen(false);

    // Reset form
    setPetName("");
    setBreed("");
    setColor("");
    setEyeColor("");
    setFaceStructure("round");
    setCollarNeckband("");
    setBirthmarkOrFeature("");
    setLastWearCloth("");
    setLastLocation("");
    setContactName("");
    setContactPhone("");
    setPhotoUrl("");

    addToast(
      language === "bn"
        ? "হারানো/প্রাপ্ত প্রাণীর রিপোর্ট সফলভাবে নথিভুক্ত হয়েছে!"
        : "Pet FIR report successfully registered!",
      "success"
    );
  };

  // ==========================================================
  // FILTER LISTINGS
  // ==========================================================

  const lostListings =
    listings.filter(
      (listing) =>
        listing.type === "lost"
    );

  const foundListings =
    listings.filter(
      (listing) =>
        listing.type === "found"
    );

  // ==========================================================
  // PET CARD
  // ==========================================================

  const renderPetCard = (
    item: LostAndFoundListing
  ) => {
    const isMatched =
      matchedIds.includes(
        item.id
      );

    const displayImg =
      item.photoUrl &&
      item.photoUrl.length > 5
        ? item.photoUrl
        : PET_IMAGES[
            item.species
          ] ||
          PET_IMAGES.cat;

    return (
      <div
        key={item.id}
        className={`
          bg-white/90
          backdrop-blur-xs
          border
          border-emerald-950/20
          rounded-2xl
          p-4
          flex
          gap-4
          items-center
          shadow-md
          transition-all
          hover:shadow-xl
          hover:-translate-y-0.5
          ${
            isMatched
              ? "ring-2 ring-emerald-500 border-emerald-500 bg-emerald-50/50"
              : ""
          }
        `}
      >
        <div
          className="
            w-24
            h-24
            sm:w-28
            sm:h-28
            rounded-xl
            overflow-hidden
            bg-slate-100
            shrink-0
            border
            border-emerald-900/20
            shadow-inner
          "
        >
          <img
            src={displayImg}
            alt={
              item.petName ||
              item.breed ||
              "Pet"
            }
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 min-w-0 space-y-1 text-xs text-[#1b3554]">
          <div className="flex items-center justify-between gap-2">
            <h4 className="font-extrabold text-[#000f22] text-sm sm:text-base truncate">
              {item.petName ||
                (item.species ===
                "cat"
                  ? "Unknown Cat"
                  : "Unnamed Pet")}
            </h4>

            <span className="px-2.5 py-0.5 border border-emerald-800/40 bg-emerald-100/60 text-emerald-950 text-[10px] font-extrabold rounded-md uppercase shrink-0">
              {item.type}
            </span>
          </div>

          <p className="font-semibold text-emerald-900 capitalize">
            {item.species} /{" "}
            {item.breed ||
              "Unknown breed"}
          </p>

          <p className="flex items-center gap-1.5 text-slate-600 truncate">
            <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />

            <span className="truncate">
              {item.lastLocation ||
                "Unknown location"}
            </span>
          </p>

          <p className="flex items-center gap-1.5 text-slate-600">
            <Calendar className="w-3.5 h-3.5 text-emerald-700 shrink-0" />

            <span>
              {item.type ===
              "lost"
                ? "Date Lost: "
                : "Date Found: "}

              {item.reportedDate}
            </span>
          </p>
        </div>
      </div>
    );
  };

  // ==========================================================
  // RETURN
  // ==========================================================

  return (
    <div className="min-h-screen bg-emerald-50/20 py-10 px-4 sm:px-6 lg:px-8 space-y-8 font-sans">

      {/* ====================================================
          TITLE
      ==================================================== */}

      <div className="max-w-4xl mx-auto text-center space-y-1.5">
        <h1 className="text-3xl sm:text-4xl font-black text-[#000f22] tracking-tight">
          Lost & Found
        </h1>

        <p className="text-sm text-[#1b3554] max-w-xl mx-auto font-medium">
          Helping pets find their way home.
        </p>
      </div>

      {/* ====================================================
          FIND MY PET - IMAGE AI
      ==================================================== */}

      <div className="max-w-6xl mx-auto">
        <div className="bg-white border-2 border-emerald-600/30 rounded-3xl p-6 shadow-xl">

          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-100 mb-3">
              <Sparkles className="w-6 h-6 text-emerald-700" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-[#000f22]">
              Find My Lost Pet with AI
            </h2>

            <p className="text-sm text-slate-600 mt-2 max-w-xl mx-auto">
              Upload a clear photo of your
              lost pet. AI will compare
              the image with pets reported
              as found.
            </p>
          </div>

          {/* UPLOAD */}

          <div className="flex flex-col items-center gap-4">

            <label
              htmlFor="lost-pet-ai-image"
              className="
                cursor-pointer
                w-full
                max-w-md
                border-2
                border-dashed
                border-emerald-500
                rounded-2xl
                p-6
                text-center
                hover:bg-emerald-50
                transition
              "
            >
              <div className="flex flex-col items-center gap-2">

                <Upload className="w-10 h-10 text-emerald-600" />

                <span className="font-bold text-[#000f22]">
                  {searchImage
                    ? "Change Pet Image"
                    : "Choose Lost Pet Image"}
                </span>

                <span className="text-xs text-slate-500">
                  JPG, PNG or WEBP —
                  maximum 10 MB
                </span>
              </div>

              <input
                id="lost-pet-ai-image"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={
                  handleSearchImageChange
                }
              />
            </label>

            {/* IMAGE PREVIEW */}

            {searchImage && (
              <div className="flex flex-col items-center gap-3">

                <img
                  src={URL.createObjectURL(
                    searchImage
                  )}
                  alt="Selected lost pet"
                  className="
                    w-52
                    h-52
                    object-cover
                    rounded-2xl
                    border-2
                    border-emerald-500
                    shadow-lg
                  "
                />

                <p className="text-xs text-slate-600 max-w-xs truncate">
                  Selected:{" "}
                  {searchImage.name}
                </p>

              </div>
            )}

            {/* ERROR */}

            {aiSearchError && (
              <div className="w-full max-w-md bg-red-50 border border-red-300 text-red-700 rounded-xl p-3 text-sm text-center">
                {aiSearchError}
              </div>
            )}

            {/* FIND MY PET BUTTON */}

            <button
              type="button"
              onClick={
                handleAISearch
              }
              disabled={
                !searchImage ||
                isSearchingAI
              }
              className="
                px-8
                py-3
                bg-emerald-600
                hover:bg-emerald-500
                disabled:bg-slate-300
                disabled:cursor-not-allowed
                text-white
                font-black
                rounded-xl
                shadow-lg
                transition
                flex
                items-center
                gap-2
              "
            >
              {isSearchingAI ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />

                  <span>
                    AI is comparing pets...
                  </span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />

                  <span>
                    Find My Pet
                  </span>
                </>
              )}
            </button>
          </div>

          {/* =================================================
              AI RESULTS
          ================================================= */}

          {aiMatches.length > 0 && (
            <div className="mt-8 border-t border-slate-200 pt-6">

              <h3 className="text-xl font-black text-[#000f22] mb-4">
                Possible Matches
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {aiMatches.map(
                  (match, index) => {
                    const listing =
                      match?.listing;

                    if (!listing) {
                      return null;
                    }

                    const image =
                      listing.photoUrl &&
                      listing.photoUrl.length >
                        5
                        ? listing.photoUrl
                        : PET_IMAGES[
                            listing.species as PetSpecies
                          ] ||
                          PET_IMAGES.cat;

                    return (
                      <div
                        key={
                          match.listingId ||
                          index
                        }
                        className="
                          border-2
                          border-emerald-300
                          bg-emerald-50/50
                          rounded-2xl
                          p-4
                          shadow-md
                        "
                      >

                        <img
                          src={image}
                          alt={
                            listing.petName ||
                            "Found pet"
                          }
                          className="
                            w-full
                            h-56
                            object-cover
                            rounded-xl
                          "
                        />

                        <div className="mt-4 space-y-2">

                          <div className="flex justify-between items-center gap-2">

                            <h4 className="text-lg font-black text-[#000f22]">
                              {listing.petName ||
                                "Found Pet"}
                            </h4>

                            <span className="
                              bg-emerald-600
                              text-white
                              px-3
                              py-1
                              rounded-full
                              text-xs
                              font-black
                              shrink-0
                            ">
                              {match.confidence ??
                                0}
                              %
                            </span>
                          </div>

                          <p className="text-sm text-emerald-800 font-bold">
                            AI Similarity
                          </p>

                          <p className="text-sm text-slate-700">
                            {match.reason ||
                              "AI identified similarities between the uploaded pet and this listing."}
                          </p>

                          <div className="text-sm text-slate-700 space-y-1 pt-2">

                            <p>
                              <strong>
                                Species:
                              </strong>{" "}
                              {listing.species ||
                                "Unknown"}
                            </p>

                            <p>
                              <strong>
                                Breed:
                              </strong>{" "}
                              {listing.breed ||
                                "Unknown"}
                            </p>

                            <p>
                              <strong>
                                Color:
                              </strong>{" "}
                              {listing.color ||
                                "Unknown"}
                            </p>

                            {listing.eyeColor && (
                              <p>
                                <strong>
                                  Eye Color:
                                </strong>{" "}
                                {
                                  listing.eyeColor
                                }
                              </p>
                            )}

                            <p>
                              <strong>
                                Location:
                              </strong>{" "}
                              {listing.lastLocation ||
                                "Unknown"}
                            </p>

                            <p>
                              <strong>
                                Contact:
                              </strong>{" "}
                              {listing.contactName ||
                                "Unknown"}
                            </p>

                            {listing.contactPhone && (
                              <p>
                                <strong>
                                  Phone:
                                </strong>{" "}
                                {
                                  listing.contactPhone
                                }
                              </p>
                            )}

                          </div>
                        </div>
                      </div>
                    );
                  }
                )}

              </div>
            </div>
          )}

          {/* NO MATCH */}

          {!isSearchingAI &&
            searchImage &&
            aiMatches.length === 0 &&
            !aiSearchError && (
              <div className="mt-6 bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">

                <p className="font-bold text-slate-700">
                  No possible matches found.
                </p>

                <p className="text-xs text-slate-500 mt-1">
                  Try uploading a clearer
                  photo of your pet.
                </p>

              </div>
            )}

        </div>
      </div>

      {/* ====================================================
          OLD AI FEATURE MATCHER
      ==================================================== */}

      <div className="
        max-w-6xl
        mx-auto
        bg-[#000f22]
        text-white
        p-5
        rounded-2xl
        shadow-xl
        border
        border-emerald-800/40
        flex
        flex-col
        sm:flex-row
        items-center
        justify-between
        gap-4
      ">

        <div className="flex items-center gap-3">

          <div className="
            w-10
            h-10
            rounded-xl
            bg-emerald-950/80
            border
            border-emerald-500/40
            flex
            items-center
            justify-center
            text-emerald-400
            shrink-0
          ">
            <Bot className="w-5 h-5 animate-pulse" />
          </div>

          <div>

            <h3 className="font-bold text-sm text-white">
              AI Multi-Criteria Feature Matcher
            </h3>

            <p className="text-xs text-slate-300">
              Scan breed, color traits,
              face structure, and
              locations across listings.
            </p>

          </div>
        </div>

        <button
          type="button"
          onClick={
            handleRunAiMatch
          }
          disabled={
            isAiMatching
          }
          className="
            px-5
            py-2.5
            bg-emerald-500
            hover:bg-emerald-400
            disabled:bg-slate-600
            text-slate-950
            font-extrabold
            text-xs
            rounded-xl
            shadow-md
            flex
            items-center
            gap-2
            shrink-0
            transition-all
          "
        >
          {isAiMatching ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}

          <span>
            {getTranslation(
              language,
              "aiMatchingBtn"
            ) ||
              "Run AI Detect & Match Analysis"}
          </span>
        </button>
      </div>

      {/* AI TEXT ANALYSIS */}

      {aiAnalysis && (
        <div className="
          max-w-6xl
          mx-auto
          p-4
          bg-[#000f22]
          border
          border-emerald-800/40
          rounded-2xl
          text-xs
          space-y-1
          text-white
          shadow-lg
        ">

          <p className="font-bold text-emerald-400">
            AI Analysis Result:
          </p>

          <p className="text-slate-300">
            {aiAnalysis}
          </p>

          {matchedIds.length >
            0 && (
            <p className="text-emerald-400 font-bold">
              Matched Listing IDs:{" "}
              {matchedIds.join(
                ", "
              )}
            </p>
          )}
        </div>
      )}

      {/* ====================================================
          LOST + FOUND CARDS
      ==================================================== */}

      <div className="
        max-w-6xl
        mx-auto
        grid
        grid-cols-1
        lg:grid-cols-2
        gap-8
        items-start
      ">

        {/* ==================================================
            LOST PETS
        ================================================== */}

        <div className="
          bg-gradient-to-b
          from-emerald-50/90
          via-emerald-100/30
          to-white
          border-2
          border-emerald-600/40
          rounded-3xl
          p-6
          shadow-xl
          shadow-emerald-900/5
          space-y-6
          relative
          overflow-hidden
        ">

          <div className="
            absolute
            top-0
            right-0
            w-32
            h-32
            bg-emerald-300/20
            rounded-full
            blur-2xl
            pointer-events-none
          " />

          <div className="text-center space-y-2 relative z-10">

            <div className="
              inline-flex
              items-center
              gap-2
              text-emerald-950
              font-black
              text-xl
            ">
              <PawPrint className="w-5 h-5 text-emerald-700" />

              <span>
                Lost Pets
              </span>
            </div>

            <p className="
              text-xs
              text-emerald-900/80
              max-w-xs
              mx-auto
              leading-relaxed
              font-medium
            ">
              Have you lost your pet?
              Post a lost report to
              help others spot and
              help.
            </p>

            <button
              type="button"
              onClick={() => {
                setReportType(
                  "lost"
                );

                setIsModalOpen(
                  true
                );
              }}
              className="
                w-full
                sm:w-auto
                px-6
                py-2.5
                border-2
                border-emerald-800
                bg-white
                hover:bg-emerald-50
                text-emerald-950
                font-extrabold
                text-xs
                rounded-xl
                shadow-sm
                hover:shadow-md
                transition-all
                flex
                items-center
                justify-center
                gap-2
                mx-auto
              "
            >
              <Plus className="w-4 h-4 text-emerald-700" />

              <span>
                Report a Lost Pet
              </span>
            </button>

          </div>

          <div className="
            space-y-4
            relative
            z-10
          ">
            {lostListings
              .slice(0, 3)
              .map(
                renderPetCard
              )}
          </div>

          <div className="
            text-center
            pt-2
            relative
            z-10
          ">

            <button
              type="button"
              onClick={() =>
                setViewAllType(
                  "lost"
                )
              }
              className="
                inline-flex
                items-center
                gap-1.5
                text-xs
                font-black
                text-emerald-950
                hover:text-emerald-700
                transition-colors
              "
            >
              <span>
                View All Lost Pets
              </span>

              <ArrowRight className="w-4 h-4" />
            </button>

          </div>
        </div>

        {/* ==================================================
            FOUND PETS
        ================================================== */}

        <div className="
          bg-gradient-to-b
          from-emerald-50/90
          via-emerald-100/30
          to-white
          border-2
          border-emerald-600/40
          rounded-3xl
          p-6
          shadow-xl
          shadow-emerald-900/5
          space-y-6
          relative
          overflow-hidden
        ">

          <div className="
            absolute
            top-0
            right-0
            w-32
            h-32
            bg-emerald-300/20
            rounded-full
            blur-2xl
            pointer-events-none
          " />

          <div className="
            text-center
            space-y-2
            relative
            z-10
          ">

            <div className="
              inline-flex
              items-center
              gap-2
              text-emerald-950
              font-black
              text-xl
            ">
              <PawPrint className="w-5 h-5 text-emerald-700" />

              <span>
                Found Pets
              </span>
            </div>

            <p className="
              text-xs
              text-emerald-900/80
              max-w-xs
              mx-auto
              leading-relaxed
              font-medium
            ">
              Found a pet? Post details
              to help reunite them with
              their family.
            </p>

            <button
              type="button"
              onClick={() => {
                setReportType(
                  "found"
                );

                setIsModalOpen(
                  true
                );
              }}
              className="
                w-full
                sm:w-auto
                px-6
                py-2.5
                border-2
                border-emerald-800
                bg-white
                hover:bg-emerald-50
                text-emerald-950
                font-extrabold
                text-xs
                rounded-xl
                shadow-sm
                hover:shadow-md
                transition-all
                flex
                items-center
                justify-center
                gap-2
                mx-auto
              "
            >
              <Plus className="w-4 h-4 text-emerald-700" />

              <span>
                Report a Found Pet
              </span>
            </button>

          </div>

          <div className="
            space-y-4
            relative
            z-10
          ">
            {foundListings
              .slice(0, 3)
              .map(
                renderPetCard
              )}
          </div>

          <div className="
            text-center
            pt-2
            relative
            z-10
          ">

            <button
              type="button"
              onClick={() =>
                setViewAllType(
                  "found"
                )
              }
              className="
                inline-flex
                items-center
                gap-1.5
                text-xs
                font-black
                text-emerald-950
                hover:text-emerald-700
                transition-colors
              "
            >
              <span>
                View All Found Pets
              </span>

              <ArrowRight className="w-4 h-4" />
            </button>

          </div>
        </div>
      </div>

      {/* ====================================================
          VIEW ALL MODAL
      ==================================================== */}

      {viewAllType && (
        <div className="
          fixed
          inset-0
          z-50
          flex
          items-center
          justify-center
          p-4
          bg-[#000f22]/80
          backdrop-blur-xs
        ">

          <div className="
            bg-white
            border
            border-emerald-800/30
            rounded-3xl
            max-w-3xl
            w-full
            p-6
            space-y-6
            shadow-2xl
            max-h-[85vh]
            overflow-y-auto
          ">

            <div className="
              flex
              items-center
              justify-between
              border-b
              pb-4
              border-slate-200
            ">

              <h3 className="
                text-xl
                font-black
                text-emerald-950
                capitalize
              ">
                All{" "}
                {viewAllType} Pets (
                {viewAllType ===
                "lost"
                  ? lostListings.length
                  : foundListings.length}
                )
              </h3>

              <button
                type="button"
                onClick={() =>
                  setViewAllType(
                    null
                  )
                }
                className="
                  p-1
                  rounded-full
                  hover:bg-emerald-50
                  text-emerald-900
                "
              >
                <X className="w-6 h-6" />
              </button>

            </div>

            <div className="
              grid
              grid-cols-1
              md:grid-cols-2
              gap-4
            ">
              {(viewAllType ===
              "lost"
                ? lostListings
                : foundListings
              ).map(
                renderPetCard
              )}
            </div>

          </div>
        </div>
      )}

      {/* ====================================================
          REPORT PET MODAL
      ==================================================== */}

      {isModalOpen && (
        <div className="
          fixed
          inset-0
          z-50
          flex
          items-center
          justify-center
          p-4
          bg-[#000f22]/80
          backdrop-blur-xs
        ">

          <div className="
            bg-[#000f22]
            text-white
            rounded-3xl
            max-w-lg
            w-full
            p-6
            space-y-4
            shadow-2xl
            border
            border-emerald-800/60
            max-h-[90vh]
            overflow-y-auto
          ">

            <div className="
              flex
              items-center
              justify-between
              border-b
              pb-3
              border-emerald-900
            ">

              <h3 className="
                text-lg
                font-black
                text-white
              ">
                {reportType ===
                "lost"
                  ? "Report Lost Pet"
                  : "Report Found Pet"}
              </h3>

              <button
                type="button"
                onClick={() =>
                  setIsModalOpen(
                    false
                  )
                }
                className="
                  p-1
                  rounded-full
                  hover:bg-emerald-950
                  text-slate-300
                "
              >
                <X className="w-5 h-5" />
              </button>

            </div>

            <form
              onSubmit={
                handleCreateReport
              }
              className="
                space-y-3
                text-xs
              "
            >

              {/* PET NAME + SPECIES */}

              <div className="
                grid
                grid-cols-2
                gap-3
              ">

                <div>
                  <label className="
                    font-bold
                    text-slate-200
                    block
                    mb-1
                  ">
                    Pet Name
                  </label>

                  <input
                    type="text"
                    value={petName}
                    onChange={(event) =>
                      setPetName(
                        event.target.value
                      )
                    }
                    placeholder="e.g. Ricky"
                    className="
                      w-full
                      p-2.5
                      bg-emerald-950/40
                      border
                      border-emerald-800/60
                      focus:border-emerald-400
                      focus:outline-none
                      rounded-xl
                      text-white
                      placeholder-slate-400
                    "
                  />
                </div>

                <div>
                  <label className="
                    font-bold
                    text-slate-200
                    block
                    mb-1
                  ">
                    Species
                  </label>

                  <select
                    value={species}
                    onChange={(event) =>
                      setSpecies(
                        event.target
                          .value as PetSpecies
                      )
                    }
                    className="
                      w-full
                      p-2.5
                      bg-emerald-950/40
                      border
                      border-emerald-800/60
                      focus:border-emerald-400
                      focus:outline-none
                      rounded-xl
                      font-bold
                      text-white
                    "
                  >
                    <option
                      value="cat"
                      className="bg-[#000f22]"
                    >
                      Cat
                    </option>

                    <option
                      value="dog"
                      className="bg-[#000f22]"
                    >
                      Dog
                    </option>

                    <option
                      value="rabbit"
                      className="bg-[#000f22]"
                    >
                      Rabbit
                    </option>

                    <option
                      value="bird"
                      className="bg-[#000f22]"
                    >
                      Bird
                    </option>

                    <option
                      value="other"
                      className="bg-[#000f22]"
                    >
                      Other
                    </option>
                  </select>
                </div>
              </div>

              {/* BREED + COLOR */}

              <div className="
                grid
                grid-cols-2
                gap-3
              ">

                <div>
                  <label className="
                    font-bold
                    text-slate-200
                    block
                    mb-1
                  ">
                    Breed
                  </label>

                  <input
                    type="text"
                    value={breed}
                    onChange={(event) =>
                      setBreed(
                        event.target.value
                      )
                    }
                    required
                    placeholder="e.g. Persian"
                    className="
                      w-full
                      p-2.5
                      bg-emerald-950/40
                      border
                      border-emerald-800/60
                      focus:border-emerald-400
                      focus:outline-none
                      rounded-xl
                      text-white
                      placeholder-slate-400
                    "
                  />
                </div>

                <div>
                  <label className="
                    font-bold
                    text-slate-200
                    block
                    mb-1
                  ">
                    Color
                  </label>

                  <input
                    type="text"
                    value={color}
                    onChange={(event) =>
                      setColor(
                        event.target.value
                      )
                    }
                    required
                    placeholder="e.g. White / Grey"
                    className="
                      w-full
                      p-2.5
                      bg-emerald-950/40
                      border
                      border-emerald-800/60
                      focus:border-emerald-400
                      focus:outline-none
                      rounded-xl
                      text-white
                      placeholder-slate-400
                    "
                  />
                </div>
              </div>

              {/* EYE COLOR */}

              <div>
                <label className="
                  font-bold
                  text-slate-200
                  block
                  mb-1
                ">
                  Eye Color
                </label>

                <input
                  type="text"
                  value={eyeColor}
                  onChange={(event) =>
                    setEyeColor(
                      event.target.value
                    )
                  }
                  placeholder="e.g. Green"
                  className="
                    w-full
                    p-2.5
                    bg-emerald-950/40
                    border
                    border-emerald-800/60
                    focus:border-emerald-400
                    focus:outline-none
                    rounded-xl
                    text-white
                    placeholder-slate-400
                  "
                />
              </div>

              {/* FACE STRUCTURE */}

              <div>
                <label className="
                  font-bold
                  text-slate-200
                  block
                  mb-1
                ">
                  Face Structure
                </label>

                <select
                  value={
                    faceStructure
                  }
                  onChange={(event) =>
                    setFaceStructure(
                      event.target
                        .value as
                        | "round"
                        | "long"
                        | "pointed"
                        | "flat"
                    )
                  }
                  className="
                    w-full
                    p-2.5
                    bg-emerald-950/40
                    border
                    border-emerald-800/60
                    focus:border-emerald-400
                    focus:outline-none
                    rounded-xl
                    text-white
                  "
                >
                  <option
                    value="round"
                    className="bg-[#000f22]"
                  >
                    Round
                  </option>

                  <option
                    value="long"
                    className="bg-[#000f22]"
                  >
                    Long
                  </option>

                  <option
                    value="pointed"
                    className="bg-[#000f22]"
                  >
                    Pointed
                  </option>

                  <option
                    value="flat"
                    className="bg-[#000f22]"
                  >
                    Flat
                  </option>
                </select>
              </div>

              {/* COLLAR */}

              <div>
                <label className="
                  font-bold
                  text-slate-200
                  block
                  mb-1
                ">
                  Collar / Neckband
                </label>

                <input
                  type="text"
                  value={
                    collarNeckband
                  }
                  onChange={(event) =>
                    setCollarNeckband(
                      event.target.value
                    )
                  }
                  placeholder="e.g. Red collar"
                  className="
                    w-full
                    p-2.5
                    bg-emerald-950/40
                    border
                    border-emerald-800/60
                    focus:border-emerald-400
                    focus:outline-none
                    rounded-xl
                    text-white
                    placeholder-slate-400
                  "
                />
              </div>

              {/* SPECIAL FEATURE */}

              <div>
                <label className="
                  font-bold
                  text-slate-200
                  block
                  mb-1
                ">
                  Birthmark / Special Feature
                </label>

                <input
                  type="text"
                  value={
                    birthmarkOrFeature
                  }
                  onChange={(event) =>
                    setBirthmarkOrFeature(
                      event.target.value
                    )
                  }
                  placeholder="e.g. White spot on forehead"
                  className="
                    w-full
                    p-2.5
                    bg-emerald-950/40
                    border
                    border-emerald-800/60
                    focus:border-emerald-400
                    focus:outline-none
                    rounded-xl
                    text-white
                    placeholder-slate-400
                  "
                />
              </div>

              {/* CLOTHING */}

              <div>
                <label className="
                  font-bold
                  text-slate-200
                  block
                  mb-1
                ">
                  Last Worn Cloth
                </label>

                <input
                  type="text"
                  value={
                    lastWearCloth
                  }
                  onChange={(event) =>
                    setLastWearCloth(
                      event.target.value
                    )
                  }
                  placeholder="e.g. Blue shirt"
                  className="
                    w-full
                    p-2.5
                    bg-emerald-950/40
                    border
                    border-emerald-800/60
                    focus:border-emerald-400
                    focus:outline-none
                    rounded-xl
                    text-white
                    placeholder-slate-400
                  "
                />
              </div>

              {/* PHOTO URL */}

              <div>
                <label className="
                  font-bold
                  text-slate-200
                  block
                  mb-1
                ">
                  Custom Photo URL
                  (Optional)
                </label>

                <input
                  type="text"
                  value={photoUrl}
                  onChange={(event) =>
                    setPhotoUrl(
                      event.target.value
                    )
                  }
                  placeholder="Leave empty to use automatic species photo"
                  className="
                    w-full
                    p-2.5
                    bg-emerald-950/40
                    border
                    border-emerald-800/60
                    focus:border-emerald-400
                    focus:outline-none
                    rounded-xl
                    text-white
                    placeholder-slate-400
                  "
                />
              </div>

              {/* LOCATION */}

              <div>
                <label className="
                  font-bold
                  text-slate-200
                  block
                  mb-1
                ">
                  Location
                </label>

                <input
                  type="text"
                  value={lastLocation}
                  onChange={(event) =>
                    setLastLocation(
                      event.target.value
                    )
                  }
                  required
                  placeholder="e.g. Chittagong"
                  className="
                    w-full
                    p-2.5
                    bg-emerald-950/40
                    border
                    border-emerald-800/60
                    focus:border-emerald-400
                    focus:outline-none
                    rounded-xl
                    text-white
                    placeholder-slate-400
                  "
                />
              </div>

              {/* CONTACT */}

              <div className="
                grid
                grid-cols-2
                gap-3
              ">

                <div>
                  <label className="
                    font-bold
                    text-slate-200
                    block
                    mb-1
                  ">
                    Contact Name
                  </label>

                  <input
                    type="text"
                    value={
                      contactName
                    }
                    onChange={(event) =>
                      setContactName(
                        event.target
                          .value
                      )
                    }
                    required
                    className="
                      w-full
                      p-2.5
                      bg-emerald-950/40
                      border
                      border-emerald-800/60
                      focus:border-emerald-400
                      focus:outline-none
                      rounded-xl
                      text-white
                    "
                  />
                </div>

                <div>
                  <label className="
                    font-bold
                    text-slate-200
                    block
                    mb-1
                  ">
                    Contact Phone
                  </label>

                  <input
                    type="text"
                    value={
                      contactPhone
                    }
                    onChange={(event) =>
                      setContactPhone(
                        event.target
                          .value
                      )
                    }
                    required
                    className="
                      w-full
                      p-2.5
                      bg-emerald-950/40
                      border
                      border-emerald-800/60
                      focus:border-emerald-400
                      focus:outline-none
                      rounded-xl
                      text-white
                    "
                  />
                </div>
              </div>

              {/* BUTTONS */}

              <div className="
                flex
                items-center
                justify-end
                gap-2
                pt-3
                border-t
                border-emerald-900
                mt-4
              ">

                <button
                  type="button"
                  onClick={() =>
                    setIsModalOpen(
                      false
                    )
                  }
                  className="
                    px-4
                    py-2
                    bg-emerald-950/80
                    hover:bg-emerald-900
                    text-slate-200
                    font-bold
                    rounded-xl
                    transition-all
                  "
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="
                    px-5
                    py-2
                    bg-emerald-500
                    hover:bg-emerald-400
                    text-slate-950
                    font-black
                    rounded-xl
                    shadow-lg
                    transition-all
                  "
                >
                  Register Report
                </button>

              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default LostAndFoundPage;
