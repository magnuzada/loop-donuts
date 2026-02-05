import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import MenuClient from "./MenuClient"; // Importa o visual que criamos acima

export const dynamic = "force-dynamic"; // Garante dados sempre frescos

export default async function MenuPage() {
  await dbConnect();

  // Busca produtos ativos com estoque maior que 0
  const dbProducts = await Product.find({ 
    isActive: true, 
    stock: { $gt: 0 } 
  }).lean();

  // Tratamento para evitar erro de ID no React
  const products = dbProducts.map((p: any) => ({
    ...p,
    _id: p._id.toString(),
  }));

  // Renderiza o Cliente passando os produtos
  return <MenuClient products={products} />;
}