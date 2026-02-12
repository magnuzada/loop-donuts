import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Neighborhood from "@/models/Neighborhood";

export async function GET() {
  try {
    await connectToDatabase();

    // 1. Limpa bairros antigos (Cuidado: apaga tudo para recriar)
    await Neighborhood.deleteMany({});

    // 2. Lista de Bairros Iniciais (Edite aqui seus valores reais)
    const initialNeighborhoods = [
      { name: "Centro", price: 5.00, active: true },
      { name: "São Mateus", price: 7.00, active: true },
      { name: "Alto dos Passos", price: 8.00, active: true },
      { name: "Benfica", price: 15.00, active: true },
      { name: "Cascatinha", price: 12.00, active: true },
      { name: "Bairro Muito Longe", price: 99.00, active: false } // Exemplo de inativo
    ];

    await Neighborhood.insertMany(initialNeighborhoods);

    return NextResponse.json({ 
      message: "Bairros cadastrados com sucesso!", 
      data: initialNeighborhoods 
    });

  } catch (error) {
    return NextResponse.json({ error: "Erro ao criar bairros" }, { status: 500 });
  }
}