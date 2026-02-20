import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Order from "@/models/Order";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phone } = body;

    if (!phone) {
      return NextResponse.json({ error: "Número de telefone obrigatório." }, { status: 400 });
    }

    // Limpa a formatação (deixa só os números) para garantir a busca correta
    const cleanPhone = phone.replace(/\D/g, "");

    await connectToDatabase();

    // Busca o pedido mais recente que contenha esse telefone (Case/Regex safe)
    const order = await Order.findOne({
      "customer.phone": { $regex: cleanPhone, $options: "i" }
    })
    .sort({ createdAt: -1 }) // Pega o mais novo
    .lean();

    if (!order) {
      return NextResponse.json({ error: "Nenhum pedido encontrado para este número hoje." }, { status: 404 });
    }

    // Princípio de Privilégio Mínimo: Retorna APENAS o necessário para o frontend
    const safeOrderData = {
      id: order._id.toString(),
      status: order.status,
      total: order.total,
      deliveryFee: order.deliveryFee,
      items: order.items.map((item: any) => ({
        name: item.name,
        quantity: item.quantity,
      })),
      createdAt: order.createdAt,
    };

    return NextResponse.json(safeOrderData, { status: 200 });

  } catch (error: any) {
    console.error("❌ Erro na API de Rastreio:", error.message);
    return NextResponse.json({ error: "Erro interno no servidor." }, { status: 500 });
  }
}