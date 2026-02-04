import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  image: string;
  category?: string;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    category: { type: String, required: false },
  },
  { timestamps: true } // Cria createdAt e updatedAt automático
);

// Se o modelo já existe (cache do Next.js), usa ele. Se não, cria um novo.
export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);