import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { getTranslation } from "../translations/i18n";
import {
  PawPrint,
  Syringe,
  Clock,
  CheckCircle2,
  Calendar,
  Plus,
  ArrowRight,
  ShieldCheck,
  Bell,
  FileSpreadsheet,
  Stethoscope,
  ChevronDown,
} from "lucide-react";

export const VaccinationPage: React.FC = () => {
  const { language, pets, activePetId, setActivePetId, setActivePage, requireAuth } = useApp();

  // Active pet reference
  const activePet = pets.find((p) => p.id === activePetId) || pets[0];

  // Modal / Form states for wireframe buttons
  const [showAddPetModal, setShowAddPetModal] = useState(false);
  const [showAddVaccineModal, setShowAddVaccineModal] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 space-y-8 font-sans text-slate-800">
      
      {/* Top Main Heading */}
      <div className="max-w-5xl mx-auto text-center space-y-1">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Vaccination
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium">
          Protect your pet. Keep vaccinations up to date.
        </p>
      </div>

      {/* Main Content Split Grid (My Pets vs Vaccination Schedule) */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: My Pets */}
        <div className="md:col-span-5 bg-white border border-emerald-100 rounded-2xl p-5 shadow-lg shadow-emerald-500/10 space-y-4">
          <div className="text-center space-y-1 pb-2 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-900 flex items-center justify-center gap-2">
              <PawPrint className="w-5 h-5 text-emerald-600" />
              <span>My Pets</span>
            </h2>
            <p className="text-xs text-slate-500">
              Select a pet to view vaccination details.
            </p>
          </div>

          {/* Pet Cards List */}
          <div className="space-y-3">
            {pets.map((pet) => {
              const isSelected = pet.id === activePet?.id;
              return (
                <div
                  key={pet.id}
                  onClick={() => setActivePetId(pet.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? "border-emerald-500 bg-emerald-50/40 shadow-xs"
                      : "border-slate-200 hover:border-emerald-200 bg-white"
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    {/* Image Placeholder Frame */}
                    <div className="w-14 h-14 rounded-lg bg-slate-100 border border-slate-300 overflow-hidden shrink-0 flex items-center justify-center">
                      {pet.photoUrl ? (
                        <img
                          src={pet.photoUrl}
                          alt={pet.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <PawPrint className="w-6 h-6 text-slate-400" />
                      )}
                    </div>

                    <div className="space-y-0.5">
                      <h3 className="font-extrabold text-slate-900 text-sm">
                        {pet.name}
                      </h3>
                      <p className="text-xs text-slate-600 font-medium capitalize">
                        {pet.species} / {pet.breed}
                      </p>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1 font-medium pt-0.5">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>Age: {pet.ageYears} yrs</span>
                      </p>
                    </div>
                  </div>

                  <ArrowRight
                    className={`w-4 h-4 transition-transform ${
                      isSelected ? "text-emerald-600 translate-x-1" : "text-slate-300"
                    }`}
                  />
                </div>
              );
            })}
          </div>

          {/* Add New Pet Button */}
          <button
            onClick={() => requireAuth() && setShowAddPetModal(true)}
            className="w-full py-2.5 px-4 bg-white hover:bg-emerald-50/50 text-slate-800 font-bold text-xs rounded-xl border border-slate-300 hover:border-emerald-300 shadow-2xs transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5] text-emerald-600" />
            <span>Add New Pet</span>
          </button>
        </div>

        {/* Right Column: Vaccination Schedule & History */}
        <div className="md:col-span-7 bg-white border border-emerald-100 rounded-2xl p-5 shadow-lg shadow-emerald-500/10 space-y-6">
          
          {/* Header */}
          <div className="text-center space-y-1 pb-2 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-900 flex items-center justify-center gap-2">
              <Syringe className="w-5 h-5 text-emerald-600" />
              <span>Vaccination Schedule</span>
            </h2>
            <p className="text-xs text-slate-500">
              View and manage your pet's vaccinations.
            </p>
          </div>

          {/* Select Pet Dropdown */}
          <div className="space-y-1">
            <div className="relative">
              <select
                value={activePet?.id || ""}
                onChange={(e) => setActivePetId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 cursor-pointer"
              >
                {pets.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.species})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3.5 top-3 pointer-events-none" />
            </div>
          </div>

          {/* Upcoming Vaccinations Section */}
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wide">
              Upcoming Vaccinations
            </h3>

            <div className="space-y-2.5">
              {/* Upcoming Item 1 */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100/60 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4 text-emerald-700" />
                  </div>
                  <div>
                    <p className="font-extrabold text-slate-900">Rabies Booster</p>
                    <p className="text-[11px] text-slate-500">Recommended at 12 weeks</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1 justify-end">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <span>Due on</span>
                  </p>
                  <p className="font-bold text-slate-900 text-xs">15/08/2026</p>
                </div>
              </div>

              {/* Upcoming Item 2 */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100/60 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4 text-emerald-700" />
                  </div>
                  <div>
                    <p className="font-extrabold text-slate-900">DHPP / Parvovirus</p>
                    <p className="text-[11px] text-slate-500">Recommended at 16 weeks</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1 justify-end">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <span>Due on</span>
                  </p>
                  <p className="font-bold text-slate-900 text-xs">10/10/2026</p>
                </div>
              </div>

              {/* Upcoming Item 3 */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100/60 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4 text-emerald-700" />
                  </div>
                  <div>
                    <p className="font-extrabold text-slate-900">Deworming & Kennel Cough</p>
                    <p className="text-[11px] text-slate-500">Recommended at 1 year</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1 justify-end">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <span>Due on</span>
                  </p>
                  <p className="font-bold text-slate-900 text-xs">05/01/2027</p>
                </div>
              </div>
            </div>
          </div>

          <hr className="border-slate-200" />

          {/* Vaccination History Section */}
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wide">
              Vaccination History
            </h3>

            <div className="space-y-2.5">
              {activePet?.vaccinations && activePet.vaccinations.length > 0 ? (
                activePet.vaccinations.map((vac) => (
                  <div
                    key={vac.id}
                    className="p-3 bg-slate-50/80 border border-slate-200 rounded-xl flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                      </div>
                      <div>
                        <p className="font-extrabold text-slate-900">{vac.vaccineName}</p>
                        <p className="text-[11px] text-slate-500">Given on {vac.givenDate}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[11px] text-slate-500 font-medium">Next due</p>
                      <p className="font-bold text-slate-900 text-xs">{vac.nextDueDate}</p>
                    </div>
                  </div>
                ))
              ) : (
                <>
                  <div className="p-3 bg-slate-50/80 border border-slate-200 rounded-xl flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                      </div>
                      <div>
                        <p className="font-extrabold text-slate-900">Core Feline Tricat / Core Distemper</p>
                        <p className="text-[11px] text-slate-500">Given on 12/01/2026</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[11px] text-slate-500 font-medium">Next due</p>
                      <p className="font-bold text-slate-900 text-xs">12/01/2027</p>
                    </div>
                  </div>
                  <div className="p-3 bg-slate-50/80 border border-slate-200 rounded-xl flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                      </div>
                      <div>
                        <p className="font-extrabold text-slate-900">Rabies Primary Dose</p>
                        <p className="text-[11px] text-slate-500">Given on 04/03/2025</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[11px] text-slate-500 font-medium">Next due</p>
                      <p className="font-bold text-slate-900 text-xs">04/03/2026</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Add Vaccination Record Button */}
          <button
            onClick={() => requireAuth() && setShowAddVaccineModal(true)}
            className="w-full py-2.5 px-4 bg-white hover:bg-emerald-50/50 text-slate-800 font-bold text-xs rounded-xl border border-slate-300 hover:border-emerald-300 shadow-2xs transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5] text-emerald-600" />
            <span>Add Vaccination Record</span>
          </button>
        </div>

      </div>

      {/* 4 Feature Highlights Grid */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-4">
        
        {/* Card 1 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 text-center space-y-2 shadow-sm hover:shadow-emerald-500/10 transition-shadow">
          <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
          </div>
          <h4 className="font-black text-slate-900 text-xs">Keep Them Protected</h4>
          <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
            Vaccinations help prevent serious diseases.
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 text-center space-y-2 shadow-sm hover:shadow-emerald-500/10 transition-shadow">
          <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto">
            <Bell className="w-5 h-5 text-emerald-600" />
          </div>
          <h4 className="font-black text-slate-900 text-xs">Timely Reminders</h4>
          <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
            Get notified before vaccines are due.
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 text-center space-y-2 shadow-sm hover:shadow-emerald-500/10 transition-shadow">
          <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto">
            <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
          </div>
          <h4 className="font-black text-slate-900 text-xs">Health Records</h4>
          <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
            Track and manage your pet's vaccination history.
          </p>
        </div>

        {/* Card 4 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 text-center space-y-2 shadow-sm hover:shadow-emerald-500/10 transition-shadow">
          <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto">
            <Stethoscope className="w-5 h-5 text-emerald-600" />
          </div>
          <h4 className="font-black text-slate-900 text-xs">Vet Approved</h4>
          <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
            All vaccines are recommended by vets.
          </p>
        </div>

      </div>

      {/* Modal Placeholders */}
      {(showAddPetModal || showAddVaccineModal) && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-xl border border-slate-200 text-center">
            <h3 className="font-bold text-slate-900 text-base">
              {showAddPetModal ? "Add New Pet" : "Add Vaccination Record"}
            </h3>
            <p className="text-xs text-slate-600">
              {showAddPetModal
                ? "Enter your pet's information to manage their immunization passport."
                : "Record a newly completed vaccine dose for " + activePet?.name}
            </p>
            <div className="space-y-2 text-left text-xs">
              <input
                type="text"
                placeholder={showAddPetModal ? "Pet Name" : "Vaccine Name"}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <input
                type="date"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  if (!requireAuth()) return;
                  setShowAddPetModal(false);
                  setShowAddVaccineModal(false);
                }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!requireAuth()) return;
                  setShowAddPetModal(false);
                  setShowAddVaccineModal(false);
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg cursor-pointer"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};