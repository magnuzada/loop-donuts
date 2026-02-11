import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Order from "@/models/Order";

// 👇 ESSA LINHA MATA O CACHE E OBRIGA A ATUALIZAR SEMPRE 👇
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectToDatabase();
    
    const orders = await Order.find().sort({ createdAt: -1 });

    return NextResponse.json(orders, {
      // Garantia extra para navegadores teimosos
      headers: {
        'Cache-Control': 'no-store, max-age=0'
      }
    });
  } catch (error) {
    console.error("Erro ao buscar pedidos:", error);
    return NextResponse.json({ error: "Erro ao carregar pedidos" }, { status: 500 });
  }
}