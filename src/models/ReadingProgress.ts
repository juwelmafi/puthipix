import mongoose, { Schema, Document, Model } from "mongoose";

export interface IReadingProgress extends Document {
  userId: mongoose.Types.ObjectId;
  bookId: mongoose.Types.ObjectId;
  lastPage: number;
  totalPages: number;
  progressPercent: number;
  lastReadAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ReadingProgressSchema = new Schema<IReadingProgress>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    bookId: {
      type: Schema.Types.ObjectId,
      ref: "Book",
      required: true,
      index: true,
    },
    lastPage: {
      type: Number,
      required: true,
      default: 1,
    },
    totalPages: {
      type: Number,
      required: true,
      default: 1,
    },
    progressPercent: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    lastReadAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// One reading progress record per user per book
ReadingProgressSchema.index({ userId: 1, bookId: 1 }, { unique: true });

export const ReadingProgress: Model<IReadingProgress> =
  mongoose.models.ReadingProgress ||
  mongoose.model<IReadingProgress>("ReadingProgress", ReadingProgressSchema);

export default ReadingProgress;

