# 📁 Estrutura do Projeto - Vida no Prato

## Visão Geral

```
mvc/
├── 📄 app.js                    # Servidor principal Express
├── 📄 package.json              # Dependências e scripts
├── 📄 package-lock.json         # Lock das dependências
├── 📄 .env.example              # Variáveis de exemplo
├── 📄 .gitignore                # Arquivos ignorados pelo git
├── 📚 README.md                 # Documentação principal
├── 📚 API.md                    # Documentação de rotas/API
├── 📚 CONTRIBUTING.md           # Guia de contribuição
├── 📚 ESTRUTURA.md              # Este arquivo
├── 📁 src/                      # Código fonte da aplicação
│   ├── 📁 config/               # Configurações
│   │   ├── banco-dados.js       # Pool de conexão MySQL
│   │   ├── upload.js            # Configuração Multer
│   │   └── logger.js            # Utilidades de log
│   │
│   ├── 📁 models/               # Modelos de dados
│   │   ├── categoria.js         # Modelo de categorias
│   │   ├── dataModel.js         # Dados de exemplo
│   │   ├── itemPedido.js        # Modelo de itens de pedido
│   │   ├── pedido.js            # Modelo de pedidos
│   │   ├── produto.js           # Modelo de produtos
│   │   ├── usuario.js           # Modelo de usuários
│   │   └── userModel.js         # (Legacy) Modelo anterior
│   │
│   ├── 📁 controllers/          # Lógica de controle
│   │   ├── categoriaController.js
│   │   ├── homeController.js
│   │   ├── pedidoController.js
│   │   ├── produtoController.js
│   │   └── usuarioController.js
│   │
│   ├── 📁 routes/               # Definição de rotas
│   │   ├── index.js             # Importador de rotas
│   │   ├── admin.js             # Rotas do painel admin
│   │   ├── auth.js              # Rotas de autenticação
│   │   ├── categorias.js        # Rotas de categorias
│   │   ├── checkout.js          # Rotas de checkout
│   │   ├── colaborador.js       # Rotas de colaborador
│   │   ├── home.js              # Rotas da home
│   │   ├── pedido.js            # Rotas de pedidos
│   │   └── produtos.js          # Rotas de produtos
│   │
│   ├── 📁 public/               # Arquivos estáticos
│   │   ├── 📁 css/              # Estilos CSS
│   │   │   ├── vida-no-prato.css    # Estilos principais
│   │   │   ├── painel-admin.css     # Estilos do painel
│   │   │   └── about.css            # Estilos da página about
│   │   │
│   │   ├── 📁 js/               # Scripts JavaScript
│   │   │   └── script.js        # Script principal (frontend)
│   │   │
│   │   └── 📁 images/           # Imagens
│   │       └── 📁 uploads/      # Imagens enviadas
│   │
│   └── 📁 views/                # Templates EJS
│       ├── index.ejs            # Página inicial
│       ├── about.ejs            # Página sobre
│       ├── admin.ejs            # Painel administrativo
│       ├── categories.ejs       # Página de categorias
│       ├── checkout.ejs         # Página de checkout
│       ├── pedidos.ejs          # Histórico de pedidos
│       ├── usuario.ejs          # Perfil do usuário
│       ├── rastreio.ejs         # Rastreio de pedidos
│       ├── pix.ejs              # Pagamento PIX
│       ├── perfil-colaborador.ejs # Perfil do colaborador
│       ├── 404.ejs              # Página 404
│       ├── error.ejs            # Página de erro
│       └── 📁 partials/         # Componentes reutilizáveis
│           └── modals.ejs       # Modais (login, etc)
│
└── 📁 .git/                     # Repositório Git
```

## 📊 Fluxo de Dados

```
Request HTTP
    ↓
routes/ (Roteamento)
    ↓
controllers/ (Lógica)
    ↓
models/ (Acesso aos dados)
    ↓
views/ (Renderização EJS)
    ↓
Response HTML/JSON
```

