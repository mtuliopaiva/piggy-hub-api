# Piggy Hub API

<p align="center">
  API REST para gerenciamento de finanças pessoais com suporte a categorias de gastos, perfil de usuário e auditoria de operações.
</p>

---

## 📋 Descrição do Projeto

**Piggy Hub API** é uma aplicação backend desenvolvida para gerenciar transações financeiras pessoais. A API permite que os usuários criem contas, façam login, gerenciem seu perfil, categorias de gastos e registrem transações de receita e despesa.

A aplicação implementa um sistema robusto de:
- **Autenticação e Autorização** com JWT e sistema de roles/permissions
- **Auditoria** - rastreamento de todas as operações do sistema
- **Logs de Eventos** - registro de erros e eventos importantes
- **Soft Delete** - exclusão lógica de dados

---

## 🎯 Objetivo do Projeto

Fornecer uma plataforma segura e escalável para:
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

### Qualidade de Código
- **ESLint** - Linting
- **Prettier** - Formatação
- **Jest** - Testes

---

## 📚 Endpoints Existentes

### 🔐 **Autenticação** (`/api/auth`)

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| `POST` | `/auth/register` | Registrar novo usuário | ❌ |
| `POST` | `/auth/login` | Fazer login | ❌ |
| `POST` | `/auth/forgot-password` | Solicitar reset de senha | ❌ |
| `POST` | `/auth/reset-password` | Resetar senha com token | ❌ |

**Schemas:**
- `AuthRegisterDto` - email, password
- `AuthLoginDto` - email, password
- `ForgotPasswordDto` - email
- `ResetPasswordDto` - token, newPassword

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

**Modelos:**
- `User` - uuid, email, password, type (ADMIN/USER), createdAt, updatedAt, deletedAt
- `UserProfile` - name, birthDate, avatarUrl

**Query Parameters:**
- `search` - Buscar por email (endpoint GET /users)

---

### 📂 **Categorias** (`/api/categories`)

| Método | Endpoint | Descrição | Autenticação | Permissão |
|--------|----------|-----------|--------------|-----------|
| `GET` | `/categories` | Listar categorias | 🔒 JWT | ✅ |

**Modelos:**
- `Category` - uuid, name, description

**Query Parameters:**
- `search` - Buscar por name ou description

**Categorias Padrão (Seed):**
- Food, Transport, Rent, Health, Entertainment, Education, Salary, Freelance, Investment, Others

---

### 📊 **Transações** (Em Desenvolvimento)

> Endpoints de transações ainda não foram implementados na estrutura atual.

**Modelos:**
- `Transaction` - uuid, title, amount, type (INCOME/EXPENSE), date, userUuid, categoryUuid

---

### 📝 **Auditoria** (`/api/audits`)

| Método | Endpoint | Descrição | Autenticação | Permissão |
|--------|----------|-----------|--------------|-----------|
| `GET` | `/audits` | Listar auditorias | 🔒 JWT | `audits.read` |
| `GET` | `/audits/:uuid` | Obter auditoria por ID | 🔒 JWT | `audits.read` |

**Modelos:**
- `Audit` - uuid, actorUuid, actorEmail, action, entity, entityUuid, oldData, newData, metadata, createdAt

---

### 📋 **Logs de Eventos** (`/api/event-logs`)

> Endpoints para logs de eventos disponíveis para consulta.

**Modelos:**
- `EventLog` - uuid, level, message, context, stack, metadata, createdAt

---

## 🚀 Como Rodar o Projeto

### Pré-requisitos

- **Node.js** ^22.0
- **npm** ou **yarn**
- **PostgreSQL** 12+

### 1️⃣ Instalação de Dependências

```bash
npm install
