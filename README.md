# 🍩 Loop Donuts - E-commerce Serverless

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel)

**Loop Donuts** é uma aplicação de e-commerce *Fullstack Serverless* desenvolvida para uma loja de donuts artesanais. O projeto evoluiu de um MVP estático para uma plataforma robusta com catálogo dinâmico, carrinho de compras persistente e checkout integrado com pagamentos via Pix.

O objetivo principal é oferecer uma experiência de compra fluida e moderna (estilo **Neo-Brutalism**), permitindo que os clientes escolham seus sabores favoritos e realizem o pedido online, enquanto a administração possui um painel de controle em tempo real.

---

## 📑 Índice

- [🍩 Loop Donuts - E-commerce Serverless](#-loop-donuts---e-commerce-serverless)
  - [📑 Índice](#-índice)
  - [📂 Estrutura do Projeto](#-estrutura-do-projeto)
  - [🛠️ Stack Tecnológica](#️-stack-tecnológica)
  - [✨ Funcionalidades](#-funcionalidades)
    - [🛒 Cliente (Loja)](#-cliente-loja)
    - [👮 Administrativo (Backoffice)](#-administrativo-backoffice)
  - [🚀 Instalação e Configuração](#-instalação-e-configuração)
  - [🏗️ Arquitetura e Decisões Técnicas](#️-arquitetura-e-decisões-técnicas)
    - [📦 Carrinho e Persistência](#-carrinho-e-persistência)
    - [💳 Segurança no Checkout](#-segurança-no-checkout)
    - [🖼️ Estabilidade do Instagram](#️-estabilidade-do-instagram)
  - [👤 Autor](#-autor)

---

## 📂 Estrutura do Projeto

A organização do código segue as convenções do **Next.js (App Router)**:

* **src/app/**: Rotas da aplicação (Admin, API, Páginas Institucionais).
* **src/components/**: Componentes de UI reutilizáveis (NavBar, Footer, Hero).
* **src/context/**: Gerenciamento de estado global (CartContext).
* **src/models/**: Schemas do banco de dados (Mongoose/MongoDB).
* **public/instagram/**: Fotos locais para o carrossel estático (Estratégia Anti-Quebra).

---

## 🛠️ Stack Tecnológica

* **Frontend:** [Next.js 14](https://nextjs.org/), React, Tailwind CSS.
* **Backend:** Next.js API Routes (Serverless Functions).
* **Banco de Dados:** [MongoDB Atlas](https://www.mongodb.com/atlas) com Mongoose.
* **Pagamentos:** SDK do [Mercado Pago](https://www.mercadopago.com.br/) (Pix Transparente).
* **Hospedagem:** Vercel.

---

## ✨ Funcionalidades

### 🛒 Cliente (Loja)
* **Catálogo Dinâmico:** Produtos carregados em tempo real do banco de dados.
* **Carrinho Persistente:** Salvo no `localStorage` para não perder dados ao fechar a aba.
* **Checkout Pix:** Geração instantânea de QR Code e código "Copia e Cola".
* **Design Responsivo:** Otimizado para dispositivos móveis com paddings inteligentes.

### 👮 Administrativo (Backoffice)
* **Dashboard Financeiro:** Visão de faturamento total, ticket médio e volume de vendas.
* **Gestão de Pedidos:** Monitoramento e atualização manual de status (Pendente -> Pago -> Entregue).
* **Segurança:** Layout isolado para evitar sobreposição de elementos de navegação.

---

## 🚀 Instalação e Configuração

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/magnuzada/loop-donuts.git](https://github.com/magnuzada/loop-donuts.git)
    cd loop-donuts
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Variáveis de Ambiente (.env.local):**
    ```env
    MONGODB_URI=sua_string_de_conexao
    MP_ACCESS_TOKEN=seu_token_mercado_pago
    NEXT_PUBLIC_BASE_URL=http://localhost:3000
    ```

4.  **Inicie o servidor:**
    ```bash
    npm run dev
    ```

---

## 🏗️ Arquitetura e Decisões Técnicas

### 📦 Carrinho e Persistência
Utilizamos **React Context API** para o estado global e sincronização com o **LocalStorage**. Isso garante que a experiência do usuário não seja interrompida por recarregamentos de página.

### 💳 Segurança no Checkout
Os preços não são enviados pelo cliente. A API de checkout (`/api/checkout`) recebe apenas os IDs dos produtos e **recalcula todos os valores no servidor** consultando o banco de dados, evitando manipulações de preço no frontend.

### 🖼️ Estabilidade do Instagram
Optamos por uma **solução manual de carrossel** (imagens locais em `/public/instagram/`). Essa decisão técnica evita que mudanças súbitas na API do Meta quebrem o layout do site, garantindo 100% de *uptime* visual.

---

## 👤 Autor

Desenvolvido com 🍩 e ☕ por **Magnum Werneck Louzada**.