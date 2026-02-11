import { NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { connectToDatabase } from "@/lib/mongodb";
import Order from "@/models/Order";

// Inicializa o Cliente MP
const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! });

export async function POST(request: Request) {
  try {
    // 1. Recebe o aviso
    const body = await request.json();
    const { action, data } = body;

    // Filtra apenas avisos de pagamento
    if (action !== "payment.created" && action !== "payment.updated") {
      return NextResponse.json({ ok: true });
    }

    // Se não tiver ID, ignora
    if (!data?.id) {
      return NextResponse.json({ error: "ID ausente" }, { status: 400 });
    }

    console.log(`🔔 Webhook Recebido: Pagamento ${data.id}`);

    // 2. SEGURANÇA TOTAL: Verifica status real no MP
    const payment = new Payment(client);
    
    let paymentInfo;
    try {
      paymentInfo = await payment.get({ id: data.id });
    } catch (error) {
      console.error("❌ Pagamento não encontrado no MP:", data.id);
      return NextResponse.json({ error: "Pagamento não verificado" }, { status: 200 });
    }

    // 3. Extrai o ID do pedido
    const orderId = paymentInfo.external_reference;
    const statusAtual = paymentInfo.status;

    console.log(`🔎 Status Real no MP: ${statusAtual} | Pedido ID: ${orderId}`);

    if (orderId && (statusAtual === "approved" || statusAtual === "authorized")) {
      await connectToDatabase();

      // 4. IDEMPOTÊNCIA
      const existingOrder = await Order.findById(orderId);
      
      if (existingOrder && existingOrder.status === "paid") {
        console.log("✅ Pedido já estava pago.");
        return NextResponse.json({ ok: true });
      }

      // 5. ATUALIZA O BANCO (Para "paid")
      await Order.findByIdAndUpdate(orderId, {
        status: "paid",
        updatedAt: new Date()
      });

      console.log("🎉 SUCESSO: Pedido atualizado para PAGO!");
    }

    return NextResponse.json({ ok: true });

  } catch (error) {
    console.error("❌ Erro no Webhook:", error);
    return NextResponse.json({ error: "Erro interno, mas recebido" }, { status: 200 });
  }
}