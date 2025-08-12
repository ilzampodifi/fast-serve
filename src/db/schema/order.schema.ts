import { InferSchemaType, model, Schema } from "mongoose";

export const OrderSchema = new  Schema({
    total: { type: Number, required: true, min: 0 },
}, {
    versionKey: false,
    timestamps: true
})

export type Order = InferSchemaType<typeof OrderSchema> & { _id: string };
export const OrderModel = model<Order>("Order", OrderSchema);