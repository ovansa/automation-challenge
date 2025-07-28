# Quick Post App

A full-stack application for user authentication and post management, built with TypeScript and designed for comprehensive testing. Features a clean monorepo architecture with complete test coverage using Jest and Cypress.

## Project Structure

```
quick-post-app/
├── backend/         # Express API server
├── frontend/        # React + Vite application
├── e2e/             # Cypress end-to-end tests
├── shared/          # Shared TypeScript types
└── package.json     # Workspace configuration
```

## Quick Start

### Prerequisites

- Node.js 18+
- pnpm 8+ (recommended)

### Installation

```bash
git clone https://github.com/yourusername/quick-post-app.git
cd quick-post-app
pnpm install -r
pnpm run setup
```

### Development

```bash
# Start both frontend and backend
pnpm run dev

# Backend: http://localhost:4000
# Frontend: http://localhost:5173
```

## Testing

### Backend Tests

Run the complete backend test suite using Jest and Supertest:

```bash
pnpm run test:backend
```

**Test Coverage:**

- Authentication endpoints (register, login)
- Post CRUD operations
- User management
- Middleware validation
- Error handling

### End-to-End Tests

Run comprehensive E2E tests with Cypress:

```bash
# Headless mode (recommended for CI)
pnpm run test:e2e

# Interactive mode (development)
pnpm run test:e2e:open

# Clean output (minimal logging)
pnpm run test:e2e:clean
```

**E2E Test Coverage:**

- User registration flow
- Login/logout functionality
- Post creation and management
- Form validation
- Error handling
- Navigation flows

### Test Credentials

```
Username: john_doe
Password: password123
```

### Continuous Integration

The project includes GitHub Actions workflow for automated testing:

```yaml
# Runs on push/PR to main/develop branches
- Backend unit tests
- End-to-end tests
- Parallel execution for faster CI
- Artifact collection for debugging
```

## Available Scripts

| Command                   | Description                           |
| ------------------------- | ------------------------------------- |
| `pnpm run test:backend`   | Run backend unit tests                |
| `pnpm run test:e2e`       | Run E2E tests (headless)              |
| `pnpm run test:e2e:open`  | Open Cypress test runner              |
| `pnpm run test:e2e:clean` | Run E2E tests with minimal output     |
| `pnpm run dev`            | Start development servers             |
| `pnpm run build`          | Build all packages                    |
| `pnpm run setup`          | Install dependencies and build shared |

## Tech Stack

**Backend Testing:**

- Jest - Unit testing framework
- Supertest - HTTP assertion library
- ts-jest - TypeScript support for Jest

**Frontend Testing:**

- Cypress - End-to-end testing
- Faker.js - Test data generation
- TypeScript support

**Development:**

- Express.js + React
- TypeScript
- pnpm workspaces
- Concurrent test execution

## Test Configuration

### Backend Tests

Located in `backend/tests/`, covering:

- API endpoints
- Authentication middleware
- Data validation
- Error responses

### E2E Tests

Located in `e2e/cypress/e2e/`, covering:

- Complete user workflows
- Cross-browser compatibility
- Real API integration
- UI interactions

### Running Tests in CI

```bash
# GitHub Actions automatically runs:
pnpm run test:backend        # Backend unit tests
pnpm run test:e2e:headless   # E2E tests in headless mode
```

## API Endpoints

| Method | Endpoint         | Auth Required | Tested |
| ------ | ---------------- | ------------- | ------ |
| POST   | `/auth/register` | No            | ✓      |
| POST   | `/auth/login`    | No            | ✓      |
| GET    | `/posts`         | Yes           | ✓      |
| POST   | `/posts`         | Yes           | ✓      |
| PUT    | `/posts/:id`     | Yes           | ✓      |
| DELETE | `/posts/:id`     | Yes           | ✓      |
| GET    | `/users`         | Yes           | ✓      |
| GET    | `/health`        | No            | ✓      |
| POST   | `/reset`         | No            | ✓      |

## Troubleshooting Tests

### Backend Tests Failing

```bash
# Ensure backend dependencies are installed
pnpm --filter backend install

# Check if ports are available
lsof -i :4000
```

### E2E Tests Failing

```bash
# Install Cypress binary
pnpm --filter e2e exec cypress install

# Reset test data
curl -X POST http://localhost:4000/reset

# Check if frontend is accessible
curl http://localhost:5173
```
