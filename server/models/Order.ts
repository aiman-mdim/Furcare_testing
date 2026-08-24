import mongoose, { Document, Schema } from "mongoose";

export type OrderItemType =
  | "product"
  | "grooming_service"
  | "hotel_booking"
  | "premium_plan"
  | "vet_appointment"
  | "adoption";

export interface IOrderItem {
  itemId: string;
  productId: string;
  name: string;
  quantity: number;
  priceTk: number;
  type: OrderItemType;
  customData?: Record<string, any>;
}

export interface IOrder extends Document {
  orderId: string;

  userId: mongoose.Types.ObjectId;

  items: IOrderItem[];

  subtotal: number;
  deliveryFee: number;
  totalAmount: number;

  paymentMethod:
    | "cash"
    | "visa"
    | "mastercard"
    | "american_express"
    | "bkash"
    | "none";

  paymentStatus:
    | "pending"
    | "paid"
    | "not_required";

  orderStatus:
    | "pending"
    | "confirmed"
    | "processing"
    | "completed"
    | "cancelled";

  customerEmail?: string;
  customerPhone?: string;
  deliveryAddress?: string;

  createdAt: Date;
}

const orderItemSchema = new Schema<IOrderItem>(
  {
    itemId: {
      type: String,
      required: true,
    },

    productId: {
      type: String,
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    priceTk: {
      type: Number,
      required: true,
      min: 0,
    },

    type: {
      type: String,
      required: true,
      enum: [
        "product",
        "grooming_service",
        "hotel_booking",
        "premium_plan",
        "vet_appointment",
        "adoption",
      ],
    },

    customData: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    _id: false,
  }
);

const orderSchema = new Schema<IOrder>(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    items: {
      type: [orderItemSchema],
      required: true,
    },

    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },

    deliveryFee: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    paymentMethod: {
      type: String,
      required: true,
      enum: [
        "cash",
        "visa",
        "mastercard",
        "american_express",
        "bkash",
        "none",
      ],
    },

    paymentStatus: {
      type: String,
      required: true,
      enum: [
        "pending",
        "paid",
        "not_required",
      ],
    },

    orderStatus: {
      type: String,
      required: true,
      enum: [
        "pending",
        "confirmed",
        "processing",
        "completed",
        "cancelled",
      ],
    },

    customerEmail: String,
    customerPhone: String,
    deliveryAddress: String,
  },
  {
    timestamps: true,
  }
);

export const Order = mongoose.model<IOrder>(
  "Order",
  orderSchema
);