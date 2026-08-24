import {
  Pet,
  VaccineRecord,
  MedicalRecord,
} from "../types";

/*
 * FurCare API
 *
 * The current FurCare server runs on port 3000.
 *
 * If VITE_API_URL is not provided, use the current
 * origin so the application also works when Express
 * serves the Vite frontend itself.
 */

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

  ageYears?: number;
  ageMonths?: number;

  color?: string;
  weightKg?: number;

  gender:
    | "male"
    | "female";

  photoUrl?: string;

  allergies?: string[];

  vaccinations?: VaccineRecord[];

  medicalHistory?: MedicalRecord[];

  microchipId?: string;
}

/* =========================================================
   SAFE JSON RESPONSE
========================================================= */

async function readJson(response: Response): Promise<any> {
  const text = await response.text();

  if (!text) {
    return {};
  }

  try {
    return JSON.parse(text);
  } catch {
    return {
      error: text,
    };
  }
}

/* =========================================================
   CONVERT API PET -> FRONTEND PET
========================================================= */

function mapPet(pet: ApiPet): Pet {
  return {
    id: pet._id,

    owner_id: pet.owner_id,

    name: pet.name,

    species: pet.species,

    breed: pet.breed,

    ageYears: pet.ageYears ?? 0,

    ageMonths: pet.ageMonths ?? 0,

    color: pet.color ?? "",

    weightKg: pet.weightKg ?? 0,

    gender: pet.gender,

    photoUrl: pet.photoUrl ?? "",

    allergies: Array.isArray(pet.allergies)
      ? pet.allergies
      : [],

    vaccinations: Array.isArray(
      pet.vaccinations
    )
      ? pet.vaccinations
      : [],

    medicalHistory: Array.isArray(
      pet.medicalHistory
    )
      ? pet.medicalHistory
      : [],

    microchipId: pet.microchipId,
  };
}

/* =========================================================
   NETWORK ERROR HANDLER
========================================================= */

function handleNetworkError(
  error: unknown,
  action: string
): never {
  console.error(
    `❌ Pet API ${action} failed:`,
    error
  );

  if (
    error instanceof TypeError &&
    error.message.toLowerCase().includes("fetch")
  ) {
    throw new Error(
      "Cannot connect to the FurCare server. " +
        "Please make sure the backend is running on http://localhost:3000."
    );
  }

  if (error instanceof Error) {
    throw error;
  }

  throw new Error(
    `Failed to ${action}.`
  );
}

/* =========================================================
   PET API
========================================================= */

export const petsApi = {

  /* =======================================================
     GET MY PETS
  ======================================================= */

  async getMyPets(): Promise<Pet[]> {
    try {
      const response = await fetch(
        API_URL,
        {
          method: "GET",

          credentials: "include",

          headers: {
            Accept:
              "application/json",
          },
        }
      );

      const data =
        await readJson(response);

      if (!response.ok) {
        throw new Error(
          data.error ||
            data.message ||
            `Failed to fetch pets (${response.status})`
        );
      }

      if (!Array.isArray(data.pets)) {
        return [];
      }

      return data.pets
        .filter(Boolean)
        .map(mapPet);
    } catch (error) {
      return handleNetworkError(
        error,
        "fetch pets"
      );
    }
  },

  /* =======================================================
     CREATE PET
  ======================================================= */

  async createPet(
    pet: Omit<
      Pet,
      "id" | "owner_id"
    >
  ): Promise<Pet> {
    try {
      const response = await fetch(
        API_URL,
        {
          method: "POST",

          credentials: "include",

          headers: {
            "Content-Type":
              "application/json",

            Accept:
              "application/json",
          },

          body: JSON.stringify(pet),
        }
      );

      const data =
        await readJson(response);

      if (!response.ok) {
        throw new Error(
          data.error ||
            data.message ||
            `Failed to register pet (${response.status})`
        );
      }

      if (!data.pet) {
        throw new Error(
          "Server did not return the registered pet."
        );
      }

      return mapPet(data.pet);
    } catch (error) {
      return handleNetworkError(
        error,
        "register pet"
      );
    }
  },

  /* =======================================================
     GET ONE PET
  ======================================================= */

  async getPet(
    id: string
  ): Promise<Pet> {
    try {
      const response =
        await fetch(
          `${API_URL}/${encodeURIComponent(id)}`,
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
        await readJson(response);

      if (!response.ok) {
        throw new Error(
          data.error ||
            data.message ||
            "Failed to fetch pet."
        );
      }

      if (!data.pet) {
        throw new Error(
          "Pet was not returned by the server."
        );
      }

      return mapPet(data.pet);
    } catch (error) {
      return handleNetworkError(
        error,
        "fetch pet"
      );
    }
  },

  /* =======================================================
     UPDATE PET
  ======================================================= */

  async updatePet(
    id: string,
    updates: Partial<
      Omit<
        Pet,
        "id" | "owner_id"
      >
    >
  ): Promise<Pet> {
    try {
      const response =
        await fetch(
          `${API_URL}/${encodeURIComponent(id)}`,
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

            body: JSON.stringify(
              updates
            ),
          }
        );

      const data =
        await readJson(response);

      if (!response.ok) {
        throw new Error(
          data.error ||
            data.message ||
            "Failed to update pet."
        );
      }

      if (!data.pet) {
        throw new Error(
          "Updated pet was not returned by the server."
        );
      }

      return mapPet(data.pet);
    } catch (error) {
      return handleNetworkError(
        error,
        "update pet"
      );
    }
  },

  /* =======================================================
     DELETE PET
  ======================================================= */

  async deletePet(
    id: string
  ): Promise<void> {
    try {
      const response =
        await fetch(
          `${API_URL}/${encodeURIComponent(id)}`,
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

      const data =
        await readJson(response);

      if (!response.ok) {
        throw new Error(
          data.error ||
            data.message ||
            "Failed to delete pet."
        );
      }
    } catch (error) {
      return handleNetworkError(
        error,
        "delete pet"
      );
    }
  },
};