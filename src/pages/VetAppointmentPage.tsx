import React, {
  useState,
} from "react";

import {
  mockVets,
} from "../data/mockData";

import {
  useApp,
} from "../context/AppContext";

import {
  Product,
} from "../types";


export const VetAppointmentPage:
  React.FC = () => {

  const {
    addToCart,
    requireAuth,
    addToast,
    setActivePage,
  } = useApp();


  const [
    selectedSlots,
    setSelectedSlots,
  ] = useState<{
    [key: string]: string;
  }>({});


  const handleSlotSelect = (
    vetId: string,
    slot: string
  ) => {

    setSelectedSlots(
      (prev) => ({
        ...prev,

        [vetId]:
          slot,
      })
    );
  };


  const handleBookAppointment = (
    vet:
      (typeof mockVets)[number],

    selectedSlot:
      string
  ) => {

    if (!requireAuth()) {
      return;
    }


    const appointmentProduct:
      Product = {

        product_id:
          `VET-${vet.id}-${selectedSlot}`,

        nameEn:
          `Vet Appointment - ${vet.name}`,

        nameBn:
          `ভেট অ্যাপয়েন্টমেন্ট - ${vet.name}`,

        category:
          "healthcare",

        targetSpecies:
          "all",

        priceTk:
          vet.feeTk,

        rating:
          vet.rating,

        reviewsCount:
          0,

        image:
          vet.photoUrl,

        descriptionEn:
          `${vet.specialty} appointment at ${vet.clinicName}`,

        descriptionBn:
          `${vet.clinicName} এ ভেট অ্যাপয়েন্টমেন্ট`,

        stock:
          1,
      };


    const added =
      addToCart(
        appointmentProduct,

        1,

        "vet_appointment",

        {
          vetId:
            vet.id,

          vetName:
            vet.name,

          clinicName:
            vet.clinicName,

          area:
            vet.area,

          date:
            new Date()
              .toISOString()
              .split("T")[0],

          time:
            selectedSlot,

          feeTk:
            vet.feeTk,

          consultationType:
            "in_person",
        }
      );


    if (added) {

      addToast(
        "Appointment added to cart. Complete payment to confirm.",
        "success"
      );


      setActivePage(
        "cart"
      );
    }
  };


  return (

    <div className="max-w-7xl mx-auto px-4 py-8 font-sans">

      <h1 className="text-2xl font-bold text-slate-900 mb-6">

        Book Vet Appointment

      </h1>


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {mockVets.map(
          (vet) => {

            const selectedSlot =
              selectedSlots[
                vet.id
              ];


            return (

              <div
                key={vet.id}
                className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between space-y-4"
              >

                <div className="flex items-start gap-4">

                  <img
                    src={
                      vet.photoUrl
                    }

                    alt={
                      vet.name
                    }

                    className="w-20 h-20 rounded-2xl object-cover"
                  />


                  <div>

                    <h3 className="font-bold text-slate-900 text-lg">

                      {vet.name}

                    </h3>


                    <p className="text-sm text-blue-600">

                      {vet.specialty}

                    </p>


                    <p className="text-xs text-slate-500">

                      {vet.qualification}

                    </p>

                  </div>

                </div>


                <div className="text-sm border-t pt-3">

                  <p>

                    📍
                    {" "}
                    {vet.clinicName}

                  </p>


                  <p className="font-bold text-lg">

                    ৳
                    {vet.feeTk}

                  </p>

                </div>


                <div>

                  <p className="text-xs font-bold mb-2">

                    AVAILABLE SLOTS

                  </p>


                  <div className="grid grid-cols-3 gap-2">

                    {vet.availableTimes.map(
                      (slot) => (

                        <button
                          key={
                            slot
                          }

                          onClick={() =>
                            handleSlotSelect(
                              vet.id,
                              slot
                            )
                          }

                          className={`p-2 text-xs rounded-xl ${
                            selectedSlot ===
                            slot
                              ? "bg-blue-600 text-white"
                              : "bg-blue-50 text-blue-600"
                          }`}
                        >

                          {slot}

                        </button>
                      )
                    )}

                  </div>

                </div>


                <button

                  disabled={
                    !selectedSlot
                  }

                  onClick={() =>
                    selectedSlot &&
                    handleBookAppointment(
                      vet,
                      selectedSlot
                    )
                  }

                  className={`w-full py-3 font-bold rounded-xl ${
                    selectedSlot
                      ? "bg-blue-600 text-white"
                      : "bg-slate-200 text-slate-400"
                  }`}
                >

                  {selectedSlot

                    ? `Add Appointment to Cart (৳${vet.feeTk})`

                    : "Select a Time Slot"

                  }

                </button>

              </div>
            );
          }
        )}

      </div>

    </div>
  );
};


export default
  VetAppointmentPage; 
