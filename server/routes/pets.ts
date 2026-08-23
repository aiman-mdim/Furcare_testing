import mongoose, {
  Document,
  Model,
  Schema,
} from "mongoose";

// ============================================
// PET DOCUMENT TYPE
// ============================================

export interface IPet extends Document {
  owner_id: mongoose.Types.ObjectId;

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

  vaccinations: {
    id: string;
    vaccineName: string;
    givenDate: string;
    nextDueDate: string;
    status:
      | "completed"
      | "upcoming"
      | "overdue";
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

// ============================================
// VACCINE RECORD SCHEMA
// ============================================

const VaccineRecordSchema =
  new Schema(
    {
      id: {
        type: String,
        required: true,
      },

      vaccineName: {
        type: String,
        required: true,
        trim: true,
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
        trim: true,
      },

      veterinarian: {
        type: String,
        required: true,
        trim: true,
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
    {
      _id: false,
    }
  );

// ============================================
// MEDICAL RECORD SCHEMA
// ============================================

const MedicalRecordSchema =
  new Schema(
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
        trim: true,
      },

      description: {
        type: String,
        required: true,
        trim: true,
      },

      doctorName: {
        type: String,
        required: true,
        trim: true,
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
    {
      _id: false,
    }
  );

// ============================================
// PET SCHEMA
// ============================================

const PetSchema =
  new Schema<IPet>(
    {
      // ----------------------------------------
      // OWNER
      // ----------------------------------------
      //
      // IMPORTANT:
      // This value comes from the authenticated
      // user's JWT in server/routes/pets.ts.
      //
      // The frontend should NEVER be trusted
      // to choose the owner_id.
      // ----------------------------------------

      owner_id: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
      },

      // ----------------------------------------
      // BASIC INFORMATION
      // ----------------------------------------

      name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100,
      },

      species: {
        type: String,
        enum: [
          "dog",
          "cat",
          "rabbit",
        ],
        required: true,
      },

      breed: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100,
      },

      // ----------------------------------------
      // AGE
      // ----------------------------------------

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

      // ----------------------------------------
      // PHYSICAL INFORMATION
      // ----------------------------------------

      color: {
        type: String,
        default: "",
        trim: true,
        maxlength: 100,
      },

      weightKg: {
        type: Number,
        default: 0,
        min: 0,
      },

      gender: {
        type: String,
        enum: [
          "male",
          "female",
        ],
        required: true,
      },

      // ----------------------------------------
      // PHOTO
      // ----------------------------------------

      photoUrl: {
        type: String,
        default: "",
        trim: true,
      },

      // ----------------------------------------
      // ALLERGIES
      // ----------------------------------------

      allergies: {
        type: [String],
        default: [],
      },

      // ----------------------------------------
      // VACCINATIONS
      // ----------------------------------------

      vaccinations: {
        type: [
          VaccineRecordSchema,
        ],
        default: [],
      },

      // ----------------------------------------
      // MEDICAL HISTORY
      // ----------------------------------------

      medicalHistory: {
        type: [
          MedicalRecordSchema,
        ],
        default: [],
      },

      // ----------------------------------------
      // MICROCHIP
      // ----------------------------------------

      microchipId: {
        type: String,
        default: undefined,
        trim: true,
      },
    },
    {
      timestamps: true,

      versionKey: false,
    }
  );

// ============================================
// INDEX
// ============================================
//
// This makes:
// GET /api/pets
//
// much more efficient because your route uses:
//
// Pet.find({ owner_id: req.userId })
//
// ============================================

PetSchema.index({
  owner_id: 1,
  createdAt: -1,
});

// ============================================
// MODEL
// ============================================
//
// Prevent model re-compilation during
// development/hot reload.
// ============================================

const Pet: Model<IPet> =
  mongoose.models.Pet ||
  mongoose.model<IPet>(
    "Pet",
    PetSchema
  );

export default Pet; 