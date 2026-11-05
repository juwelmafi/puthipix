import mongoose, { Schema, Document, Model } from "mongoose";

export interface INotification extends Document {
  recipient: mongoose.Types.ObjectId; // User who receives notification
  sender: mongoose.Types.ObjectId; // User who triggered notification
  senderName: string;
  senderAvatar?: string;
  type: "like" | "comment" | "admin_deletion" | "admin_approval" | "admin_rejection" | "follow" | "message";
  postId?: mongoose.Types.ObjectId;
  postTitle?: string;
  conversationId?: mongoose.Types.ObjectId;
  message: string;
  note?: string; // Reason when deleted by admin
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    recipient: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    senderName: {
      type: String,
      required: true,
      trim: true,
    },
    senderAvatar: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      enum: ["like", "comment", "admin_deletion", "admin_approval", "admin_rejection", "follow", "message"],
      required: true,
      index: true,
    },
    postId: {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
    postTitle: {
      type: String,
      default: "",
    },
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
    },
    message: {
      type: String,
      required: true,
    },
    note: {
      type: String,
      default: "",
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

NotificationSchema.index({ recipient: 1, createdAt: -1 });

export const Notification: Model<INotification> =
  mongoose.models.Notification ||
  mongoose.model<INotification>("Notification", NotificationSchema);

export default Notification;

