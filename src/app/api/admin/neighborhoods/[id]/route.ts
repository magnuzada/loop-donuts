import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Neighborhood from "@/models/Neighborhood";

// Rota dinâmica para agir em UM bairro específico usando o ID dele

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { name, price, active } = await request.json();
    await connectToDatabase();
    
    const updated = await Neighborhood.findByIdAndUpdate(
      params.id,
      { name, price: Number(price), active },
      { new: true } // Retorna o documento já atualizado
    );
    
    if (!updated) return NextResponse.json({ error: "Bairro não encontrado" }, { status: 404 });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao atualizar" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();
    const deleted = await Neighborhood.findByIdAndDelete(params.id);
    
    if (!deleted) return NextResponse.json({ error: "Bairro não encontrado" }, { status: 404 });
    return NextResponse.json({ message: "Bairro removido com sucesso" });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao deletar" }, { status: 500 });
  }
}