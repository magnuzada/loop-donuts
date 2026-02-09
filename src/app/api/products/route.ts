import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/models/Product";

export async function GET() {
  try {
    await connectToDatabase();
    const products = await Product.find({});
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar produtos" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    
    // 👇 ADICIONAMOS 'stock' NA LISTA DE DADOS RECEBIDOS
    const { name, price, description, image, category, stock } = body;

    if (!name || !price) {
      return NextResponse.json({ error: "Nome e Preço são obrigatórios" }, { status: 400 });
    }

    const newProduct = await Product.create({
      name,
      price: Number(price),
      stock: Number(stock) || 0, // 👇 SALVAMOS O ESTOQUE (Se não vier, é 0)
      description,
      image: image || "https://placehold.co/400x400?text=Donut",
      category: category || "Tradicional",
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("Erro API POST:", error); // Log para ajudar no debug
    return NextResponse.json({ error: "Erro ao criar produto" }, { status: 500 });
  }
}