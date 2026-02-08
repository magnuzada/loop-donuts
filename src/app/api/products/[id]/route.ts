import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb"; // <--- CORREÇÃO: Importação com chaves {}
import Product from "@/models/Product";

// Interface para definir o formato dos params (Next.js 14)
interface RouteParams {
  params: {
    id: string;
  };
}

// GET: Buscar um produto específico pelo ID
export async function GET(request: Request, { params }: RouteParams) {
  try {
    await connectToDatabase(); // <--- CORREÇÃO: Nome da função atualizado

    const product = await Product.findById(params.id);

    if (!product) {
      return NextResponse.json(
        { message: "Produto não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json(
      { message: "Erro ao buscar produto" },
      { status: 500 }
    );
  }
}

// PUT: Atualizar um produto
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const body = await request.json();
    await connectToDatabase();

    const updatedProduct = await Product.findByIdAndUpdate(
      params.id,
      body,
      { new: true } // Retorna o produto atualizado
    );

    if (!updatedProduct) {
      return NextResponse.json(
        { message: "Produto não encontrado para atualização" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedProduct);
  } catch (error) {
    return NextResponse.json(
      { message: "Erro ao atualizar produto" },
      { status: 500 }
    );
  }
}

// DELETE: Remover um produto
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    await connectToDatabase();

    const deletedProduct = await Product.findByIdAndDelete(params.id);

    if (!deletedProduct) {
      return NextResponse.json(
        { message: "Produto não encontrado para remoção" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Produto removido com sucesso" });
  } catch (error) {
    return NextResponse.json(
      { message: "Erro ao deletar produto" },
      { status: 500 }
    );
  }
}