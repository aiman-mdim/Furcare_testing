import {
  Pet,
  VaccineRecord,
  MedicalRecord,
} from "../types";

const API_URL = "/api/pets";

interface ApiPet {
  _id: string;

  owner_id: string;

  name: string;

  species:
    | "dog"
    | "cat"
    | "rabbit";

  breed: string;

  ageYears: number;

  ageMonths: number;

  color: string;

  weightKg: number;

  gender:
    | "male"
    | "female";

  photoUrl: string;

  allergies: string[];

  vaccinations: VaccineRecord[];

  medicalHistory: MedicalRecord[];

  microchipId?: string;
}

// ============================================
// CONVERT MONGODB PET → FRONTEND PET
// ============================================

function mapPet(
  pet: ApiPet
): Pet {

  return {
    id: pet._id,

    owner_id: pet.owner_id,

    name: pet.name,

    species: pet.species,

    breed: pet.breed,

    ageYears:
      pet.ageYears ?? 0,

    ageMonths:
      pet.ageMonths ?? 0,

    color:
      pet.color ?? "",

    weightKg:
      pet.weightKg ?? 0,

    gender: pet.gender,

    photoUrl:
      pet.photoUrl ?? "",

    allergies:
      Array.isArray(
        pet.allergies
      )
        ? pet.allergies
        : [],

    vaccinations:
      Array.isArray(
        pet.vaccinations
      )
        ? pet.vaccinations
        : [],

    medicalHistory:
      Array.isArray(
        pet.medicalHistory
      )
        ? pet.medicalHistory
        : [],

    microchipId:
      pet.microchipId,
  };
}

// ============================================
// PET API
// ============================================

export const petsApi = {

  // ==========================================
  // GET MY PETS
  // ==========================================

  async getMyPets(): Promise<Pet[]> {

    const response =
      await fetch(API_URL, {
        method: "GET",

        credentials: "include",

        headers: {
          Accept:
            "application/json",
        },
      });

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.error ||
          data.message ||
          "Failed to fetch pets"
      );
    }

    return Array.isArray(
      data.pets
    )
      ? data.pets.map(
          mapPet
        )
      : [];
  },

  // ==========================================
  // CREATE PET
  // ==========================================

  async createPet(
    pet: Omit<
      Pet,
      "id" | "owner_id"
    >
  ): Promise<Pet> {

    const response =
      await fetch(API_URL, {
        method: "POST",

        credentials: "include",

        headers: {
          "Content-Type":
            "application/json",

          Accept:
            "application/json",
        },

        body:
          JSON.stringify(pet),
      });

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.error ||
          data.message ||
          "Failed to register pet"
      );
    }

    if (!data.pet) {
      throw new Error(
        "Server did not return the registered pet"
      );
    }

    return mapPet(
      data.pet
    );
  },

  // ==========================================
  // GET ONE PET
  // ==========================================

  async getPet(
    id: string
  ): Promise<Pet> {

    const response =
      await fetch(
        `${API_URL}/${id}`,
        {
          method: "GET",

          credentials:
            "include",

          headers: {
            Accept:
              "application/json",
          },
        }
      );

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.error ||
          "Failed to fetch pet"
      );
    }

    return mapPet(
      data.pet
    );
  },

  // ==========================================
  // UPDATE PET
  // ==========================================

  async updatePet(
    id: string,
    updates: Partial<
      Omit<Pet, "id" | "owner_id">
    >
  ): Promise<Pet> {

    const response =
      await fetch(
        `${API_URL}/${id}`,
        {
          method: "PUT",

          credentials:
            "include",

          headers: {
            "Content-Type":
              "application/json",

            Accept:
              "application/json",
          },

          body:
            JSON.stringify(
              updates
            ),
        }
      );

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.error ||
          "Failed to update pet"
      );
    }

    return mapPet(
      data.pet
    );
  },

  // ==========================================
  // DELETE PET
  // ==========================================

  async deletePet(
    id: string
  ): Promise<void> {

    const response =
      await fetch(
        `${API_URL}/${id}`,
        {
          method: "DELETE",

          credentials:
            "include",

          headers: {
            Accept:
              "application/json",
          },
        }
      );

    if (!response.ok) {

      const data =
        await response.json();

      throw new Error(
        data.error ||
          "Failed to delete pet"
      );
    }
  },
};