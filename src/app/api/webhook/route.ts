import { NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { connectToDatabase } from "@/lib/mongodb";
import Order from "@/models/Order";
import crypto from 'crypto';

// 1. Função de Validação de Assinatura (Segurança Máxima)
function verifyMercadoPagoSignature(
  rawBody: string,
  signatureHeader: string | null,
  requestIdHeader: string | null,
  webhookSecret: string
): boolean {
  if (!signatureHeader || !requestIdHeader || !webhookSecret) return false;

  const signatureParts = signatureHeader.split(',').map(part => part.trim().split('='));
  let ts = '';
  let v1 = '';
  
  for (const [key, value] of signatureParts) {
    if (key === 'ts') ts = value;
    else if (key === 'v1') v1 = value;
  }

  if (!ts || !v1) return false;

  const signedContent = `id:${requestIdHeader}:ts:${ts}:${rawBody}`;
  const hmac = crypto.createHmac('sha256', webhookSecret);
  hmac.update(signedContent);
  const expectedSignature = hmac.digest('hex');

  return expectedSignature === v1;
}

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const url = new URL(request.url);
    
    // Extrai ID e Tipo de onde quer que eles venham (Query ou Body)
    const id = url.searchParams.get("data.id") || JSON.parse(rawBody)?.data?.id;
    const type = url.searchParams.get("type") || JSON.parse(rawBody)?.type;

    if (type !== "payment" || !id) {
      return NextResponse.json({ message: "Ignorado - Não é pagamento" }, { status: 200 });
    }

    // Validação de Assinatura (Opcional em Dev, Recomendada em Prod)
    const signatureHeader = request.headers.get('x-signature');
    const requestIdHeader = request.headers.get('x-request-id');
    const webhookSecret = process.env.MP_WEBHOOK_SECRET;

    if (webhookSecret && (!signatureHeader || !verifyMercadoPagoSignature(rawBody, signatureHeader, requestIdHeader, webhookSecret))) {
      console.error("❌ Webhook: Assinatura inválida detectada!");
      return NextResponse.json({ error: "Assinatura inválida" }, { status: 403 });
    }

    await connectToDatabase();

    const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! });
    const payment = new Payment(client);
    
    // 2. Busca o pagamento direto no Mercado Pago (Verificação de verdade)
    const paymentData = await payment.get({ id });
    const status = paymentData.status;
    const orderId = paymentData.external_reference; // IMPORTANTE: Seu Checkout deve enviar o ID do pedido aqui

    console.log(`🔔 Webhook: Pagamento ${id} recebeu status: ${status}`);

    // 3. Atualiza o pedido no seu Banco de Dados
    if (status === "approved" && orderId) {
      const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        { status: "paid" },
        { new: true }
      );
      
      if (updatedOrder) {
        console.log(`✅ Pedido ${orderId} marcado como PAGO!`);
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });

  } catch (error: any) {
    console.error("❌ Erro no Webhook:", error.message);
    return NextResponse.json({ error: "Erro interno" }, { status: 200 }); // Retornamos 200 para o MP parar de tentar
  }
}