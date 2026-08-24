import mongoose, {
  Document,
  Model,
  Schema,
} from "mongoose";

// ============================================
// AI MATCH TYPE
// ============================================

interface IAIMatch {
  listingId: string;
  confidence: number;
  reason: string;
}

// ============================================
// IMAGE FEATURES
// ============================================

interface IImageFeatures {
  species?: string;
  breed?: string;
  color?: string;
  markings?: string[];
  facialFeatures?: string[];
  distinctiveFeatures?: string[];
}

// ============================================
// LOST / FOUND DOCUMENT
// ============================================

export interface ILostFound extends Document {
  owner_id: mongoose.Types.ObjectId;

  type: "lost" | "found";

  petName?: string;

  species:
    | "dog"
    | "cat"
    | "rabbit";

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

  imageFeatures?: IImageFeatures;

  aiMatches?: IAIMatch[];

  createdAt: Date;

  updatedAt: Date;
}

// ============================================
// AI MATCH SCHEMA
// ============================================

const AIMatchSchema =
  new Schema<IAIMatch>(
    {
      listingId: {
        type: String,
        required: true,
      },

      confidence: {
        type: Number,
        min: 0,
        max: 100,
        required: true,
      },

      reason: {
        type: String,
        default: "",
      },
    },
    {
      _id: false,
    }
  );

// ============================================
// IMAGE FEATURES SCHEMA
// ============================================

const ImageFeaturesSchema =
  new Schema<IImageFeatures>(
    {
      species: String,

      breed: String,

      color: String,

      markings: {
        type: [String],
        default: [],
      },

      facialFeatures: {
        type: [String],
        default: [],
      },

      distinctiveFeatures: {
        type: [String],
        default: [],
      },
    },
    {
      _id: false,
    }
  );

// ============================================
// MAIN SCHEMA
// ============================================

const LostFoundSchema =
  new Schema<ILostFound>(
    {
      owner_id: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
      },

      type: {
        type: String,
        enum: ["lost", "found"],
        required: true,
      },

      petName: {
        type: String,
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
      },

      color: {
        type: String,
        required: true,
        trim: true,
      },

      eyeColor: {
        type: String,
        required: true,
        trim: true,
      },

      faceStructure: {
        type: String,
        enum: [
          "round",
          "long",
          "pointed",
          "flat",
        ],
        required: true,
      },

      collarNeckband: {
        type: String,
        trim: true,
      },

      birthmarkOrFeature: {
        type: String,
        trim: true,
      },

      lastWearCloth: {
        type: String,
        trim: true,
      },

      lastLocation: {
        type: String,
        required: true,
        trim: true,
      },

      contactPhone: {
        type: String,
        required: true,
        trim: true,
      },

      contactName: {
        type: String,
        required: true,
        trim: true,
      },

      photoUrl: {
        type: String,
        required: true,
        trim: true,
      },

      status: {
        type: String,
        enum: [
          "active",
          "matched",
          "resolved",
        ],
        default: "active",
      },

      reportedDate: {
        type: String,
        required: true,
      },

      imageFeatures: {
        type: ImageFeaturesSchema,
        default: undefined,
      },

      aiMatches: {
        type: [AIMatchSchema],
        default: [],
      },
    },
    {
      timestamps: true,
      versionKey: false,
    }
  );

// ============================================
// INDEXES
// ============================================

LostFoundSchema.index({
  type: 1,
  status: 1,
});

LostFoundSchema.index({
  species: 1,
});

LostFoundSchema.index({
  owner_id: 1,
  createdAt: -1,
});

// ============================================
// MODEL
// ============================================

const LostFound: Model<ILostFound> =
  mongoose.models.LostFound ||
  mongoose.model<ILostFound>(
    "LostFound",
    LostFoundSchema
  );

export default LostFound;