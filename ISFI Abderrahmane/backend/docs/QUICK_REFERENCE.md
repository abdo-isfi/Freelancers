# Backend Quick Reference

## 🚀 Start Here

```bash
cd backend
npm install
npm run dev
```

Server runs on `http://localhost:4000`

---

## 📚 File Structure

```
backend/
├── src/
│   ├── app.js                          # Express app setup
│   ├── server.js                       # Server entry point
│   ├── config/
│   │   └── database.js                 # Database config (dev/test/prod)
│   ├── models/
│   │   ├── User.js, Client.js, etc.   # 9 Sequelize models
│   │   └── index.js                    # Model loader
│   ├── services/
│   │   ├── authService.js              # Auth business logic
│   │   ├── clientService.js            # Client CRUD
│   │   ├── projectService.js           # Project CRUD
│   │   ├── taskService.js              # Task CRUD
│   │   ├── timeEntryService.js         # Time tracking
│   │   ├── invoiceService.js           # Invoice management
│   │   └── noteService.js              # Note management
│   ├── controllers/
│   │   ├── authController.js           # Auth endpoints
│   │   ├── clientController.js         # Client endpoints
│   │   ├── projectController.js        # Project endpoints
│   │   ├── taskController.js           # Task endpoints
│   │   ├── timeEntryController.js      # Time entry endpoints
│   │   ├── invoiceController.js        # Invoice endpoints
│   │   └── dashboardController.js      # Notes & dashboard
│   ├── routes/
│   │   ├── authRoutes.js               # /api/auth routes
│   │   ├── clientRoutes.js             # /api/clients routes
│   │   ├── projectRoutes.js            # /api/projects routes
│   │   ├── taskRoutes.js               # /api/tasks routes
│   │   ├── timeEntryRoutes.js          # /api/time-entries routes
│   │   ├── invoiceRoutes.js            # /api/invoices routes
│   │   ├── noteRoutes.js               # /api/notes routes
│   │   ├── dashboardRoutes.js          # /api/dashboard routes
│   │   └── index.js                    # Route aggregator
│   ├── middlewares/
│   │   ├── authMiddleware.js           # JWT verification
│   │   ├── validationMiddleware.js     # Input validation
│   │   └── errorHandler.js             # Error handling
│   └── loaders/
│       └── logger.js                   # Pino logger
├── migrations/                          # Sequelize migrations
├── seeders/                             # Database seeders
├── Dockerfile                           # Docker image
├── docker-compose.yml                   # Docker Compose
├── .sequelizerc                         # Sequelize CLI config
├── .env.example                         # Environment template
├── package.json                         # Dependencies
├── jest.config.js                       # Test config
├── BACKEND_README.md                    # API documentation
├── IMPLEMENTATION_SUMMARY.md            # Implementation details
├── PROJECT_COMPLETION_SUMMARY.md        # Completion report
└── setup.sh                             # Setup script
```

---

## 🔑 Key Features

### Authentication
```javascript
// Register
POST /api/auth/register
Body: { email, password, firstName, lastName, companyName }

// Login
POST /api/auth/login
Body: { email, password }
Response: { user, accessToken, refreshToken }

// Refresh Token
POST /api/auth/refresh
Body: { refreshToken }

// Logout
POST /api/auth/logout
Body: { refreshToken }

// Get Me
GET /api/auth/me
Header: Authorization: Bearer <token>
```

### CRUD Operations
All resources support:
```
GET    /api/{resource}              # List (with pagination)
GET    /api/{resource}/:id          # Get one
POST   /api/{resource}              # Create
PUT    /api/{resource}/:id          # Update
DELETE /api/{resource}/:id          # Delete
```

Resources: `clients`, `projects`, `tasks`, `time-entries`, `invoices`, `notes`

---

## 🗄️ Database

### 9 Models
1. **User** - Freelancer account
2. **Client** - Client info
3. **Project** - Client project
4. **Task** - Project task
5. **TimeEntry** - Time tracking
6. **Invoice** - Billing
7. **InvoiceItem** - Invoice line
8. **Note** - Notes
9. **RefreshToken** - Token storage

### Setup
```bash
npm run db:migrate      # Create tables
npm run db:seed         # Add test data
npm run db:migrate:undo # Drop tables
```

---

## 🔐 Authentication Flow

```
1. Register -> User created
2. Login -> accessToken + refreshToken returned
3. Use accessToken in Authorization header
4. accessToken expires in 15m
5. Use refreshToken to get new accessToken
6. Logout -> refreshToken revoked
```

### Bearer Token Format
```
Authorization: Bearer <accessToken>
```

