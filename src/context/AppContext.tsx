import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

import {
  Language,
  User,
  Pet,
  Appointment,
  CartItem,
  Product,
  AdoptionListing,
} from "../types";

import {
  initialPets,
  mockAdoptionListings,
} from "../data/mockData";

import { authApi } from "../services/auth";

// ============================================
// PAGE TYPES
// ============================================

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

// ============================================
// TOAST TYPES
// ============================================

interface ToastNotification {
  id: string;
  type: "success" | "info" | "warning" | "reminder";
  message: string;
  time?: string;
}

// ============================================
// APP CONTEXT TYPE
// ============================================

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
  addToCart: (
    product: Product,
    quantity?: number,
    type?: CartItem["type"],
    customData?: Record<string, any>
  ) => void;
  updateCartQty: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;

  appointments: Appointment[];
  addAppointment: (appt: Omit<Appointment, "id">) => void;
  cancelAppointment: (id: string) => void;

  isAiModalOpen: boolean;
  setIsAiModalOpen: (open: boolean) => void;

  toasts: ToastNotification[];
  addToast: (
    message: string,
    type?: ToastNotification["type"]
  ) => void;
  removeToast: (id: string) => void;

  adoptionListings: AdoptionListing[];
  addAdoptionListing: (item: AdoptionListing) => void;

  simulatedTime: string;
  triggerUpcomingReminders: () => void;
}

// ============================================
// CONTEXT
// ============================================

const AppContext = createContext<
  AppContextType | undefined
>(undefined);

// ============================================
// APP PROVIDER
// ============================================

