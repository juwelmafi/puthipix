import mongoose, { Schema, Document, Model } from "mongoose";

export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId;
  bookId: mongoose.Types.ObjectId;
  amount: number;
  currency: string;
  tranId: string;
  valId?: string;
  bankTranId?: string;
  status: "PENDING" | "PAID" | "FAILED" | "CANCELLED" | "REFUNDED";
  paymentMethod?: string;
  gatewayResponse?: any;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
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
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: "BDT",
    },
    tranId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    valId: {
      type: String,
      default: "",
    },
    bankTranId: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["PENDING", "PAID", "FAILED", "CANCELLED", "REFUNDED"],
      default: "PENDING",
      index: true,
    },
    paymentMethod: {
      type: String,
      default: "SSLCommerz",
    },
    gatewayResponse: {
      type: Schema.Types.Mixed,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);

export default Order;

