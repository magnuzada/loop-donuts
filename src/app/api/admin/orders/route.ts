 import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Order from "@/models/Order"; // Certifique-se que o Model de Order existe

export async function GET() {
  try {
    await connectToDatabase();

    // Busca todos os pedidos e ordena do mais recente para o mais antigo
    const orders = await Order.find().sort({ createdAt: -1 });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Erro ao buscar pedidos:", error);
    return NextResponse.json(
      { error: "Falha ao carregar pedidos." },
      { status: 500 }
    );
  }
}