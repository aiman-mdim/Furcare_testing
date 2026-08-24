import React, { useState } from "react";
import { useApp, PageName } from "../context/AppContext";
import { getTranslation } from "../translations/i18n";
import {
  Heart,
  Stethoscope,
  Scissors,
  Hotel,
  Store,
  ShieldCheck,
  Search,
  Crown,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Calendar,
  Users,
  Award,
  PhoneCall,
  Bot,

  // NEW Icon
  Star,
  ChevronDown,
  Quote,
  UserCircle,
} from "lucide-react";

export const HomePage: React.FC = () => {
  const { language, setActivePage, setIsAiModalOpen } = useApp();

    const [openFAQ, setOpenFAQ] = useState<number | null>(0);

const testimonials = [
  {
    name: "Aiman",
    city: "Chattogram",
    review:
      "The online veterinarian diagnosed my puppy within minutes. Booking was extremely simple and professional.",
  },
  {
    name: "Sarah",
    city: "Dhaka",
    review:
      "Doorstep grooming was amazing. My cat loved the service and the staff were very friendly.",
  },
  {
    name: "Fahim",
    city: "Sylhet",
    review:
      "Lost & Found helped me recover my missing cat in just two days. Highly recommended.",
  },
];

const faqs = [
  {
    question: "How do I book a veterinarian?",
    answer:
      "Go to the Vet section, choose your preferred veterinarian, select a date and time, and confirm your appointment.",
  },
  {
    question: "Is AI Doctor free?",
    answer:
      "Yes. AI Doctor provides preliminary guidance. For emergencies, always consult a licensed veterinarian.",
  },
  {
    question: "Can I book home grooming?",
    answer:
      "Yes. Doorstep grooming is available in selected cities across Bangladesh.",
  },
  {
    question: "Do you provide emergency ambulance?",
    answer:
      "Yes. Emergency ambulance service is available 24/7 in supported locations.",
  },
  {
    question: "How do vaccination reminders work?",
    answer:
      "You'll receive automatic reminders before your pet's next vaccination date.",
  },
  {
    question: "Are medical records secure?",
    answer:
      "Absolutely. Your pet's medical history is stored securely and accessible only by authorized users.",
  },
];

  const categories: {
    id: PageName;
    titleKey: any;
    descKey: any;
    icon: React.ReactNode;
    bgImage: string;
    tagEn: string;
    tagBn: string;
    badgeColor: string;
  }[] = [
    {
      id: "adoption",
      titleKey: "catAdoptionTitle",
      descKey: "catAdoptionDesc",
      icon: <Heart className="w-6 h-6 text-rose-500" />,
      bgImage: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80",
      tagEn: "Tinder Match",
      tagBn: "টিন্ডার ম্যাচ",
      badgeColor: "bg-rose-500",
    },
    {
      id: "vet",
      titleKey: "catVetTitle",
      descKey: "catVetDesc",
      icon: <Stethoscope className="w-6 h-6 text-blue-500" />,
      bgImage: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80",
      tagEn: "1-Hr Reminder",
      tagBn: "১-ঘন্টা রিমাইন্ডার",
      badgeColor: "bg-blue-600",
    },
    {
      id: "grooming",
      titleKey: "catGroomingTitle",
      descKey: "catGroomingDesc",
      icon: <Scissors className="w-6 h-6 text-purple-500" />,
      bgImage: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=800&q=80",
      tagEn: "Doorstep Home",
      tagBn: "বাসায় গ্রুমিং",
      badgeColor: "bg-purple-600",
    },
    {
      id: "hotel",
      titleKey: "catHotelTitle",
      descKey: "catHotelDesc",
      icon: <Hotel className="w-6 h-6 text-amber-500" />,
      bgImage: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=800&q=80",
      tagEn: "৳500/day AC",
      tagBn: "৳৫০০/দিন এসি",
      badgeColor: "bg-amber-600",
    },
    {
      id: "store",
      titleKey: "catStoreTitle",
      descKey: "catStoreDesc",
      icon: <Store className="w-6 h-6 text-emerald-500" />,
      bgImage: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=800&q=80",
      tagEn: "Supermart",
      tagBn: "অনলাইন সুপারমার্ট",
      badgeColor: "bg-emerald-600",
    },
    {
      id: "vaccines",
      titleKey: "catVaccineTitle",
      descKey: "catVaccineDesc",
      icon: <ShieldCheck className="w-6 h-6 text-teal-500" />,
      bgImage: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80",
      tagEn: "Digital Passport",
      tagBn: "ডিজিটাল পাসপোর্ট",
      badgeColor: "bg-teal-600",
    },
    {
      id: "lostfound",
      titleKey: "catLostFoundTitle",
      descKey: "catLostFoundDesc",
      icon: <Search className="w-6 h-6 text-indigo-500" />,
      bgImage: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80",
      tagEn: "AI Detect Match",
      tagBn: "AI শনাক্তকরণ",
      badgeColor: "bg-indigo-600",
    },
    {
      id: "premium",
      titleKey: "catPremiumTitle",
      descKey: "catPremiumDesc",
      icon: <Crown className="w-6 h-6 text-amber-400" />,
      bgImage: "https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&w=800&q=80",
      tagEn: "৳500 VIP Package",
      tagBn: "৳৫০০ ভিআইপি",
      badgeColor: "bg-amber-500",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 space-y-16 pb-20 overflow-hidden">
      
      {/* Hero Section with Float-up Animation & Glass Panel */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 text-white overflow-hidden">
        {/* Background Decorative Blur Orbs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6 text-left animate-slide-up">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-400/30 backdrop-blur-md text-emerald-300 text-xs font-bold tracking-wide">
              <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" />
              <span>{language === "bn" ? "বাংলাদেশের প্রথম স্মার্ট পেট কেয়ার সিস্টেম" : "Bangladesh's #1 Smart Pet Healthcare System"}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] font-display">
              {getTranslation(language, "heroTitle")}
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed font-normal">
              {getTranslation(language, "heroSubtitle")}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => setActivePage("vet")}
                className="flex items-center gap-2 px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm rounded-2xl shadow-lg hover:shadow-emerald-500/25 transition-all transform hover:-translate-y-0.5"
              >
                <Stethoscope className="w-5 h-5" />
                <span>{getTranslation(language, "bookVetNow")}</span>
              </button>

              <button
                onClick={() => setActivePage("adoption")}
                className="flex items-center gap-2 px-6 py-3.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm rounded-2xl backdrop-blur-md transition-all"
              >
                <Heart className="w-5 h-5 text-rose-400 fill-current" />
                <span>{getTranslation(language, "exploreAdoption")}</span>
              </button>

              <button
                onClick={() => setIsAiModalOpen(true)}
                className="flex items-center gap-2 px-5 py-3.5 bg-amber-400/90 hover:bg-amber-400 text-slate-950 font-extrabold text-sm rounded-2xl transition-all shadow-md"
              >
                <Bot className="w-5 h-5 animate-bounce" />
                <span>{language === "bn" ? "AI ডাক্তার থেকে পরামর্শ" : "Ask AI Doctor"}</span>
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10 text-xs">
              <div>
                <p className="text-xl font-black text-white font-display">12,500+</p>
                <p className="text-slate-400">{language === "bn" ? "ভেরিফাইড পোষা প্রাণী" : "Registered Pets"}</p>
              </div>
              <div>
                <p className="text-xl font-black text-white font-display">150+</p>
                <p className="text-slate-400">{language === "bn" ? "বিশেষজ্ঞ পশু ডাক্তার" : "Expert Vets in BD"}</p>
              </div>
              <div>
                <p className="text-xl font-black text-white font-display">99.4%</p>
                <p className="text-slate-400">{language === "bn" ? "সন্তুষ্ট গ্রাহক" : "Happy Pet Owners"}</p>
              </div>
            </div>
          </div>

          {/* Hero Right Visual Glass Banner */}
          <div className="lg:col-span-5 relative animate-fade-in">
            <div className="relative rounded-3xl overflow-hidden border border-white/20 bg-white/5 backdrop-blur-lg p-3 shadow-2xl group">
              <img
                src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1000&q=80"
                alt="Pets Care"
                className="w-full h-80 sm:h-96 object-cover rounded-2xl group-hover:scale-105 transition-transform duration-700"
              />
              {/* Glass Floating Card Badge */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-slate-900/80 border border-white/20 backdrop-blur-md text-white shadow-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center font-bold text-slate-950">
                    24/7
                  </div>
                  <div>
                    <p className="text-xs font-bold">{language === "bn" ? "জরুরি চিকিৎসা সেবা" : "Emergency Vet Ambulance"}</p>
                    <p className="text-[11px] text-slate-300">{language === "bn" ? "ঢাকা, চট্টগ্রাম ও সিলেটে সহজ বুকিং" : "Dhaka, Chattogram & Sylhet"}</p>
                  </div>
                </div>
                <button
                  onClick={() => setActivePage("vet")}
                  className="px-3 py-1.5 bg-white text-slate-950 text-xs font-bold rounded-xl hover:bg-emerald-400"
                >
                  Call
                </button>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Service Categories Grid Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full">
            {getTranslation(language, "brandName")} Services
          </span>
          <h2 className="text-3xl font-black text-slate-900 font-display">
            {getTranslation(language, "servicesTitle")}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            {getTranslation(language, "servicesSubtitle")}
          </p>
        </div>

        {/* Categories Grid (8 Cards with background images & frosted glass) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, index) => (
            <div
              key={cat.id}
              onClick={() => setActivePage(cat.id)}
              className="group relative h-72 rounded-3xl overflow-hidden cursor-pointer shadow-md hover:shadow-2xl transition-all duration-300 border border-slate-200/80 transform hover:-translate-y-1.5"
            >
              {/* Category Background Image */}
              <img
                src={cat.bgImage}
                alt={cat.id}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              
              {/* Dark Gradient Overlay for High Contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-900/20" />

              {/* Top Badge */}
              <div className="absolute top-4 right-4 z-10">
                <span className={`px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide text-white rounded-lg shadow-sm ${cat.badgeColor}`}>
                  {language === "bn" ? cat.tagBn : cat.tagEn}
                </span>
              </div>

              {/* Glass Bottom Info Box */}
              <div className="absolute bottom-3 left-3 right-3 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white space-y-2 transition-colors group-hover:bg-white/20">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-white text-slate-900 shadow-sm shrink-0">
                    {cat.icon}
                  </div>
                  <h3 className="font-bold text-sm font-display line-clamp-1">
                    {getTranslation(language, cat.titleKey)}
                  </h3>
                </div>

                <p className="text-[11px] text-slate-200 line-clamp-2 leading-relaxed">
                  {getTranslation(language, cat.descKey)}
                </p>

                <div className="pt-1 flex items-center justify-between text-xs font-bold text-emerald-300 group-hover:text-emerald-200">
                  <span>{language === "bn" ? "প্রবেশ করুন" : "Open Service"}</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>


      {/* ================= Testimonials ================= */}

<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

<div className="text-center mb-12">
<h2 className="text-4xl font-black text-slate-900">
What Our Pet Owners Say
</h2>

<p className="text-slate-500 mt-3">
Trusted by thousands of pet lovers across Bangladesh.
</p>

</div>

<div className="grid md:grid-cols-3 gap-8">

{testimonials.map((item,index)=>(

<div
key={index}
className="bg-white hover:bg-emerald-50 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">

<div className="flex items-center gap-1 mb-5">

{[1,2,3,4,5].map(star=>(
<Star
key={star}
className="w-5 h-5 fill-yellow-400 text-yellow-400"
/>
))}

</div>

<Quote className="w-10 h-10 text-emerald-500 mb-5"/>

<p className="text-slate-600 leading-relaxed">
{item.review}
</p>

<div className="flex items-center gap-4 mt-8">

<UserCircle className="w-12 h-12 text-emerald-600"/>

<div>

<h4 className="font-bold">
{item.name}
</h4>

<p className="text-sm text-slate-500">
{item.city}
</p>

</div>

</div>

</div>

))}

</div>

</section>

{/* ================= FAQ ================= */}

<section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">

<div className="text-center mb-10">

<h2 className="text-4xl font-black">
Frequently Asked Questions
</h2>

<p className="text-slate-500 mt-3">
Everything you need to know about FurCare.
</p>

</div>

<div className="space-y-5">

{faqs.map((faq,index)=>(

<div
key={index}
className="bg-white rounded-2xl shadow-md overflow-hidden">

<button

onClick={()=>setOpenFAQ(openFAQ===index?null:index)}

className="w-full flex justify-between items-center px-6 py-5 text-left font-bold hover:bg-emerald-50 transition">

<span>{faq.question}</span>

<ChevronDown

className={`transition-transform ${
openFAQ===index?"rotate-180":""
}`}

/>

</button>

{openFAQ===index && (

<div className="px-6 pb-6 text-slate-600 leading-relaxed">

{faq.answer}

</div>

)}

</div>

))}

</div>

</section>

   {/* Emergency Hotline Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 rounded-3xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl border border-emerald-700/50">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/20 border border-rose-400/40 flex items-center justify-center text-rose-400 shrink-0">
              <ShieldAlert className="w-8 h-8 animate-pulse" />
            </div>
            <div>
              <h3 className="text-xl font-black font-display">
                {language === "bn" ? "পোষা প্রাণীর অসুস্থতা বা দুর্ঘটনা? ২৪/৭ জরুরি ভেটেরিনারি কেয়ার" : "Pet Illness or Injury? 24/7 Emergency Ambulance & Vet"}
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                {language === "bn"
                  ? "আমাদের বিশেষজ্ঞ ডাক্তার টিম ঢাকা, চট্টগ্রাম ও সিলেটে তাত্ক্ষণিক হোম ভিজিট ও অ্যাম্বুলেন্স সেবা দিতে প্রস্তুত।"
                  : "Our emergency vet squad provides immediate home visits and ambulance dispatch across Bangladesh."}
              </p>
            </div>
          </div>

          <button
            onClick={() => setActivePage("vet")}
            className="shrink-0 px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-xs rounded-2xl shadow-lg transition-all"
          >
            {language === "bn" ? "জরুরি ডাক্তার ডাকুন" : "Call Emergency Vet"}
          </button>
        </div>
      </section>
    </div>
  );
};

 
