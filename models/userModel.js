import mongoose from "mongoose";
import productModel from "./productModel.js";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: {},
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
    role: {
      type: Number,
      default: 0,
    },
    interactions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Products", // Reference to the Products model
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("users", userSchema);