## 🔄 Fluxo de Autenticação

```
Usuário Public
├── Email + Senha
├── POST /auth/register (novo usuário)
├── POST /auth/login (login)
└── Acesso: Home, Categorias, Checkout, Pedidos

Colaborador (Estabelecimento)
├── CNPJ + Senha
├── POST /auth/register (novo estabelecimento)
├── POST /auth/login-collaborator (login)
└── Acesso: Painel Admin, Perfil, Gerenciar Produtos
```

## 🗄️ Banco de Dados

### Tabelas Principais

**usuarios**
- id, nome, email, telefone, cnpj, senha, nota, descricao_estabelecimento

**produtos**
- id, nome, preco, categoria_id, emoji, imagem, descricao

**categorias**
- id, nome, slug, emoji, descricao

**pedidos**
- id, usuario_id, status, data_criacao, valor_total

**item_pedido**
- id, pedido_id, produto_id, quantidade, preco_unitario

## 🚀 Como Usar

### Iniciar o servidor
```bash
npm run dev          # Desenvolvimento com nodemon
npm start            # Produção com node
```

### Acessar a aplicação
```
http://localhost:3003
```

### Painel de Colaborador
```
http://localhost:3003/admin
```

### Perfil de Colaborador
```
http://localhost:3003/colaborador/perfil/:id
```

## 📝 Padrões de Código

### Nomes de Arquivos
- Controllers: `nomeController.js`
- Models: `nome.js`
- Routes: `nome.js`
- Views: `nome.ejs`

### Estrutura de Função
```javascript
/**
 * Descrição breve
 * @param {type} param - Descrição
 * @returns {type} Retorno
 */
function minhaFuncao(param) {
  // implementação
}
```

### Estrutura de Rota
```javascript
const express = require('express');
const router = express.Router();

// ============================================================
// ROTA DESCRIÇÃO
// ============================================================
router.get('/path', (req, res) => {
  // lógica
});

module.exports = router;
```

## 🔒 Segurança

- Senhas hashadas com bcryptjs
- Validação de entrada no backend
- Escape de dados em templates EJS
- CORS e validações apropriadas

## 📚 Documentação Adicional

- **README.md** - Visão geral e setup
- **API.md** - Endpoints e rotas
- **CONTRIBUTING.md** - Guia de desenvolvimento
- **.env.example** - Variáveis de ambiente

---

**Última atualização**: Novembro 2025
**Versão**: 1.0.0

### 📊 **Model** (`src/models/`)
- Gerencia dados da aplicação
- Simula banco de dados com variáveis
- Fornece métodos para acessar dados
- Validação de dados

### 👁️ **View** (`src/views/`)
- Templates EJS dinâmicos
- Apresentação dos dados
- Interface do usuário
- Layout responsivo

### 🌐 **Public** (`src/public/`)
- Arquivos estáticos (CSS, JS, imagens)
- Servidos diretamente pelo Express
- Estilos e interatividade frontend

## 🔄 Fluxo de Dados

```
1. 🌐 Requisição HTTP → app.js
2. 🛣️ app.js → Routes (roteamento)
3. 🎮 Routes → Controller
4. 📊 Controller → Model (busca dados)
5. 👁️ Controller → View (renderiza template)
6. 🌐 Response HTML → Cliente
```

## 🚀 Vantagens da Estrutura /src + Routes

- ✅ **Organização**: Código fonte separado da configuração
- ✅ **Escalabilidade**: Fácil adição de novos módulos e rotas
- ✅ **Manutenibilidade**: Estrutura clara e previsível
- ✅ **Padrões**: Seguindo boas práticas da indústria
- ✅ **Build**: Preparado para ferramentas de build
- ✅ **Deploy**: Facilita processo de deployment
- ✅ **Modularidade**: Rotas organizadas por funcionalidade
- ✅ **Separação de responsabilidades**: Cada camada com sua função