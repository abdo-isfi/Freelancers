const request = require('supertest');
require('dotenv').config();
const app = require('../src/app');
const { sequelize, User, Client, Project } = require('../src/models');

describe('Invoice Endpoints', () => {
  let token;
  let userId;
  let clientId;
  let projectId;

  beforeAll(async () => {
    // Sync DB
    await sequelize.sync({ force: true });
    
    // Setup: Login to get token
    // 1. Register user
    const email = `invoice-test-${Date.now()}@example.com`;
    const userRes = await request(app)
      .post('/api/auth/register')
      .send({
        email,
        password: 'Password123',
        firstName: 'Invoice',
        lastName: 'Tester',
        companyName: 'Invoice Corp'
      });
    
    userId = userRes.body.data.id;

    // 2. Login
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email, password: 'Password123' });
    
    token = loginRes.body.data.accessToken;

    // 3. Create Client
    const clientRes = await request(app)
      .post('/api/clients')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Test Client', email: 'client@test.com' });
    
    clientId = clientRes.body.data.id;

    // 4. Create Project
    const projectRes = await request(app)
    .post('/api/projects')
    .set('Authorization', `Bearer ${token}`)
    .send({ 
        name: 'Test Project', 
        clientId, 
        billingType: 'hourly',
        status: 'active'
    });
    // Project creation might fail if fields mismatch audit, assuming standard fields
    // If it fails, we skip projectId in invoice (it's optional in some schemas)
    if (projectRes.body.data) projectId = projectRes.body.data.id;
  });

  it('should create an invoice successfully', async () => {
    const res = await request(app)
      .post('/api/invoices')
      .set('Authorization', `Bearer ${token}`)
      .send({
        clientId,
        projectId,
        invoiceNumber: `INV-${Date.now()}`,
        issueDate: '2025-01-01',
        dueDate: '2025-01-15',
        currency: 'USD',
        items: [
          { description: 'Dev Work', quantity: 10, unitPrice: 50 }
        ]
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.subtotal).toBeDefined();
  });
});
