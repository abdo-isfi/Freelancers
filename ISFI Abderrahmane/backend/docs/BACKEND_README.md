# Freelancer Management Backend API

A comprehensive Node.js/Express REST API for managing freelance projects, clients, time tracking, invoicing, and more.

## 🏗️ Architecture

The backend is built with a clean, modular architecture:

```
src/
├── controllers/     # Request handlers for all routes
├── services/        # Business logic layer
├── models/          # Sequelize ORM models
├── routes/          # API route definitions
├── middlewares/     # Auth, validation, error handling
├── loaders/         # Logger configuration
└── config/          # Database configuration
```

## 🎯 Features Implemented

### ✅ Core Features
- **User Authentication**: Register, login, JWT tokens, refresh tokens
- **Client Management**: CRUD operations for clients
- **Project Management**: Create projects with various billing types (hourly, daily, fixed price)
- **Task Management**: Create tasks with status tracking and priorities
- **Time Tracking**: Start/stop time tracking, log time entries
- **Invoicing**: Create invoices with line items, track payment status
- **Notes**: Create and organize notes across projects/clients

### ✅ Technical Implementation
- **Database**: Sequelize ORM with MySQL (development) & SQLite (testing)
- **Authentication**: JWT with access & refresh tokens, bcrypt password hashing
- **Validation**: Express-validator for all request data
- **Error Handling**: Centralized error handler middleware
- **Logging**: Pino logger with pretty formatting
- **Migrations**: Sequelize migrations for database schema

## 📋 Project Structure

### Models (9 tables)
1. **User** - Freelancer accounts
2. **Client** - Client information
3. **Project** - Client projects with billing configuration
4. **Task** - Project tasks with status and priority
5. **TimeEntry** - Time tracking entries
6. **Invoice** - Billing invoices
7. **InvoiceItem** - Invoice line items
8. **Note** - Notes for projects/clients/tasks
9. **RefreshToken** - JWT refresh token management

### Services (Business Logic)
- `authService` - Authentication, token management
- `clientService` - Client CRUD & queries
- `projectService` - Project management
- `taskService` - Task operations
- `timeEntryService` - Time tracking logic
- `invoiceService` - Invoice generation and management
- `noteService` - Note operations

### Routes (9 endpoint groups)
```
POST   /api/auth/register          - Register new user
POST   /api/auth/login             - Login user
POST   /api/auth/refresh           - Refresh access token
POST   /api/auth/logout            - Logout user
GET    /api/auth/me                - Get current user (requires auth)

GET    /api/clients                - Get all clients (requires auth)
GET    /api/clients/:id            - Get client by ID
POST   /api/clients                - Create client
PUT    /api/clients/:id            - Update client
DELETE /api/clients/:id            - Delete client

GET    /api/projects               - Get all projects
GET    /api/projects/:id           - Get project by ID
POST   /api/projects               - Create project
PUT    /api/projects/:id           - Update project
DELETE /api/projects/:id           - Delete project

GET    /api/tasks                  - Get project tasks
GET    /api/tasks/:id              - Get task by ID
POST   /api/tasks                  - Create task
PUT    /api/tasks/:id              - Update task
PATCH  /api/tasks/:id/status       - Update task status
DELETE /api/tasks/:id              - Delete task

GET    /api/time-entries           - Get time entries
POST   /api/time-entries           - Create time entry
PUT    /api/time-entries/:id       - Update time entry
DELETE /api/time-entries/:id       - Delete time entry
POST   /api/time-entries/start     - Start time tracking
POST   /api/time-entries/:id/stop  - Stop time tracking

GET    /api/invoices               - Get all invoices
GET    /api/invoices/:id           - Get invoice by ID
POST   /api/invoices               - Create invoice
PUT    /api/invoices/:id           - Update invoice
POST   /api/invoices/:id/mark-paid - Mark invoice as paid
GET    /api/invoices/:id/download  - Download invoice (PDF)
DELETE /api/invoices/:id           - Delete invoice

GET    /api/notes                  - Get all notes
GET    /api/notes/:id              - Get note by ID
POST   /api/notes                  - Create note
PUT    /api/notes/:id              - Update note
DELETE /api/notes/:id              - Delete note

GET    /api/dashboard/summary      - Get dashboard summary
GET    /api/health                 - Health check
```

## 🚀 Getting Started

### Prerequisites
- Node.js v20+
- MySQL 8.0+ (for development)
- npm or yarn

### Installation

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Update .env with your configuration
nano .env
```

### Configuration

Update `.env` file:
```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=freelancer_mgmt_dev

JWT_SECRET=your-super-secret-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key
JWT_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

PORT=4000
NODE_ENV=development
```

### Database Setup

```bash
# Run migrations to create tables
npm run db:migrate

# Seed database with test data
npm run db:seed

# Undo migrations (if needed)
npm run db:migrate:undo
```

### Running the Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

Server will run on `http://localhost:4000`

## 🔐 Authentication

### Register User
```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123",
    "firstName": "John",
    "lastName": "Doe",
    "companyName": "My Company"
  }'
```

