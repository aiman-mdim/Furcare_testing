import mongoose, { Document, Schema } from "mongoose";

export interface IPet extends Document {
  owner_id: mongoose.Types.ObjectId;

  name: string;

  species: "dog" | "cat" | "rabbit";

  breed: string;

  ageYears: number;
  ageMonths: number;

  color: string;

  weightKg: number;

  gender: "male" | "female";

  photoUrl: string;

  allergies: string[];

  vaccinations: {
    id: string;
    vaccineName: string;
    givenDate: string;
    nextDueDate: string;
    status: "completed" | "upcoming" | "overdue";
    batchNumber?: string;
    veterinarian: string;
    postVaccineTipsEn?: string[];
    postVaccineTipsBn?: string[];
  }[];

  medicalHistory: {
    id: string;
    date: string;
    title: string;
    description: string;
    doctorName: string;
    type:
      | "vaccine"
      | "surgery"
      | "checkup"
      | "allergy";
  }[];

  microchipId?: string;

  createdAt: Date;
  updatedAt: Date;
}

const PetSchema = new Schema<IPet>(
  {
    owner_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    species: {
      type: String,
      enum: ["dog", "cat", "rabbit"],
      required: true,
    },

    breed: {
      type: String,
      required: true,
      trim: true,
    },

    ageYears: {
      type: Number,
      default: 0,
      min: 0,
    },

    ageMonths: {
      type: Number,
      default: 0,
      min: 0,
      max: 11,
    },

    color: {
      type: String,
      default: "",
      trim: true,
    },

    weightKg: {
      type: Number,
      default: 0,
      min: 0,
    },

    gender: {
      type: String,
      enum: ["male", "female"],
      required: true,
    },

    photoUrl: {
      type: String,
      default: "",
    },

    allergies: {
      type: [String],
      default: [],
    },

    vaccinations: {
      type: [
        {
          id: {
            type: String,
            required: true,
          },

          vaccineName: {
            type: String,
            required: true,
          },

          givenDate: {
            type: String,
            required: true,
          },

          nextDueDate: {
            type: String,
            required: true,
          },

          status: {
            type: String,
            enum: [
              "completed",
              "upcoming",
              "overdue",
            ],
            required: true,
          },

          batchNumber: {
            type: String,
          },

          veterinarian: {
            type: String,
            required: true,
          },

          postVaccineTipsEn: {
            type: [String],
            default: [],
          },

          postVaccineTipsBn: {
            type: [String],
            default: [],
          },
        },
      ],

      default: [],
    },

    medicalHistory: {
      type: [
        {
          id: {
            type: String,
            required: true,
          },

          date: {
            type: String,
            required: true,
          },

          title: {
            type: String,
            required: true,
          },

          description: {
            type: String,
            required: true,
          },

          doctorName: {
            type: String,
            required: true,
          },

          type: {
            type: String,
            enum: [
              "vaccine",
              "surgery",
              "checkup",
              "allergy",
            ],
            required: true,
          },
        },
      ],

      default: [],
    },

    microchipId: {
      type: String,
      default: "",
      trim: true,
    },
  },

  {
    timestamps: true,
  }
);

export default mongoose.models.Pet ||
  mongoose.model<IPet>("Pet", PetSchema);