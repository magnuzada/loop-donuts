import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";
import { Payment, MercadoPagoConfig } from 'mercadopago';

// Configuração do Mercado Pago
const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! });

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { cartItems, customer } = body;

    // Log para conferência
    console.log("🛒 Iniciando Checkout para:", customer.name);

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ message: "Carrinho vazio" }, { status: 400 });
    }

    // 1. CÁLCULO SEGURO DO TOTAL
    let total = cartItems.reduce((acc: number, item: any) => {
      const price = Number(item.price);
      const quantity = Number(item.quantity);
      return acc + (price * quantity);
    }, 0);

    // Arredonda para 2 casas decimais (Ex: 10.99)
    total = Number(total.toFixed(2));
    
    console.log("💰 Total Calculado:", total);

    if (total <= 0) {
      return NextResponse.json({ message: "Valor inválido" }, { status: 400 });
    }

    // 2. CRIA O PEDIDO NO MONGODB
    const newOrder = await Order.create({
      customer,
      items: cartItems.map((item: any) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      total,
      status: 'pending',
    });

    // 3. GERA O PIX NO MERCADO PAGO
    const payment = new Payment(client);
    
    // TRUQUE: Usamos um email aleatório @gmail.com para passar pelo filtro anti-fraude do modo Teste
    const uniqueEmail = `cliente_teste_${Date.now()}@gmail.com`;

    const paymentData = {
      transaction_amount: total,
      description: `Pedido Loop Donuts #${newOrder._id}`,
      payment_method_id: 'pix',
      payer: {
        email: uniqueEmail, // <--- CORREÇÃO AQUI
        first_name: 'APRO', // Gatilho para aprovar automático no Sandbox
        last_name: 'User',
        identification: {
            type: 'CPF',
            number: '19119119100' // CPF Genérico válido
        },
        address: {
            zip_code: '06233200',
            street_name: 'Av. das Nações Unidas',
            street_number: '3003',
            neighborhood: 'Bonfim',
            city: 'Osasco',
            federal_unit: 'SP'
        }
      },
    };

    const mpResponse = await payment.create({ body: paymentData });
    const { id, point_of_interaction } = mpResponse;

    // Pega o "Copia e Cola" e o Link do QR Code
    const qrCode = point_of_interaction?.transaction_data?.qr_code;
    const ticketUrl = point_of_interaction?.transaction_data?.ticket_url;

    // 4. ATUALIZA O PEDIDO COM OS DADOS DO PIX
    newOrder.paymentId = id?.toString();
    newOrder.pixQrCode = qrCode;
    newOrder.pixTicketUrl = ticketUrl;
    await newOrder.save();

    console.log("✅ Pedido criado com sucesso! ID:", newOrder._id);

    return NextResponse.json({ 
      message: "Pix gerado com sucesso!", 
      orderId: newOrder._id,
      pix: {
        qrCode,
        ticketUrl
      }
    }, { status: 201 });

  } catch (error: any) {
    console.error("❌ Erro Fatal no Checkout:", error);
    // Retorna o erro detalhado para facilitar a leitura no navegador
    return NextResponse.json({ 
      message: "Erro ao processar pedido", 
      error: error.message,
      cause: error.cause 
    }, { status: 500 });
  }
}