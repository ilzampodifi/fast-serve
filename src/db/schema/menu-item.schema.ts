import { InferSchemaType, model, Schema } from "mongoose";

export const MenuItemSchema = new Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    image: { type: String, required: true, trim: true },
}, {
    versionKey: false,
    timestamps: true
});

export type MenuItem = InferSchemaType<typeof MenuItemSchema> & { _id: string };
export const MenuItemModel = model<MenuItem>("MenuItem", MenuItemSchema);