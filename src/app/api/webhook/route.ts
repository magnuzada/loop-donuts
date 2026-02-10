import { NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { connectToDatabase } from "@/lib/mongodb";
import Order from "@/models/Order";

// Configura o cliente do Mercado Pago
const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

export async function POST(request: Request) {
  try {
    // 1. Recebe o aviso do Mercado Pago
    const body = await request.json();
    const { action, data } = body;

    console.log("🔔 Webhook recebeu:", action, data?.id);

    // Se não for aviso de pagamento, ignora (retorna 200 para eles não ficarem tentando)
    if (action !== "payment.created" && action !== "payment.updated") {
      return NextResponse.json({ ok: true });
    }

    // 2. Segurança: Pergunta ao Mercado Pago o status real desse ID
    // (Não confiamos apenas no body que chegou, vai que é fake)
    const payment = new Payment(client);
    const paymentInfo = await payment.get({ id: data.id });

    // 3. Se estiver APROVADO, atualiza o banco
    if (paymentInfo.status === "approved") {
      await connectToDatabase();
      
      // O 'external_reference' deve ser o ID do nosso pedido (configuramos isso no Checkout)
      const orderId = paymentInfo.external_reference;

      if (orderId) {
        console.log(`✅ Pagamento Aprovado! Atualizando Pedido ${orderId}...`);
        
        await Order.findByIdAndUpdate(orderId, { 
          status: "paid",
          paymentId: data.id,
          updatedAt: new Date()
        });
        
        console.log("🚀 Pedido atualizado para 'paid' com sucesso!");
      }
    }

    // 4. Responde 200 OK (Obrigatório, senão o MP acha que deu erro e manda de novo)
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("❌ Erro no Webhook:", error);
    // Mesmo com erro, respondemos 200 para o MP parar de mandar (nós olhamos o log depois)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 200 });
  }
}