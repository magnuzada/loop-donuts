import { NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";
import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/models/Product";
import Order from "@/models/Order";

export async function POST(request: Request) {
  try {
    // 0. SEGURANÇA: Valida Token
    const accessToken = process.env.MP_ACCESS_TOKEN;
    if (!accessToken) {
      console.error("❌ ERRO CRÍTICO: MP_ACCESS_TOKEN ausente");
      return NextResponse.json({ error: "Erro de configuração no servidor" }, { status: 500 });
    }

    // 1. Inicializa Conexões
    await connectToDatabase();
    const client = new MercadoPagoConfig({ accessToken });
    
    // 2. Recebe Dados
    const body = await request.json();
    const { cart, customer } = body;

    if (!cart || cart.length === 0) return NextResponse.json({ error: "Carrinho vazio" }, { status: 400 });
    if (!customer?.phone) return NextResponse.json({ error: "Telefone obrigatório" }, { status: 400 });

    // 🚨 CORREÇÃO PRINCIPAL: Definição da URL
    // Se estiver em produção (Vercel), usa o link real. Se for local, tenta usar o origin.
    const origin = request.headers.get("origin") || "http://localhost:3000";
    const BASE_URL = process.env.NODE_ENV === 'production' 
      ? "https://loop-donuts.vercel.app" 
      : origin;

    // 3. Processa Produtos (Preço seguro do Banco de Dados)
    const productIds = cart.map((item: any) => item._id || item.id);
    const dbProducts = await Product.find({ _id: { $in: productIds } });
    const productsMap = new Map(dbProducts.map((p) => [p._id.toString(), p]));

    const itemsForMercadoPago: any[] = [];
    const itemsForDatabase: any[] = [];
    let totalCalculado = 0;

    for (const cartItem of cart) {
      const id = cartItem._id || cartItem.id;
      const realProduct = productsMap.get(id);
      
      if (!realProduct) continue;

      const quantity = Number(cartItem.quantity);
      const realPrice = Number(realProduct.price);
      totalCalculado += realPrice * quantity;

      // Item para o Mercado Pago
      itemsForMercadoPago.push({
        id: realProduct._id.toString(),
        title: realProduct.name,
        quantity: quantity,
        unit_price: realPrice,
        currency_id: "BRL",
        picture_url: realProduct.image || ""
      });

      // Item para o seu Banco de Dados (MongoDB)
      itemsForDatabase.push({
        name: realProduct.name,
        quantity: quantity,
        price: realPrice,
        // productId: realProduct._id // Opcional, se seu Schema aceitar
      });
    }

    // 4. Tratamento de E-mail (Obrigatório pro MP)
    const cleanPhone = customer.phone.replace(/\D/g, "");
    const finalEmail = (customer.email && customer.email.includes("@"))
      ? customer.email.trim()
      : `cliente_${cleanPhone}@loopdonuts.com`; // E-mail técnico se o user não der

    // 5. Cria o Pedido no Mongo (Status: Pendente)
    const newOrder = await Order.create({
      customer: { ...customer, email: finalEmail },
      items: itemsForDatabase,
      total: totalCalculado,
      status: "pending",
      createdAt: new Date(),
    });

    // 6. Cria a Preferência no Mercado Pago
    const preference = new Preference(client);
    const result = await preference.create({
      body: {
        items: itemsForMercadoPago,
        payer: {
          email: finalEmail,
          // Se tiver CPF, envia. Se não, não envia o objeto identification.
          ...(customer.docNumber && {
            identification: { type: "CPF", number: customer.docNumber.replace(/\D/g, "") }
          })
        },
        // 👇 AQUI ESTAVA O ERRO. Agora aponta para URLs reais.
        back_urls: {
          success: `${BASE_URL}/success`, // Página de Sucesso
          failure: `${BASE_URL}/`,        // Volta pra Home se falhar
          pending: `${BASE_URL}/`,        // Volta pra Home se ficar pendente
        },
        auto_return: "approved",
        external_reference: newOrder._id.toString(), // Link entre MP e Mongo
        notification_url: `${BASE_URL}/api/webhook`, // O Robô que avisa que pagou
        metadata: { 
          db_order_id: newOrder._id.toString() 
        }
      },
    });

    // 7. Salva o ID do MP no Pedido
    newOrder.paymentId = result.id; // Ou mp_preference_id dependendo do seu Schema
    await newOrder.save();

    return NextResponse.json({ url: result.init_point, id: result.id });

  } catch (error: any) {
    console.error("❌ ERRO CHECKOUT:", error);
    return NextResponse.json({ 
      error: "Erro ao processar", 
      details: error.message 
    }, { status: 500 });
  }
}