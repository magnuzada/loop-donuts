import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb"; // <--- CORRIGIDO
import Product from "@/models/Product";

// GET: Listar produtos
export async function GET() {
  try {
    await connectToDatabase(); // <--- CORRIGIDO
    const products = await Product.find({});
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar produtos" }, { status: 500 });
  }
}

// POST: Criar produto
export async function POST(req: Request) {
  try {
    const body = await req.json();
    await connectToDatabase(); // <--- CORRIGIDO
    const newProduct = await Product.create(body);
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao criar produto" }, { status: 500 });
  }
}