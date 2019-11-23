import mongoose from "mongoose";
import { UserModel } from "./user.interface";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true },
    password: String,
    firstName: String,
    lastName: String,
    theme: { type: Number, default: 0 }
  },
  {
    timestamps: true
  }
);

const User = mongoose.model<UserModel>("User", userSchema);
export { User, userSchema };
