import mongoose, { Schema, Document, Model } from "mongoose";

export interface IGenre extends Document {
  name: string;
  slug: string;
  description?: string;
  order?: number;
  createdAt: Date;
  updatedAt: Date;
}

const GenreSchema = new Schema<IGenre>(
  {
    name: {
      type: String,
      required: [true, "Genre name is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Genre slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      default: "",
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const Genre: Model<IGenre> =
  mongoose.models.Genre || mongoose.model<IGenre>("Genre", GenreSchema);

export default Genre;

