import { NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";
import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/models/Product";
import Order from "@/models/Order";
import Neighborhood from "@/models/Neighborhood";

export async function POST(request: Request) {
  try {
    const accessToken = process.env.MP_ACCESS_TOKEN;
    if (!accessToken) {
      return NextResponse.json({ error: "Token MP não configurado" }, { status: 500 });
    }

    await connectToDatabase();
    
    const body = await request.json();
    const { cart, customer } = body;

    // --- VALIDAÇÃO DO BAIRRO (CASE INSENSITIVE) ---
    const neighborhoodDoc = await Neighborhood.findOne({ 
      name: { $regex: new RegExp(`^${customer.neighborhood}$`, "i") }, 
      active: true 
    });

    if (!neighborhoodDoc) {
      return NextResponse.json({ error: `Bairro não atendido: ${customer.neighborhood}` }, { status: 400 });
    }
    
    const deliveryFee = Number(neighborhoodDoc.price);

    // --- CONFIGURAÇÃO DA URL (CORREÇÃO DO ERRO 400) ---
    // Pega a URL base de forma segura
    const origin = request.headers.get("origin");
    const host = request.headers.get("host");
    
    // Se não tiver origin, usa o host. Se falhar, usa localhost.
    let BASE_URL = origin || `http://${host}` || "http://localhost:3000";

    // REMOVE BARRA NO FINAL SE TIVER (pra evitar http://site.com//success)
    if (BASE_URL.endsWith("/")) {
        BASE_URL = BASE_URL.slice(0, -1);
    }
    
    console.log(`🔗 BASE_URL definida como: ${BASE_URL}`);

    // Só ativa o retorno automático se NÃO for localhost
    // Isso evita o erro "back_url.success must be defined" em desenvolvimento
    const autoReturnStrategy = BASE_URL.includes("localhost") ? undefined : "approved";

    // --- PROCESSAMENTO DOS PRODUTOS ---
    const productIds = cart.map((item: any) => item._id || item.id);
    const dbProducts = await Product.find({ _id: { $in: productIds } });
    const productsMap = new Map(dbProducts.map((p) => [p._id.toString(), p]));

    const itemsForMercadoPago: any[] = [];
    const itemsForDatabase: any[] = [];
    let productsTotal = 0;

    for (const cartItem of cart) {
      const id = cartItem._id || cartItem.id;
      const realProduct = productsMap.get(id);
      
      if (!realProduct) continue;

      const quantity = Number(cartItem.quantity);
      const realPrice = Number(realProduct.price);
      productsTotal += realPrice * quantity;

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

    const finalTotal = productsTotal + deliveryFee;

    // Cria Pedido no Banco
    const newOrder = await Order.create({
      customer: customer,
      items: itemsForDatabase,
      deliveryFee: deliveryFee,
      total: finalTotal,
      status: "pending",
      createdAt: new Date(),
    });

    // --- CRIAÇÃO DA PREFERÊNCIA MP ---
    const client = new MercadoPagoConfig({ accessToken });
    const preference = new Preference(client);

    const result = await preference.create({
      body: {
        items: itemsForMercadoPago,
        shipments: {
          cost: deliveryFee,
          mode: "not_specified",
        },
        payer: {
          email: "test_user_123@test.com", // Email de teste para evitar validação chata
        },
        back_urls: {
          success: `${BASE_URL}/success`,
          failure: `${BASE_URL}/`,
          pending: `${BASE_URL}/`,
        },
        auto_return: autoReturnStrategy, // AQUI ESTÁ A CORREÇÃO
        external_reference: newOrder._id.toString(),
        notification_url: `${BASE_URL}/api/webhook`,
        metadata: { 
          db_order_id: newOrder._id.toString() 
        }
      },
    });

    return NextResponse.json({ url: result.init_point, id: result.id });

  } catch (error: any) {
    console.error("❌ ERRO CHECKOUT:", error);
    return NextResponse.json({ error: "Erro interno", details: error.message }, { status: 500 });
  }
}