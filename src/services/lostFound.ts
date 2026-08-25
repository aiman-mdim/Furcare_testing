import axios from "axios";

export type LostFoundType = "lost" | "found";

export interface LostFoundReport {
  _id: string;
  owner_id: string;

  type: LostFoundType;

  petName?: string;

  species: "dog" | "cat" | "rabbit";

  breed: string;
  color: string;
  eyeColor: string;

  faceStructure:
    | "round"
    | "long"
    | "pointed"
    | "flat";

  collarNeckband?: string;
  birthmarkOrFeature?: string;
  lastWearCloth?: string;

  lastLocation: string;

  contactPhone: string;
  contactName: string;

  photoUrl: string;

  status:
    | "active"
    | "matched"
    | "resolved";

  reportedDate: string;

  createdAt: string;
  updatedAt: string;
}

export interface CreateLostFoundData {
  type: LostFoundType;

  petName?: string;

  species: "dog" | "cat" | "rabbit";

  breed: string;
  color: string;
  eyeColor: string;

  faceStructure:
    | "round"
    | "long"
    | "pointed"
    | "flat";

  collarNeckband?: string;
  birthmarkOrFeature?: string;
  lastWearCloth?: string;

  lastLocation: string;

  contactPhone: string;
  contactName: string;

  reportedDate?: string;

  image: File;
}

const API_URL = "/api/lost-found";

export const lostFoundApi = {
  /**
   * Get every active lost/found report.
   * This endpoint is public at backend level,
   * but the frontend page itself is intended
   * for logged-in users.
   */
  async getAllReports(): Promise<LostFoundReport[]> {
    const response = await axios.get(API_URL);

    return response.data?.listings || [];
  },

  /**
   * Get reports created by the currently
   * logged-in user.
   */
  async getMyReports(): Promise<LostFoundReport[]> {
    const response = await axios.get(
      `${API_URL}/mine`
    );

    return response.data?.listings || [];
  },

  /**
   * Create a new lost/found report.
   *
   * Uses multipart/form-data because
   * the pet image is uploaded together
   * with the report.
   */
  async createReport(
    data: CreateLostFoundData
  ): Promise<LostFoundReport> {
    const formData = new FormData();

    formData.append("type", data.type);

    if (data.petName) {
      formData.append(
        "petName",
        data.petName
      );
    }

    formData.append(
      "species",
      data.species
    );

    formData.append(
      "breed",
      data.breed
    );

    formData.append(
      "color",
      data.color
    );

    formData.append(
      "eyeColor",
      data.eyeColor
    );

    formData.append(
      "faceStructure",
      data.faceStructure
    );

    if (data.collarNeckband) {
      formData.append(
        "collarNeckband",
        data.collarNeckband
      );
    }

    if (data.birthmarkOrFeature) {
      formData.append(
        "birthmarkOrFeature",
        data.birthmarkOrFeature
      );
    }

    if (data.lastWearCloth) {
      formData.append(
        "lastWearCloth",
        data.lastWearCloth
      );
    }

    formData.append(
      "lastLocation",
      data.lastLocation
    );

    formData.append(
      "contactPhone",
      data.contactPhone
    );

    formData.append(
      "contactName",
      data.contactName
    );

    if (data.reportedDate) {
      formData.append(
        "reportedDate",
        data.reportedDate
      );
    }

    formData.append(
      "image",
      data.image
    );

    const response = await axios.post(
      API_URL,
      formData,
      {
        withCredentials: true,
      }
    );

    return response.data.listing;
  },

  /**
   * Resolve one of the user's reports.
   */
  async resolveReport(
    id: string
  ): Promise<LostFoundReport> {
    const response = await axios.patch(
      `${API_URL}/${id}/resolve`,
      {},
      {
        withCredentials: true,
      }
    );

    return response.data.listing;
  },

  /**
   * Delete one of the user's reports.
   */
  async deleteReport(
    id: string
  ): Promise<void> {
    await axios.delete(
      `${API_URL}/${id}`,
      {
        withCredentials: true,
      }
    );
  },
};