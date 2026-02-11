import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Order from "@/models/Order";

export async function GET() {
  try {
    await connectToDatabase();
    
    // O segredo está aqui: find() vazio busca TUDO.
    // .sort({ createdAt: -1 }) ordena do mais novo para o mais velho.
    const orders = await Order.find().sort({ createdAt: -1 });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Erro ao buscar pedidos:", error);
    return NextResponse.json({ error: "Erro ao carregar pedidos" }, { status: 500 });
  }
}