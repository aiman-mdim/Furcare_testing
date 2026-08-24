import React, { useEffect, useState } from "react";

import { useApp } from "../context/AppContext";

import {
  Pet,
  PetSpecies,
  VaccineRecord,
} from "../types";

  PetSpecies,
  VaccineRecord,
  Order,
} from "../types";

import { ordersApi } from "../services/orders";

import {
  Plus,
  ShieldCheck,
  Trash2,
  X,
} from "lucide-react";

// ============================================
// COMPONENT
// ============================================

export const UserDashboardPage: React.FC = () => {
  const {
    currentUser,
    pets,
    addPet,
    setActivePage,
  } = useApp();

  // ==========================================
  // PURCHASE / ORDER HISTORY
  // ==========================================

  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadOrders = async () => {
      try {
        setOrdersLoading(true);

        const data = await ordersApi.getMyOrders();

        if (mounted) {
          setOrders(data);
        }
      } catch (error) {
        console.error(
          "Failed to load orders:",
          error
        );
      } finally {
        if (mounted) {
          setOrdersLoading(false);
        }
      }
    };

    loadOrders();

    return () => {
      mounted = false;
    };
  }, []);

  // ==========================================
  // ADD PET MODAL
  // ==========================================

  const [
    isAddPetModalOpen,
    setIsAddPetModalOpen,
  ] = useState(false);

  // ==========================================
  // PET FORM
  // ==========================================

  const [petName, setPetName] = useState("");

  const [species, setSpecies] =
    useState<PetSpecies>("dog");

  const [breed, setBreed] = useState("");

  const [ageYears, setAgeYears] = useState(0);

  const [ageMonths, setAgeMonths] = useState(0);

  const [weightKg, setWeightKg] = useState(0);

  const [gender, setGender] =
    useState<"male" | "female">("male");

  const [color, setColor] = useState("");

  const [photoUrl, setPhotoUrl] = useState("");

  // ==========================================
  // VACCINATION FORM
  // ==========================================

  const [vaccinations, setVaccinations] =
    useState<VaccineRecord[]>([]);

  const [vaccineName, setVaccineName] =
    useState("");

  const [givenDate, setGivenDate] =
    useState("");

  const [nextDueDate, setNextDueDate] =
    useState("");

  const [veterinarian, setVeterinarian] =
    useState("");

  const [batchNumber, setBatchNumber] =
    useState("");

  // ==========================================
  // ADD VACCINATION
  // ==========================================

  const handleAddVaccination = () => {
    if (
      !vaccineName.trim() ||
      !givenDate ||
      !nextDueDate ||
      !veterinarian.trim()
    ) {
      alert(
        "Please fill in vaccine name, given date, next due date and veterinarian."
      );

      return;
    }

    const newVaccination: VaccineRecord = {
      id:
        "VAC-" +
        Date.now().toString(),

      vaccineName:
        vaccineName.trim(),

      givenDate,

      nextDueDate,

      status: "completed",

      batchNumber:
        batchNumber.trim() ||
        undefined,

      veterinarian:
        veterinarian.trim(),

      postVaccineTipsEn: [],

      postVaccineTipsBn: [],
    };

    setVaccinations((previous) => [
      ...previous,
      newVaccination,
    ]);

    // Clear vaccination inputs

    setVaccineName("");

    setGivenDate("");

    setNextDueDate("");

    setVeterinarian("");

    setBatchNumber("");
  };

  // ==========================================
  // REMOVE VACCINATION
  // ==========================================

  const handleRemoveVaccination = (
    id: string
  ) => {
    setVaccinations((previous) =>
      previous.filter(
        (vaccination) =>
          vaccination.id !== id
      )
    );
  };

  // ==========================================
  // RESET FORM
  // ==========================================

  const resetPetForm = () => {
    setPetName("");

    setSpecies("dog");

    setBreed("");

    setAgeYears(0);

    setAgeMonths(0);

    setWeightKg(0);

    setGender("male");

    setColor("");

    setPhotoUrl("");

    setVaccinations([]);

    setVaccineName("");

    setGivenDate("");

    setNextDueDate("");

    setVeterinarian("");

    setBatchNumber("");
  };

  // ==========================================
  // CREATE PET
  // ==========================================

  const handleCreatePet = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    if (!currentUser?.id) {
      alert(
        "Please login before adding a pet."
      );

      return;
    }

    // Basic validation

    if (!petName.trim()) {
      alert("Pet name is required.");

      return;
    }

    if (!breed.trim()) {
      alert("Breed is required.");

      return;
    }

    if (ageYears < 0) {
      alert(
        "Age years cannot be negative."
      );

      return;
    }

    if (
      ageMonths < 0 ||
      ageMonths > 11
    ) {
      alert(
        "Age months must be between 0 and 11."
      );

      return;
    }

    if (weightKg < 0) {
      alert(
        "Weight cannot be negative."
      );

      return;
    }

    // ========================================
    // PET DATA
    //
    // Do NOT create:
    // id
    // owner_id
    //
    // Backend creates/assigns them.
    // ========================================

    const petData = {
      name: petName.trim(),

      species,

      breed: breed.trim(),

      ageYears,

      ageMonths,

      color: color.trim(),

      weightKg,

      gender,

      photoUrl: photoUrl.trim(),

      allergies: [],

      vaccinations,

      medicalHistory: [],
    };

    try {
      await addPet(petData);

      // Close modal

      setIsAddPetModalOpen(false);

      // Clear form

      resetPetForm();
    } catch (error) {
      console.error(
        "Failed to add pet:",
        error
      );
    }
  };

  // ==========================================
  // OPEN MODAL
  // ==========================================

  const openAddPetModal = () => {
    resetPetForm();

    setIsAddPetModalOpen(true);
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 space-y-10">

      {/* ======================================
          DASHBOARD HEADER
      ====================================== */}

      <div className="max-w-6xl mx-auto bg-gradient-to-r from-emerald-900 to-slate-900 text-white p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-emerald-800/50">

        <div className="flex items-center gap-4">

          <div className="w-16 h-16 rounded-2xl bg-emerald-500 flex items-center justify-center font-black text-slate-950 text-2xl">

            {currentUser
              ? currentUser.name.charAt(0).toUpperCase()
              : "U"}

          </div>

          <div>

            <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold uppercase rounded-md">

              {currentUser?.role ||
                "Pet Owner"}{" "}
              Dashboard

            </span>

            <h1 className="text-2xl sm:text-3xl font-black mt-1">

              Welcome Back,{" "}
              {currentUser?.name ||
                "Pet Parent"}!

            </h1>

            <p className="text-xs text-slate-300">

              {currentUser?.email} •{" "}
              {currentUser?.city ||
                "Dhaka, Bangladesh"}

            </p>

          </div>

        </div>

        <button
          onClick={openAddPetModal}
          className="px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-2xl shadow-md transition-all flex items-center gap-2"
        >

          <Plus className="w-4 h-4" />

          Add New Pet

        </button>

      </div>

      {/* ======================================
          PETS
      ====================================== */}

      <div className="max-w-6xl mx-auto space-y-4">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">

          <h2 className="text-xl font-black text-slate-900">

            My Registered Pets (
            {pets.length}
            )

          </h2>

          <span className="text-xs text-slate-500 font-semibold">

            Your pets are stored in
            MongoDB

          </span>

        </div>

        {pets.length === 0 ? (

          <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center">

            <div className="mx-auto w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mb-4">

              <Plus className="w-8 h-8 text-emerald-600" />

            </div>

            <h3 className="text-lg font-black text-slate-900">

              No pets registered yet

            </h3>

            <p className="text-sm text-slate-500 mt-2">

              Add your first pet to
              create their digital
              health passport.

            </p>

            <button
              onClick={openAddPetModal}
              className="mt-5 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold"
            >

              Register First Pet

            </button>

          </div>

        ) : (

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {pets.map((pet) => (

              <div
                key={pet.id}
                className="bg-white rounded-3xl p-5 shadow-md border border-slate-200 hover:shadow-xl transition-all space-y-4"
              >

                <div className="flex items-center gap-4">

                  <img
                    src={
                      pet.photoUrl ||
                      "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80"
                    }
                    alt={pet.name}
                    className="w-16 h-16 rounded-2xl object-cover ring-2 ring-emerald-500/30"
                  />

                  <div className="min-w-0">

                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 font-mono text-[10px] font-bold rounded-md">

                      #{pet.id}

                    </span>

                    <h3 className="font-bold text-slate-900 truncate">

                      {pet.name}

                    </h3>

                    <p className="text-xs text-slate-500">

                      {pet.breed} •{" "}
                      {pet.species.toUpperCase()}

                    </p>

                  </div>

                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-2xl text-slate-700">

                  <div>

                    <strong>
                      Age:
                    </strong>{" "}

                    {pet.ageYears}y{" "}
                    {pet.ageMonths}m

                  </div>

                  <div>

                    <strong>
                      Weight:
                    </strong>{" "}

                    {pet.weightKg} kg

                  </div>

                  <div>

                    <strong>
                      Vaccines:
                    </strong>{" "}

                    {pet.vaccinations.length}

                  </div>

                  <div>

                    <strong>
                      Gender:
                    </strong>{" "}

                    {pet.gender}

                  </div>

                </div>

                <button
                  onClick={() =>
                    setActivePage("vaccines")
                  }
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5"
                >

                  <ShieldCheck className="w-4 h-4 text-emerald-400" />

                  View Digital Passport

                </button>

              </div>

            ))}

          </div>

        )}

      </div>

      {/* ======================================
          PURCHASE & BOOKING HISTORY
      ====================================== */}

      <div className="max-w-6xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-sm p-6 mt-8">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">

          <div>

            <h2 className="text-xl font-black text-slate-900">

              Purchase & Booking History

            </h2>

            <p className="text-xs text-slate-500 mt-1">

              Your pet store orders,
              appointments, grooming,
              premium and adoption requests.

            </p>

          </div>

          <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold">

            {orders.length} Orders

          </span>

        </div>

        {/* LOADING */}

        {ordersLoading ? (

          <div className="py-10 text-center text-slate-400">

            <p className="font-semibold">

              Loading your purchases...

            </p>

          </div>

        ) : orders.length === 0 ? (

          /* EMPTY */

          <div className="py-10 text-center">

            <div className="mx-auto w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">

              <ShieldCheck className="w-7 h-7 text-slate-400" />

            </div>

            <p className="font-semibold text-slate-600">

              No purchases yet.

            </p>

            <p className="text-xs text-slate-400 mt-1">

              Your orders and bookings
              will appear here.

            </p>

          </div>

        ) : (

          /* ORDERS */

          <div className="space-y-4">

            {orders.map((order) => (

              <div
                key={order.id}
                className="border border-slate-200 rounded-2xl p-5 hover:shadow-sm transition-all"
              >

                {/* ORDER HEADER */}

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">

                  <div>

                    <p className="font-black text-slate-900">

                      {order.orderId}

                    </p>

                    <p className="text-xs text-slate-500 mt-1">

                      {new Date(
                        order.createdAt
                      ).toLocaleString()}

                    </p>

                  </div>

                  <div className="flex flex-wrap gap-2">

                    <span
                      className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                        order.paymentStatus ===
                        "paid"
                          ? "bg-emerald-100 text-emerald-700"
                          : order.paymentStatus ===
                            "not_required"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >

                      {order.paymentStatus ===
                      "not_required"
                        ? "No Payment Required"
                        : order.paymentStatus}

                    </span>

                    <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-bold">

                      {order.orderStatus}

                    </span>

                  </div>

                </div>

                {/* ORDER ITEMS */}

                <div className="mt-4 divide-y">

                  {order.items.map(
                    (item, index) => (

                      <div
                        key={`${order.id}-${index}`}
                        className="py-3 flex justify-between gap-4"
                      >

                        <div className="min-w-0">

                          <p className="font-bold text-sm text-slate-900">

                            {item.name}

                          </p>

                          <p className="text-[11px] text-slate-500 capitalize mt-1">

                            {item.type.replace(
                              "_",
                              " "
                            )}

                            {" • "}

                            Qty:{" "}
                            {item.quantity}

                          </p>

                          {/* DATE */}

                          {item.customData
                            ?.date && (

                            <p className="text-[11px] text-blue-600 mt-1">

                              Date:{" "}
                              {
                                item
                                  .customData
                                  .date
                              }

                            </p>

                          )}

                          {/* TIME */}

                          {item.customData
                            ?.time && (

                            <p className="text-[11px] text-blue-600">

                              Time:{" "}
                              {
                                item
                                  .customData
                                  .time
                              }

                            </p>

                          )}

                          {/* GROOMING TYPE */}

                          {item.customData
                            ?.groomingType && (

                            <p className="text-[11px] text-purple-600 capitalize">

                              Grooming:{" "}
                              {
                                item
                                  .customData
                                  .groomingType
                              }

                            </p>

                          )}

                          {/* PREMIUM PLAN */}

                          {item.customData
                            ?.planName && (

                            <p className="text-[11px] text-amber-600">

                              Plan:{" "}
                              {
                                item
                                  .customData
                                  .planName
                              }

                            </p>

                          )}

                        </div>

                        <p className="font-black text-sm text-slate-900 whitespace-nowrap">

                          ৳
                          {item.priceTk *
                            item.quantity}

                        </p>

                      </div>

                    )
                  )}

                </div>

                {/* ORDER TOTAL */}

                <div className="border-t border-slate-200 mt-3 pt-3 flex justify-between items-center">

                  <span className="font-bold text-slate-600">

                    Total

                  </span>

                  <span className="font-black text-emerald-700 text-lg">

                    ৳{order.totalAmount}

                  </span>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

      {/* ======================================
          ADD PET MODAL
      ====================================== */}

      {isAddPetModalOpen && (

        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">

          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">

            {/* HEADER */}

            <div className="sticky top-0 bg-white z-10 p-6 border-b border-slate-200 flex items-center justify-between">

              <div>

                <h3 className="text-xl font-black text-slate-900">

                  Register New Pet

                </h3>

                <p className="text-xs text-slate-500 mt-1">

                  Pet information and
                  vaccination history will
                  be saved to your account.

                </p>

              </div>

              <button
                type="button"
                onClick={() => {
                  setIsAddPetModalOpen(false);
                  resetPetForm();
                }}
                className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl"
              >

                <X className="w-5 h-5" />

              </button>

            </div>

            {/* FORM */}

            <form
              onSubmit={handleCreatePet}
              className="p-6 space-y-6"
            >

              {/* =================================
                  BASIC INFORMATION
              ================================= */}

              <section>

                <h4 className="font-black text-slate-900 mb-3">

                  Pet Information

                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

                  {/* NAME */}

                  <div>

                    <label className="text-xs font-bold text-slate-700">

                      Pet Name

                    </label>

                    <input
                      type="text"
                      value={petName}
                      onChange={(e) =>
                        setPetName(
                          e.target.value
                        )
                      }
                      required
                      placeholder="e.g. Simba"
                      className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl"
                    />

                  </div>

                  {/* SPECIES */}

                  <div>

                    <label className="text-xs font-bold text-slate-700">

                      Species

                    </label>

                    <select
                      value={species}
                      onChange={(e) =>
                        setSpecies(
                          e.target.value as PetSpecies
                        )
                      }
                      className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl"
                    >

                      <option value="dog">
                        Dog
                      </option>

                      <option value="cat">
                        Cat
                      </option>

                      <option value="rabbit">
                        Rabbit
                      </option>

                    </select>

                  </div>

                  {/* BREED */}

                  <div>

                    <label className="text-xs font-bold text-slate-700">

                      Breed

                    </label>

                    <input
                      type="text"
                      value={breed}
                      onChange={(e) =>
                        setBreed(
                          e.target.value
                        )
                      }
                      required
                      placeholder="e.g. Persian"
                      className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl"
                    />

                  </div>

                  {/* COLOR */}

                  <div>

                    <label className="text-xs font-bold text-slate-700">

                      Color

                    </label>

                    <input
                      type="text"
                      value={color}
                      onChange={(e) =>
                        setColor(
                          e.target.value
                        )
                      }
                      placeholder="e.g. Brown"
                      className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl"
                    />

                  </div>

                  {/* AGE YEARS */}

                  <div>

                    <label className="text-xs font-bold text-slate-700">

                      Age — Years

                    </label>

                    <input
                      type="number"
                      min="0"
                      value={ageYears}
                      onChange={(e) =>
                        setAgeYears(
                          Number(
                            e.target.value
                          )
                        )
                      }
                      className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl"
                    />

                  </div>

                  {/* AGE MONTHS */}

                  <div>

                    <label className="text-xs font-bold text-slate-700">

                      Age — Months

                    </label>

                    <input
                      type="number"
                      min="0"
                      max="11"
                      value={ageMonths}
                      onChange={(e) =>
                        setAgeMonths(
                          Number(
                            e.target.value
                          )
                        )
                      }
                      className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl"
                    />

                  </div>

                  {/* WEIGHT */}

                  <div>

                    <label className="text-xs font-bold text-slate-700">

                      Weight (kg)

                    </label>

                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={weightKg}
                      onChange={(e) =>
                        setWeightKg(
                          Number(
                            e.target.value
                          )
                        )
                      }
                      className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl"
                    />

                  </div>

                  {/* GENDER */}

                  <div>

                    <label className="text-xs font-bold text-slate-700">

                      Gender

                    </label>

                    <select
                      value={gender}
                      onChange={(e) =>
                        setGender(
                          e.target.value as
                            | "male"
                            | "female"
                        )
                      }
                      className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl"
                    >

                      <option value="male">
                        Male
                      </option>

                      <option value="female">
                        Female
                      </option>

                    </select>

                  </div>

                  {/* PHOTO */}

                  <div className="md:col-span-2">

                    <label className="text-xs font-bold text-slate-700">

                      Photo URL

                    </label>

                    <input
                      type="url"
                      value={photoUrl}
                      onChange={(e) =>
                        setPhotoUrl(
                          e.target.value
                        )
                      }
                      placeholder="https://..."
                      className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl"
                    />

                  </div>

                </div>

              </section>

              {/* =================================
                  VACCINATION HISTORY
              ================================= */}

              <section className="border-t border-slate-200 pt-6">

                <div className="flex items-center justify-between mb-3">

                  <div>

                    <h4 className="font-black text-slate-900">

                      Vaccination History

                    </h4>

                    <p className="text-xs text-slate-500">

                      Add previous and current
                      vaccinations.

                    </p>

                  </div>

                  <span className="text-xs font-bold bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full">

                    {vaccinations.length}{" "}
                    added

                  </span>

                </div>

                {/* VACCINATION INPUT */}

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">

                  <div>

                    <label className="text-xs font-bold text-slate-700">

                      Vaccine Name

                    </label>

                    <input
                      type="text"
                      value={vaccineName}
                      onChange={(e) =>
                        setVaccineName(
                          e.target.value
                        )
                      }
                      placeholder="e.g. Rabies"
                      className="w-full mt-1 p-3 bg-white border border-slate-200 rounded-xl"
                    />

                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

                    <div>

                      <label className="text-xs font-bold text-slate-700">

                        Given Date

                      </label>

                      <input
                        type="date"
                        value={givenDate}
                        onChange={(e) =>
                          setGivenDate(
                            e.target.value
                          )
                        }
                        className="w-full mt-1 p-3 bg-white border border-slate-200 rounded-xl"
                      />

                    </div>

                    <div>

                      <label className="text-xs font-bold text-slate-700">

                        Next Due Date

                      </label>

                      <input
                        type="date"
                        value={nextDueDate}
                        onChange={(e) =>
                          setNextDueDate(
                            e.target.value
                          )
                        }
                        className="w-full mt-1 p-3 bg-white border border-slate-200 rounded-xl"
                      />

                    </div>

                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

                    <div>

                      <label className="text-xs font-bold text-slate-700">

                        Veterinarian

                      </label>

                      <input
                        type="text"
                        value={veterinarian}
                        onChange={(e) =>
                          setVeterinarian(
                            e.target.value
                          )
                        }
                        placeholder="Dr. Rahman"
                        className="w-full mt-1 p-3 bg-white border border-slate-200 rounded-xl"
                      />

                    </div>

                    <div>

                      <label className="text-xs font-bold text-slate-700">

                        Batch Number
                        <span className="font-normal text-slate-400">
                          {" "}
                          (optional)
                        </span>

                      </label>

                      <input
                        type="text"
                        value={batchNumber}
                        onChange={(e) =>
                          setBatchNumber(
                            e.target.value
                          )
                        }
                        placeholder="e.g. RB-2026-001"
                        className="w-full mt-1 p-3 bg-white border border-slate-200 rounded-xl"
                      />

                    </div>

                  </div>

                  <button
                    type="button"
                    onClick={
                      handleAddVaccination
                    }
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl"
                  >

                    <Plus className="w-4 h-4 inline mr-1" />

                    Add Vaccination

                  </button>

                </div>

                {/* ADDED VACCINATIONS */}

                {vaccinations.length > 0 && (

                  <div className="mt-4 space-y-2">

                    {vaccinations.map(
                      (vaccination) => (

                        <div
                          key={
                            vaccination.id
                          }
                          className="flex items-center justify-between gap-3 p-3 bg-white border border-slate-200 rounded-xl"
                        >

                          <div>

                            <p className="font-bold text-sm text-slate-900">

                              {
                                vaccination.vaccineName
                              }

                            </p>

                            <p className="text-xs text-slate-500">

                              Given:{" "}
                              {
                                vaccination.givenDate
                              }{" "}
                              • Next due:{" "}
                              {
                                vaccination.nextDueDate
                              }

                            </p>

                            <p className="text-xs text-slate-500">

                              Vet:{" "}
                              {
                                vaccination.veterinarian
                              }

                            </p>

                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              handleRemoveVaccination(
                                vaccination.id
                              )
                            }
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                          >

                            <Trash2 className="w-4 h-4" />

                          </button>

                        </div>

                      )
                    )}

                  </div>

                )}

              </section>

              {/* =================================
                  BUTTONS
              ================================= */}

              <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-5">

                <button
                  type="button"
                  onClick={() => {
                    setIsAddPetModalOpen(
                      false
                    );

                    resetPetForm();
                  }}
                  className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >

                  Cancel

                </button>

                <button
                  type="submit"
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl shadow-md"
                >

                  Save Pet & Health History

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}; 
