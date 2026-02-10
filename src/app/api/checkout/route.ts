import { NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago"; 
import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/models/Product";
import Order from "@/models/Order";

export async function POST(request: Request) {
  try {
    // 0. SEGURANÇA: Valida Token antes de tudo
    const accessToken = process.env.MP_ACCESS_TOKEN;
    if (!accessToken) {
      console.error("❌ ERRO CRÍTICO: MP_ACCESS_TOKEN não configurado no .env");
      return NextResponse.json({ error: "Erro de configuração no servidor (Token ausente)" }, { status: 500 });
    }

    // 1. Inicializa Conexões
    await connectToDatabase();
    const client = new MercadoPagoConfig({ accessToken });
    const preference = new Preference(client);

    // 2. Recebe e Valida Dados
    const body = await request.json();
    const { cart, customer } = body;

    if (!cart || cart.length === 0) return NextResponse.json({ error: "Carrinho vazio" }, { status: 400 });
    if (!customer?.phone) return NextResponse.json({ error: "Telefone é obrigatório" }, { status: 400 });

    // 3. Detecta a URL correta (Localhost ou Vercel) automaticamente
    // Isso evita o erro de "undefined" nas URLs de retorno
    const origin = request.headers.get("origin") || "https://loop-donuts.vercel.app";

    // 4. Processa Produtos (Segurança de Preço)
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

    // 5. E-MAIL E DOC (Lógica Híbrida)
    const cleanPhone = customer.phone.replace(/\D/g, "");
    
    // Tenta usar o e-mail real. Se não tiver, usa o técnico (Risco de perder cartão!)
    const finalEmail = (customer.email && customer.email.includes("@"))
      ? customer.email.trim()
      : `cliente_${cleanPhone}@loopdonuts.com`;

    const payerDoc = (customer.docNumber && customer.docNumber.length > 5)
      ? { type: "CPF", number: customer.docNumber.replace(/\D/g, "") }
      : undefined;

    // 6. Cria Pedido no Banco
    const newOrder = await Order.create({
      customer: { ...customer, email: finalEmail },
      items: itemsForDatabase,
      total: totalCalculado,
      status: "pending",
      createdAt: new Date(),
    });

    // 7. Cria Preferência no Mercado Pago
    const result = await preference.create({
      body: {
        items: itemsForMercadoPago,
        payer: {
          email: finalEmail,
          identification: payerDoc,
        },
        // Back URLs dinâmicas baseadas na origem
        back_urls: {
            success: `${origin}/menu?status=success`,
            failure: `${origin}/menu?status=failure`,
            pending: `${origin}/menu?status=pending`,
        },
        auto_return: "approved",
        external_reference: newOrder._id.toString(),
        notification_url: `${origin}/api/webhook`, 
        metadata: { db_order_id: newOrder._id.toString() }
      },
    });

    // 8. Salva ID e Retorna
    newOrder.mp_preference_id = result.id;
    await newOrder.save();

    return NextResponse.json({ url: result.init_point, id: result.id });

  } catch (error: any) {
    // 🔥 LOG DE ERRO DETALHADO (A Correção Principal)
    console.error("❌ ERRO NO CHECKOUT (JSON):", JSON.stringify(error, null, 2));
    
    // Tenta pegar a mensagem real do erro
    const errorMessage = error.cause?.description || error.message || "Erro desconhecido ao processar pagamento";
    
    return NextResponse.json({ 
      error: "Erro ao criar preferência de pagamento", 
      details: errorMessage 
    }, { status: 500 });
  }
}