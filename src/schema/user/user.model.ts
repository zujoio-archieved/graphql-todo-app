import mongoose from "mongoose";
import { UserModel } from "./user.interface";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true },
    password: String,
    firstName: String,
    lastName: String
  },
  {
    timestamps: true
  }
);

const User = mongoose.model<UserModel>("User", userSchema);
export { User, userSchema };
