import { NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago"; 
import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/models/Product";
import Order from "@/models/Order";

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    // Inicializa MP
    const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! });
    const preference = new Preference(client);

    const body = await request.json();
    const { cart, customer } = body;

    // --- Validações ---
    if (!cart || cart.length === 0) return NextResponse.json({ error: "Carrinho vazio" }, { status: 400 });
    if (!customer?.phone) return NextResponse.json({ error: "Telefone é obrigatório" }, { status: 400 });

    // 1. Processa os Itens (Preço do Banco = Segurança)
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

    // 2. LÓGICA HÍBRIDA DE E-MAIL (Real ou Técnico)
    const cleanPhone = customer.phone.replace(/\D/g, "");
    
    // Se o cliente mandou email válido, usa. Se não, gera o técnico.
    const finalEmail = (customer.email && customer.email.includes("@"))
      ? customer.email
      : `cliente_${cleanPhone}@loopdonuts.com`;

    // 3. LÓGICA DE CPF (Se tiver)
    const payerDoc = (customer.docNumber && customer.docNumber.length > 5)
      ? { type: "CPF", number: customer.docNumber.replace(/\D/g, "") }
      : undefined;

    // 4. Cria Pedido no Banco (Status Pending)
    const newOrder = await Order.create({
      customer: {
        ...customer,
        email: finalEmail, 
      },
      items: itemsForDatabase,
      total: totalCalculado,
      status: "pending",
      createdAt: new Date(),
    });

    // 5. Cria Preferência no Mercado Pago (LIBERADA PARA TODOS OS MEIOS)
    const result = await preference.create({
      body: {
        items: itemsForMercadoPago,
        payer: {
          email: finalEmail,
          identification: payerDoc, // Manda CPF se existir
        },
        // 👇 REMOVI O BLOQUEIO DE CARTÃO AQUI!
        // Deixando vazio, o MP aceita Pix, Boleto, Crédito e Débito automaticamente.
        back_urls: {
            success: `${process.env.NEXT_PUBLIC_BASE_URL}/menu?status=success`,
            failure: `${process.env.NEXT_PUBLIC_BASE_URL}/menu?status=failure`,
            pending: `${process.env.NEXT_PUBLIC_BASE_URL}/menu?status=pending`,
        },
        auto_return: "approved",
        external_reference: newOrder._id.toString(),
        notification_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/webhook`,
        metadata: { db_order_id: newOrder._id.toString() }
      },
    });

    // 6. Atualiza o pedido com o ID da preferência (Importante!)
    newOrder.mp_preference_id = result.id;
    await newOrder.save();

    return NextResponse.json({ url: result.init_point, id: result.id });

  } catch (error) {
    console.error("Erro no Checkout:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}