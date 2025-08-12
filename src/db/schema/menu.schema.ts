import { InferSchemaType, model, Schema } from "mongoose";

export const MenuSchema = new Schema({
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
}, {
    versionKey: false,
    timestamps: true
});

export type Menu = InferSchemaType<typeof MenuSchema> & { _id: string };
export const MenuModel = model<Menu>("Menu", MenuSchema);