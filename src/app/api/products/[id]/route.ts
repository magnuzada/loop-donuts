import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";

// Definição do tipo para o Next.js 15+
type Props = {
  params: Promise<{ id: string }>;
};

// DELETE: Apagar um produto
export async function DELETE(req: Request, props: Props) {
  try {
    await dbConnect();
    
    // ✅ CORREÇÃO: Aguardamos o params antes de usar
    const params = await props.params;
    const id = params.id;

    const deleted = await Product.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Produto não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Produto excluído!" });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// PUT: Atualizar um produto (Editar)
export async function PUT(req: Request, props: Props) {
  try {
    await dbConnect();
    
    // ✅ CORREÇÃO: Aguardamos o params aqui também
    const params = await props.params;
    const id = params.id;
    
    const body = await req.json();

    const updated = await Product.findByIdAndUpdate(id, body, {
      new: true, // Retorna o dado novo
      runValidators: true,
    });

    if (!updated) {
      return NextResponse.json({ success: false }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}