import { NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";

const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! });

// 👇 ISSO AQUI RESOLVE O ERRO 405 NO NAVEGADOR
export async function GET() {
  return NextResponse.json({ status: "Webhook Online! 🚀" });
}

export async function POST(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("data.id") || (await request.json()).data?.id;

    if (!id) return NextResponse.json({ message: "ID missing" }, { status: 200 });

    console.log(`🔔 Webhook: Recebi Pagamento ID: ${id}`);

    const payment = await new Payment(client).get({ id });

    if (payment.status === 'approved') {
      await dbConnect();
      await Order.findOneAndUpdate(
        { paymentId: id.toString() },
        { status: 'paid', paidAt: new Date() }
      );
      console.log(`✅ PEDIDO PAGO!`);
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro" }, { status: 500 });
  }
}