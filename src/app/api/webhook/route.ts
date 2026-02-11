import { NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { connectToDatabase } from "@/lib/mongodb";
import Order from "@/models/Order";

// SEGREDO: O Webhook precisa responder RÁPIDO (200 OK), senão o MP fica reenviando.
export async function POST(request: Request) {
  try {
    // 1. Validação de Segurança (Query Params)
    const url = new URL(request.url);
    const type = url.searchParams.get("type"); // ex: "payment"
    const topic = url.searchParams.get("topic"); // ex: "payment"
    const id = url.searchParams.get("data.id") || url.searchParams.get("id");

    // Se não for pagamento, ignora (mas responde 200 pro MP não chiar)
    if ((type !== "payment" && topic !== "payment") || !id) {
      return NextResponse.json({ ok: true });
    }

    console.log(`🔔 WEBHOOK: Recebendo notificação de pagamento: ${id}`);

    // 2. Conexão com MP e Banco
    const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! });
    const payment = new Payment(client);
    await connectToDatabase();

    // 3. "Trust but Verify": Vai no MP conferir se é verdade
    const paymentInfo = await payment.get({ id: id });
    
    // Se o status não for 'approved' (pago), ignora.
    if (paymentInfo.status !== 'approved') {
      console.log(`⚠️ Pagamento ${id} ainda não aprovado. Status: ${paymentInfo.status}`);
      return NextResponse.json({ ok: true });
    }

    // 4. Busca o Pedido no Banco (Usando a referência externa)
    const orderId = paymentInfo.external_reference;
    if (!orderId) {
      console.error("❌ ERRO: Pagamento sem external_reference (ID do Pedido)");
      return NextResponse.json({ ok: true });
    }

    console.log(`✅ Pagamento APROVADO! Atualizando pedido ${orderId}...`);

    // 5. ATUALIZA O BANCO (A Melhoria Expert Aqui 👇)
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId, 
      {
        status: "paid",       // Muda o status para Verde
        paymentId: id,        // Salva o ID Real da Transação (Para Estorno futuro)
        updatedAt: new Date()
      },
      { new: true }
    );

    if (updatedOrder) {
      console.log(`🎉 PEDIDO ${orderId} CONFIRMADO COM SUCESSO!`);
    } else {
      console.error(`❌ Pedido ${orderId} não encontrado no banco.`);
    }

    return NextResponse.json({ ok: true });

  } catch (error) {
    console.error("🔥 ERRO NO WEBHOOK:", error);
    // IMPORTANTE: Responder 200 mesmo com erro interno para evitar loop infinito do MP
    return NextResponse.json({ ok: true }, { status: 200 });
  }
}