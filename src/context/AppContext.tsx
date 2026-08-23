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
  CartItemType,
} from "../types";

import { mockAdoptionListings } from "../data/mockData";

import { authApi } from "../services/auth";
import { petsApi } from "../services/pets";

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
  type:
    | "success"
    | "info"
    | "warning"
    | "reminder";
  message: string;
  time?: string;
}

// ============================================
// APP CONTEXT TYPE
// ============================================

interface AppContextType {
  // Language
  language: Language;
  setLanguage: (lang: Language) => void;

  // Navigation
  activePage: PageName;
  setActivePage: (page: PageName) => void;

  // User
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;

  requireAuth: () => boolean;

  pendingPage: PageName | null;
  setPendingPage: (
    page: PageName | null
  ) => void;

  // Pets
  pets: Pet[];

  activePetId: string;

  setActivePetId: (id: string) => void;

<<<<<<< Updated upstream
  addPet: (
    pet: Omit<Pet, "id">
  ) => Promise<void>;
=======
  addPet: (pet: Omit<Pet, "id">) => Promise<void>;
>>>>>>> Stashed changes

  // Cart
  cart: CartItem[];

  addToCart: (
    product: Product,
    quantity?: number,
    type?: CartItemType,
    customData?: Record<string, any>
  ) => boolean;

  updateCartQty: (
    productId: string,
    quantity: number
  ) => void;

  removeFromCart: (
    productId: string
  ) => void;

  clearCart: () => void;

  // Appointments
  appointments: Appointment[];

  addAppointment: (
    appt: Omit<Appointment, "id">
  ) => void;

  cancelAppointment: (
    id: string
  ) => void;

  // AI
  isAiModalOpen: boolean;

  setIsAiModalOpen: (
    open: boolean
  ) => void;

  // Toasts
  toasts: ToastNotification[];

  addToast: (
    message: string,
    type?: ToastNotification["type"]
  ) => void;

  removeToast: (
    id: string
  ) => void;

  // Adoption
  adoptionListings: AdoptionListing[];

  addAdoptionListing: (
    item: AdoptionListing
  ) => void;

  // Time
  simulatedTime: string;

  triggerUpcomingReminders: () => void;
}

// ============================================
// CONTEXT
// ============================================

const AppContext =
  createContext<AppContextType | undefined>(
    undefined
  );

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
<<<<<<< Updated upstream
  //
  // IMPORTANT:
  //
  // Pets are stored in MongoDB.
  //
  // We DO NOT use:
  //
  // localStorage("furcare_pets...")
  //
  // anymore.
  //
  // The backend determines the owner from
  // the authenticated session/JWT.
  //
  // New user:
  //
  // pets = []
  //
  // ==========================================
=======
>>>>>>> Stashed changes

  const [pets, setPets] =
    useState<Pet[]>([]);

  // ==========================================
  // ACTIVE PET
  // ==========================================

  const [activePetId, setActivePetId] =
    useState<string>("");

  // ==========================================
  // CART
  // ==========================================

  const [cart, setCart] =
    useState<CartItem[]>(() => {
      try {
        const saved =
          localStorage.getItem(
            "furcare_cart"
          );

<<<<<<< Updated upstream
        return saved
          ? JSON.parse(saved)
          : [];
      } catch (error) {
        console.error(
          "Failed to load cart:",
          error
        );

=======
        if (!saved) {
          return [];
        }

        const parsed =
          JSON.parse(saved);

        if (!Array.isArray(parsed)) {
          return [];
        }

        /*
         * Compatibility protection:
         *
         * Old cart items may not have an id.
         * Old cart items may also not have a type.
         *
         * This converts old saved cart items into
         * the new CartItem structure.
         */

        return parsed.map(
          (item: any, index: number) => ({
            id:
              item.id ||
              `product-restored-${Date.now()}-${index}`,

            product: item.product,

            quantity:
              typeof item.quantity === "number"
                ? item.quantity
                : 1,

            type:
              item.type || "product",

            customData:
              item.customData || {},
          })
        );
      } catch (error) {
        console.error(
          "Failed to load cart:",
          error
        );

>>>>>>> Stashed changes
        return [];
      }
    });

  // ==========================================
  // APPOINTMENTS
  // ==========================================

  const [appointments, setAppointments] =
    useState<Appointment[]>([]);

  // ==========================================
  // ADOPTION LISTINGS
  // ==========================================

  const [
    adoptionListings,
    setAdoptionListings,
  ] = useState<AdoptionListing[]>(
    mockAdoptionListings
  );

  // ==========================================
  // AI MODAL
  // ==========================================

  const [
    isAiModalOpen,
    setIsAiModalOpen,
  ] = useState<boolean>(false);

  // ==========================================
  // TOASTS
  // ==========================================

  const [toasts, setToasts] =
    useState<ToastNotification[]>([]);

  // ==========================================
  // SIMULATED TIME
  // ==========================================

  const [simulatedTime, setSimulatedTime] =
    useState<string>("15:00");

  // ==========================================
  // REMOVE TOAST
