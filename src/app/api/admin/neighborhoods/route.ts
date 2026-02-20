import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Neighborhood from "@/models/Neighborhood";

// S - Single Responsibility: Apenas lista e cria bairros.

export async function GET() {
  try {
    await connectToDatabase();
    // Traz todos os bairros em ordem alfabética
    const neighborhoods = await Neighborhood.find().sort({ name: 1 });
    return NextResponse.json(neighborhoods);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar bairros" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, price, active } = await request.json();
    
    if (!name || price === undefined) {
      return NextResponse.json({ error: "Nome e preço são obrigatórios" }, { status: 400 });
    }

    await connectToDatabase();
    const newNeighborhood = await Neighborhood.create({ 
      name, 
      price: Number(price), 
      active: active ?? true 
    });
    
    return NextResponse.json(newNeighborhood, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao criar bairro" }, { status: 500 });
  }
}
