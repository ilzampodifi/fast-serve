import { InferSchemaType, model, Schema } from "mongoose";

export const UserSchema = new Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, unique: true },
    password: { type: String, required: true, trim: true },
}, {
    versionKey: false,
    timestamps: true
})

export type User = InferSchemaType<typeof UserSchema> & { _id: string };
export const UserModel = model<User>("User", UserSchema);