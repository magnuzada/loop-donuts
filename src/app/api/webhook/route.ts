import { NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { connectToDatabase } from "@/lib/mongodb";
import Order from "@/models/Order";

// Inicializa o Cliente MP
const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! });

export async function POST(request: Request) {
  try {
    // 1. Recebe o aviso (Pode ser de qualquer um, inclusive hackers)
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

    // 2. SEGURANÇA TOTAL: "Confie, mas Verifique"
    // Vamos perguntar diretamente ao Mercado Pago o status real desse ID.
    // Hackers não conseguem falsificar essa resposta, pois usamos o Token Oficial.
    const payment = new Payment(client);
    
    let paymentInfo;
    try {
      paymentInfo = await payment.get({ id: data.id });
    } catch (error) {
      console.error("❌ Pagamento não encontrado no MP (Pode ser fake):", data.id);
      return NextResponse.json({ error: "Pagamento não verificado" }, { status: 200 }); // Retorna 200 pro MP parar de mandar
    }

    // 3. Extrai o ID do nosso pedido (que enviamos no checkout)
    const orderId = paymentInfo.external_reference;
    const statusAtual = paymentInfo.status;

    console.log(`🔎 Status Real no MP: ${statusAtual} | Pedido ID: ${orderId}`);

    if (orderId && (statusAtual === "approved" || statusAtual === "authorized")) {
      await connectToDatabase();

      // 4. IDEMPOTÊNCIA (Evita processar 2x)
      const existingOrder = await Order.findById(orderId);
      
      if (existingOrder && existingOrder.status === "paid") {
        console.log("✅ Pedido já estava pago. Nenhuma ação necessária.");
        return NextResponse.json({ ok: true });
      }

      // 5. ATUALIZA O BANCO (Fica Verde!)
      await Order.findByIdAndUpdate(orderId, {
        status: "paid", // Ou 'approved'
        updatedAt: new Date(),
        // Opcional: Salvar dados do pagamento para auditoria
        payment_info: {
          id: data.id,
          method: paymentInfo.payment_method_id,
          type: paymentInfo.payment_type_id
        }
      });

      console.log("🎉 SUCESSO: Pedido atualizado para PAGO!");
    }

    // Responde 200 OK rápido para o Mercado Pago não ficar reenviando
    return NextResponse.json({ ok: true });

  } catch (error) {
    console.error("❌ Erro no Webhook:", error);
    // Retorna 200 para evitar loop infinito de erros do MP
    return NextResponse.json({ error: "Erro interno, mas recebido" }, { status: 200 });
  }
}