<<<<<<< Updated upstream
  // ==========================================

  const removeToast = (
    id: string
  ) => {
    setToasts((prev) =>
      prev.filter(
        (toast) =>
          toast.id !== id
      )
    );
  };
=======
  // ==========================================

  const removeToast = (
    id: string
  ) => {
    setToasts((prev) =>
      prev.filter(
        (toast) =>
          toast.id !== id
      )
    );
  };

  // ==========================================
  // TOAST SYSTEM
  // ==========================================

  const addToast = (
    message: string,
    type: ToastNotification["type"] =
      "info"
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
      time:
        new Date().toLocaleTimeString(),
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
  // RESTORE AUTHENTICATED SESSION
  // ==========================================

  useEffect(() => {
    let mounted = true;

    const restoreSession =
      async () => {
        try {
          const result =
            await authApi.me();

          if (!mounted) {
            return;
          }

          if (result?.user) {
            setCurrentUser(
              result.user
            );
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
  // LOAD PETS FROM DATABASE
  // ==========================================

  useEffect(() => {
    let mounted = true;

    const loadPets =
      async () => {
        // --------------------------------------
        // NO USER
        // --------------------------------------

        if (!currentUser?.id) {
          setPets([]);
          setActivePetId("");

          return;
        }

        // --------------------------------------
        // USER LOGGED IN
        // --------------------------------------

        try {
          const userPets =
            await petsApi.getMyPets();

          if (!mounted) {
            return;
          }

          setPets(userPets);

          // ------------------------------------
          // SELECT FIRST PET
          // ------------------------------------

          if (
            userPets.length > 0
          ) {
            setActivePetId(
              userPets[0].id
            );
          } else {
            setActivePetId("");
          }
        } catch (error) {
          if (!mounted) {
            return;
          }

          console.error(
            "Failed to load pets:",
            error
          );

          setPets([]);
          setActivePetId("");

          addToast(
            error instanceof Error
              ? error.message
              : "Failed to load your pets.",
            "warning"
          );
        }
      };

    loadPets();

    return () => {
      mounted = false;
    };
  }, [currentUser?.id]);

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
  // LOAD USER APPOINTMENTS
  // ==========================================

  useEffect(() => {
    if (!currentUser?.id) {
      setAppointments([]);

      return;
    }

    try {
      const saved =
        localStorage.getItem(
          `furcare_appts_${currentUser.id}`
        );

      if (saved) {
        const parsed =
          JSON.parse(saved);

        if (
          Array.isArray(parsed)
        ) {
          setAppointments(
            parsed
          );
        } else {
          setAppointments([]);
        }
      } else {
        setAppointments([]);
      }
    } catch (error) {
      console.error(
        "Failed to load appointments:",
        error
      );

      setAppointments([]);
    }
  }, [currentUser?.id]);

  // ==========================================
  // SAVE USER APPOINTMENTS
  // ==========================================

  useEffect(() => {
    if (!currentUser?.id) {
      return;
    }

    try {
      localStorage.setItem(
        `furcare_appts_${currentUser.id}`,
        JSON.stringify(
          appointments
        )
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
>>>>>>> Stashed changes

  // ==========================================
  // PAGE NAVIGATION
  // ==========================================

<<<<<<< Updated upstream
  const addToast = (
    message: string,
    type: ToastNotification["type"] =
      "info"
=======
  const setActivePage = (
    page: PageName
>>>>>>> Stashed changes
  ) => {
    // ----------------------------------------
    // PROTECTED PAGES
    // ----------------------------------------

<<<<<<< Updated upstream
    const toast: ToastNotification = {
      id,
      message,
      type,
      time:
        new Date().toLocaleTimeString(),
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
  // RESTORE AUTHENTICATED SESSION
  // ==========================================

  useEffect(() => {
    let mounted = true;

    const restoreSession =
      async () => {
        try {
          const result =
            await authApi.me();

          if (!mounted) {
            return;
          }

          if (result?.user) {
            setCurrentUser(
              result.user
            );
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
  // LOAD PETS FROM DATABASE
  // ==========================================
  //
  // Whenever the logged-in user changes:
  //
  // 1. No user -> []
  // 2. User -> GET /api/pets
  //
  // The backend must return only the pets
  // belonging to the authenticated user.
  //
  // ==========================================

  useEffect(() => {
    let mounted = true;

    const loadPets =
      async () => {

        // --------------------------------------
        // NO USER
        // --------------------------------------

        if (!currentUser?.id) {

          setPets([]);
          setActivePetId("");

          return;
        }

        // --------------------------------------
        // USER LOGGED IN
        // --------------------------------------

        try {

          const userPets =
            await petsApi.getMyPets();

          if (!mounted) {
            return;
          }

          // ------------------------------------
          // Store database pets in React state
          // ------------------------------------

          setPets(userPets);

          // ------------------------------------
          // Select first pet
          // ------------------------------------

          if (
            userPets.length > 0
          ) {

            setActivePetId(
              userPets[0].id
            );

          } else {

            // ----------------------------------
            // BRAND NEW USER
            // ----------------------------------

            setActivePetId("");
          }

        } catch (error) {

          if (!mounted) {
            return;
          }

          console.error(
            "Failed to load pets:",
            error
          );

          setPets([]);
          setActivePetId("");

          addToast(
            error instanceof Error
              ? error.message
              : "Failed to load your pets.",
            "warning"
          );
        }
      };

    loadPets();

    return () => {
      mounted = false;
    };

  }, [currentUser?.id]);

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
  // LOAD USER APPOINTMENTS
  // ==========================================

  useEffect(() => {

    if (!currentUser?.id) {

      setAppointments([]);

      return;
    }

    try {

      const saved =
        localStorage.getItem(
          `furcare_appts_${currentUser.id}`
        );

      if (saved) {

        const parsed =
          JSON.parse(saved);

        if (
          Array.isArray(parsed)
        ) {

          setAppointments(
            parsed
          );

        } else {

          setAppointments([]);
        }

      } else {

        setAppointments([]);
      }

    } catch (error) {

      console.error(
        "Failed to load appointments:",
        error
      );

      setAppointments([]);
    }

  }, [currentUser?.id]);

  // ==========================================
  // SAVE USER APPOINTMENTS
  // ==========================================

  useEffect(() => {

    if (!currentUser?.id) {
      return;
    }

    try {

      localStorage.setItem(
        `furcare_appts_${currentUser.id}`,
        JSON.stringify(
          appointments
        )
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
  // PAGE NAVIGATION
  // ==========================================

  const setActivePage = (
    page: PageName
  ) => {

    // Protected pages

=======
>>>>>>> Stashed changes
    if (
      !currentUser?.id &&
      (
        page === "cart" ||
        page === "dashboard"
      )
    ) {

      setPendingPage(page);

      addToast(
        "Please log in to continue.",
        "warning"
      );

      setActivePageState(
        "login"
      );

      return;
    }

    setActivePageState(page);
  };

  // ==========================================
  // AUTH CHECK
  // ==========================================

  const requireAuth = () => {

    if (currentUser?.id) {
      return true;
    }

    addToast(
      "Please log in to continue.",
      "warning"
    );

    setActivePageState(
      "login"
    );

    return false;
  };

  // ==========================================
  // ADD PET
  // ==========================================
  //
  // IMPORTANT:
  //
  // Age and vaccination history are included
  // in petData and sent directly to MongoDB.
  //
  // The frontend DOES NOT assign owner_id.
  //
  // The backend must determine owner_id from
  // the authenticated user/session.
  //
  // ==========================================

  const addPet = async (
    petData: Omit<Pet, "id">
  ): Promise<void> => {
<<<<<<< Updated upstream

=======
>>>>>>> Stashed changes
    // ----------------------------------------
    // CHECK AUTHENTICATION
    // ----------------------------------------

    if (!requireAuth()) {
      return;
    }

    try {
<<<<<<< Updated upstream

      // --------------------------------------
      // NEVER trust owner_id from frontend
      // --------------------------------------

      const {
        owner_id: _ownerId,
        ...petPayload
      } = petData;

      // --------------------------------------
      // CREATE PET IN MONGODB
      //
      // petPayload contains:
      //
      // name
      // species
      // breed
      // ageYears
      // ageMonths
      // color
      // weightKg
      // gender
      // photoUrl
      // allergies
      // vaccinations
      // medicalHistory
      // microchipId
      //
      // --------------------------------------

      const newPet =
        await petsApi.createPet(
          petPayload
        );

      // --------------------------------------
      // UPDATE DASHBOARD IMMEDIATELY
      // --------------------------------------

      setPets((prev) => [
        newPet,
        ...prev,
      ]);

      // --------------------------------------
      // SELECT NEW PET
      // --------------------------------------

      setActivePetId(
        newPet.id
      );

=======
      // --------------------------------------
      // NEVER TRUST owner_id FROM FRONTEND
      // --------------------------------------

      const {
        owner_id: _ownerId,
        ...petPayload
      } = petData;

      // --------------------------------------
      // CREATE PET IN MONGODB
      // --------------------------------------

      const newPet =
        await petsApi.createPet(
          petPayload
        );

      // --------------------------------------
      // UPDATE DASHBOARD
      // --------------------------------------

      setPets((prev) => [
        newPet,
        ...prev,
      ]);

      // --------------------------------------
      // SELECT NEW PET
      // --------------------------------------

      setActivePetId(
        newPet.id
      );

>>>>>>> Stashed changes
      // --------------------------------------
      // SUCCESS MESSAGE
      // --------------------------------------

      addToast(
        `Registered new pet: ${newPet.name}!`,
        "success"
      );
<<<<<<< Updated upstream

    } catch (error) {

=======
    } catch (error) {
>>>>>>> Stashed changes
      console.error(
        "Failed to register pet:",
        error
      );

      addToast(
        error instanceof Error
          ? error.message
          : "Failed to register pet. Please try again.",
        "warning"
      );
    }
  };

  // ==========================================
  // ADD TO CART
  // ==========================================

  const addToCart = (
    product: Product,
    quantity: number = 1,
<<<<<<< Updated upstream
    type: CartItem["type"] =
      "product",
    customData?: Record<string, any>
  ): boolean => {
=======
    type: CartItemType = "product",
    customData?: Record<string, any>
  ): boolean => {
    // ----------------------------------------
    // CHECK AUTHENTICATION
    // ----------------------------------------
>>>>>>> Stashed changes

    if (!requireAuth()) {
      return false;
    }

    // ----------------------------------------
    // VALIDATE QUANTITY
    // ----------------------------------------

    if (
      !Number.isFinite(quantity) ||
      quantity <= 0
    ) {
      addToast(
        "Invalid quantity.",
        "warning"
      );

      return false;
    }

    // ----------------------------------------
    // CREATE UNIQUE ID
    // ----------------------------------------

    const newItemId =
      `${type}-${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 9)}`;

    setCart((prev) => {
      /*
       * IMPORTANT:
       *
       * Only normal products are allowed
       * to merge with an existing cart item.
       *
       * Vet appointments, adoption, grooming,
       * hotel and premium items should remain
       * separate cart entries.
       */

      const existingIndex =
        type === "product"
          ? prev.findIndex(
              (item) =>
                item.product.product_id ===
                  product.product_id &&
                item.type === type
            )
          : -1;

<<<<<<< Updated upstream
      if (
        existingIndex > -1
      ) {

        const updated = [
          ...prev,
        ];

        updated[
          existingIndex
        ] = {

          ...updated[
            existingIndex
          ],
=======
      // --------------------------------------
      // EXISTING NORMAL PRODUCT
      // --------------------------------------

      if (
        existingIndex > -1
      ) {
        const updated = [
          ...prev,
        ];
>>>>>>> Stashed changes

        updated[
          existingIndex
        ] = {
          ...updated[
            existingIndex
          ],
          quantity:
            updated[
              existingIndex
            ].quantity +
            quantity,
        };

        return updated;
      }

      // --------------------------------------
      // NEW CART ITEM
      // --------------------------------------

      const newItem: CartItem = {
        id: newItemId,
        product,
        quantity,
        type,
        customData:
          customData || {},
      };

      return [
        ...prev,
        newItem,
      ];
    });

    // ----------------------------------------
    // SUCCESS TOAST
    // ----------------------------------------

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

    // ----------------------------------------
    // REMOVE IF ZERO OR LESS
    // ----------------------------------------

    if (quantity <= 0) {
<<<<<<< Updated upstream

=======
>>>>>>> Stashed changes
      removeFromCart(
        productId
      );

      return;
    }

    // ----------------------------------------
    // UPDATE QUANTITY
    // ----------------------------------------

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
    if (!requireAuth()) {
      return;
    }

    if (!requireAuth()) {
      return;
    }

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
<<<<<<< Updated upstream

=======
>>>>>>> Stashed changes
    setAdoptionListings(
      (prev) => [
        item,
        ...prev,
      ]
    );
  };

  // ==========================================
  // UPCOMING APPOINTMENT REMINDER
  // ==========================================

  const triggerUpcomingReminders =
    () => {
<<<<<<< Updated upstream

      if (
        !currentUser?.id ||
        appointments.length === 0
      ) {
        return;
      }

      const upcomingAppointment =
        appointments[0];

=======
      if (
        !currentUser?.id ||
        appointments.length === 0
      ) {
        return;
      }

      const upcomingAppointment =
        appointments[0];

>>>>>>> Stashed changes
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
<<<<<<< Updated upstream

=======
>>>>>>> Stashed changes
    if (
      !currentUser?.id ||
      appointments.length === 0
    ) {
      return;
    }

    const timer =
      setTimeout(() => {
<<<<<<< Updated upstream

        triggerUpcomingReminders();

=======
        triggerUpcomingReminders();
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream

=======
>>>>>>> Stashed changes
        // ------------------------------------
        // Language
        // ------------------------------------

        language,
        setLanguage,

        // ------------------------------------
        // Navigation
        // ------------------------------------

        activePage,
        setActivePage,

        // ------------------------------------
        // User
        // ------------------------------------

        currentUser,
        setCurrentUser,

        requireAuth,

        pendingPage,
        setPendingPage,

        // ------------------------------------
        // Pets
        // ------------------------------------

        pets,
        activePetId,
        setActivePetId,
        addPet,

        // ------------------------------------
        // Cart
        // ------------------------------------

        cart,
        addToCart,
        updateCartQty,
        removeFromCart,
        clearCart,

        // ------------------------------------
        // Appointments
        // ------------------------------------

        appointments,
        addAppointment,
        cancelAppointment,

        // ------------------------------------
        // AI
        // ------------------------------------

        isAiModalOpen,
        setIsAiModalOpen,

        // ------------------------------------
        // Toasts
        // ------------------------------------

        toasts,
        addToast,
        removeToast,

        // ------------------------------------
        // Adoption
        // ------------------------------------

        adoptionListings,
        addAdoptionListing,

        // ------------------------------------
        // Simulated time
        // ------------------------------------

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
<<<<<<< Updated upstream
};
=======
}; 
>>>>>>> Stashed changes
