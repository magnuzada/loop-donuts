import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Order from "@/models/Order";

// Rota dinâmica para atualizar o status de UM pedido específico
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json({ error: "O novo status é obrigatório." }, { status: 400 });
    }

    await connectToDatabase();
    
    // Procura o pedido pelo ID e atualiza apenas o campo 'status'
    const updatedOrder = await Order.findByIdAndUpdate(
      params.id,
      { status },
      { new: true } // Retorna o pedido já atualizado
    ).lean();

    if (!updatedOrder) {
      return NextResponse.json({ error: "Pedido não encontrado." }, { status: 404 });
    }

    return NextResponse.json(updatedOrder, { status: 200 });
  } catch (error: any) {
    console.error("❌ Erro ao atualizar status do pedido:", error.message);
    return NextResponse.json({ error: "Erro interno no servidor." }, { status: 500 });
  }
}