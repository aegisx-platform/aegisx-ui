# GEMINI.md - AegisX Starter

## Project Overview

This is a production-ready monorepo starter template for a full-stack application. It uses Angular for the frontend, Fastify for the backend, and PostgreSQL and Redis for the database and caching layers, respectively. The project is built with Nx and uses `pnpm` for package management.

The application features a comprehensive Role-Based Access Control (RBAC) system, a CRUD generator, real-time features with WebSockets, a bulk import system, and more.

**Key Technologies:**

- **Frontend:** Angular, Angular Material, TailwindCSS
- **Backend:** Fastify, TypeBox, Knex.js
- **Database:** PostgreSQL, Redis
- **Build System:** Nx
- **Package Manager:** pnpm

## Building and Running

### Prerequisites

- Node.js (>=22.0.0)
- pnpm (>=10.0.0)
- Docker

### Setup

1.  **Install dependencies:**

    ```bash
    pnpm install
    ```

2.  **Set up the environment and start services:**
    ```bash
    pnpm run setup
    ```
    This command will:
    - Set up environment variables.
    - Start PostgreSQL and Redis in Docker.
    - Run database migrations.
    - Seed the database.

### Development

- **Start all development servers (API, web, admin):**

  ```bash
  pnpm run dev:all
  ```

- **Start API server only:**

  ```bash
  pnpm run dev:api
  ```

- **Start web app only:**
  ```bash
  pnpm run dev:web
  ```

### Building

- **Build all applications:**

  ```bash
  pnpm run build
  ```

- **Build for production:**
  ```bash
  pnpm run build:prod
  ```

### Testing

- **Run all tests:**

  ```bash
  pnpm run test
  ```

- **Run unit tests:**

  ```bash
  pnpm run test:unit
  ```

- **Run integration tests:**

  ```bash
  pnpm run test:integration
  ```

- **Run end-to-end tests:**
  ```bash
  pnpm run test:e2e
  ```

## Development Conventions

- **Package Manager:** This project uses `pnpm`. Do not use `npm` or `yarn`.
- **Monorepo:** The project is structured as a monorepo using Nx.
- **Commits:** Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.
- **CRUD Generation:** A built-in CRUD generator is available to quickly scaffold new features. Use `pnpm crud --help` for more information.
- **Environment Variables:** Environment variables are managed with `.env` files. A `.env.example` file is provided as a template.
- **Database Migrations:** Database schema changes are managed with Knex.js migrations.
- **API-First Workflow:** The recommended development approach is to start with the API definition and then implement the frontend.
