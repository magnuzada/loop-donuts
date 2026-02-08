d:\Trabalho\Projetos\loja-donuts\web\PROJECT_STATUS.md
```markdown
# 🍩 Loop Donuts - Status do Projeto & Documentação Técnica

> **Última atualização:** Fevereiro/2026
> **Status:** Em desenvolvimento (v2.0 - Arquitetura Serverless)

Este documento serve como a "Fonte da Verdade" técnica do projeto, documentando a stack, arquitetura e padrões de design implementados até o momento.

---

## 1. 🛠️ Stack Tecnológica Confirmada

Baseado na análise do `package.json`:

*   **Core & Framework:**
    *   Next.js `14.1.0` (App Router)
    *   React `^18`
    *   TypeScript `^5`
*   **Estilização & UI:**
    *   Tailwind CSS `^3.4.1`
    *   Framer Motion `^12.33.0` (Animações)
    *   Lucide React `^0.344.0` (Ícones)
*   **Dados & Backend:**
    *   Mongoose `^9.1.6` (ODM para MongoDB)

---

## 2. 📂 Arquitetura de Pastas (App Router)

A estrutura segue o padrão do Next.js 14 App Router, organizando lógicas de cliente e servidor.

*   `src/app`: Rotas da aplicação.
    *   `/menu`: Página de listagem de produtos (`MenuClient.tsx` - Client Component).
    *   `/api`: Rotas de API Serverless (Backend).
*   `src/components`: Componentes de UI reutilizáveis.
    *   `AboutSection.tsx`, `SocialSection.tsx`: Seções da Landing Page.
    *   `Shop.tsx`: Lógica de vitrine e carrinho.
    *   `ProductCard.tsx`: Card de exibição de produto.
*   `src/context`: Gerenciamento de estado global.
    *   `CartContext.tsx`: Contexto do carrinho de compras (Persistência em LocalStorage).
*   `src/models`: Modelos de dados (Schemas do Mongoose).

---

## 3. 🗄️ Banco de Dados & Schema

O projeto utiliza **MongoDB** com **Mongoose**. O modelo principal identificado é `Product`.

### Produto (`src/models/Product.ts`)

| Campo | Tipo | Obrigatório | Padrão | Descrição |
| :--- | :--- | :---: | :---: | :--- |
| `name` | String | Sim | - | Nome do donut/produto. |
| `description` | String | Sim | - | Descrição detalhada. |
| `image` | String | Sim | - | URL da imagem do produto. |
| `sku` | String | Não | - | Código único (Sparse/Unique). |
| `status` | Enum | - | `active` | `active`, `inactive`, `draft`. |
| `stock` | Number | Sim | `0` | Quantidade em estoque. |
| `minStock` | Number | - | `5` | Alerta de estoque baixo. |
| `price` | Number | Sim | - | Preço de venda atual. |
| `discountPrice` | Number | Não | - | Preço promocional. |
| `category` | String | Sim | - | Categoria principal (ex: Bebidas). |
| `tags` | [String]| - | `[]` | Tags flexíveis (ex: Sem açúcar). |
| `isNewArrival` | Boolean| - | `false` | Flag para lançamentos. |

*Timestamps (`createdAt`, `updatedAt`) são gerados automaticamente.*

---

## 4. 🔌 API Endpoints

Rotas de API identificadas através da análise de chamadas no frontend (`fetch`) e documentação de arquitetura:

*   **Checkout**
    *   `POST /api/checkout`
    *   **Uso:** Iniciado em `Shop.tsx`.
    *   **Payload:** `{ cart: CartItem[], customerName: string }`
    *   **Retorno:** Gera um pedido e retorna o payload do Pix (QR Code).

*   **Webhooks**
    *   `POST /api/webhook` (Referenciado em `ARCHITECTURE.md`)
    *   **Uso:** Recebimento de notificações de pagamento do Mercado Pago.

---

## 5. 🎨 Design System (Tailwind Config)

A identidade visual está codificada no `tailwind.config.js` com os seguintes tokens:

### Cores da Marca
*   🟠 **Brand (Principal):** `#FE6100` (Laranja Loop)
    *   `bg-brand`, `text-brand`
*   🍦 **Brand Light:** `#FFF0E5` (Creme suave)
    *   `bg-brand-light`

### Cores de Ação (CTA)
*   🟡 **Secondary / CTA:** `#FFBD03` (Amarelo)
    *   `bg-cta`, `bg-secondary`
*   **CTA Hover:** `#E5A900`
    *   `hover:bg-cta-hover`

### Superfícies & Formas
*   ⚪ **Paper:** `#FFFFFF`
*   **Border Radius:**
    *   `rounded-card`: `16px`
    *   `rounded-btn`: `12px`
    *   `rounded-pill`: `9999px` (Pílula completa)

---
*Documento gerado automaticamente via Engenharia Reversa em Fevereiro/2026.*
