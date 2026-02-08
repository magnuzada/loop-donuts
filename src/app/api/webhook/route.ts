import { NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { connectToDatabase } from "@/lib/mongodb";
import Order from "@/models/Order";

// Configuração do Mercado Pago
const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

export async function POST(request: Request) {
  try {
    // 1. Recebe o aviso do Mercado Pago
    // O aviso vem na URL (query params) ou no corpo (body)
    const url = new URL(request.url);
    const topic = url.searchParams.get("topic") || url.searchParams.get("type");
    const id = url.searchParams.get("id") || url.searchParams.get("data.id");

    // Se não tiver ID, ignora (pode ser só um teste de conexão)
    if (!id) {
      return NextResponse.json({ message: "Dados insuficientes" }, { status: 200 });
    }

    // 2. Se o aviso for sobre um PAGAMENTO
    if (topic === "payment") {
      // Conecta no Banco
      await connectToDatabase();

      // Pergunta para o Mercado Pago: "Qual o status REAL desse pagamento?"
      // (Isso evita golpes de gente forjando avisos falsos)
      const payment = new Payment(client);
      const paymentData = await payment.get({ id: id });

      const status = paymentData.status; // ex: 'approved', 'pending'
      const externalReference = paymentData.external_reference; // É o nosso Order ID

      console.log(`🔔 Webhook recebido: Pagamento ${id} está ${status}`);

      // 3. Atualiza o pedido no nosso Banco de Dados
      if (externalReference) {
        await Order.findByIdAndUpdate(externalReference, {
          status: status === "approved" ? "paid" : status, // Traduz para 'paid' se aprovado
          paymentId: id,
          updatedAt: new Date(),
        });
        console.log(`✅ Pedido ${externalReference} atualizado para: ${status}`);
      }
    }

    // Responde pro Mercado Pago que entendemos o recado (obrigatório responder 200)
    return NextResponse.json({ message: "Recebido" }, { status: 200 });

  } catch (error) {
    console.error("❌ Erro no Webhook:", error);
    // Mesmo com erro, respondemos 200 para o Mercado Pago não ficar reenviando infinitamente
    return NextResponse.json({ message: "Erro processado" }, { status: 200 });
  }
}