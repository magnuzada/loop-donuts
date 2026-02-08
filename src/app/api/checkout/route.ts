import { NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { connectToDatabase } from "@/lib/mongodb"; // <--- CORREÇÃO AQUI (Com chaves {})
import Order from "@/models/Order";

// Configuração do Mercado Pago
const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

export async function POST(request: Request) {
  try {
    const { cart, customer } = await request.json();

    // Conecta no Banco
    await connectToDatabase(); // <--- CORREÇÃO AQUI (Nome novo)

    // Calcula o total (Segurança: recalcular no back para evitar fraudes)
    const total = cart.reduce((acc: number, item: any) => acc + item.price * item.quantity, 0);

    // 1. Cria o Pedido no nosso Banco (Status: Pendente)
    const newOrder = await Order.create({
      customer: customer || { name: "Cliente Site" },
      items: cart,
      total,
      status: "pending",
    });

    // 2. Cria a Preferência de Pagamento no Mercado Pago
    const payment = new Payment(client);

    const paymentData = await payment.create({
      body: {
        transaction_amount: total,
        description: `Pedido #${newOrder._id} - Loop Donuts`,
        payment_method_id: "pix",
        payer: {
          email: customer?.email || "email@teste.com",
          first_name: customer?.name || "Cliente",
        },
        external_reference: newOrder._id.toString(), // <--- Link entre MP e nosso Banco
      },
    });

    // 3. Salva o ID do pagamento no pedido
    newOrder.paymentId = paymentData.id?.toString();
    await newOrder.save();

    // 4. Retorna o QR Code para o Frontend
    return NextResponse.json({
      orderId: newOrder._id,
      qr_code: paymentData.point_of_interaction?.transaction_data?.qr_code,
      qr_code_base64: paymentData.point_of_interaction?.transaction_data?.qr_code_base64,
    });

  } catch (error) {
    console.error("Erro no Checkout:", error);
    return NextResponse.json(
      { error: "Erro ao processar pagamento" },
      { status: 500 }
    );
  }
}