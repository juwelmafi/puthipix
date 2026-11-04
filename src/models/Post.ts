import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPost extends Document {
  author: mongoose.Types.ObjectId;
  authorName: string;
  userAvatar?: string;
  bookTitle?: string;
  bookAuthor?: string;
  postTitle: string;
  genre: string; // e.g. "বই পর্যালোচনা", "স্বরচিত সাহিত্য", "কবিতা ও গান", "সাহিত্য ভাবনা", "উদ্ধৃতি ও পঙক্তি"
  content: string;
  image?: string;
  imageKey?: string;
  likes: mongoose.Types.ObjectId[];
  likesCount: number;
  commentsCount: number;
  status: "active" | "deleted_by_admin";
  adminDeletionNote?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<IPost>(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    authorName: {
      type: String,
      required: true,
      trim: true,
    },
    userAvatar: {
      type: String,
      default: "",
    },
    bookTitle: {
      type: String,
      trim: true,
      default: "",
    },
    bookAuthor: {
      type: String,
      trim: true,
      default: "",
    },
    postTitle: {
      type: String,
      required: [true, "পোস্টের শিরোনাম আবশ্যক"],
      trim: true,
    },
    genre: {
      type: String,
      default: "বই পর্যালোচনা",
      index: true,
    },
    content: {
      type: String,
      required: [true, "মূল লেখা বা বক্তব্য আবশ্যক"],
      trim: true,
    },
    image: {
      type: String,
      default: "",
    },
    imageKey: {
      type: String,
      default: "",
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    likesCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    commentsCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ["active", "deleted_by_admin"],
      default: "active",
      index: true,
    },
    adminDeletionNote: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster feed querying
PostSchema.index({ createdAt: -1 });
PostSchema.index({ status: 1, createdAt: -1 });

export const Post: Model<IPost> =
  mongoose.models.Post || mongoose.model<IPost>("Post", PostSchema);

export default Post;

