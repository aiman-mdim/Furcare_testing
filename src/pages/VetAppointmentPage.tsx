import React from "react";
// Import the image file directly from assets
import doctorImg from "../assets/doctor.jpg";

export const VetDoctorCard: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto p-4 font-sans">
      <div className="bg-white rounded-3xl border border-slate-300 p-5 shadow-xs flex items-start justify-between gap-4">
        
        <div className="flex items-start gap-4">
          {/* Avatar Box with Local Image */}
          <div className="w-20 h-20 rounded-2xl border border-slate-300 bg-slate-50 overflow-hidden shrink-0">
            <img
              src={doctorImg}
              alt="Dr. Sharmin Akter"
              className="w-full h-full object-cover object-top"
            />
          </div>

          {/* Details */}
          <div className="space-y-1.5 text-sm text-slate-700">
            <div>
              <span className="font-bold text-slate-900">Doctor Name: </span>
              <span className="font-bold text-blue-900">Dr. Sharmin Akter</span>
            </div>
            <div>
              <span className="font-bold text-slate-900">Clinic Name: </span>
              <span className="text-slate-600">Uttara Pet Care & Vaccination Hub</span>
            </div>
            <div className="text-slate-600">
              <span className="font-bold text-slate-900">Location: </span>
              <span>Uttara, Dhaka</span>
            </div>
          </div>
        </div>

        {/* Fee & Rating */}
        <div className="flex flex-col items-end justify-between self-stretch shrink-0">
          <span className="font-extrabold text-slate-900 text-lg">৳700</span>
          <div className="text-amber-500 font-bold text-xs">★ 4.8</div>
        </div>

      </div>
    </div>
  );
};

export default VetDoctorCard;
