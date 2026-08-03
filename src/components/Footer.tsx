import React from "react";
import { useApp } from "../context/AppContext";
import { getTranslation } from "../translations/i18n";
import { PhoneCall, Mail, MapPin, Heart, ShieldCheck, Headphones } from "lucide-react";

export const Footer: React.FC = () => {
  const { language, setActivePage } = useApp();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          
          {/* Col 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md">
                <Heart className="w-6 h-6 fill-current" />
              </div>
              <span className="text-2xl font-black text-white font-display">
                Fur<span className="text-emerald-400">Care</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {language === "bn"
                ? "বাংলাদেশের শীর্ষস্থানীয় স্মার্ট পেট হেলথকেয়ার প্ল্যাটফর্ম। যাচাইকৃত ডাক্তার, পেট অ্যাডাপশন, হোম গ্রুমিং ও ডিজিটাল ভ্যাকসিন পাসপোর্ট সার্ভিস।"
                : "Bangladesh's leading smart pet healthcare platform. Verified veterinarians, adoption matching, doorstep grooming, and digital health passports."}
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs font-bold text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>{language === "bn" ? "১০০% ভেরিফাইড পেট সার্ভিসেস" : "100% Verified Pet Services"}</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              {language === "bn" ? "জরুরি সার্ভিসেস" : "Core Services"}
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => setActivePage("vet")} className="hover:text-emerald-400 transition-colors">
                  {getTranslation(language, "navVet")}
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage("grooming")} className="hover:text-emerald-400 transition-colors">
                  {getTranslation(language, "navGrooming")}
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage("hotel")} className="hover:text-emerald-400 transition-colors">
                  {getTranslation(language, "navHotel")}
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage("store")} className="hover:text-emerald-400 transition-colors">
                  {getTranslation(language, "navStore")}
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage("adoption")} className="hover:text-emerald-400 transition-colors">
                  {getTranslation(language, "navAdoption")}
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage("lostfound")} className="hover:text-emerald-400 transition-colors">
                  {getTranslation(language, "navLostFound")}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Emergency Helpline BD */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              {language === "bn" ? "২৪/৭ জরুরি সাপোর্ট" : "24/7 Emergency Support"}
            </h4>
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-3">
              <div className="flex items-center gap-3 text-xs">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Hotline BD</p>
                  <p className="font-bold text-white">+880 1700-FURCARE</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                  <Headphones className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Vet Ambulance</p>
                  <p className="font-bold text-white">+880 1800-EMERGENCY</p>
                </div>
              </div>
            </div>
          </div>

          {/* Col 4: Contact & Locations */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              {language === "bn" ? "অফিসের ঠিকানা" : "Headquarters"}
            </h4>
            <ul className="space-y-3 text-xs">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Level 7, Pet Healthcare Tower, Dhanmondi 27, Dhaka, Bangladesh</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>support@furcarebd.com</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 FurCare — Smart Pet Healthcare & Services Platform. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Terms of Service</span>
            <span>Privacy Policy</span>
            <span>Vet License BD</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
