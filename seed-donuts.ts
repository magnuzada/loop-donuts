import { connectToDatabase } from '../lib/mongodb';
import Donut from '../models/Donut';
import mongoose from 'mongoose';

const epicDonuts = [
  {
    name: "Donut Glacial",
    description: "Um donut coberto com glacê azul celeste e flocos de neve comestíveis. Sabor menta e baunilha.",
    price: 12.50,
    image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=1000&auto=format&fit=crop",
    category: "Especial",
    active: true,
  },
  {
    name: "Donut Vulcânico",
    description: "Recheado com calda de chocolate quente e pimenta, coberto com granulado de rocha vulcânica (chocolate crocante).",
    price: 13.00,
    image: "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?q=80&w=1000&auto=format&fit=crop",
    category: "Aventureiro",
    active: true,
  },
  {
    name: "Donut Estelar",
    description: "Glacê de lavanda com glitter comestível e recheio de frutas silvestres. Uma explosão cósmica de sabor.",
    price: 14.00,
    image: "https://images.unsplash.com/photo-1626094309830-abbb0c99da4a?q=80&w=1000&auto=format&fit=crop",
    category: "Fantasia",
    active: true,
  },
  {
    name: "Donut da Floresta Encantada",
    description: "Com cobertura de matcha e decorado com cogumelos de chocolate branco e folhas de hortelã.",
    price: 12.00,
    image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=1000&auto=format&fit=crop",
    category: "Natureza",
    active: true,
  },
  {
    name: "Donut do Tesouro Pirata",
    description: "Recheado com creme de caramelo salgado e coberto com moedas de chocolate douradas.",
    price: 13.50,
    image: "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?q=80&w=1000&auto=format&fit=crop",
    category: "Aventura",
    active: true,
  },
  {
    name: "Donut Cítrico Tropical",
    description: "Glacê de maracujá e limão, com raspas de coco e pedacinhos de manga. Uma viagem ao paraíso.",
    price: 11.80,
    image: "https://images.unsplash.com/photo-1626094309830-abbb0c99da4a?q=80&w=1000&auto=format&fit=crop",
    category: "Frutado",
    active: true,
  },
  {
    name: "Donut Café da Manhã dos Campeões",
    description: "Cobertura de maple syrup, bacon crocante e um toque de café. Para começar o dia com energia.",
    price: 14.20,
    image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=1000&auto=format&fit=crop",
    category: "Exótico",
    active: true,
  },
  {
    name: "Donut Unicórnio Mágico",
    description: "Glacê colorido em tons pastel, com chifre de açúcar e orelhinhas de chocolate. Pura magia!",
    price: 15.00,
    image: "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?q=80&w=1000&auto=format&fit=crop",
    category: "Fantasia",
    active: true,
  },
  {
    name: "Donut de Caramelo Salgado e Pretzel",
    description: "Combinação perfeita de doce e salgado, com cobertura de caramelo, flor de sal e pedaços de pretzel.",
    price: 13.80,
    image: "https://images.unsplash.com/photo-1626094309830-abbb0c99da4a?q=80&w=1000&auto=format&fit=crop",
    category: "Gourmet",
    active: true,
  },
  {
    name: "Donut de Chocolate Intenso com Framboesa",
    description: "Massa de chocolate, recheio de ganache de chocolate amargo e cobertura com framboesas frescas.",
    price: 14.50,
    image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=1000&auto=format&fit=crop",
    category: "Clássico",
    active: true,
  },
];

async function seedDonuts() {
  try {
    await connectToDatabase();
    console.log('✅ Conectado ao MongoDB.');

    // Limpar a coleção de donuts antes de inserir novos (opcional, mas bom para re-seeding)
    await Donut.deleteMany({});
    console.log('🗑️ Coleção de donuts limpa.');

    await Donut.insertMany(epicDonuts);
    console.log(`🎉 ${epicDonuts.length} donuts épicos inseridos com sucesso!`);

  } catch (error) {
    console.error('❌ Erro ao semear donuts:', error);
  } finally {
    // Desconectar do banco de dados
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
      console.log('🔌 Desconectado do MongoDB.');
    }
  }
}

seedDonuts();