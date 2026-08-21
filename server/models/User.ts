import mongoose, { Document, Schema } from "mongoose";

export type UserRole =
  | "pet_owner"
  | "vet"
  | "groomer"
  | "shelter";

export interface IUser extends Document {
  name: string;
  email: string;
  phone?: string;
  city?: string;
  passwordHash: string;
  role: UserRole;
  isPremium: boolean;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    city: {
      type: String,
      trim: true,
    },

    passwordHash: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["pet_owner", "vet", "groomer", "shelter"],
      default: "pet_owner",
    },

    isPremium: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model<IUser>("User", userSchema);
