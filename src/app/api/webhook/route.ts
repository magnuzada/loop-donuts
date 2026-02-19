import { NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { connectToDatabase } from "@/lib/mongodb";
import Order from "@/models/Order";

export async function POST(request: Request) {
  try {
    // 1. Pega os dados que o Mercado Pago enviou
    const url = new URL(request.url);
    const id = url.searchParams.get("data.id");
    const type = url.searchParams.get("type");

    // Só nos importamos se for uma notificação de "pagamento"
    if (type !== "payment" || !id) {
      return NextResponse.json({ message: "Ignorado - Não é pagamento" }, { status: 200 });
    }

    const accessToken = process.env.MP_ACCESS_TOKEN;
    if (!accessToken) {
      console.error("❌ Webhook: Token MP ausente");
      return NextResponse.json({ error: "Erro de config" }, { status: 500 });
    }

    // 2. Segurança Máxima: Vai no MP perguntar se esse pagamento é real mesmo
    const client = new MercadoPagoConfig({ accessToken });
    const payment = new Payment(client);
    const paymentData = await payment.get({ id });

    // 3. Verifica o Status e o ID do Pedido
    const status = paymentData.status; // ex: "approved", "rejected", "pending"
    const orderId = paymentData.external_reference; // Aquele ID do Mongo que mandamos ontem

    if (!orderId) {
      console.error("❌ Webhook: Pagamento sem external_reference");
      return NextResponse.json({ error: "Pedido não rastreável" }, { status: 400 });
    }

    await connectToDatabase();

    // 4. Se foi aprovado, atualiza o banco de dados!
    if (status === "approved") {
      const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        { 
          status: "paid", // Muda para pago! Isso vai fazer o Painel Admin apitar 🔔
          paymentId: id 
        },
        { new: true }
      );
      
      console.log(`✅ WEBHOOK: Pedido ${orderId} atualizado para PAGO!`);
    } else {
      console.log(`⚠️ WEBHOOK: Pedido ${orderId} teve status alterado para: ${status}`);
      // Opcional: Você pode tratar cancelamentos aqui no futuro
    }

    // Retorna 200 OK para o Mercado Pago parar de mandar a mesma notificação
    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error: any) {
    console.error("❌ ERRO NO WEBHOOK:", error.message);
    // Sempre retorne 200 para o MP não ficar tentando reenviar em caso de erro interno nosso
    return NextResponse.json({ error: "Erro interno processado" }, { status: 200 });
  }
}