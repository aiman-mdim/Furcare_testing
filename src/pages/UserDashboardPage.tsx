import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { getTranslation } from "../translations/i18n";
import { Pet, PetSpecies } from "../types";
import {
  User,
  Plus,
  ShieldCheck,
  Calendar,
  Heart,
  Stethoscope,
  Trash2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export const UserDashboardPage: React.FC = () => {
  const { language, currentUser, pets, appointments, addPet, setActivePage } = useApp();

  const [isAddPetModalOpen, setIsAddPetModalOpen] = useState(false);

  // New Pet Form State
  const [petName, setPetName] = useState("");
  const [species, setSpecies] = useState<PetSpecies>("dog");
  const [breed, setBreed] = useState("");
  const [ageYears, setAgeYears] = useState(1);
  const [ageMonths, setAgeMonths] = useState(2);
  const [weightKg, setWeightKg] = useState(4.5);
  const [photoUrl, setPhotoUrl] = useState("https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80");

  const handleCreatePet = (e: React.FormEvent) => {
    e.preventDefault();
    const newPet: Pet = {
      id: "PET-" + Math.floor(100 + Math.random() * 900),
      owner_id: currentUser?.id || "USR-101",
      name: petName,
      species,
      breed,
      color: "Brown",
      ageYears,
      ageMonths,
      weightKg,
      gender: "male",
      photoUrl,
      allergies: [],
      vaccinations: [
        {
          id: "v-10",
          vaccineName: "Core Combination",
          givenDate: "2025-01-10",
          nextDueDate: "2026-01-10",
          status: "completed",
          veterinarian: "Dr. Nazmul Ahsan",
        },
      ],
      medicalHistory: [],
    };

    addPet(newPet);
    setIsAddPetModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 space-y-10">
      
      {/* Dashboard Welcome Header */}
      <div className="max-w-6xl mx-auto bg-gradient-to-r from-emerald-900 to-slate-900 text-white p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-emerald-800/50">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500 flex items-center justify-center font-black text-slate-950 text-2xl font-display">
            {currentUser ? currentUser.name.charAt(0) : "U"}
          </div>
          <div>
            <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold uppercase rounded-md">
              {currentUser?.role || "Pet Owner"} Dashboard
            </span>
            <h1 className="text-2xl sm:text-3xl font-black font-display mt-1">
              Welcome Back, {currentUser?.name || "Pet Parent"}!
            </h1>
            <p className="text-xs text-slate-300">{currentUser?.email} • {currentUser?.city || "Dhaka, Bangladesh"}</p>
          </div>
        </div>

        <button
          onClick={() => setIsAddPetModalOpen(true)}
          className="px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-2xl shadow-md transition-all flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Pet</span>
        </button>
      </div>

      {/* Registered Pets Grid */}
      <div className="max-w-6xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-slate-900 font-display">
            My Registered Pets ({pets.length})
          </h2>
          <span className="text-xs text-slate-500 font-semibold">Click pet to manage health passport</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pets.map((pet) => (
            <div
              key={pet.id}
              className="bg-white rounded-3xl p-5 shadow-md border border-slate-200 hover:shadow-xl transition-all space-y-4"
            >
              <div className="flex items-center gap-4">
                <img
                  src={pet.photoUrl}
                  alt={pet.name}
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-emerald-500/30 shrink-0"
                />
                <div>
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-700 font-mono text-[10px] font-bold rounded-md">
                    #{pet.id}
                  </span>
                  <h3 className="font-bold text-slate-900 text-base font-display">{pet.name}</h3>
                  <p className="text-xs text-slate-500">{pet.breed} • {pet.species.toUpperCase()}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-2xl text-slate-700">
                <div><strong>Age:</strong> {pet.ageYears}y {pet.ageMonths}m</div>
                <div><strong>Weight:</strong> {pet.weightKg} kg</div>
              </div>

              <button
                onClick={() => setActivePage("vaccines")}
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>View Digital Passport</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Add Pet Form Modal */}
      {isAddPetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <h3 className="text-xl font-black text-slate-900 font-display">
              Add New Pet to Family
            </h3>

            <form onSubmit={handleCreatePet} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Pet Name</label>
                <input
                  type="text"
                  value={petName}
                  onChange={(e) => setPetName(e.target.value)}
                  required
                  placeholder="e.g. Simba"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
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
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Breed</label>
                  <input
                    type="text"
                    value={breed}
                    onChange={(e) => setBreed(e.target.value)}
                    required
                    placeholder="e.g. Persian"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddPetModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 text-white font-extrabold rounded-xl shadow-md"
                >
                  Save Pet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
