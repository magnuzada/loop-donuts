import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/models/Product";
import MenuClient from "./MenuClient";

export const dynamic = "force-dynamic"; // Garante dados sempre frescos

export default async function MenuPage() {
  await connectToDatabase();

  // ATENÇÃO AQUI 👇
  // Agora buscamos produtos que:
  // 1. Tenham estoque MAIOR que 0
  // 2. E estejam ativos (seja pelo jeito antigo 'isActive' OU pelo novo 'status')
  const dbProducts = await Product.find({
    stock: { $gt: 0 },
    $or: [
      { isActive: true },      // Jeito antigo
      { status: "active" }     // Jeito novo
    ]
  }).lean();

  const products = dbProducts.map((p: any) => ({
    ...p,
    _id: p._id.toString(),
  }));

  return <MenuClient products={products} />;
}