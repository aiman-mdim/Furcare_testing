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
  requireAuth: () => boolean;
  pendingPage: PageName | null;
  setPendingPage: (page: PageName | null) => void;

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
  ) => boolean;
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

  const [activePage, setActivePageState] =
    useState<PageName>("home");

  const [pendingPage, setPendingPage] =
    useState<PageName | null>(null);

  // ==========================================
  // CURRENT USER
  // ==========================================

  const [currentUser, setCurrentUser] =
    useState<User | null>(null);

  // ==========================================
  // PETS
  // ==========================================
  //
  // IMPORTANT:
  //
  // Pets are stored separately for every user.
  //
  // Example:
  //
  // furcare_pets_USER_101
  // furcare_pets_USER_202
  //
  // A new user gets [].
  //
  // There are NO demo pets here.
  // ==========================================

  const [pets, setPets] = useState<Pet[]>([]);

  // ==========================================
  // ACTIVE PET
  // ==========================================
  //
  // New users have no active pet.
  // ==========================================

  const [activePetId, setActivePetId] =
    useState<string>("");

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
  //
  // IMPORTANT:
  //
  // No default/demo appointment.
  // Each user gets their own appointment list.
  // ==========================================

  const [appointments, setAppointments] =
    useState<Appointment[]>([]);

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
  // LOAD USER-SPECIFIC DATA
  // ==========================================
  //
  // This runs whenever the logged-in user changes.
  //
  // VERY IMPORTANT:
  //
  // User A:
  // furcare_pets_A
  //
  // User B:
  // furcare_pets_B
  //
  // They never share pet data.
  // ==========================================

  useEffect(() => {
    if (!currentUser?.id) {
      // No logged-in user.
      setPets([]);
      setAppointments([]);
      setActivePetId("");

      return;
    }

    const userId = String(currentUser.id);

    const petsKey =
      `furcare_pets_${userId}`;

    const appointmentsKey =
      `furcare_appts_${userId}`;

    const activePetKey =
      `furcare_active_pet_${userId}`;

    // ========================================
    // LOAD PETS
    // ========================================

    try {
      const savedPets =
        localStorage.getItem(petsKey);

      if (savedPets) {
        const parsedPets =
          JSON.parse(savedPets);

        if (Array.isArray(parsedPets)) {
          setPets(parsedPets);

          // Restore active pet only if it
          // actually belongs to this user.

          const savedActivePet =
            localStorage.getItem(activePetKey);

          const activePetExists =
            savedActivePet &&
            parsedPets.some(
              (pet: Pet) =>
                pet.id === savedActivePet
            );

          if (activePetExists) {
            setActivePetId(savedActivePet);
          } else if (parsedPets.length > 0) {
            setActivePetId(parsedPets[0].id);
          } else {
            setActivePetId("");
          }
        } else {
          setPets([]);
          setActivePetId("");
        }
      } else {
        // Brand-new user.
        setPets([]);
        setActivePetId("");
      }
    } catch (error) {
      console.error(
        "Failed to load user pets:",
        error
      );

      setPets([]);
      setActivePetId("");
    }

    // ========================================
    // LOAD APPOINTMENTS
    // ========================================

    try {
      const savedAppointments =
        localStorage.getItem(appointmentsKey);

      if (savedAppointments) {
        const parsedAppointments =
          JSON.parse(savedAppointments);

        if (Array.isArray(parsedAppointments)) {
          setAppointments(parsedAppointments);
        } else {
          setAppointments([]);
        }
      } else {
        // Brand-new user.
        setAppointments([]);
      }
    } catch (error) {
      console.error(
        "Failed to load user appointments:",
        error
      );

      setAppointments([]);
    }

  }, [currentUser?.id]);

  // ==========================================
  // SAVE USER-SPECIFIC PETS
  // ==========================================

  useEffect(() => {
    if (!currentUser?.id) {
      return;
    }

    try {
      localStorage.setItem(
        `furcare_pets_${currentUser.id}`,
        JSON.stringify(pets)
      );
    } catch (error) {
      console.error(
        "Failed to save pets:",
        error
      );
    }
  }, [pets, currentUser?.id]);

  // ==========================================
  // SAVE ACTIVE PET
  // ==========================================

  useEffect(() => {
    if (!currentUser?.id) {
      return;
    }

    try {
      const key =
        `furcare_active_pet_${currentUser.id}`;

      if (activePetId) {
        localStorage.setItem(
          key,
          activePetId
        );
      } else {
        localStorage.removeItem(key);
      }
    } catch (error) {
      console.error(
        "Failed to save active pet:",
        error
      );
    }
  }, [
    activePetId,
    currentUser?.id,
  ]);

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
  // SAVE USER-SPECIFIC APPOINTMENTS
  // ==========================================

  useEffect(() => {
    if (!currentUser?.id) {
      return;
    }

    try {
      localStorage.setItem(
        `furcare_appts_${currentUser.id}`,
        JSON.stringify(appointments)
      );
    } catch (error) {
      console.error(
        "Failed to save appointments:",
        error
      );
    }
  }, [
    appointments,
    currentUser?.id,
  ]);

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

  const setActivePage = (page: PageName) => {
    if (
      !currentUser?.id &&
      (page === "cart" || page === "dashboard")
    ) {
      setPendingPage(page);
      addToast("Please log in to continue.", "warning");
      setActivePageState("login");
      return;
    }

    setActivePageState(page);
  };

  const requireAuth = () => {
    if (currentUser?.id) {
      return true;
    }

    addToast("Please log in to continue.", "warning");
    setActivePageState("login");
    return false;
  };

  // ==========================================
  // ADD PET
  // ==========================================

  const addPet = (
    petData: Omit<Pet, "id">
  ) => {

    // Don't allow pets without
    // an authenticated owner.

    if (!requireAuth()) {
      return;
    }

    const newId =
      "PET-" +
      Date.now()
        .toString(36)
        .toUpperCase();

    const newPet: Pet = {
      ...petData,

      id: newId,

      // Always use the authenticated
      // user's ID as the owner.
      owner_id: currentUser.id,
    };

    setPets((prev) => [
      ...prev,
      newPet,
    ]);

    // Automatically select the
    // newly registered pet.

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

    if (!requireAuth()) {
      return false;
    }

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

    return true;
  };

  // ==========================================
  // UPDATE CART QUANTITY
  // ==========================================

  const updateCartQty = (
    productId: string,
    quantity: number
  ) => {

    if (!requireAuth()) {
      return;
    }

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

    if (!requireAuth()) {
      return;
    }

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
    if (!requireAuth()) {
      return;
    }

    setCart([]);
  };

  // ==========================================
  // ADD APPOINTMENT
  // ==========================================

  const addAppointment = (
    apptData: Omit<Appointment, "id">
  ) => {

    if (!requireAuth()) {
      return;
    }

    const newId =
      "APT-" +
      Date.now()
        .toString(36)
        .toUpperCase();

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

    // Don't show the old hard-coded
    // Rocky reminder.

    if (appointments.length === 0) {
      return;
    }

    const upcomingAppointment =
      appointments[0];

    addToast(
      language === "bn"
        ? `⏰ রিমাইন্ডার: ${upcomingAppointment.petName} এর জন্য ${upcomingAppointment.vetName} এর সাথে অ্যাপয়েন্টমেন্ট আছে।`
        : `⏰ Reminder: ${upcomingAppointment.petName} has an appointment with ${upcomingAppointment.vetName}.`,
      "reminder"
    );
  };

  // ==========================================
  // INITIAL REMINDER
  // ==========================================

  useEffect(() => {

    // Don't automatically show a reminder
    // for a fake/demo appointment.

    if (
      !currentUser?.id ||
      appointments.length === 0
    ) {
      return;
    }

    const timer = setTimeout(() => {
      triggerUpcomingReminders();
    }, 2000);

    return () => {
      clearTimeout(timer);
    };

  }, [
    language,
    currentUser?.id,
    appointments.length,
  ]);

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
        requireAuth,
        pendingPage,
        setPendingPage,

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
