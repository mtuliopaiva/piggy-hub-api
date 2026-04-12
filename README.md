# Piggy Hub API

<p align="center">
  API REST para gerenciamento de finanças pessoais com suporte a categorias de gastos, perfil de usuário e auditoria de operações.
</p>

---

## 📋 Descrição do Projeto

**Piggy Hub API** é uma aplicação backend desenvolvida para gerenciar transações financeiras pessoais. A API permite que os usuários criem contas, façam login, gerenciem seu perfil, categorias de gastos e registrem transações de receita e despesa.
---

## 🎯 Objetivo do Projeto

Fornecer uma plataforma para:
1. Gerenciar contas de usuários com perfis personalizados
2. Categorizar e registrar transações de receita e despesa
3. Manter histórico completo de todas as operações (auditoria)
4. Controlar permissões baseadas em roles (Admin/User)
5. Registrar eventos e erros do sistema

---

## 🛠️ Tecnologias Utilizadas

### Backend
- **NestJS** ^11.0.1 - Framework Node.js
- **TypeScript** - Linguagem de programação
- **PostgreSQL** - Banco de dados
- **Prisma** 6.5.0 - ORM

### Autenticação & Segurança
- **JWT** (@nestjs/jwt ^11.0.2)
- **Passport** ^0.7.0 with JWT Strategy
- **bcrypt** ^6.0.0 - Hash de senhas

### Padrões & Arquitetura
- **CQRS Pattern** (@nestjs/cqrs ^11.0.3)
- **Swagger** (@nestjs/swagger ^11.2.5) - Documentação API
- **Class Validator** ^0.14.3 - Validação de DTOs
- **Class Transformer** ^0.5.1 - Transformação de dados

### Notificações
- **Nodemailer** ^8.0.5 - Envio de emails

---

## 📚 Endpoints Existentes

### 🔐 **Autenticação** (`/api/auth`)

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| `POST` | `/auth/register` | Registrar novo usuário | ❌ |
| `POST` | `/auth/login` | Fazer login | ❌ |
| `POST` | `/auth/forgot-password` | Solicitar reset de senha | ❌ |
| `POST` | `/auth/reset-password` | Resetar senha com token | ❌ |
---

### 👥 **Usuários** (`/api/users`)

| Método | Endpoint | Descrição | Autenticação | Permissão |
|--------|----------|-----------|--------------|-----------|
| `GET` | `/users` | Listar usuários | 🔒 JWT | `users.read` |
| `GET` | `/users/me` | Obter perfil do usuário logado | 🔒 JWT | `users.read` |
| `GET` | `/users/:uuid` | Obter usuário por ID | 🔒 JWT | `users.read` |
| `PATCH` | `/users/me/update` | Atualizar perfil do usuário | 🔒 JWT | `users.update` |
| `PATCH` | `/users/:uuid` | Atualizar usuário | 🔒 JWT | `users.update` |
| `DELETE` | `/users/:uuid` | Deletar usuário (soft delete) | 🔒 JWT | `users.delete` |
| `POST` | `/users/:uuid/restore` | Restaurar usuário deletado | 🔒 JWT | `users.restore` |
---

### 📂 **Categorias** (`/api/categories`)

| Método | Endpoint | Descrição | Autenticação | Permissão |
|--------|----------|-----------|--------------|-----------|
| `GET` | `/categories` | Listar categorias | 🔒 JWT | ✅ |
---

### 📝 **Auditoria** (`/api/audits`)

| Método | Endpoint | Descrição | Autenticação | Permissão |
|--------|----------|-----------|--------------|-----------|
| `GET` | `/audits` | Listar auditorias | 🔒 JWT | `audits.read` |
| `GET` | `/audits/:uuid` | Obter auditoria por ID | 🔒 JWT | `audits.read` |
---

### 📋 **Logs de Eventos** (`/api/eventLogs`)

| Método | Endpoint | Descrição | Autenticação | Permissão |
|--------|----------|-----------|--------------|-----------|
| `GET` | `/eventLogs` | Listar logs de eventos | 🔒 JWT | `logs.read` |
| `GET` | `/eventLogs/:uuid` | Obter log por ID | 🔒 JWT | `logs.read` |
---

## 🚀 Como Rodar o Projeto

### Pré-requisitos

- Node.js ^22.0
- PostgreSQL 12+
- npm ou yarn

### 1. Instalar Dependências

```bash
npm install

### 2. Configurar Variáveis de Ambiente
### 3. Criar Banco de Dados
### 4. Executar Migrações
### 5. Popular com as Seeds

