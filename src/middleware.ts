import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Define que estamos protegendo tudo que começa com /admin
  const isPrivatePath = path.startsWith('/admin');
  
  // Mas a página de Login (/admin/login) tem que ser pública, senão ninguém entra!
  const isPublicPath = path === '/admin/login';

  // Recupera o "crachá" (Cookie)
  const token = request.cookies.get('admin_token')?.value;

  // REGRA: Se é rota privada, não é a tela de login e não tem token -> Manda pro Login
  if (isPrivatePath && !isPublicPath && !token) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  // Se já tem token e tenta ir pro login, manda direto pro painel
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/admin/orders', request.url));
  }

  return NextResponse.next();
}

// Configuração: Onde esse middleware deve rodar?
export const config = {
  matcher: ['/admin/:path*'],
};