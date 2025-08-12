import { InferSchemaType, model, Schema } from "mongoose";
import { MenuItemSchema } from "./menu-item.schema";

export const MenuSchema = new Schema({
    type: { type: String, required: true, trim: true },
    items: { type: [MenuItemSchema], required: true },
}, {
    versionKey: false,
    timestamps: true
});

export type Menu = InferSchemaType<typeof MenuSchema> & { _id: string };
export const MenuModel = model<Menu>("Menu", MenuSchema);