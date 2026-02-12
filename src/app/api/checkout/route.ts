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

    // 🚨 DEFINIÇÃO DE URL BLINDADA
    const origin = request.headers.get("origin");
    let BASE_URL = origin || "http://localhost:3000"; 

    if (process.env.NODE_ENV === 'production') {
        BASE_URL = "https://loop-donuts.vercel.app";
    }
    
    console.log("🔗 URL Base:", BASE_URL);

    // 3. Processa Produtos
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

      itemsForMercadoPago.push({
        id: realProduct._id.toString(),
        title: realProduct.name,
        quantity: quantity,
        unit_price: realPrice,
        currency_id: "BRL",
        picture_url: realProduct.image || ""
      });

      itemsForDatabase.push({
        product: realProduct._id,
        name: realProduct.name,
        quantity: quantity,
        price: realPrice,
        image: realProduct.image
      });
    }

    // 4. Tratamento de E-mail
    const cleanPhone = customer.phone.replace(/\D/g, "");
    const finalEmail = (customer.email && customer.email.includes("@"))
      ? customer.email.trim()
      : `cliente_${cleanPhone}@loopdonuts.com`;

    // 5. Cria Pedido no Mongo
    const newOrder = await Order.create({
      customer: { ...customer, email: finalEmail },
      items: itemsForDatabase,
      total: totalCalculado,
      status: "pending",
      createdAt: new Date(),
    });

    // 6. Cria a Preferência no Mercado Pago
    const preference = new Preference(client);

    // 🧠 ESTRATÉGIA INTELIGENTE DE RETORNO
    // Se for localhost, DESATIVA o retorno automático para não dar erro 400.
    // Se for produção (HTTPS), ATIVA para dar melhor experiência.
    const autoReturnStrategy = BASE_URL.includes("localhost") ? undefined : "approved";

    const result = await preference.create({
      body: {
        items: itemsForMercadoPago,
        payer: {
          email: finalEmail,
          ...(customer.docNumber && {
            identification: { type: "CPF", number: customer.docNumber.replace(/\D/g, "") }
          })
        },
        back_urls: {
          success: `${BASE_URL}/success`,
          failure: `${BASE_URL}/`,
          pending: `${BASE_URL}/`,
        },
        auto_return: autoReturnStrategy, // <--- A MÁGICA AQUI
        external_reference: newOrder._id.toString(),
        notification_url: `${BASE_URL}/api/webhook`,
        metadata: { 
          db_order_id: newOrder._id.toString() 
        }
      },
    });

    // 7. Salva ID e Retorna
    newOrder.paymentId = result.id;
    await newOrder.save();

    return NextResponse.json({ url: result.init_point, id: result.id });

  } catch (error: any) {
    console.error("❌ ERRO CHECKOUT:", error);
    return NextResponse.json({ 
      error: "Erro ao processar", 
      details: error.message,
      cause: error.cause 
    }, { status: 500 });
  }
}