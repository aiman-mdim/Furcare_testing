import mongoose, {
  Document,
  Model,
  Schema,
} from "mongoose";

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

  createdAt: Date;

  updatedAt: Date;
}

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
        enum: [
          "lost",
          "found",
        ],
        required: true,
        index: true,
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
        maxlength: 100,
      },

      color: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100,
      },

      eyeColor: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100,
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
        maxlength: 200,
      },

      birthmarkOrFeature: {
        type: String,
        trim: true,
        maxlength: 500,
      },

      lastWearCloth: {
        type: String,
        trim: true,
        maxlength: 200,
      },

      lastLocation: {
        type: String,
        required: true,
        trim: true,
        maxlength: 300,
      },

      contactPhone: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50,
      },

      contactName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100,
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
        index: true,
      },

      reportedDate: {
        type: String,
        required: true,
      },
    },
    {
      timestamps: true,
      versionKey: false,
    }
  );

/*
|--------------------------------------------------------------------------
| INDEXES
|--------------------------------------------------------------------------
*/

LostFoundSchema.index({
  type: 1,
  status: 1,
  createdAt: -1,
});

LostFoundSchema.index({
  owner_id: 1,
  createdAt: -1,
});

LostFoundSchema.index({
  species: 1,
});

/*
|--------------------------------------------------------------------------
| MODEL
|--------------------------------------------------------------------------
*/

const LostFound: Model<ILostFound> =
  mongoose.models.LostFound ||
  mongoose.model<ILostFound>(
    "LostFound",
    LostFoundSchema
  );

export default LostFound;