import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/models/Product";

// Helper para pegar o ID da URL
interface Params {
  params: { id: string };
}

// 1. EDITAR (PUT)
export async function PUT(request: Request, { params }: Params) {
  try {
    await connectToDatabase();
    const { id } = params;
    const body = await request.json();

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { ...body }, // Atualiza com os dados novos
      { new: true } // Retorna o produto já atualizado
    );

    if (!updatedProduct) {
      return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 });
    }

    return NextResponse.json(updatedProduct);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao atualizar produto" }, { status: 500 });
  }
}

// 2. DELETAR (DELETE)
export async function DELETE(request: Request, { params }: Params) {
  try {
    await connectToDatabase();
    const { id } = params;

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 });
    }

    return NextResponse.json({ message: "Produto removido com sucesso!" });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao remover produto" }, { status: 500 });
  }
}