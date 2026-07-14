import mongoose, { Schema, Document } from "mongoose";

export interface IPaymentDoc extends Document {
  user: mongoose.Types.ObjectId;
  course: mongoose.Types.ObjectId;
  amount: number;
  transactionId: string;
  status: "pending" | "completed" | "failed" | "cancelled";
  paymentMethod: string;
  currency: string;
  createdAt: Date;
}

const PaymentSchema = new Schema<IPaymentDoc>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    transactionId: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "cancelled"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      default: "SSLCommerz",
    },
    currency: {
      type: String,
      default: "BDT",
    },
  },
  {
    timestamps: true,
  }
);

const Payment = mongoose.models.Payment || mongoose.model<IPaymentDoc>("Payment", PaymentSchema);

export default Payment;
