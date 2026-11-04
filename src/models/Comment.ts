import mongoose, { Schema, Document, Model } from "mongoose";

export interface IComment extends Document {
  postId: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<IComment>(
  {
    postId: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true,
      index: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    userName: {
      type: String,
      required: true,
      trim: true,
    },
    userAvatar: {
      type: String,
      default: "",
    },
    content: {
      type: String,
      required: [true, "মন্তব্য আবশ্যক"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

CommentSchema.index({ postId: 1, createdAt: 1 });

export const Comment: Model<IComment> =
  mongoose.models.Comment || mongoose.model<IComment>("Comment", CommentSchema);

export default Comment;
