import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Order from "@/models/Order";

// Lista de status permitidos
const ALLOWED_STATUSES = [
  'pending', 
  'paid', 
  'failed', 
  'preparing',  
  'delivering', 
  'completed',  
  'canceled'
];

interface RouteParams {
  params: { id: string };
}

// PATCH: Atualiza o status manualmente
export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    await connectToDatabase();
    const { id } = params;

    const body = await request.json();
    const { status } = body;

    // Validação
    if (!status || !ALLOWED_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: "Status inválido", allowed: ALLOWED_STATUSES },
        { status: 400 }
      );
    }

    // Atualiza no Banco
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return NextResponse.json({ error: "Pedido não encontrado" }, { status: 404 });
    }

    return NextResponse.json(updatedOrder);

  } catch (error) {
    console.error("Erro ao atualizar pedido:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

// DELETE: Para limpar testes
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    await connectToDatabase();
    const { id } = params;
    await Order.findByIdAndDelete(id);
    return NextResponse.json({ message: "Pedido removido" });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao deletar" }, { status: 500 });
  }
}