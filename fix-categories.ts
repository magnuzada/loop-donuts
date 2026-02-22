import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/models/Product";

export async function runAuditory() {
  await connectToDatabase();

  console.log("--- Iniciando Auditoria de Categorias ---");

  // 1. Busca todos os produtos para análise
  const products = await Product.find({});

  for (const product of products) {
    let newCategory = product.category?.toLowerCase() || "tradicionais";

    // Mapeamento de nomes antigos/errados para o novo ENUM
    if (newCategory.includes("especial") || newCategory.includes("favorito")) {
      newCategory = "especiais";
    } else if (newCategory.includes("vegano")) {
      newCategory = "veganos";
    } else {
      newCategory = "tradicionais";
    }

    // 2. Atualiza o documento no banco
    await Product.updateOne(
      { _id: product._id },
      { $set: { category: newCategory } }
    );
    
    console.log(`Donut "${product.name}" atualizado para: ${newCategory}`);
  }

  console.log("--- Auditoria Concluída com Sucesso ---");
}