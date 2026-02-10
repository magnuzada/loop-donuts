import mongoose, { Schema, model, models } from "mongoose";

const ProductSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    category: { type: String, default: "Tradicional" },
    image: { type: String },
    stock: { type: Number, default: 0 },
    
    // 👇 AQUI ESTÁ A CURA! Adicione esta linha:
    status: { type: String, default: "active" }, 
  },
  { timestamps: true }
);

// Se o modelo já existe, usa ele. Se não, cria um novo.
const Product = models.Product || model("Product", ProductSchema);

export default Product;