export const AppProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  // ==========================================
  // LANGUAGE
  // ==========================================

  const [language, setLanguage] =
    useState<Language>("en");

  // ==========================================
  // ACTIVE PAGE
  // ==========================================

  const [activePage, setActivePage] =
    useState<PageName>("home");

  // ==========================================
  // CURRENT USER
  // ==========================================
  //
  // IMPORTANT:
  // Start with null.
  //
  // This means the user is NOT automatically
  // considered logged in.
  //
  // The authenticated user will be restored
  // through authApi.me().
  // ==========================================

  const [currentUser, setCurrentUser] =
    useState<User | null>(null);

  // ==========================================
  // PETS
  // ==========================================

  const [pets, setPets] = useState<Pet[]>(() => {
    try {
      const saved =
        localStorage.getItem("furcare_pets");

      return saved
        ? JSON.parse(saved)
        : initialPets;
    } catch (error) {
      console.error(
        "Failed to load pets from localStorage:",
        error
      );

      return initialPets;
    }
  });

  // ==========================================
  // ACTIVE PET
  // ==========================================

  const [activePetId, setActivePetId] =
    useState<string>("PET-101");

  // ==========================================
  // CART
  // ==========================================

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved =
        localStorage.getItem("furcare_cart");

      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error(
        "Failed to load cart from localStorage:",
        error
      );

      return [];
    }
  });

  // ==========================================
  // APPOINTMENTS
  // ==========================================

  const [appointments, setAppointments] =
    useState<Appointment[]>(() => {
      try {
        const saved =
          localStorage.getItem("furcare_appts");

        if (saved) {
          return JSON.parse(saved);
        }

        return [
          {
            id: "APT-881",
            pet_id: "PET-101",
            petName: "Rocky",
            vet_id: "VET-1",
            vetName: "Dr. Ahmed Hossain",
            clinicName:
              "Central Pet Hospital & Research Center",
            area: "Dhanmondi, Dhaka",
            date: "2026-08-03",
            time: "16:00",
            status: "scheduled",
            symptomProblem:
              "Skin allergy scratching and routine vaccine check",
            feeTk: 800,
            consultationType: "in_person",
          },
        ];
      } catch (error) {
        console.error(
          "Failed to load appointments from localStorage:",
          error
        );

        return [];
      }
    });

  // ==========================================
  // ADOPTION LISTINGS
  // ==========================================

  const [adoptionListings, setAdoptionListings] =
    useState<AdoptionListing[]>(
      mockAdoptionListings
    );

  // ==========================================
  // AI MODAL
  // ==========================================

  const [isAiModalOpen, setIsAiModalOpen] =
    useState<boolean>(false);

  // ==========================================
  // TOASTS
  // ==========================================

  const [toasts, setToasts] = useState<
    ToastNotification[]
  >([]);

  // ==========================================
  // SIMULATED TIME
  // ==========================================

  const [simulatedTime, setSimulatedTime] =
    useState<string>("15:00");

  // ==========================================
  // RESTORE AUTHENTICATED SESSION
  // ==========================================
  //
  // When the application starts:
  //
  // 1. Ask the backend if a valid session exists.
  // 2. If there is a user, restore it.
  // 3. If there is no valid session, keep
  //    currentUser as null.
  //
  // This prevents fake automatic login.
  // ==========================================

  useEffect(() => {
    let mounted = true;

    const restoreSession = async () => {
      try {
        const result = await authApi.me();

        if (!mounted) {
          return;
        }

        if (result?.user) {
          setCurrentUser(result.user);
        } else {
          setCurrentUser(null);
        }
      } catch (error) {
        if (!mounted) {
          return;
        }

        console.log(
          "No authenticated session found."
        );

        setCurrentUser(null);
      }
    };

    restoreSession();

    return () => {
      mounted = false;
    };
  }, []);

  // ==========================================
  // SAVE PETS
  // ==========================================

  useEffect(() => {
    try {
      localStorage.setItem(
        "furcare_pets",
        JSON.stringify(pets)
      );
    } catch (error) {
      console.error(
        "Failed to save pets:",
        error
      );
    }
  }, [pets]);

  // ==========================================
  // SAVE CART
  // ==========================================

  useEffect(() => {
    try {
      localStorage.setItem(
        "furcare_cart",
        JSON.stringify(cart)
      );
    } catch (error) {
      console.error(
        "Failed to save cart:",
        error
      );
    }
  }, [cart]);

  // ==========================================
  // SAVE APPOINTMENTS
  // ==========================================

  useEffect(() => {
    try {
      localStorage.setItem(
        "furcare_appts",
        JSON.stringify(appointments)
      );
    } catch (error) {
      console.error(
        "Failed to save appointments:",
        error
      );
    }
  }, [appointments]);

  // ==========================================
  // TOAST SYSTEM
  // ==========================================

  const addToast = (
    message: string,
    type: ToastNotification["type"] = "info"
  ) => {
    const id =
      "TST-" +
      Math.random()
        .toString(36)
        .substring(2, 11);

    const toast: ToastNotification = {
      id,
      message,
      type,
      time: new Date().toLocaleTimeString(),
    };

    setToasts((prev) => [
      ...prev,
      toast,
    ]);

    setTimeout(() => {
      removeToast(id);
    }, 5000);
  };

  // ==========================================
  // REMOVE TOAST
  // ==========================================

  const removeToast = (id: string) => {
    setToasts((prev) =>
      prev.filter(
        (toast) => toast.id !== id
      )
    );
  };

  // ==========================================
  // ADD PET
  // ==========================================

  const addPet = (
    petData: Omit<Pet, "id">
  ) => {
    const newId =
      "PET-" +
      Math.floor(
        100 + Math.random() * 900
      );

    const newPet: Pet = {
      ...petData,
      id: newId,
    };

    setPets((prev) => [
      ...prev,
      newPet,
    ]);

    setActivePetId(newId);

    addToast(
      `Registered new pet: ${newPet.name}!`,
      "success"
    );
  };

  // ==========================================
  // ADD TO CART
  // ==========================================

  const addToCart = (
    product: Product,
    quantity: number = 1,
    type: CartItem["type"] = "product",
    customData?: Record<string, any>
  ) => {
    setCart((prev) => {
      const existingIndex =
        prev.findIndex(
          (item) =>
            item.product.product_id ===
            product.product_id
        );

      if (existingIndex > -1) {
        const updated = [...prev];

        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity:
            updated[existingIndex].quantity +
            quantity,
        };

        return updated;
      }

      return [
        ...prev,
        {
          product,
          quantity,
          type,
          customData,
        },
      ];
    });

    addToast(
      language === "bn"
        ? `"${product.nameBn}" কার্টে যোগ করা হয়েছে!`
        : `"${product.nameEn}" added to cart!`,
      "success"
    );
  };

  // ==========================================
  // UPDATE CART QUANTITY
  // ==========================================

  const updateCartQty = (
    productId: string,
    quantity: number
  ) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart((prev) =>
      prev.map((item) =>
        item.product.product_id ===
        productId
          ? {
              ...item,
              quantity,
            }
          : item
      )
    );
  };

  // ==========================================
  // REMOVE FROM CART
  // ==========================================

  const removeFromCart = (
    productId: string
  ) => {
    setCart((prev) =>
      prev.filter(
        (item) =>
          item.product.product_id !==
          productId
      )
    );

    addToast(
      language === "bn"
        ? "পণ্য কার্ট থেকে সরানো হয়েছে"
        : "Item removed from cart",
      "info"
    );
  };

  // ==========================================
  // CLEAR CART
  // ==========================================

  const clearCart = () => {
    setCart([]);
  };

  // ==========================================
  // ADD APPOINTMENT
  // ==========================================

  const addAppointment = (
    apptData: Omit<Appointment, "id">
  ) => {
    const newId =
      "APT-" +
      Math.floor(
        100 + Math.random() * 900
      );

    const newAppt: Appointment = {
      ...apptData,
      id: newId,
    };

    setAppointments((prev) => [
      newAppt,
      ...prev,
    ]);

    addToast(
      language === "bn"
        ? `ডাক্তার ${newAppt.vetName} এর সাথে অ্যাপয়েন্টমেন্ট বুক হয়েছে!`
        : `Appointment booked with ${newAppt.vetName}!`,
      "success"
    );
  };

  // ==========================================
  // CANCEL APPOINTMENT
  // ==========================================

  const cancelAppointment = (
    id: string
  ) => {
    setAppointments((prev) =>
      prev.filter(
        (appointment) =>
          appointment.id !== id
      )
    );

    addToast(
      language === "bn"
        ? "অ্যাপয়েন্টমেন্ট বাতিল করা হয়েছে"
        : "Appointment cancelled",
      "info"
    );
  };

  // ==========================================
  // ADD ADOPTION LISTING
  // ==========================================

  const addAdoptionListing = (
    item: AdoptionListing
  ) => {
    setAdoptionListings((prev) => [
      item,
      ...prev,
    ]);
  };

  // ==========================================
  // UPCOMING APPOINTMENT REMINDER
  // ==========================================

  const triggerUpcomingReminders = () => {
    addToast(
      language === "bn"
        ? "⏰ রিমাইন্ডার: আজ বিকেল ৪:০০ টায় রকির জন্য ডঃ আহমেদ হোসেনের সাথে অ্যাপয়েন্টমেন্ট আছে (১ ঘন্টা বাকি)!"
        : "⏰ Reminder: You have an appointment for Rocky with Dr. Ahmed Hossain at 4:00 PM today (1 hour remaining)!",
      "reminder"
    );
  };

  // ==========================================
  // INITIAL REMINDER
  // ==========================================

  useEffect(() => {
    const timer = setTimeout(() => {
      triggerUpcomingReminders();
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, [language]);

  // ==========================================
  // CONTEXT PROVIDER
  // ==========================================

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

// ============================================
// useApp HOOK
// ============================================

export const useApp = () => {
  const context =
    useContext(AppContext);

  if (!context) {
    throw new Error(
      "useApp must be used within an AppProvider"
    );
  }

  return context;
}; 
