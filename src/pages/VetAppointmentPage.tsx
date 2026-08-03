import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { getTranslation } from "../translations/i18n";
import { mockVets } from "../data/mockData";
import { VetDoctor } from "../types";
import {
  Stethoscope,
  Search,
  Calendar,
  Clock,
  MapPin,
  Star,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Phone,
  FileText,
  Bot,
  Loader2,
} from "lucide-react";

export const VetAppointmentPage: React.FC = () => {
  const {
    language,
    pets,
    addAppointment,
    appointments,
    triggerUpcomingReminders,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVet, setSelectedVet] = useState<VetDoctor | null>(null);
  const [selectedPetId, setSelectedPetId] = useState<string>(pets[0]?.id || "");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");
  const [symptomInput, setSymptomInput] = useState("");
  const [aiFirstAidSteps, setAiFirstAidSteps] = useState<string[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isBookingDone, setIsBookingDone] = useState(false);

  // Filter vets
  const filteredVets = mockVets.filter(
    (v) =>
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const fetchAiFirstAid = async () => {
    if (!symptomInput.trim()) return;
    setIsAiLoading(true);

    try {
      const activePet = pets.find((p) => p.id === selectedPetId);
      const res = await fetch("/api/gemini/first-aid", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          symptom: symptomInput,
          petType: activePet?.species || "pet",
          language,
        }),
      });

      const data = await res.json();
      setAiFirstAidSteps(data.firstAidSteps || []);
    } catch (err) {
      console.error("First aid error:", err);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVet || !selectedTimeSlot || !selectedPetId) return;

    const pet = pets.find((p) => p.id === selectedPetId);

    addAppointment({
      pet_id: selectedPetId,
      petName: pet?.name || "Pet",
      vet_id: selectedVet.id,
      vetName: selectedVet.name,
      clinicName: selectedVet.clinicName,
      area: selectedVet.area,
      date: new Date().toISOString().split("T")[0],
      time: selectedTimeSlot,
      status: "scheduled",
      symptomProblem: symptomInput,
      firstAidAdvice: aiFirstAidSteps,
      feeTk: selectedVet.feeTk,
      consultationType: "in_person",
    });

    setIsBookingDone(true);
    setTimeout(() => {
      setIsBookingDone(false);
      setSelectedVet(null);
      setSymptomInput("");
      setAiFirstAidSteps([]);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 space-y-10">
      
      {/* Header */}
      <div className="max-w-4xl mx-auto text-center space-y-2">
        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-extrabold uppercase rounded-full">
          Bangladesh Vet Network
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 font-display">
          {getTranslation(language, "vetPageTitle")}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto">
          {language === "bn"
            ? "বাংলাদেশে অবস্থিত রেজিস্টার্ড পশু হাসপাতাল ও ভেটেরিনারি চিকিৎসকদের সময়সূচী খুঁজুন এবং অ্যাপয়েন্টমেন্ট বুক করুন।"
            : "Search registered pet clinics in Dhaka, Chattogram & Sylhet. Get 1-hour appointment reminders & Gemini AI first-aid guidance."}
        </p>
      </div>

      {/* Vet Search Bar */}
      <div className="max-w-3xl mx-auto bg-white p-3 rounded-2xl shadow-md border border-slate-200 flex items-center gap-2" id="vet-search-bar">
        <Search className="w-5 h-5 text-slate-400 ml-2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={getTranslation(language, "vetSearchPlaceholder")}
          className="flex-1 text-xs sm:text-sm text-slate-800 focus:outline-none"
        />
        <button
          onClick={() => {}}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all"
        >
          {getTranslation(language, "searchBtn")}
        </button>
      </div>

      {/* Vet List Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVets.map((vet) => (
          <div
            key={vet.id}
            className="bg-white rounded-3xl p-6 shadow-md border border-slate-200 hover:shadow-xl transition-all space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <img
                  src={vet.photoUrl}
                  alt={vet.name}
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-blue-500/30 shrink-0"
                />
                <div>
                  <h3 className="font-bold text-slate-900 text-sm font-display">{vet.name}</h3>
                  <p className="text-[11px] font-semibold text-blue-600 leading-tight">{vet.specialty}</p>
                  <p className="text-[10px] text-slate-500 mt-1">{vet.qualification}</p>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                  <span className="truncate">{vet.clinicName}, {vet.area}</span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="flex items-center gap-1 font-bold text-amber-500 text-xs">
                    <Star className="w-4 h-4 fill-current" />
                    <span>{vet.rating} ({vet.experienceYears} yrs exp)</span>
                  </span>
                  <span className="font-black text-slate-900 text-sm">৳{vet.feeTk}</span>
                </div>
              </div>

              {/* Schedules Available */}
              <div className="space-y-1.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Available Slots Today:</p>
                <div className="flex flex-wrap gap-1.5">
                  {vet.availableTimes.map((time) => (
                    <span
                      key={time}
                      onClick={() => {
                        setSelectedVet(vet);
                        setSelectedTimeSlot(time);
                      }}
                      className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 rounded-lg text-[11px] font-mono font-bold cursor-pointer transition-colors"
                    >
                      {time}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setSelectedVet(vet);
                setSelectedTimeSlot(vet.availableTimes[0]);
              }}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all mt-2"
            >
              Book Appointment (৳{vet.feeTk})
            </button>
          </div>
        ))}
      </div>

      {/* Scheduled Appointments History */}
      <div className="max-w-4xl mx-auto bg-white rounded-3xl p-6 shadow-md border border-slate-200 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-slate-900 text-sm font-display">
              My Scheduled Vet Appointments & Prescription History
            </h3>
          </div>
          <button
            onClick={triggerUpcomingReminders}
            className="text-xs font-bold text-amber-700 bg-amber-100 hover:bg-amber-200 px-3 py-1 rounded-lg"
          >
            Test 1-Hr Alert
          </button>
        </div>

        <div className="space-y-3">
          {appointments.map((appt) => (
            <div
              key={appt.id}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-800 font-bold font-mono text-[10px] rounded-md">
                    #{appt.id}
                  </span>
                  <span className="font-bold text-slate-900">{appt.vetName}</span>
                  <span className="text-slate-500">• {appt.clinicName}</span>
                </div>
                <p className="text-slate-600">
                  <strong>Pet:</strong> {appt.petName} | <strong>Time:</strong> {appt.time} | <strong>Area:</strong> {appt.area}
                </p>
                {appt.symptomProblem && (
                  <p className="text-slate-500 italic">"Symptom: {appt.symptomProblem}"</p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-bold rounded-full text-[11px]">
                  Confirmed
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Booking & AI First-Aid Modal */}
      {selectedVet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <img
                  src={selectedVet.photoUrl}
                  alt={selectedVet.name}
                  className="w-12 h-12 rounded-xl object-cover"
                />
                <div>
                  <h3 className="font-bold text-slate-900 text-sm font-display">{selectedVet.name}</h3>
                  <p className="text-xs text-blue-600">{selectedVet.clinicName}, {selectedVet.area}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedVet(null)}
                className="text-slate-400 hover:text-slate-700 text-xs font-bold"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleBookSubmit} className="space-y-4 text-xs">
              
              {/* Pet Selection */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">{getTranslation(language, "selectPetLabel")}</label>
                <select
                  value={selectedPetId}
                  onChange={(e) => setSelectedPetId(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                >
                  {pets.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.species.toUpperCase()} - {p.breed})
                    </option>
                  ))}
                </select>
              </div>

              {/* Available Time Slots */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">{getTranslation(language, "selectTimeSlot")}</label>
                <div className="flex flex-wrap gap-2">
                  {selectedVet.availableTimes.map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setSelectedTimeSlot(time)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold border transition-all ${
                        selectedTimeSlot === time
                          ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              {/* Symptom Input & AI First-Aid Advice */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="font-bold text-slate-700 block">{getTranslation(language, "symptomLabel")}</label>
                <textarea
                  value={symptomInput}
                  onChange={(e) => setSymptomInput(e.target.value)}
                  placeholder="e.g. Pet is scratching ears intensely, vomiting or lethargic..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 h-20 text-xs"
                />

                <button
                  type="button"
                  onClick={fetchAiFirstAid}
                  disabled={isAiLoading || !symptomInput.trim()}
                  className="w-full py-2 bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 rounded-xl font-bold text-xs flex items-center justify-center gap-2"
                >
                  {isAiLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Bot className="w-4 h-4 text-purple-600" />
                  )}
                  <span>{getTranslation(language, "getAiFirstAid")}</span>
                </button>

                {/* AI First-Aid Steps Display */}
                {aiFirstAidSteps.length > 0 && (
                  <div className="p-4 bg-purple-50/80 border border-purple-200 rounded-2xl space-y-2 text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-purple-900">
                      <Sparkles className="w-4 h-4 text-purple-600" />
                      <span>{getTranslation(language, "aiFirstAidTitle")}</span>
                    </div>
                    <ul className="space-y-1 list-disc list-inside text-purple-950 font-medium">
                      {aiFirstAidSteps.map((step, i) => (
                        <li key={i}>{step}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Reminder Warning */}
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 font-semibold">
                {getTranslation(language, "reminderNotice")}
              </div>

              {isBookingDone ? (
                <div className="p-3 bg-emerald-100 text-emerald-800 font-bold rounded-xl text-center">
                  Appointment Successfully Booked!
                </div>
              ) : (
                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl text-xs shadow-md"
                >
                  {getTranslation(language, "confirmBooking")} {selectedVet.feeTk})
                </button>
              )}

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
