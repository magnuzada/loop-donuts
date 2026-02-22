import mongoose from 'mongoose';
// Alterado para importação padrão (sem as chaves)
import Product from '../models/Product'; 

async function seedDatabase() {
  // Pega a URL direto do seu .env ou substitua pela string aqui se preferir
  const MONGODB_URI = "sua_url_do_mongodb_atlas_aqui"; 

  const donuts = [
    {
      name: "Clássico Loop",
      description: "Nossa massa artesanal com infusão de baunilha natural e cobertura de açúcar cristal de moagem fina.",
      price: 12.00,
      image: "https://images.pexels.com/photos/1191639/pexels-photo-1191639.jpeg",
      category: "Clássicos",
      stock: 50
    },
    {
      name: "Explosão de Frutas Vermelhas",
      description: "Recheio cremoso de frutas silvestres selecionadas e cobertura de glacê de framboesa pura.",
      price: 16.50,
      image: "https://images.pexels.com/photos/3779093/pexels-photo-3779093.jpeg",
      category: "Premium",
      stock: 30
    },
    {
      name: "Double Chocolate",
      description: "Massa de cacau intenso com cobertura de chocolate meio amargo e raspas de chocolate 70%.",
      price: 15.00,
      image: "https://images.pexels.com/photos/40516/glow-donuts-donuts-dark-candy-40516.jpeg",
      category: "Chocolate",
      stock: 40
    },
    {
      name: "Nuvem de Pistache",
      description: "Creme de pistache artesanal com cobertura aveludada e pedaços crocantes de sementes selecionadas.",
      price: 18.00,
      image: "https://images.pexels.com/photos/867470/pexels-photo-867470.jpeg",
      category: "Exóticos",
      stock: 20
    },
    {
      name: "Caramelo Salgado",
      description: "O equilíbrio perfeito entre o doce do caramelo cozido lentamente e um toque de flor de sal.",
      price: 14.50,
      image: "https://images.pexels.com/photos/1407346/pexels-photo-1407346.jpeg",
      category: "Premium",
      stock: 25
    },
    {
      name: "Chocoberry",
      description: "Combinação clássica de morangos frescos com uma generosa camada de chocolate ao leite.",
      price: 16.00,
      image: "https://images.pexels.com/photos/131893/pexels-photo-131893.jpeg",
      category: "Chocolate",
      stock: 35
    },
    {
      name: "Limão Siciliano & Merengue",
      description: "Curd de limão refrescante finalizado com merengue maçaricado na hora.",
      price: 15.50,
      image: "https://images.pexels.com/photos/2134224/pexels-photo-2134224.jpeg",
      category: "Frutados",
      stock: 20
    },
    {
      name: "Cookies & Cream",
      description: "Cobertura de chocolate branco com pedaços crocantes de biscoito de cacau.",
      price: 14.00,
      image: "https://images.pexels.com/photos/2673024/pexels-photo-2673024.jpeg",
      category: "Clássicos",
      stock: 45
    },
    {
      name: "Doce de Leite Real",
      description: "Recheio farto de doce de leite artesanal, polvilhado com canela e açúcar.",
      price: 14.50,
      image: "https://images.pexels.com/photos/5941544/pexels-photo-5941544.jpeg",
      category: "Clássicos",
      stock: 30
    },
    {
      name: "Duo de Avelã",
      description: "Creme duplo de avelã e chocolate branco, decorado com avelãs torradas inteiras.",
      price: 17.50,
      image: "https://images.pexels.com/photos/1191639/pexels-photo-1191639.jpeg",
      category: "Premium",
      stock: 15
    }
  ];

  try {
    // Se você não quiser colar a URL aqui, certifique-se que o .env está na raiz
    await mongoose.connect(MONGODB_URI);
    console.log("🔌 Conectado ao MongoDB...");

    await Product.deleteMany({});
    console.log("🧹 Vitrine limpa.");

    await Product.insertMany(donuts);
    console.log("🍩 10 Donuts plantados com sucesso!");

    process.exit(0);
  } catch (error) {
    console.error("❌ Erro:", error);
    process.exit(1);
  }
}

seedDatabase();