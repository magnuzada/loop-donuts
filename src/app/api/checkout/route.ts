import { NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago"; 
import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/models/Product";
import Order from "@/models/Order";

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! });
    const preference = new Preference(client);

    const body = await request.json();
    const { cart, customer } = body;

    // --- Validações ---
    if (!cart || cart.length === 0) return NextResponse.json({ error: "Carrinho vazio" }, { status: 400 });
    if (!customer?.phone) return NextResponse.json({ error: "Telefone é obrigatório" }, { status: 400 });

    // 1. Processa os Itens
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
      });

      itemsForDatabase.push({
        product: realProduct._id,
        name: realProduct.name,
        quantity: quantity,
        price: realPrice,
        image: realProduct.image
      });
    }

    // 2. E-MAIL E DOC (Lógica Híbrida)
    const cleanPhone = customer.phone.replace(/\D/g, "");
    const finalEmail = (customer.email && customer.email.includes("@"))
      ? customer.email
      : `cliente_${cleanPhone}@loopdonuts.com`;

    const payerDoc = (customer.docNumber && customer.docNumber.length > 5)
      ? { type: "CPF", number: customer.docNumber.replace(/\D/g, "") }
      : undefined;

    // 3. Cria Pedido no Banco
    const newOrder = await Order.create({
      customer: { ...customer, email: finalEmail },
      items: itemsForDatabase,
      total: totalCalculado,
      status: "pending",
      createdAt: new Date(),
    });

    // 👇 DEFINA AQUI O SEU SITE REAL (Sem barra no final)
    // Se estiver testando local, use http://localhost:3000
    // Se for subir pra Vercel, use a URL oficial
    const BASE_URL = "https://loop-donuts.vercel.app"; 

    // 4. Cria Preferência (LIBERADA GERAL)
    const result = await preference.create({
      body: {
        items: itemsForMercadoPago,
        payer: {
          email: finalEmail,
          identification: payerDoc,
        },
        // 👇 REMOVI payment_methods: {} (Isso libera Crédito, Débito e TUDO)
        
        // URLs de retorno (Para onde o cliente vai depois de pagar)
        back_urls: {
            success: `${BASE_URL}/menu?status=success`,
            failure: `${BASE_URL}/menu?status=failure`,
            pending: `${BASE_URL}/menu?status=pending`,
        },
        auto_return: "approved",
        external_reference: newOrder._id.toString(),
        notification_url: `${BASE_URL}/api/webhook`, // Webhook também precisa da URL certa
        metadata: { db_order_id: newOrder._id.toString() }
      },
    });

    // 5. Salva ID e Retorna
    newOrder.mp_preference_id = result.id;
    await newOrder.save();

    return NextResponse.json({ url: result.init_point, id: result.id });

  } catch (error) {
    console.error("❌ ERRO CRÍTICO NO CHECKOUT:", error);
    // Retorna o erro detalhado para você ver no Network do navegador se precisar
    return NextResponse.json({ error: "Erro ao processar pagamento", details: String(error) }, { status: 500 });
  }
}