### Login
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123"
  }'
```

Response includes `accessToken` and `refreshToken`.

### Using Auth Token

```bash
curl -X GET http://localhost:4000/api/auth/me \
  -H "Authorization: Bearer <accessToken>"
```

### Refresh Token
```bash
curl -X POST http://localhost:4000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken": "<refreshToken>"}'
```

## 📝 Example API Requests

### Create a Client
```bash
curl -X POST http://localhost:4000/api/clients \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Acme Corp",
    "email": "contact@acme.com",
    "phone": "+1-555-0101",
    "companyName": "Acme Corporation",
    "address": "123 Business St",
    "taxId": "TAX123456",
    "currency": "EUR"
  }'
```

### Create a Project
```bash
curl -X POST http://localhost:4000/api/projects \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "clientId": 1,
    "name": "Website Redesign",
    "description": "Complete website overhaul",
    "billingType": "fixed_price",
    "fixedAmount": 5000,
    "startDate": "2024-01-15",
    "endDateEstimated": "2024-03-15"
  }'
```

### Start Time Tracking
```bash
curl -X POST http://localhost:4000/api/time-entries/start \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "projectId": 1,
    "taskId": 1,
    "description": "Working on homepage design"
  }'
```

### Create Invoice
```bash
curl -X POST http://localhost:4000/api/invoices \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "projectId": 1,
    "clientId": 1,
    "invoiceNumber": "INV-001",
    "issueDate": "2024-02-01",
    "dueDate": "2024-03-01",
    "items": [
      {
        "description": "Development work",
        "quantity": 40,
        "unitPrice": 100
      }
    ],
    "notes": "Thank you for your business!"
  }'
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run unit tests only
npm run test:unit

# Run integration tests only
npm run test:integration
```

## 📦 NPM Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Start with nodemon (development) |
| `npm start` | Start in production mode |
| `npm test` | Run all tests with Jest |
| `npm run test:unit` | Run unit tests only |
| `npm run test:integration` | Run integration tests only |
| `npm run db:migrate` | Run database migrations |
| `npm run db:seed` | Seed database with test data |
| `npm run db:migrate:undo` | Revert all migrations |

## 🔄 Validation Rules

### Authentication
- Email must be valid format
- Password: minimum 8 chars, must contain lowercase, uppercase, and numbers
- First/Last name: minimum 2 characters (optional)

### Clients
- Name: required, minimum 2 characters
- Email: optional but must be valid format
- Currency: optional, 3-letter code (e.g., EUR, USD)

### Projects
- Client ID: required
- Name: required, minimum 2 characters
- Billing Type: must be "hourly", "day_rate", or "fixed_price"
- Status: "active", "paused", or "finished"

### Tasks
- Project ID: required
- Title: required, minimum 2 characters
- Priority: "low", "medium", or "high"
- Status: "todo", "in_progress", "in_review", or "completed"

### Invoices
- Project ID & Client ID: required
- Invoice Number: unique
- Issue Date & Due Date: required, valid dates
- Items: minimum 1 item with quantity and unitPrice

### Notes
- Title: required
- Content: required
- Color: optional ("yellow", "blue", "green", "pink", "red")

## 🛠️ Error Handling

All errors return standardized format:
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Email is invalid"
    }
  ]
}
```

HTTP Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (invalid token)
- `404` - Not Found
- `409` - Conflict (duplicate email, etc.)
- `500` - Server Error

## 📋 Next Steps

### Immediate Priority
1. ✅ Complete route middleware setup (in progress)
2. Write comprehensive test suite
3. Add Swagger API documentation
4. Implement PDF invoice generation
5. Set up Docker containers

### Future Enhancements
- Pagination for all list endpoints
- CSV/PDF export functionality
- Kanban board endpoints
- Real-time notifications (WebSocket)
- File uploads (invoices, attachments)
- Expense tracking
- Tax calculation
- Multi-currency support
- Team collaboration features

## 📚 Dependencies

### Core
- `express` (5.2.1) - Web framework
- `sequelize` (6.37.7) - ORM
- `mysql2` (3.15.3) - MySQL driver

### Authentication
- `jsonwebtoken` (9.0.3) - JWT handling
- `bcrypt` (6.0.0) - Password hashing

### Validation & Middleware
- `express-validator` (7.2.1) - Input validation
- `cors` (2.8.5) - CORS handling
- `dotenv` (17.2.3) - Environment variables

### Logging
- `pino` (9.14.0) - Logger
- `pino-pretty` (11.3.0) - Pretty formatting

### Documentation
- `swagger-jsdoc` (6.2.8) - API docs
- `swagger-ui-express` (5.0.1) - Swagger UI

### Development & Testing
- `nodemon` (3.1.11) - Auto-reload
- `jest` (29.7.0) - Test framework
- `supertest` (7.1.4) - HTTP assertion library
- `sequelize-cli` (6.6.3) - Migration CLI

## 📄 License

ISC

---

**Last Updated**: December 8, 2025
**Status**: Core implementation complete, testing & documentation in progress
