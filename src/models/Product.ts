import mongoose, { Schema, model, models } from "mongoose";

const ProductSchema = new Schema(
  {
    // 1. Informações Básicas
    name: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true }, // URL única
    
    // 2. Controle & Estoque
    sku: { type: String, unique: true, sparse: true }, // Código único (opcional no início)
    status: { 
      type: String, 
      enum: ["active", "inactive", "draft"], 
      default: "active" 
    },
    stock: { type: Number, required: true, default: 0 },
    minStock: { type: Number, default: 5 }, // Alerta de estoque baixo

    // 3. Precificação & Ofertas
    price: { type: Number, required: true },
    discountPrice: { type: Number }, // Preço promocional
    discountStart: { type: Date },
    discountEnd: { type: Date },

    // 4. Categorização (3 Níveis Fixos + Tags)
    category: { type: String, required: true },       // Nível 1 (ex: Bebidas)
    subcategory: { type: String },                    // Nível 2 (ex: Café)
    subSubCategory: { type: String },                 // Nível 3 (ex: Expresso)
    tags: { type: [String], default: [] },            // Flexível (ex: Sem açúcar)

    // ...
    isFeatured: { type: Boolean, default: false },
    isPromo: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false }, // 👈 MUDOU DE isNew PARA isNewArrival
// ...
  },
  { timestamps: true } // Cria automaticamente createdAt e updatedAt
);

// Evita re-compilar o modelo se já existir (Hot Reload do Next.js)
const Product = models.Product || model("Product", ProductSchema);

export default Product;