---

## ✅ Validation Rules

### Common Validations
- **Email**: Valid format, unique
- **Password**: 8+ chars, uppercase, lowercase, numbers
- **Enum**: Specific values only (e.g., status, priority)
- **Date**: ISO 8601 format
- **Number**: Min/max ranges
- **String**: Min/max length

### By Resource
- **Client**: name required, email optional
- **Project**: clientId, name, billingType required
- **Task**: projectId, title required, status enum
- **TimeEntry**: projectId required, auto-calculates duration
- **Invoice**: projectId, clientId, items required
- **Note**: title, content required

---

## 📊 Common Responses

### Success (2xx)
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* resource data */ }
}
```

### Error (4xx/5xx)
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    { "field": "email", "message": "Email already exists" }
  ]
}
```

### Status Codes
- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `409` - Conflict
- `500` - Server Error

---

## 🧪 Testing

```bash
npm test                    # All tests
npm run test:unit          # Unit tests only
npm run test:integration   # Integration tests only
```

---

## 📦 Environment

Required in `.env`:
```
DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME
JWT_SECRET, JWT_REFRESH_SECRET
JWT_EXPIRY, JWT_REFRESH_EXPIRY
PORT, NODE_ENV
```

---

## 🐳 Docker

```bash
# Build and run
docker-compose up --build

# Stop
docker-compose down

# View logs
docker-compose logs -f backend
```

MySQL runs on `localhost:3306`
Backend runs on `localhost:4000`

---

## 🔧 Development

### Add New Endpoint

1. **Create Service** (`/src/services/resourceService.js`)
   ```javascript
   class ResourceService {
     async getAll(userId, options) { }
     async getById(id, userId) { }
     async create(userId, data) { }
     async update(id, userId, data) { }
     async delete(id, userId) { }
     formatResource(resource) { }
   }
   ```

2. **Create Controller** (`/src/controllers/resourceController.js`)
   ```javascript
   const service = require('../services/resourceService');
   
   const getAll = async (req, res, next) => {
     try {
       const result = await service.getAll(req.userId, req.query);
       res.json({ success: true, data: result });
     } catch (error) {
       next(error);
     }
   };
   ```

3. **Create Routes** (`/src/routes/resourceRoutes.js`)
   ```javascript
   router.use(verifyToken);
   router.get('/', getAll);
   router.get('/:id', validation.getById, getById);
   router.post('/', validation.create, create);
   router.put('/:id', validation.update, update);
   router.delete('/:id', validation.delete, delete);
   ```

4. **Register Route** (`/src/routes/index.js`)
   ```javascript
   const resourceRoutes = require('./resourceRoutes');
   router.use('/resources', resourceRoutes);
   ```

5. **Add Validation** (`/src/middlewares/validationMiddleware.js`)
   ```javascript
   resourceValidation: {
     create: [
       body('field').notEmpty().withMessage('Field required'),
     ]
   }
   ```

### Add Database Field
1. Create migration: `npx sequelize-cli migration:create --name add-field-to-table`
2. Edit migration file
3. Update model definition
4. Run: `npm run db:migrate`

---

## 📖 API Documentation

See `BACKEND_README.md` for:
- Complete endpoint list with examples
- Authentication guide
- Validation rules
- Error handling
- Setup instructions

---

## 🚨 Common Issues

### Port Already in Use
```bash
lsof -i :4000
kill -9 <PID>
```

### Database Connection Failed
- Check `.env` credentials
- Ensure MySQL is running
- Create database: `mysql -u root -p -e "CREATE DATABASE freelancer_mgmt_dev;"`

### JWT Token Invalid
- Ensure token is in Authorization header
- Format: `Authorization: Bearer <token>`
- Token expires in 15m, use refresh endpoint

### Validation Errors
- Check request body format
- Ensure all required fields are included
- Validate enum values (status, priority, etc.)

---

## 🎯 Quick Tips

- All protected routes require: `Authorization: Bearer <token>`
- All data is user-scoped (user_id from token)
- Pagination: `?page=1&limit=10`
- Filtering: `?status=active` (on supported endpoints)
- Errors include detailed field validation messages
- Timestamps auto-managed (created_at, updated_at)

---

## 📞 Support

For detailed information, see:
- `BACKEND_README.md` - Complete API docs
- `IMPLEMENTATION_SUMMARY.md` - Implementation details
- `PROJECT_COMPLETION_SUMMARY.md` - Project status
- Code comments in services for business logic details

---

**Last Updated**: December 8, 2025
**Backend Status**: ✅ Production Ready
