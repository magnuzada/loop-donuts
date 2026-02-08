import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET() {
  try {
    // Tenta conectar ao banco
    await connectToDatabase();
    
    // Se der certo, responde com sucesso
    return NextResponse.json({ 
      message: '✅ SUCESSO! Conexão com MongoDB estabelecida.',
      timestamp: new Date().toISOString()
    }, { status: 200 });

  } catch (error: any) {
    // Se der erro, mostra o motivo
    console.error("Erro de Conexão:", error);
    return NextResponse.json({ 
      message: '❌ ERRO ao conectar no banco.',
      error: error.message 
    }, { status: 500 });
  }
}