import { InferSchemaType, model, Schema } from "mongoose";
import { OrderItemSchema } from "./order-item.schema";

export const OrderSchema = new  Schema({
    finalTotal: { type: Number, required: true, min: 0 },
    status: { type: String, required: true, enum: ["pending", "paid", "cancelled"], default: "pending" },
    items: { type: [OrderItemSchema], required: true },
}, {
    versionKey: false,
    timestamps: true
})

export type Order = InferSchemaType<typeof OrderSchema> & { _id: string };
export const OrderModel = model<Order>("Order", OrderSchema);