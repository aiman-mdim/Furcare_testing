import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { getTranslation } from "../translations/i18n";
import {
  ShieldCheck,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Clock,
  Heart,
  FileText,
  Plus,
  Stethoscope,
  ChevronRight,
} from "lucide-react";

export const VaccinationPage: React.FC = () => {
  const { language, pets, activePetId, setActivePetId, setActivePage } = useApp();

  const activePet = pets.find((p) => p.id === activePetId) || pets[0];

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 space-y-10">
      
      {/* Title */}
      <div className="max-w-4xl mx-auto text-center space-y-2">
        <span className="px-3 py-1 bg-teal-100 text-teal-800 text-xs font-extrabold uppercase rounded-full">
          Smart Health Passport
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 font-display">
          {getTranslation(language, "passportTitle")}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto">
          {language === "bn"
            ? "আপনার পোষা প্রাণীর ডিজিটাল হেলথ পাসপোর্ট। টিকাদানের ইতিহাস, অ্যালার্জি ও মেডিকেল ফাইল নিরাপদ ট্র্যাকিং।"
            : "Digital immunization records, allergy notes, surgeries & real-time automated vaccine due alerts."}
        </p>
      </div>

      {/* Pet Selector Bar */}
      <div className="max-w-3xl mx-auto bg-white p-3 rounded-2xl shadow-md border border-slate-200 flex items-center justify-between gap-4">
        <span className="text-xs font-bold text-slate-700">Select Pet Passport:</span>
        <div className="flex items-center gap-2 overflow-x-auto">
          {pets.map((pet) => (
            <button
              key={pet.id}
              onClick={() => setActivePetId(pet.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                pet.id === activePet.id
                  ? "bg-teal-600 text-white border-teal-600 shadow-xs"
                  : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
              }`}
            >
              <img
                src={pet.photoUrl}
                alt={pet.name}
                className="w-5 h-5 rounded-full object-cover"
              />
              <span>{pet.name}</span>
            </button>
          ))}
        </div>
      </div>

      {activePet && (
        <div className="max-w-5xl mx-auto space-y-8">
          
          {/* Pet Digital Card Hero */}
          <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-teal-700/50 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <img
                src={activePet.photoUrl}
                alt={activePet.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover ring-4 ring-teal-500/50 shadow-md"
              />
              <div className="space-y-1">
                <span className="px-2.5 py-0.5 bg-teal-500/20 text-teal-300 border border-teal-400/30 text-[10px] font-mono font-bold rounded-md">
                  PASSPORT ID: #{activePet.id}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black font-display">{activePet.name}</h2>
                <p className="text-xs text-slate-300 font-medium">
                  {activePet.species.toUpperCase()} • {activePet.breed} • {activePet.ageYears} yrs {activePet.ageMonths} mos • {activePet.weightKg} kg
                </p>
                {activePet.microchipId && (
                  <p className="text-[11px] text-teal-400 font-mono">Microchip: {activePet.microchipId}</p>
                )}
              </div>
            </div>

            <button
              onClick={() => setActivePage("vet")}
              className="shrink-0 px-5 py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs rounded-2xl shadow-md transition-all flex items-center gap-2"
            >
              <Stethoscope className="w-4 h-4" />
              <span>{getTranslation(language, "bookVaccineAppt")}</span>
            </button>
          </div>

          {/* Vaccine Due Notification Banner */}
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-center justify-between gap-4 text-xs text-amber-900">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <p className="font-bold">Next Vaccine Scheduled Due: 15 July 2026</p>
                <p className="text-[11px] text-amber-800">
                  Rabies & Parvovirus booster due in 12 days. Real-time notifications enabled.
                </p>
              </div>
            </div>
            <button
              onClick={() => setActivePage("vet")}
              className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shrink-0"
            >
              Book Doctor
            </button>
          </div>

          {/* Vaccination Records Table */}
          <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-200 space-y-4">
            <h3 className="text-lg font-black text-slate-900 font-display flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-teal-600" />
              <span>{getTranslation(language, "vaccineHistory")}</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] font-bold">
                    <th className="py-3 px-2">Vaccine Name</th>
                    <th className="py-3 px-2">Given Date</th>
                    <th className="py-3 px-2">Next Due Date</th>
                    <th className="py-3 px-2">Veterinarian</th>
                    <th className="py-3 px-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {activePet.vaccinations.map((v) => (
                    <tr key={v.id} className="hover:bg-slate-50">
                      <td className="py-3.5 px-2 font-bold text-slate-900">{v.vaccineName}</td>
                      <td className="py-3.5 px-2 text-slate-600">{v.givenDate}</td>
                      <td className="py-3.5 px-2 font-bold text-teal-700">{v.nextDueDate}</td>
                      <td className="py-3.5 px-2 text-slate-600">{v.veterinarian}</td>
                      <td className="py-3.5 px-2">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                            v.status === "completed"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {v.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Post-Vaccination Care Tips */}
          <div className="bg-teal-50 border border-teal-200/80 rounded-3xl p-6 space-y-3">
            <h4 className="font-bold text-teal-900 text-sm flex items-center gap-2">
              <Heart className="w-4 h-4 text-teal-600" />
              <span>{getTranslation(language, "postVaccineTips")}</span>
            </h4>
            <ul className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-teal-950 font-medium">
              <li className="p-3 bg-white rounded-2xl border border-teal-200">
                1. Ensure 24 hours of quiet rest and warm sleeping area.
              </li>
              <li className="p-3 bg-white rounded-2xl border border-teal-200">
                2. Keep the injection site dry and unrubbed for 24 hours.
              </li>
              <li className="p-3 bg-white rounded-2xl border border-teal-200">
                3. Offer fresh water and avoid strenuous exercise for 2 days.
              </li>
            </ul>
          </div>

        </div>
      )}

    </div>
  );
};
