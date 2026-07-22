<div align="center">
  <h1>TaskFlow</h1>
  <p>Uma plataforma moderna e reativa para gestão de tarefas colaborativas.</p>
</div>

---

## 🌐 Acesse a Aplicação (Deploy)

O projeto está hospedado e disponível para testes:
*   **Frontend (Vercel):** [https://task-flow-sigma-sable.vercel.app/](https://task-flow-sigma-sable.vercel.app/)
*   **Backend / API Docs (Render):** [https://taskflow-gf79.onrender.com/api/docs](https://taskflow-gf79.onrender.com/api/docs)

**Credenciais de Teste:**
*   👑 **Administrador:** `admin@task.com` / `admin123`
*   👤 **Usuário Comum:** `user@task.com` / `user123`

---

## 📖 Sobre o Projeto

O **TaskFlow** é um sistema completo de gerenciamento de tarefas desenvolvido como resposta a um desafio técnico. A plataforma permite que equipes organizem fluxos de trabalho através de painéis Kanban, listas de tarefas pessoais e um dashboard gerencial.

O sistema possui **Controle de Acesso Baseado em Cargos (RBAC)**, onde Administradores possuem uma visão global e podem gerenciar usuários, enquanto Usuários Comuns possuem acesso focado apenas em suas próprias responsabilidades.

## 🚀 Funcionalidades Principais

*   **Painel Kanban Interativo**: Visualize e mova o status das suas tarefas utilizando o método Kanban.
*   **Gestão de Tarefas (CRUD)**: Crie, edite, exclua e atualize o status de tarefas.
*   **Anexos**: Faça upload de arquivos (imagens, documentos) diretamente nas tarefas.
*   **Filtros Avançados**: Filtre tarefas por status, prioridade ou até mesmo buscando por um usuário específico (Visão Admin).
*   **Gestão de Usuários (Admin)**: Administradores podem promover ou rebaixar outros membros da equipe.
*   **Dashboard de Métricas**: Acompanhamento de progresso e estatísticas das atividades cadastradas.
*   **Autenticação JWT**: Sistema de login e registro totalmente seguro utilizando criptografia via `bcrypt`.

---

## 🏗️ Arquitetura e Tecnologias

A aplicação foi dividida em dois ecossistemas robustos para garantir escalabilidade, manutenção facilitada e alta performance.

### Frontend (Angular 21)
O client-side foi desenvolvido utilizando a mais nova versão do Angular com componentes *Standalone* e a nova reatividade baseada em **Signals**.

*   **Padrão Arquitetural**: O projeto adota a **Feature-Driven Architecture (FDA)** para organização de diretórios (dividindo a aplicação em pastas altamente coesas como `auth` e `tasks`) aliada ao **Facade Pattern**. As lógicas de estado e regras de negócios foram extraídas dos componentes visuais e alocadas em `Facades` (ex: `TasksFacade`, `AuthFacade`), que gerenciam o fluxo de dados assíncrono com a API e atualizam os Signals de forma atômica e previsível.
*   **UI/UX**: Utilizamos a biblioteca **PrimeNG** integrada com um design system proprietário via SCSS, focado em _Glassmorphism_, responsividade (CSS Grid/Flexbox) e alta acessibilidade.
*   **Testes Unitários**: O ecossistema de testes roda com extrema rapidez utilizando **Vitest**, simulando injeções de dependências e comportamentos (Mocks) da comunicação HTTP e Regras de Negócios.

### Backend (NestJS)
O servidor foi modelado utilizando os pilares do NestJS (Modularidade, Injeção de Dependências e Decorators).

*   **Padrão Arquitetural**: **Repository Pattern** em conjunto com a camada de Serviço (`Controller -> Service -> Repository`). Isso isola completamente a lógica de manipulação do banco de dados das lógicas de validação de negócios.
*   **Banco de Dados**: Utilizamos o **Prisma ORM** por conta de sua tipagem estrita de ponta a ponta e facilidade em lidar com migrações de esquemas relacionais, modelando as entidades `User`, `Task` e `Attachment`.
*   **Segurança e Uploads**: Autenticação feita via validação de JWT nativa do ecossistema Nest e armazenamento de anexos em servidor utilizando o **Multer**.
*   **Testes Unitários**: Configuração completa utilizando **Jest** para atestar o funcionamento das permissões (`Guards`) e das regras de serviços (Restrição de visualização de tarefas cruzadas).

---

## ⚙️ Como rodar o projeto localmente

Você pode iniciar o projeto de forma facilitada via Docker ou configurar os ambientes manualmente.

### 🐳 Forma Facilitada (Docker)

Após clonar o repositório, basta:
1. Criar um arquivo `.env` na pasta `Backend` com a URL do seu banco de dados PostgreSQL:
   ```env
   DATABASE_URL="postgresql://usuario:senha@host:5432/taskflow?schema=public"
   ```
2. Rodar o comando na raiz do projeto:
   ```bash
   docker compose up --build -d
   ```
E tudo irá funcionar automaticamente! O Frontend estará em `http://localhost:4200` e a API em `http://localhost:3000`.

---

### 💻 Forma Manual (Sem Docker)

**Pré-requisitos:**
*   [Node.js](https://nodejs.org/en/) (versão 18+ recomendada)
*   [PostgreSQL](https://www.postgresql.org/) (Rodando localmente ou na nuvem)
*   Gerenciador de pacotes NPM.

### 1. Configurando o Backend (API)

Abra um terminal, navegue até a pasta `Backend` e instale as dependências:
```bash
cd Backend
npm install
```

Crie um arquivo `.env` na raiz da pasta `Backend` (você pode se basear em um `.env.example` se houver) e preencha as credenciais do seu banco e do JWT:
```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/taskflow?schema=public"
JWT_SECRET="sua-chave-super-secreta"
```

Gere os arquivos do Prisma e rode as migrações para criar as tabelas no banco de dados:
```bash
npx prisma generate
npx prisma migrate dev --name init
```

Por fim, inicie o servidor em ambiente de desenvolvimento:
```bash
npm run start:dev
```
O servidor estará rodando em `http://localhost:3000`.

### 2. Configurando o Frontend (UI)

Abra uma **nova janela do terminal**, navegue até a pasta `Frontend` e instale as dependências:
```bash
cd Frontend
npm install
```

Rode a aplicação:
```bash
npm run start
```
A interface do usuário ficará disponível em `http://localhost:4200`.

---

## 🧪 Como rodar os Testes Unitários

A aplicação conta com mais de **50 cenários de testes unitários** mapeando as regras críticas do sistema.

**Testes do Backend (Jest):**
```bash
cd Backend
npm run test
```

**Testes do Frontend (Vitest):**
```bash
cd Frontend
npm run test
```

---

## 🤖 Uso de Inteligência Artificial (Transparência)

Para acelerar o desenvolvimento do projeto, mantendo a qualidade e o foco na arquitetura, orquestrei ferramentas de IA em etapas estratégicas:

*   **Claude & Lovable (Scaffolding e Design):** Utilizei o Claude para analisar os requisitos do documento do desafio técnico e formular um prompt estruturado. Em seguida, utilizei a ferramenta **Lovable** recebendo esse prompt para gerar um protótipo inicial do Frontend. O código gerado serviu como um excelente ponto de partida e base de UI/UX (Design System) para a construção final do meu projeto.
*   **Gemini 3.1 Pro / Antigravity IDE (Pair Programming):** Toda a estruturação lógica do Backend (NestJS), construção da arquitetura, integração (Frontend/Backend), automação de testes e as configurações de Deploy em nuvem (Vercel e Render) foram feitas com o auxílio do Gemini 3.1 Pro. Ter a IA como ferramenta de pair-programming elevou a produtividade e permitiu focar nas regras de negócio exigidas pelo desafio.

---

## 👤 Primeiros Passos (Testando a aplicação)

1. Com ambos os serviços rodando, acesse `http://localhost:80`.
2. O primeiro usuário que for registrado na plataforma automaticamente receberá a permissão de **ADMINISTRADOR**.
3. Crie outras contas fictícias caso deseje testar a restrição de acesso e a dinâmica de gestão de cargos no "Painel de Admin".

---
*Desenvolvido com dedicação para o desafio técnico. Obrigado pela avaliação!*