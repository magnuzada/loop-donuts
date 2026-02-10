import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/models/Product";
import MenuClient from "./MenuClient";

// 1. O segredo para não ter cache velho
export const dynamic = "force-dynamic";

export default async function MenuPage() {
  try {
    // 2. Conecta no Banco
    await connectToDatabase();

    // 3. Busca TUDO o que for ativo (igual a Home)
    // O .lean() deixa muito mais rápido
    const dbProducts = await Product.find({ 
      status: "active" 
    }).sort({ createdAt: -1 }).lean();

    // 4. Prepara os dados (converte ID para texto)
    const products = dbProducts.map((p: any) => ({
      ...p,
      _id: p._id.toString(),
      id: p._id.toString(), // Garante que funcione se o componente usar 'id' ou '_id'
      price: Number(p.price) || 0,
    }));

    console.log(`Menu carregado com ${products.length} produtos.`);

    // 5. Entrega para a tela
    return <MenuClient products={products} />;
    
  } catch (error) {
    console.error("Erro ao carregar menu:", error);
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-red-500 gap-4">
        <p className="text-xl font-bold">Ops! Erro ao carregar o cardápio.</p>
        <p className="text-sm text-gray-500">Tente recarregar a página.</p>
      </div>
    );
  }
}