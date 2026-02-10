import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/models/Product";

// Força a API a ser dinâmica (sem cache), garantindo dados sempre frescos
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectToDatabase();
    // Busca todos os produtos e ordena do mais novo para o mais antigo
    const products = await Product.find({}).sort({ createdAt: -1 });
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar produtos" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    
    const { name, price, description, image, category, stock } = body;

    // Validação básica
    if (!name || !price) {
      return NextResponse.json({ error: "Nome e Preço são obrigatórios" }, { status: 400 });
    }

    const newProduct = await Product.create({
      name,
      price: Number(price), // Garante que é número
      stock: Number(stock) || 0, // Se não vier estoque, assume 0
      description: description || "",
      image: image || "https://placehold.co/400x400?text=Donut", // Imagem padrão se faltar
      category: category || "Tradicional",
      status: "active", // <--- O PULO DO GATO: Força o produto a nascer ATIVO
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("Erro API POST:", error);
    return NextResponse.json({ error: "Erro ao criar produto" }, { status: 500 });
  }
}