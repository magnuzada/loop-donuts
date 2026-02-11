import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Order from "@/models/Order";
import mongoose from "mongoose";

const ALLOWED_STATUSES = [
  'pending', 'paid', 'failed', 'preparing', 
  'delivering', 'completed', 'canceled'
];

interface RouteParams {
  params: { id: string };
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    await connectToDatabase();
    const { id } = params;

    // 1. Validação de ID
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const body = await request.json();
    const { status } = body;

    // 2. Validação de Status
    if (!status || !ALLOWED_STATUSES.includes(status)) {
      return NextResponse.json({ error: "Status inválido" }, { status: 400 });
    }

    // 3. Atualização no Banco
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