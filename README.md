# African Estates

A full-stack real estate application built with React, Express, and PostgreSQL.

## Project Overview

African Estates is a modern real estate application featuring:

- React frontend with Tailwind CSS and Radix UI components
- Node.js/Express backend API
- PostgreSQL database with Drizzle ORM
- Authentication with Passport.js
- WebSocket support for real-time features

## Prerequisites

- [Docker](https://www.docker.com/get-started) and Docker Compose
- [Node.js](https://nodejs.org/) v18 or later (for local development without Docker)
- [Git](https://git-scm.com/)

## Quick Start with Docker

The easiest way to run the application is using Docker Compose:

1. Clone the repository:
   ```bash
   git clone https://github.com/kserge2001/AfricanEstates.git
   cd AfricanEstates
   ```

2. Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```

3. Start the application in development mode:
   ```bash
   docker-compose up
   ```

4. Access the application at http://localhost:3000

## Development Environment Setup

### Using Docker (Recommended)

Development mode includes hot-reloading and automatic database migrations:

```bash
# Start development environment
docker-compose up

# Rebuild if you've made changes to Dockerfile
docker-compose up --build

# Run in detached mode
docker-compose up -d

# Stop the application
docker-compose down
```

### Local Development (Without Docker)

If you prefer to run the application without Docker:

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up PostgreSQL database and update `.env` with your connection string

3. Run database migrations:
   ```bash
   npm run db:push
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Production Deployment

### Using Docker

1. Create and configure the `.env` file with production settings:
   ```
   NODE_ENV=production
   POSTGRES_USER=your_db_user
   POSTGRES_PASSWORD=your_secure_password
   POSTGRES_DB=african_estates
   ```

2. Start the application in production mode:
   ```bash
   NODE_ENV=production docker-compose up -d
   ```

3. The application will run in production mode with optimized builds.

### Manual Deployment

1. Install production dependencies:
   ```bash
   npm ci --production
   ```

2. Build the application:
   ```bash
   npm run build
   ```

3. Start the production server:
   ```bash
   NODE_ENV=production DATABASE_URL=your_database_url npm start
   ```

## Database Configuration

The application uses PostgreSQL with Drizzle ORM:

- **Development**: The Docker setup automatically provisions a PostgreSQL database
- **Production**: You need to provide a `DATABASE_URL` in the format:
  ```
  postgresql://username:password@hostname:5432/database_name
  ```

### Database Migrations

Database migrations are handled automatically on startup. To manually run migrations:

```bash
# With Docker
docker-compose exec app npm run db:push

# Without Docker
npm run db:push
```

## Environment Variables

The following environment variables can be configured in the `.env` file:

| Variable | Description | Default |
|----------|-------------|---------|
| NODE_ENV | Environment (`development` or `production`) | `development` |
| POSTGRES_USER | PostgreSQL username | `postgres` |
| POSTGRES_PASSWORD | PostgreSQL password | `postgres` |
| POSTGRES_DB | PostgreSQL database name | `african_estates` |
| DATABASE_URL | Full PostgreSQL connection string | Constructed from the above values |

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm start` - Start the production server
- `npm run check` - Run TypeScript type checking
- `npm run db:push` - Push database schema changes to the database

## Project Structure

- `/server` - Backend Express API code
- `/src` - Frontend React application
- `/shared` - Shared code between frontend and backend
- `/migrations` - Database migration files
- `/dist` - Production build output

## License

This project is licensed under the MIT License - see the package.json file for details.
