import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Order from "@/models/Order"; // Certifique-se que o caminho do Model está certo

export async function GET() {
  try {
    await connectToDatabase();
    
    // 1. Busca TUDO (sem filtro de status)
    // 2. Sort: -1 significa do MAIS NOVO para o mais velho
    const orders = await Order.find({}).sort({ createdAt: -1 });

    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar pedidos" }, { status: 500 });
  }
}