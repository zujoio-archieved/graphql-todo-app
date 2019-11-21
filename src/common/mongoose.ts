import mongoose from "mongoose";

export const toObjectId = (id: string) => mongoose.Types.ObjectId(id);

export const toBase64 = (id: string) => {
  const buffer = new Buffer(id);
  return buffer.toString("base64");
};

export const fromBase64 = (data: any) => {
  let buffer = new Buffer(data, "base64");
  return buffer.toString("ascii");
};
