# SGA - Projeto E-Sports

Plataforma para gerenciar campeonatos e eventos de e-sports.

## 🚀 Estrutura do Projeto

```
projeto/
├── frontend/              # Aplicação frontend
│   ├── index.html
│   ├── css/              # Estilos
│   ├── js/               # Scripts
│   ├── image/            # Imagens
│   └── webfonts/         # Fontes
├── backend/              # API Node.js
│   ├── server.js         # Servidor principal
│   ├── package.json      # Dependências
│   └── dockerfile        # Docker para backend
├── docker-compose.yml    # Orquestração de containers
├── .env.example          # Variáveis de ambiente
└── README.md
```

## 📋 Pré-requisitos

- Docker e Docker Compose
- Node.js 20+ (para desenvolvimento local sem Docker)
- PostgreSQL 16+ (para desenvolvimento local sem Docker)

## 🐳 Usando Docker Compose (Recomendado)

### 1. Configurar Variáveis de Ambiente

```bash
cp .env.example .env
```

Editar `.env` com suas credenciais:

```env
DB_USER=postgres
DB_PASSWORD=sua_senha
DB_NAME=sga_db
SESSION_SECRET=seu_secret_aqui
GOOGLE_CLIENT_ID=seu_id
GOOGLE_CLIENT_SECRET=seu_secret
EMAIL_USER=seu_email@gmail.com
EMAIL_PASS=sua_password
```

### 2. Iniciar os Serviços

```bash
docker-compose up -d
```

Isso irá:
- ✅ Criar e iniciar o banco PostgreSQL
- ✅ Criar e iniciar o servidor Node.js
- ✅ Conectar automaticamente frontend ao backend

### 3. Verificar Status

```bash
docker-compose ps
```

### 4. Ver Logs

```bash
docker-compose logs -f backend
docker-compose logs -f postgres
```

### 5. Parar os Serviços

```bash
docker-compose down
```

## 💻 Desenvolvimento Local (sem Docker)

### 1. Instalar Dependências

```bash
cd backend
npm install
```

### 2. Configurar PostgreSQL

```bash
# Linux/Mac
createdb sga_db
createuser postgres

# Windows (use pgAdmin ou psql)
```

### 3. Configurar Variáveis de Ambiente

```bash
cp .env.example .env
```

Editar `.env`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=sua_senha
DB_NAME=sga_db
```

### 4. Iniciar o Servidor

```bash
npm run dev
```

O servidor estará disponível em: `https://guilherme-sga-site.mduiqo.easypanel.host/`

## 📱 Frontend

O frontend está em `frontend/` e pode ser:

- **Servido pelo backend**: Configurado em `server.js` para servir arquivos estáticos
- **Desenvolvimento local**: Abrir `frontend/index.html` no navegador

## 🔐 Autenticação

- **Login Local**: Usuário/Email + Senha
- **Google OAuth**: Integrado com Google Sign-In
- **Recuperação de Senha**: Email com token de reset

## 📧 Email (Gmail)

Para usar a recuperação de senha:

1. Habilitar "Senhas de Aplicativos" na sua conta Google
2. Adicionar no `.env`:

```env
EMAIL_USER=seu_email@gmail.com
EMAIL_PASS=sua_app_password
```

## 🔄 Migrações (Banco de Dados)

Se precisar resetar o banco:

```bash
# Com Docker
docker-compose down -v
docker-compose up -d
```

As tabelas serão criadas automaticamente na primeira conexão.

## 🐛 Troubleshooting

### Porta 80 já em uso

```bash
# Mudar porta no docker-compose.yml ou .env
# Ou encerrar o processo usando a porta
```

### Erro de conexão PostgreSQL

```bash
# Verificar se o container está rodando
docker-compose ps

# Verificar logs
docker-compose logs postgres
```

### Erro de autenticação Google

- Verificar `GOOGLE_CLIENT_ID` e `GOOGLE_CLIENT_SECRET` no `.env`
- Certificar que a URL está configurada nas APIs do Google

## 📝 Scripts Úteis

```bash
# Backend
npm start           # Produção
npm run dev         # Desenvolvimento com nodemon

# Docker
docker-compose up -d      # Iniciar em background
docker-compose down       # Parar serviços
docker-compose rebuild    # Reconstruir imagens
```

## 🔗 Links Úteis

- Frontend: `https://guilherme-sga-site.mduiqo.easypanel.host/`
- Backend API: `https://guilherme-sga-site.mduiqo.easypanel.host/`
- Swagger/Docs: (não configurado ainda)

## 📄 Licença

ISC
