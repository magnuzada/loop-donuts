import { NextResponse } from "next/server";
import { SignJWT } from "jose";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password } = body;

    // Pega a senha do ambiente (Vercel)
    const envPassword = process.env.ADMIN_PASSWORD;

    // --- ÁREA DE DEBUG (Vai aparecer nos logs da Vercel) ---
    console.log("Tentativa de Login:");
    console.log("1. Senha que o usuário digitou:", password ? "**** (Recebida)" : "NADA (Vazia)");
    console.log("2. Senha configurada na Vercel:", envPassword ? "**** (Configurada)" : "NÃO ENCONTRADA (NULL)");
    console.log("3. Tamanho da senha digitada:", password?.length);
    console.log("4. Tamanho da senha Vercel:", envPassword?.length);
    // -------------------------------------------------------

    if (!envPassword) {
      return NextResponse.json({ error: "Erro de Configuração: Senha não definida no servidor" }, { status: 500 });
    }

    if (password === envPassword) {
      // Cria o Token (Cookie)
      const secret = new TextEncoder().encode(envPassword);
      const token = await new SignJWT({ role: "admin" })
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("2h")
        .sign(secret);

      const response = NextResponse.json({ success: true });

      response.cookies.set("admin_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
      });

      return response;
    }

    return NextResponse.json({ error: "Senha incorreta" }, { status: 401 });
  } catch (error) {
    console.error("Erro no login:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}