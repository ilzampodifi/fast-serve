import { model, Schema } from "mongoose";
import { InferSchemaType } from "mongoose";
import { MenuItemSchema } from "./menu-item.schema";

export const OrderItemSchema = new Schema({
    menuItem: { type: MenuItemSchema, required: true, ref: "MenuItem" },
    quantity: { type: Number, required: true, min: 1 },
}, {
    versionKey: false,
    timestamps: true
});

export type OrderItem = InferSchemaType<typeof OrderItemSchema> & { _id: string };
export const OrderItemModel = model<OrderItem>("OrderItem", OrderItemSchema);