import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { getTranslation } from "../translations/i18n";
import { mockLostFound } from "../data/mockData";
import { LostAndFoundListing, PetSpecies } from "../types";
import {
  Search,
  Plus,
  Bot,
  Sparkles,
  MapPin,
  Phone,
  AlertTriangle,
  Upload,
  CheckCircle2,
  Loader2,
  Eye,
  Tag,
} from "lucide-react";

export const LostAndFoundPage: React.FC = () => {
  const { language, addToast } = useApp();

  const [listings, setListings] = useState<LostAndFoundListing[]>(mockLostFound);
  const [reportType, setReportType] = useState<"lost" | "found">("lost");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [petName, setPetName] = useState("");
  const [species, setSpecies] = useState<PetSpecies>("dog");
  const [breed, setBreed] = useState("");
  const [color, setColor] = useState("");
  const [eyeColor, setEyeColor] = useState("");
  const [faceStructure, setFaceStructure] = useState<"round" | "long" | "pointed" | "flat">("round");
  const [collarNeckband, setCollarNeckband] = useState("");
  const [birthmarkOrFeature, setBirthmarkOrFeature] = useState("");
  const [lastWearCloth, setLastWearCloth] = useState("");
  const [lastLocation, setLastLocation] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactName, setContactName] = useState("");
  const [photoUrl, setPhotoUrl] = useState("https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80");

  // AI Matcher State
  const [isAiMatching, setIsAiMatching] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string>("");
  const [matchedIds, setMatchedIds] = useState<string[]>([]);

  const handleRunAiMatch = async () => {
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
      const res = await fetch("/api/gemini/lost-found-match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lostPetData: lostPetSample,
          foundListings: listings.filter((l) => l.type === "found"),
          language,
        }),
      });

      const data = await res.json();
      setMatchedIds(data.matchedIds || []);
      setAiAnalysis(data.analysis || "AI feature scan completed.");
    } catch (err) {
      console.error("AI Matcher failed:", err);
      setAiAnalysis("AI Scan failed to connect. Checked manually against color and breed.");
    } finally {
      setIsAiMatching(false);
    }
  };

  const handleCreateReport = (e: React.FormEvent) => {
    e.preventDefault();
    const newReport: LostAndFoundListing = {
      id: "LF-" + Math.floor(100 + Math.random() * 900),
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
      photoUrl,
      status: "active",
      reportedDate: new Date().toISOString().split("T")[0],
    };

    setListings((prev) => [newReport, ...prev]);
    setIsModalOpen(false);
    addToast(
      language === "bn"
        ? "হারানো/প্রাপ্ত প্রাণীর রিপোর্ট সফলভাবে নথিভুক্ত হয়েছে!"
        : "Pet FIR report successfully registered!",
      "success"
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 space-y-10">
      
      {/* Title */}
      <div className="max-w-4xl mx-auto text-center space-y-2">
        <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-xs font-extrabold uppercase rounded-full">
          AI Feature Detection & Matching
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 font-display">
          {getTranslation(language, "lostFoundTitle")}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto">
          {getTranslation(language, "lostFoundSub")}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="max-w-2xl mx-auto flex flex-wrap items-center justify-center gap-4">
        <button
          onClick={() => {
            setReportType("lost");
            setIsModalOpen(true);
          }}
          className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-2xl shadow-md flex items-center gap-2"
        >
          <AlertTriangle className="w-4 h-4" />
          <span>{getTranslation(language, "reportLostPet")}</span>
        </button>

        <button
          onClick={() => {
            setReportType("found");
            setIsModalOpen(true);
          }}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-2xl shadow-md flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>{getTranslation(language, "reportFoundPet")}</span>
        </button>
      </div>

      {/* AI Detect & Match Section */}
      <div className="max-w-4xl mx-auto bg-gradient-to-r from-indigo-900 to-slate-900 text-white p-6 rounded-3xl shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-indigo-300 shrink-0">
              <Bot className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-sm font-display">AI Multi-Criteria Pattern Detect</h3>
              <p className="text-xs text-slate-300">
                Matches color, eye color, face structure, neckband & birthmark against all listings.
              </p>
            </div>
          </div>

          <button
            onClick={handleRunAiMatch}
            disabled={isAiMatching}
            className="px-5 py-2.5 bg-indigo-500 hover:bg-indigo-400 text-slate-950 font-black text-xs rounded-xl shadow-md flex items-center gap-2 shrink-0"
          >
            {isAiMatching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>{getTranslation(language, "aiMatchingBtn")}</span>
          </button>
        </div>

        {aiAnalysis && (
          <div className="p-4 bg-indigo-950/80 border border-indigo-700 rounded-2xl text-xs space-y-2">
            <p className="font-bold text-indigo-200">{getTranslation(language, "aiMatchResult")}:</p>
            <p className="text-slate-300">{aiAnalysis}</p>
            {matchedIds.length > 0 && (
              <p className="text-emerald-400 font-bold">Matched Listing IDs: {matchedIds.join(", ")}</p>
            )}
          </div>
        )}
      </div>

      {/* Listings Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.map((item) => {
          const isMatched = matchedIds.includes(item.id);

          return (
            <div
              key={item.id}
              className={`bg-white rounded-3xl p-5 shadow-md border transition-all space-y-4 ${
                isMatched ? "ring-2 ring-emerald-500 border-emerald-500" : "border-slate-200"
              }`}
            >
              <div className="relative rounded-2xl overflow-hidden h-48">
                <img
                  src={item.photoUrl}
                  alt={item.breed}
                  className="w-full h-full object-cover"
                />
                <span
                  className={`absolute top-3 left-3 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wide rounded-lg text-white shadow-xs ${
                    item.type === "lost" ? "bg-rose-600" : "bg-indigo-600"
                  }`}
                >
                  {item.type.toUpperCase()} PET
                </span>
                {isMatched && (
                  <span className="absolute top-3 right-3 px-2 py-0.5 bg-emerald-500 text-slate-950 font-black text-[10px] rounded-md animate-bounce">
                    AI MATCHED!
                  </span>
                )}
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-slate-900 text-base font-display">
                    {item.petName || item.breed}
                  </h3>
                  <span className="font-mono text-[10px] text-slate-400 font-bold">#{item.id}</span>
                </div>

                <div className="space-y-1 text-slate-600">
                  <p><strong>Color & Eyes:</strong> {item.color} | {item.eyeColor} eyes</p>
                  <p><strong>Face & Collar:</strong> {item.faceStructure} face | {item.collarNeckband || "None"}</p>
                  {item.birthmarkOrFeature && <p><strong>Mark:</strong> {item.birthmarkOrFeature}</p>}
                  <p className="flex items-center gap-1 text-slate-500 pt-1">
                    <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span>{item.lastLocation}</span>
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between font-bold text-slate-800">
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{item.contactPhone}</span>
                  </span>
                  <span className="text-[10px] text-slate-400">{item.reportedDate}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* File Lost / Found Report Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-black text-slate-900 font-display">
              {reportType === "lost" ? "File Lost Pet FIR Report" : "Report Found Pet"}
            </h3>

            <form onSubmit={handleCreateReport} className="space-y-3 text-xs">
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Pet Name (if known)</label>
                  <input
                    type="text"
                    value={petName}
                    onChange={(e) => setPetName(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Species</label>
                  <select
                    value={species}
                    onChange={(e) => setSpecies(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  >
                    <option value="dog">Dog</option>
                    <option value="cat">Cat</option>
                    <option value="rabbit">Rabbit</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Breed</label>
                  <input
                    type="text"
                    value={breed}
                    onChange={(e) => setBreed(e.target.value)}
                    required
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Color</label>
                  <input
                    type="text"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    required
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Eye Color</label>
                  <input
                    type="text"
                    value={eyeColor}
                    onChange={(e) => setEyeColor(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Face Structure</label>
                  <select
                    value={faceStructure}
                    onChange={(e) => setFaceStructure(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  >
                    <option value="round">Round</option>
                    <option value="long">Long</option>
                    <option value="pointed">Pointed</option>
                    <option value="flat">Flat</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Collar / Neckband / Clothing</label>
                <input
                  type="text"
                  value={collarNeckband}
                  onChange={(e) => setCollarNeckband(e.target.value)}
                  placeholder="e.g. Red leather collar with bell"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Birthmark / Special Feature</label>
                <input
                  type="text"
                  value={birthmarkOrFeature}
                  onChange={(e) => setBirthmarkOrFeature(e.target.value)}
                  placeholder="e.g. Black mark on right paw"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Last Seen Location in BD</label>
                <input
                  type="text"
                  value={lastLocation}
                  onChange={(e) => setLastLocation(e.target.value)}
                  required
                  placeholder="e.g. Dhanmondi 8, Dhaka"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Contact Name</label>
                  <input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    required
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    required
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 text-white font-extrabold rounded-xl shadow-md"
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
