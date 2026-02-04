# 🏗️ Arquitetura do Projeto (v2.0)

Este documento registra as decisões arquiteturais adotadas para a evolução do **Loop Donuts** de um MVP estático para uma aplicação Fullstack Serverless.

## 1. Visão Geral da Mudança
Migramos de uma arquitetura **Client-Side (Local Storage + WhatsApp)** para uma arquitetura **Serverless Fullstack**.
* **Antes:** O carrinho vivia apenas no navegador do usuário e o checkout era manual via WhatsApp.
* **Agora:** O carrinho persiste no navegador, mas o checkout é processado via API, com persistência em banco de dados e integração de pagamento real.

## 2. Stack Tecnológica
A escolha visa manter o ecossistema unificado, reduzindo a complexidade de manutenção e custos fixos.

* **Frontend & Backend:** [Next.js](https://nextjs.org/) (App Router)
    * *Frontend:* React Server Components + Client Components.
    * *Backend:* Next.js API Routes (Serverless Functions).
* **Banco de Dados:** [MongoDB Atlas](https://www.mongodb.com/atlas)
    * *Motivo:* Armazenamento nativo de JSON (ideal para estrutura de produtos/pedidos) e excelente tier gratuito.
    * *ODM:* Mongoose.
* **Pagamentos:** [Mercado Pago](https://www.mercadopago.com.br/)
    * *Método:* Pix Transparente (SDK Oficial).
    * *Confirmação:* Webhooks para atualização de status em tempo real.
* **Hospedagem:** [Vercel](https://vercel.com/)

## 3. Fluxo de Dados (Data Flow)
1.  **Carrinho:** Gerenciado via Context API (`CartContext`) no Client-Side.
2.  **Checkout:** O Frontend envia o payload do carrinho para `/api/checkout`.
3.  **Processamento:** A API valida os valores no servidor (segurança), cria o registro no MongoDB (`status: pending`) e solicita o Pix ao Mercado Pago.
4.  **Confirmação:** O usuário paga no banco -> Mercado Pago notifica `/api/webhook` -> API atualiza MongoDB (`status: paid`).

## 4. ⚠️ Pontos de Atenção e Riscos (Risk Management)

### Limites e Custos (Free Tier)
* **Vercel:** Atenção aos limites de *Serverless Function Execution Time* (10s no plano Hobby) e largura de banda. Se o tráfego explodir, migração para Pro será necessária.
* **MongoDB Atlas:** O plano gratuito (M0 Sandbox) oferece ~512MB. Suficiente para milhares de pedidos de texto, mas exige monitoramento. *Ação:* Não armazenar imagens (Base64) no banco, apenas URLs.

### Segurança
* **Credenciais:** Nenhuma chave de API (MongoDB URI, MP Access Token) será "hardcoded". Uso estrito de Variáveis de Ambiente (`.env.local` e Vercel Environment Variables).
* **Validação:** O preço dos produtos será recalculado no Backend para evitar manipulação de payload pelo cliente.
* **Webhooks:** Implementar validação de assinatura para garantir que a notificação veio realmente do Mercado Pago.

### Escalabilidade Futura
* Em caso de hiper-escala, a arquitetura permite desacoplar o Backend (API) para um microsserviço Node.js dedicado sem quebrar o Frontend.
* Implementação futura de Cache (Redis) para catálogo de produtos.

---
*Documento atualizado em: Fevereiro/2026*