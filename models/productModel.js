import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: mongoose.ObjectId,
      ref: "Category",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    photo: {
      data: Buffer,
      contentType: String,
    },
    shipping: {
      type: Boolean,
    },
    interactionCount: {
      type: Number,
      default: 0,
    },
    usersInteracted: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users", // Reference to the User model
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Products", productSchema);
