import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAdminApplication extends Document {
  user: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone?: string;
  reason: string;
  experience?: string;
  status: "pending" | "approved" | "rejected";
  reviewedBy?: mongoose.Types.ObjectId;
  reviewedAt?: Date;
  reviewNote?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AdminApplicationSchema = new Schema<IAdminApplication>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, "আবেদনকারীর নাম আবশ্যক"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "ইমেইল আবশ্যক"],
      lowercase: true,
      trim: true,
      index: true,
    },
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    reason: {
      type: String,
      required: [true, "অ্যাডমিন হতে চাওয়ার কারণ আবশ্যক"],
      trim: true,
    },
    experience: {
      type: String,
      trim: true,
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true,
    },
    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    reviewedAt: {
      type: Date,
    },
    reviewNote: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

AdminApplicationSchema.index({ status: 1, createdAt: -1 });

export const AdminApplication: Model<IAdminApplication> =
  mongoose.models.AdminApplication ||
  mongoose.model<IAdminApplication>("AdminApplication", AdminApplicationSchema);

export default AdminApplication;

