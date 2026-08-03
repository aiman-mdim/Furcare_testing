import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  Language,
  User,
  Pet,
  Appointment,
  CartItem,
  Product,
  AdoptionListing,
  GroomingService,
  PetHotel,
  LostAndFoundListing,
} from "../types";
import { initialPets, mockAdoptionListings, mockProducts } from "../data/mockData";

export type PageName =
  | "home"
  | "adoption"
  | "vet"
  | "grooming"
  | "hotel"
  | "store"
  | "vaccines"
  | "lostfound"
  | "premium"
  | "cart"
  | "login"
  | "dashboard";

interface ToastNotification {
  id: string;
  type: "success" | "info" | "warning" | "reminder";
  message: string;
  time?: string;
}

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  activePage: PageName;
  setActivePage: (page: PageName) => void;
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  pets: Pet[];
  activePetId: string;
  setActivePetId: (id: string) => void;
  addPet: (pet: Omit<Pet, "id">) => void;
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, type?: CartItem["type"], customData?: Record<string, any>) => void;
  updateCartQty: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  appointments: Appointment[];
  addAppointment: (appt: Omit<Appointment, "id">) => void;
  cancelAppointment: (id: string) => void;
  isAiModalOpen: boolean;
  setIsAiModalOpen: (open: boolean) => void;
  toasts: ToastNotification[];
  addToast: (message: string, type?: ToastNotification["type"]) => void;
  removeToast: (id: string) => void;
  adoptionListings: AdoptionListing[];
  addAdoptionListing: (item: AdoptionListing) => void;
  simulatedTime: string; // HH:MM AM/PM
  triggerUpcomingReminders: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>("en");
  const [activePage, setActivePage] = useState<PageName>("home");

  const [currentUser, setCurrentUser] = useState<User | null>({
    id: "USR-001",
    name: "Aiman Mohammad",
    email: "aimanmohammad594@gmail.com",
    role: "pet_owner",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    phone: "+8801712345678",
    isPremium: false,
  });

  const [pets, setPets] = useState<Pet[]>(() => {
    const saved = localStorage.getItem("furcare_pets");
    return saved ? JSON.parse(saved) : initialPets;
  });

  const [activePetId, setActivePetId] = useState<string>("PET-101");

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("furcare_cart");
    return saved ? JSON.parse(saved) : [];
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem("furcare_appts");
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: "APT-881",
            pet_id: "PET-101",
            petName: "Rocky",
            vet_id: "VET-1",
            vetName: "Dr. Ahmed Hossain",
            clinicName: "Central Pet Hospital & Research Center",
            area: "Dhanmondi, Dhaka",
            date: "2026-08-03",
            time: "16:00", // 4:00 PM
            status: "scheduled",
            symptomProblem: "Skin allergy scratching and routine vaccine check",
            feeTk: 800,
            consultationType: "in_person",
          },
        ];
  });

  const [adoptionListings, setAdoptionListings] = useState<AdoptionListing[]>(mockAdoptionListings);
  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const [simulatedTime, setSimulatedTime] = useState<string>("15:00"); // 3:00 PM (1 hr before 4:00 PM appointment)

  useEffect(() => {
    localStorage.setItem("furcare_pets", JSON.stringify(pets));
  }, [pets]);

  useEffect(() => {
    localStorage.setItem("furcare_cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("furcare_appts", JSON.stringify(appointments));
  }, [appointments]);

  // Toast System
  const addToast = (message: string, type: ToastNotification["type"] = "info") => {
    const id = "TST-" + Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type, time: new Date().toLocaleTimeString() }]);
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addPet = (petData: Omit<Pet, "id">) => {
    const newId = "PET-" + Math.floor(100 + Math.random() * 900);
    const newPet: Pet = { ...petData, id: newId };
    setPets((prev) => [...prev, newPet]);
    setActivePetId(newId);
    addToast(`Registered new pet: ${newPet.name}!`, "success");
  };

  const addToCart = (
    product: Product,
    quantity: number = 1,
    type: CartItem["type"] = "product",
    customData?: Record<string, any>
  ) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.product_id === product.product_id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [...prev, { product, quantity, type, customData }];
      }
    });
    addToast(
      language === "bn"
        ? `"${product.nameBn}" কার্টে যোগ করা হয়েছে!`
        : `"${product.nameEn}" added to cart!`,
      "success"
    );
  };

  const updateCartQty = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.product_id === productId ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.product_id !== productId));
    addToast(
      language === "bn" ? "পণ্য কার্ট থেকে সেশন মুক্ত হয়েছে" : "Item removed from cart",
      "info"
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const addAppointment = (apptData: Omit<Appointment, "id">) => {
    const newId = "APT-" + Math.floor(100 + Math.random() * 900);
    const newAppt: Appointment = { ...apptData, id: newId };
    setAppointments((prev) => [newAppt, ...prev]);
    addToast(
      language === "bn"
        ? `ডাক্তার ${newAppt.vetName} এর সাথে অ্যাপয়েন্টমেন্ট বুক হয়েছে!`
        : `Appointment booked with ${newAppt.vetName}!`,
      "success"
    );
  };

  const cancelAppointment = (id: string) => {
    setAppointments((prev) => prev.filter((a) => a.id !== id));
    addToast(language === "bn" ? "অ্যাপয়েন্টমেন্ট বাতিল করা হয়েছে" : "Appointment cancelled", "info");
  };

  const addAdoptionListing = (item: AdoptionListing) => {
    setAdoptionListings((prev) => [item, ...prev]);
  };

  const triggerUpcomingReminders = () => {
    addToast(
      language === "bn"
        ? "⏰ রিমাইন্ডার: আজ বিকেল ৪:০০ টায় রকির জন্য ডঃ আহমেদ হোসেনের সাথে অ্যাপয়েন্টমেন্ট আছে (১ ঘন্টা বাকি)!"
        : "⏰ Reminder: You have an appointment for Rocky with Dr. Ahmed Hossain at 4:00 PM today (1 hour remaining)!",
      "reminder"
    );
  };

  // Initial reminder trigger on load after 2s
  useEffect(() => {
    const timer = setTimeout(() => {
      triggerUpcomingReminders();
    }, 2000);
    return () => clearTimeout(timer);
  }, [language]);

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        activePage,
        setActivePage,
        currentUser,
        setCurrentUser,
        pets,
        activePetId,
        setActivePetId,
        addPet,
        cart,
        addToCart,
        updateCartQty,
        removeFromCart,
        clearCart,
        appointments,
        addAppointment,
        cancelAppointment,
        isAiModalOpen,
        setIsAiModalOpen,
        toasts,
        addToast,
        removeToast,
        adoptionListings,
        addAdoptionListing,
        simulatedTime,
        triggerUpcomingReminders,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
