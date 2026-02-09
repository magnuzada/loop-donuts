import { NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago"; // CORREÇÃO 1: Importar Config
import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/models/Product";
import Order from "@/models/Order";

// CORREÇÃO 2: Inicializar com MercadoPagoConfig (Isso resolve o erro de Type)
const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! });
const preference = new Preference(client);

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { cart, customer } = body;

    // Validação de entrada
    if (!cart || !Array.isArray(cart) || cart.length === 0) {
      return NextResponse.json({ error: "Carrinho vazio" }, { status: 400 });
    }
    if (!customer?.phone) {
      return NextResponse.json({ error: "Telefone é obrigatório" }, { status: 400 });
    }

    // 1. OTIMIZAÇÃO: Busca Produtos no Banco
    const productIds = cart.map((item: any) => item._id || item.id);
    const dbProducts = await Product.find({ _id: { $in: productIds } });
    const productsMap = new Map(dbProducts.map((p) => [p._id.toString(), p]));

    const itemsForMercadoPago: any[] = [];
    const itemsForDatabase: any[] = [];
    let totalCalculado = 0;

    // 2. Processamento dos Itens
    for (const cartItem of cart) {
      const id = cartItem._id || cartItem.id;
      const quantity = Number(cartItem.quantity);
      const realProduct = productsMap.get(id);

      if (!realProduct) {
        return NextResponse.json({ error: `Produto indisponível: ${cartItem.name}` }, { status: 400 });
      }

      // Validação de Quantidade
      if (!Number.isInteger(quantity) || quantity <= 0) {
        return NextResponse.json({ error: `Qtd inválida: ${cartItem.name}` }, { status: 400 });
      }

      const realPrice = realProduct.price;
      totalCalculado += realPrice * quantity;

      itemsForMercadoPago.push({
        id: realProduct._id.toString(),
        title: realProduct.name,
        quantity: quantity,
        unit_price: Number(realPrice),
        currency_id: "BRL", // Boa prática adicionar
      });

      itemsForDatabase.push({
        product: realProduct._id,
        name: realProduct.name,
        quantity: quantity,
        price: realPrice,
        image: realProduct.image
      });
    }

    // 3. E-MAIL INVISÍVEL (Técnica do WhatsApp)
    const cleanPhone = customer.phone.replace(/\D/g, "");
    const technicalEmail = `${cleanPhone}@cliente.loopdonuts.com`;

    // 4. Cria a Preferência no Mercado Pago
    const result = await preference.create({
      body: {
        items: itemsForMercadoPago,
        payer: {
          email: technicalEmail,
        },
        payment_methods: {
          excluded_payment_types: [{ id: "credit_card" }],
          installments: 1,
        },
        notification_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/webhook`,
        metadata: {
          customer_name: customer.name,
          customer_phone: customer.phone,
          db_order_id: "pending", // Placeholder, podemos atualizar depois se precisar
        }
      },
    });

    // 5. Salva o Pedido no Banco
    const newOrder = await Order.create({
      customer: {
        name: customer.name,
        phone: customer.phone,
        email: technicalEmail,
        address: customer.address,
        neighborhood: customer.neighborhood,
      },
      items: itemsForDatabase,
      total: totalCalculado,
      status: "pending",
      mp_preference_id: result.id,
      createdAt: new Date(),
    });

    return NextResponse.json({
      url: result.init_point, // URL para checkout redirecionado (se usar)
      id: result.id,          // ID da preferência para abrir o modal/checkout pro
      orderId: newOrder._id,
    });

  } catch (error) {
    console.error("Erro no Checkout:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}