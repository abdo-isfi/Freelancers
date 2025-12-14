const request = require('supertest');
require('dotenv').config(); // Load env vars
const app = require('../src/app');
const { sequelize } = require('../src/models');
const { User } = require('../src/models');

describe('Auth Endpoints', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });
 
  // NOTE: In a real environment we would seed a user here
  // For this "audit fix" context, we assume the server is running against a dev DB
  // BUT tests should be isolated. We will mock the DB or create a user if force sync was used.
  // Given constraints "Minimal/No-Rewrite", we will try to login with a known dev user if exists,
  // or just check if endpoint handles bad credentials correctly (401).

  it('should return 401 for invalid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'invalid@example.com',
        password: 'wrongpassword'
      });
    
    expect(res.statusCode).toEqual(401);
  });

  // If we wanted to test success, we'd create a user first
  it('should register a new user successfully', async () => {
    const email = `test-${Date.now()}@example.com`;
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email,
        password: 'Password123',
        firstName: 'Test',
        lastName: 'User',
        companyName: 'Test Corp'
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.email).toBe(email);
  });
});
