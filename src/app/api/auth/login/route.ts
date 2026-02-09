import { NextResponse } from "next/server"; // <--- ESTA LINHA ESTAVA FALTANDO
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const body = await request.json();
  const { username, password } = body;

  // Verifica usuário e senha (EXATAMENTE IGUAIS ao .env)
  if (
    username === process.env.ADMIN_USER && 
    password === process.env.ADMIN_PASSWORD
  ) {
    // SUCESSO! Cria o cookie "admin_token"
    cookies().set("admin_token", "logado_com_sucesso", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 dia
      path: "/",
    });

    return NextResponse.json({ message: "Login realizado!" });
  }

  return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 });
}