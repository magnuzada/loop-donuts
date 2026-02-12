import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Neighborhood from "@/models/Neighborhood";

export async function GET() {
  try {
    await connectToDatabase();

    // Busca apenas bairros ATIVOS e ordena por nome (A-Z)
    const neighborhoods = await Neighborhood.find({ active: true }).sort({ name: 1 });

    return NextResponse.json(neighborhoods);
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar bairros" },
      { status: 500 }
    );
  }
}