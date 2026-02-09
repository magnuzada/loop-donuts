import mongoose, { Schema, model, models } from "mongoose";

const ProductSchema = new Schema(
  {
    name: { type: String, required: true },
    // 👇 MUDANÇA AQUI: required: false (Opcional)
    description: { type: String, required: false }, 
    price: { type: Number, required: true },
    category: { type: String, default: "Tradicional" },
    image: { type: String },
    stock: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Product = models.Product || model("Product", ProductSchema);

export default Product;