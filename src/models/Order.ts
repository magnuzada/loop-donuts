import mongoose, { Schema, Document } from 'mongoose';

// Tipagem dos itens dentro do pedido
interface OrderItem {
  productId?: string; // ID do produto (opcional por enquanto)
  name: string;
  quantity: number;
  price: number; // Preço na hora da compra (histórico)
}

// Tipagem do Pedido Completo
export interface IOrder extends Document {
  customer: {
    name: string;
    phone: string;
    address: string;
    neighborhood: string;
  };
  items: OrderItem[];
  total: number;
  status: 'pending' | 'paid' | 'failed'; // Status do pagamento
  paymentId?: string; // ID do Pix no Mercado Pago
  createdAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    customer: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
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
    status: { 
      type: String, 
      enum: ['pending', 'paid', 'failed'], 
      default: 'pending' 
    },
    paymentId: { type: String }, // Guardaremos o ID do MP aqui depois
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);