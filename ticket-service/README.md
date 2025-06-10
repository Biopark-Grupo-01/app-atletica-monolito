# Microserviço de Tickets

Este é um microserviço responsável pelo gerenciamento de ingressos (tickets) da aplicação da Atlética.

## Funcionalidades

- Criação, leitura, atualização e exclusão de tickets (CRUD)
- Reserva de tickets
- Compra de tickets
- Cancelamento de tickets
- Consulta de tickets disponíveis por evento
- Consulta de tickets por usuário

## Tecnologias

- NestJS
- TypeORM
- PostgreSQL
- Docker

## Requisitos

- Docker e Docker Compose
- Node.js 18+ (para desenvolvimento local)

## Configuração

As configurações do microserviço são feitas através de variáveis de ambiente, que podem ser definidas no arquivo `.env`:

```
NODE_ENV=development
PORT=3002
DATABASE_HOST=ticket-postgres
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres123
DATABASE_NAME=ticket_service
MONOLITH_SERVICE_URL=http://localhost:3001
```

## Executando com Docker

```bash
# Iniciar o serviço
docker-compose up -d

# Verificar logs
docker-compose logs -f

# Parar o serviço
docker-compose down
```

## Endpoints da API

Todos os endpoints estão disponíveis com o prefixo `/api/tickets`.

### Tickets

- `GET /api/tickets` - Listar todos os tickets
- `GET /api/tickets/:id` - Obter um ticket específico
- `GET /api/tickets/event/:eventId` - Listar tickets de um evento
- `GET /api/tickets/event/:eventId/available` - Listar tickets disponíveis de um evento
- `GET /api/tickets/user/:userId` - Listar tickets de um usuário
- `POST /api/tickets` - Criar um novo ticket
- `PUT /api/tickets/:id` - Atualizar um ticket
- `DELETE /api/tickets/:id` - Excluir um ticket
- `POST /api/tickets/:id/reserve/:userId` - Reservar um ticket
- `POST /api/tickets/:id/purchase/:userId` - Comprar um ticket
- `POST /api/tickets/:id/cancel` - Cancelar um ticket

## Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Executar em modo de desenvolvimento
npm run start:dev

# Compilar o projeto
npm run build

# Executar em produção
npm run start:prod
```

## Comunicação com o Monolito

Este microserviço se comunica com o monolito principal para verificar a existência de usuários e eventos. A URL do monolito é configurada através da variável de ambiente `MONOLITH_SERVICE_URL`.