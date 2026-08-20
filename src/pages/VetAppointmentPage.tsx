import React, { useState } from "react";
import { mockVets } from "../data/mockData";

export const VetAppointmentPage: React.FC = () => {
  const [selectedSlots, setSelectedSlots] = useState<{ [key: string]: string }>({});

  const handleSlotSelect = (vetId: string, slot: string) => {
    setSelectedSlots((prev) => ({
      ...prev,
      [vetId]: slot,
    }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 font-sans">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Book Vet Appointment</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockVets.map((vet) => {
          const selectedSlot = selectedSlots[vet.id];

          return (
            <div 
              key={vet.id} 
              className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow"
            >
              {/* Doctor Header */}
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 rounded-2xl border border-slate-100 bg-slate-50 overflow-hidden shrink-0">
                  <img
                    src={vet.photoUrl}
                    alt={vet.name}
                    className="w-full h-full object-cover object-top"
                  />
                </div>

                <div className="space-y-1">
                  <h3 className="font-bold text-slate-900 text-lg leading-snug">{vet.name}</h3>
                  <p className="text-sm font-semibold text-blue-600 leading-tight">
                    {vet.specialty}
                  </p>
                  <p className="text-xs text-slate-500">{vet.qualification}</p>
                </div>
              </div>

              {/* Location, Rating, and Fee */}
              <div className="space-y-2 pt-2 border-t border-slate-100 text-sm">
                <div className="flex items-center gap-2 text-slate-600 text-xs">
                  <span className="text-red-500">📍</span>
                  <span className="truncate">{vet.clinicName}, {vet.area}</span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 font-bold text-amber-500">
                    <span>★</span>
                    <span>{vet.rating}</span>
                    {vet.experienceYears && (
                      <span className="text-amber-600/80 font-normal">
                        ({vet.experienceYears} yrs exp)
                      </span>
                    )}
                  </div>
                  <span className="font-extrabold text-slate-900 text-base">৳{vet.feeTk}</span>
                </div>
              </div>

              {/* Slots */}
              <div className="space-y-2 pt-1">
                <p className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">
                  AVAILABLE SLOTS TODAY:
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {vet.availableTimes.map((slot) => {
                    const isSelected = selectedSlot === slot;
                    return (
                      <button
                        key={slot}
                        onClick={() => handleSlotSelect(vet.id, slot)}
                        className={`py-2 px-1 text-[11px] font-bold rounded-xl transition-all ${
                          isSelected
                            ? "bg-blue-600 text-white shadow-sm"
                            : "bg-blue-50/70 text-blue-600 border border-blue-200 hover:bg-blue-100"
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action Button */}
              <button 
                className={`w-full py-3 font-bold rounded-2xl transition-all active:scale-[0.98] ${
                  selectedSlot 
                    ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md" 
                    : "bg-slate-100 text-slate-400 cursor-not-allowed"
                }`}
                disabled={!selectedSlot}
              >
                {selectedSlot ? `Book Appointment (৳${vet.feeTk})` : "Select a Time Slot"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VetAppointmentPage;