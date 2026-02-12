import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/models/Product";

export async function GET() {
  try {
    await connectToDatabase();
    await Product.deleteMany({}); // Limpa antigos

    const newProducts = [
      {
        name: "Donut Glaceado",
        description: "Clássico irresistível com glacê de baunilha.",
        price: 8.90,
        category: "Clássicos",
        image: "https://images.pexels.com/photos/4686960/pexels-photo-4686960.jpeg?auto=compress&cs=tinysrgb&w=800",
        stock: 50,
        status: "active"
      },
      {
        name: "Donut de Chocolate",
        description: "Cobertura generosa de chocolate meio amargo.",
        price: 10.90,
        category: "Especiais",
        image: "https://images.pexels.com/photos/1191639/pexels-photo-1191639.jpeg?auto=compress&cs=tinysrgb&w=800",
        stock: 30,
        status: "active"
      },
      {
        name: "Donut de Morango",
        description: "Cobertura rosa vibrante com granulados.",
        price: 9.90,
        category: "Especiais",
        image: "https://images.pexels.com/photos/3628502/pexels-photo-3628502.jpeg?auto=compress&cs=tinysrgb&w=800",
        stock: 25,
        status: "active"
      }
    ];

    await Product.insertMany(newProducts);
    return NextResponse.json({ message: "Imagens corrigidas com Pexels!" });
  } catch (error) {
    return NextResponse.json({ error: "Erro no seed" }, { status: 500 });
  }
}