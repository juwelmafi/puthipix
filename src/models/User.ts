import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: "user" | "admin" | "super_admin";
  status: "active" | "suspended";
  bio?: string;
  avatar?: string;
  followers?: mongoose.Types.ObjectId[];
  following?: mongoose.Types.ObjectId[];
  followersCount?: number;
  followingCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: {
      type: String,
      required: [true, "Password hash is required"],
    },
    role: {
      type: String,
      enum: ["user", "admin", "super_admin"],
      default: "user",
      index: true,
    },
    status: {
      type: String,
      enum: ["active", "suspended"],
      default: "active",
    },
    bio: {
      type: String,
      default: "সাহিত্যপ্রেমী পাঠক ও পুথিপিক্স সংগ্রাহক।",
      maxlength: [300, "Bio cannot exceed 300 characters"],
      trim: true,
    },
    avatar: {
      type: String,
      default: "",
    },
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    following: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    followersCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    followingCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;

