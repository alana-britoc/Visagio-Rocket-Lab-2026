
# Sistema de Gerenciamento de E-commerce | Rocket Lab 2026

Aplicação Fullstack desenvolvida para o processo seletivo **Rocket Lab 2026 (Visagio)**. O sistema é uma plataforma de gestão estratégica de inventário que integra um backend assíncrono em Python com uma interface de alta fidelidade em React, focada em análise de performance e experiência do usuário (UX).

## 🛠 Especificações Técnicas

### Backend
* **FastAPI:** Framework moderno e assíncrono para construção de APIs de alta performance.
* **SQLAlchemy & Alembic:** ORM para manipulação de dados e sistema de migrações para controle de versão do banco.
* **PostgreSQL/SQLite:** Persistência de dados robusta com suporte a relacionamentos complexos.
* **Service Pattern:** Lógica de negócio isolada em serviços, garantindo o desacoplamento das rotas.

### Frontend
* **React 19 + TypeScript:** Tipagem estática para maior segurança e previsibilidade no desenvolvimento.
* **Tailwind CSS:** Estilização utilitária com foco em design moderno (Glassmorphism).
* **React Query:** Gerenciamento de estado de servidor e cache inteligente.
* **PNPM:** Gerenciador de pacotes otimizado para maior velocidade e economia de espaço em disco.

---

## 🏗️ Decisões de Arquitetura & Diferenciais

* **Segurança e Comunicação:** Implementação de Proxy reverso via Vite para mitigação de políticas de CORS e abstração da URL base da API no frontend.
* **Normalização de Ativos:** Sistema de tratamento de strings para mapeamento dinâmico de categorias, garantindo a exibição de imagens estáveis via Unsplash API sem falhas de carregamento (404).
* **UX Crítica:** Utilização de componentes de alerta (AlertDialog) para operações destrutivas e modais de feedbacks amigáveis para o usuário.
* **Performance do Banco:** Criação de índices específicos via Alembic para otimização de consultas de performance e métricas de vendas.

---

## 📂 Estrutura do Repositório

```text
├── backend
│   ├── app
│   │   ├── routers/       # Endpoints e controle de requisições
│   │   ├── schemas/       # Contratos de dados (Pydantic)
│   │   ├── services/      # Camada de lógica de negócio pura
│   │   └── main.py        # Inicialização e configuração da API
│   ├── alembic/           # Scripts de versionamento do banco
│   └── requirements.txt   # Dependências do ambiente Python
│
├── frontend
│   ├── src/
│   │   ├── components/    # Componentes de UI modulares
│   │   ├── hooks/         # Hooks customizados para consumo de API
│   │   ├── pages/         # Visões principais (Dashboard/Catálogo)
│   │   └── data/          # Mapeamentos e constantes estáticas
│   ├── package.json
│   └── vite.config.ts     # Configuração de build e Proxy reverso
└── README.md
```

---

## 🚀 Procedimentos de Execução

### 1. Clonagem e Configuração Base
```bash
git clone https://github.com/alana-britoc/Visagio-Rocket-Lab-2026.git
cd Visagio-Rocket-Lab-2026
```

### 2. Ambiente de Backend (Python)
```bash
cd backend
python -m venv venv
# Ativação: .\venv\Scripts\activate (Windows) ou source venv/bin/activate (Linux/Mac)
pip install -r requirements.txt
uvicorn app.main:app --reload
```
Acesse a documentação Swagger em: `http://127.0.0.1:8000/docs`

### 3. Ambiente de Frontend (React)
```bash
cd frontend
pnpm install
pnpm dev
```
Acesse a aplicação em: `http://localhost:5173`

---

## 🔌 Endpoints de API (Documentação Resumida)

| Método | Endpoint | Objetivo |
| :--- | :--- | :--- |
| **GET** | `/produtos` | Listagem com filtros de performance e preço. |
| **GET** | `/produtos/{id}` | Busca detalhada e métricas de avaliação. |
| **POST** | `/produtos` | Cadastro de novos itens no inventário. |
| **PUT** | `/produtos/{id}` | Atualização completa de dados cadastrais. |
| **DELETE** | `/produtos/{id}` | Remoção segura de registros do sistema. |

---

## 📈 Roadmap de Evolução
* [ ] Implementação de Testes Unitários e de Integração (Pytest/Vitest).
* [ ] Autenticação de usuários via JWT.
* [ ] Dockerização da aplicação para deploy padronizado.
* [ ] Implementação de Skeletons para otimização da performance percebida.

---
**Desenvolvido por Alana Brito**
*Engenharia de Software - UPE Campus Garanhuns*
