import mongoose, { Schema, Document } from 'mongoose';

// Tipagem dos itens dentro do pedido
interface OrderItem {
  productId?: string;
  name: string;
  quantity: number;
  price: number;
}

// 1. ATUALIZAÇÃO AQUI: Adicionamos os novos status permitidos pelo TypeScript
export interface IOrder extends Document {
  customer: {
    name: string;
    phone: string;
    email?: string; // Adicionei email opcional (boa prática)
    docNumber?: string; // Adicionei CPF opcional
    address: string;
    neighborhood: string;
  };
  items: OrderItem[];
  total: number;
  // Agora o TS aceita todos os passos da cozinha
  status: 'pending' | 'paid' | 'failed' | 'preparing' | 'delivering' | 'completed' | 'canceled';
  paymentId?: string;
  createdAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    customer: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String }, // Novo
      docNumber: { type: String }, // Novo
      address: { type: String, required: true },
      neighborhood: { type: String, required: true },
    },
    items: [
      {
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    total: { type: Number, required: true },
    
    // 2. ATUALIZAÇÃO AQUI: Ensinamos ao Banco que essas palavras são válidas
    status: { 
      type: String, 
      enum: ['pending', 'paid', 'failed', 'preparing', 'delivering', 'completed', 'canceled'], 
      default: 'pending' 
    },
    
    paymentId: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);