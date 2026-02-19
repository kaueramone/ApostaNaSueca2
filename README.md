# ApostaNaSueca 🎴

Bem-vindo ao **ApostaNaSueca**, a plataforma moderna para jogar Sueca online com apostas reais, inspirada no design da Apple.

## 🚀 Funcionalidades

- **Autenticação Completa**: Login, Registo, Recuperação de Password.
- **Carteira Digital**: Depósitos via MB Way (simulado), Levantamentos, Histórico de Transações.
- **Jogo Multiplayer**:
  - Lobby em tempo real.
  - Mesas de Sueca com apostas variadas (1€ a 20€).
  - Lógica de jogo completa (distribuição, trunfo, jogadas, pontuação).
  - Realtime updates com Supabase.
- **Painel Administrativo**: Gestão de utilizadores e aprovação de saques.
- **PWA**: Instale no seu telemóvel como uma app nativa.

## 🛠️ Tecnologias

- **Frontend**: Next.js 14 (App Router), React, Tailwind CSS.
- **Backend**: Supabase (Database, Auth, Realtime).
- **Linguagem**: TypeScript.

## ⚙️ Configuração

1.  **Clonar o repositório**
2.  **Instalar dependências**:
    ```bash
    npm install
    ```
3.  **Configurar Variáveis de Ambiente**:
    Copie `.env.local.example` para `.env.local` e preencha as chaves do Supabase.
    ```bash
    cp .env.local.example .env.local
    ```
    Você precisa de criar um projeto no [Supabase](https://supabase.com) e obter a `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

4.  **Configurar Base de Dados**:
    Execute o script `src/lib/supabase/schema.sql` no SQL Editor do seu projeto Supabase para criar as tabelas e triggers.

5.  **Correr localmente**:
    ```bash
    npm run dev
    ```

## 📱 PWA

Para testar o PWA, faça o build de produção e inicie o servidor:
```bash
npm run build
npm start
```
Abra no navegador e clique no ícone de "Adicionar ao Ecrã Principal" (telemóvel) ou "Instalar" (Chrome desktop).

## 📄 Licença

Privado.
