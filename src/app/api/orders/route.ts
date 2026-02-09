import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Order from "@/models/Order";

export async function GET() {
  try {
    await connectToDatabase();
    
    // Busca todos os pedidos e ordena pela data de criação (Decrescente)
    const orders = await Order.find({}).sort({ createdAt: -1 });
    
    return NextResponse.json(orders);
  } catch (error) {
    console.error("Erro ao buscar pedidos:", error);
    return NextResponse.json({ error: "Erro ao carregar pedidos" }, { status: 500 });
  }
}