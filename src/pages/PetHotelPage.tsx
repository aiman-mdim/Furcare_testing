import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { getTranslation } from "../translations/i18n";
import { mockPetHotels } from "../data/mockData";
import { PetHotel, Product } from "../types";
import {
  Hotel,
  Search,
  Star,
  MapPin,
  CheckCircle2,
  Calendar,
  ShieldCheck,
  CreditCard,
  Wifi,
  Tv,
} from "lucide-react";

export const PetHotelPage: React.FC = () => {
  const { language, addToCart, setActivePage } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("all");
  const [selectedRoomType, setSelectedRoomType] = useState("all");
  const [bookingDays, setBookingDays] = useState(2);

  const filteredHotels = mockPetHotels.filter((hotel) => {
    const matchesSearch =
      hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hotel.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCity = selectedCity === "all" || hotel.city === selectedCity;
    const matchesRoom = selectedRoomType === "all" || hotel.roomType === selectedRoomType;
    return matchesSearch && matchesCity && matchesRoom;
  });

  const handleBookHotel = (hotel: PetHotel) => {
    const totalCost = hotel.dailyRateTk * bookingDays;

    const productRepresentation: Product = {
      product_id: hotel.id,
      nameEn: `${hotel.name} (${hotel.roomType} - ${bookingDays} Days Boarding)`,
      nameBn: `${hotel.name} (${hotel.roomType} - ${bookingDays} দিনের বোর্ডিং)`,
      category: "accessories",
      targetSpecies: "all",
      priceTk: totalCost,
      rating: hotel.rating,
      reviewsCount: hotel.reviewsCount,
      image: hotel.image,
      descriptionEn: `Boarding room stay at ${hotel.location}, ${hotel.city}. Features 24/7 monitoring and organic meals.`,
      descriptionBn: `${hotel.location}, ${hotel.city}-এ পেটের সুবিধাজনক এসি রুম থাকার ব্যবস্থা।`,
      stock: hotel.availableRooms,
    };

    if (!addToCart(productRepresentation, 1, "hotel_booking", {
      days: bookingDays,
      dailyRate: hotel.dailyRateTk,
    })) return;

    setActivePage("cart");
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 space-y-10">
      
      {/* Title */}
      <div className="max-w-4xl mx-auto text-center space-y-2">
        <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-extrabold uppercase rounded-full">
          Luxury Boarding & Suites
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 font-display">
          {getTranslation(language, "hotelTitle")}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto">
          {getTranslation(language, "hotelSub")}
        </p>
      </div>

      {/* Hotel Search & Filter System */}
      <div className="max-w-5xl mx-auto bg-[#14532D] p-4 rounded-3xl shadow-[0_12px_35px_rgba(20,83,45,0.22)] border border-emerald-800/40 space-y-4" id="hotel-filter-system">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          
          {/* Search Location */}
          <div className="space-y-1">
            <label className="font-bold text-white block">Search Location / Hotel</label>
            <div className="bg-emerald-50/95 border border-emerald-200 rounded-xl px-3 py-2 flex items-center gap-2 shadow-sm">
              <Search className="w-4 h-4 text-emerald-700" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g. Gulshan, Uttara, Khulshi..."
                className="w-full bg-transparent text-slate-800 placeholder:text-slate-400 focus:outline-none"
              />
            </div>
          </div>

          {/* City */}
          <div className="space-y-1">
            <label className="font-bold text-white block">City</label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full px-3 py-2 bg-emerald-50/95 border border-emerald-200 rounded-xl font-medium text-slate-800 focus:outline-none shadow-sm"
            >
              <option value="all">All Cities</option>
              <option value="Dhaka">Dhaka</option>
              <option value="Chattogram">Chattogram</option>
              <option value="Sylhet">Sylhet</option>
            </select>
          </div>

          {/* Room Type */}
          <div className="space-y-1">
            <label className="font-bold text-white block">Room Category</label>
            <select
              value={selectedRoomType}
              onChange={(e) => setSelectedRoomType(e.target.value)}
              className="w-full px-3 py-2 bg-emerald-50/95 border border-emerald-200 rounded-xl font-medium text-slate-800 focus:outline-none shadow-sm"
            >
              <option value="all">All Rooms</option>
              <option value="Standard Room">Standard Room</option>
              <option value="AC Luxury Room">AC Luxury Room</option>
              <option value="VIP Suite">VIP Suite</option>
            </select>
          </div>

          {/* Duration Days */}
          <div className="space-y-1">
            <label className="font-bold text-white block">Stay Duration (Days)</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max="30"
                value={bookingDays}
                onChange={(e) => setBookingDays(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-3 py-2 bg-emerald-50/95 border border-emerald-200 rounded-xl font-bold text-center text-slate-800 shadow-sm"
              />
              <span className="font-bold text-emerald-100">Days</span>
            </div>
          </div>

        </div>
      </div>

      {/* Hotel Cards List */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredHotels.map((hotel) => (
          <div
            key={hotel.id}
            className="bg-white rounded-3xl shadow-md border border-slate-200 hover:shadow-xl transition-all overflow-hidden h-full flex flex-col justify-between"
          >
            <div className="relative h-44">
              <img
                src={hotel.image}
                alt={hotel.name}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-3 left-3 px-2.5 py-1 bg-slate-900/80 text-white backdrop-blur-md rounded-lg text-[10px] font-bold">
                {hotel.roomType}
              </span>
            </div>

            <div className="p-5 flex flex-col flex-1 space-y-3">
              <div>
                <h3 className="text-lg font-black text-slate-900 font-display">{hotel.name}</h3>
                <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  <span>{hotel.location}, {hotel.city}</span>
                </p>
              </div>

              <div className="flex items-center gap-1 text-xs font-bold text-[#14532D]">
                <Star className="w-4 h-4 fill-current" />
                <span>{hotel.rating} Rating ({hotel.reviewsCount} reviews)</span>
              </div>

              <div className="text-[11px] text-slate-500">
                {hotel.availableRooms} rooms available
              </div>

              <ul className="space-y-1 text-xs text-slate-600">
                {(language === "bn" ? hotel.featuresBn : hotel.featuresEn).slice(0, 3).map((f, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <div className="border-t border-slate-100 pt-3 mt-auto space-y-3">
                <div>
                  <p className="text-xs text-slate-400 uppercase font-bold">Daily Rate</p>
                  <p className="text-xl font-black text-slate-900 font-display">৳{hotel.dailyRateTk}</p>
                  <p className="text-[11px] text-emerald-600 font-bold">
                    Total for {bookingDays} Days: ৳{hotel.dailyRateTk * bookingDays}
                  </p>
                </div>

                <button
                  onClick={() => handleBookHotel(hotel)}
                  className="w-full py-3 bg-[#14532D] hover:bg-[#0f4224] text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>{getTranslation(language, "bookHotelRoom")}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};