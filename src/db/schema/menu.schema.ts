import { HHMM } from "@/utils/schema";
import { InferSchemaType, model, Schema } from "mongoose";

export const MenuSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    type: {
      type: String,
      required: true,
      trim: true,
      enum: ["breakfast", "lunch", "dinner", "snack"],
    },
    startTime: {
      type: String,
      required: true,
      match: HHMM,
    },
    endTime: {
      type: String,
      required: true,
      match: HHMM,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export type Menu = InferSchemaType<typeof MenuSchema> & { _id: string };
export const MenuModel = model<Menu>("Menu", MenuSchema);
