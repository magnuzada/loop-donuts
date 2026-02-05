import { NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order"; // Importa seu modelo atualizado

// Configuração do Mercado Pago
const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. Calcula o total (Segurança: backend calcula)
    let total = 0;
    body.cart.forEach((item: any) => {
      total += item.price * item.quantity;
    });

    // 2. Prepara o pagamento no Mercado Pago
    const payment = new Payment(client);
    const paymentData = {
      transaction_amount: total,
      description: `Pedido Loop Donuts - ${new Date().toLocaleTimeString()}`,
      payment_method_id: "pix",
      payer: {
        email: "cliente@email.com", // Email genérico por enquanto
        first_name: "Cliente",
      },
    };

    const mpResponse = await payment.create({ body: paymentData });

    // 3. Salva no Banco de Dados (USANDO O SEU SCHEMA NOVO)
    await dbConnect();
    
    // ... dentro de api/checkout/route.ts ...

    const newOrder = await Order.create({
      // O backend deve ler o objeto customer inteiro que enviamos agora
      customer: {
        name: body.customer?.name || "Cliente", 
        phone: body.customer?.phone || "000000000",
        address: body.customer?.address || "Retirada",
        neighborhood: body.customer?.neighborhood || "Centro",
      },
      // ...
      // Estrutura dos Itens
      items: body.cart.map((item: any) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      total: total, // ✅ Agora bate com o Schema (antes era totalAmount)
      paymentId: mpResponse.id!.toString(),
      status: "pending",
    });

    console.log(`✅ Pedido criado: ${newOrder._id}`);

    return NextResponse.json(
      {
        qr_code: mpResponse.point_of_interaction?.transaction_data?.qr_code,
        qr_code_base64: mpResponse.point_of_interaction?.transaction_data?.qr_code_base64,
        id: mpResponse.id,
        orderId: newOrder._id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro no Checkout:", error);
    return NextResponse.json(
      { error: "Erro ao processar pagamento" },
      { status: 500 }
    );
  }
}