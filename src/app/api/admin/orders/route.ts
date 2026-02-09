import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Order from "@/models/Order";

// Garante que não faça cache (sempre busca dados novos)
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectToDatabase();
    // Busca os pedidos e ordena do mais novo para o mais antigo
    const orders = await Order.find().sort({ createdAt: -1 });
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar pedidos" }, { status: 500 });
  }
}