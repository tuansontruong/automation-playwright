const { test, expect } = require('@playwright/test');
const axios = require('axios');
require('dotenv').config();

test.describe('Carrier Overview API Tests', () => {
  let apiClient;

  test.beforeEach(async () => {
    apiClient = axios.create({
      baseURL: process.env.API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  });

  test('should fetch carrier performance metrics', async () => {
    const response = await apiClient.get('/carriers/performance');
    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('onTimeDelivery');
    expect(response.data).toHaveProperty('deliveryTime');
    expect(response.data).toHaveProperty('successRate');
  });

  test('should get carrier service coverage', async () => {
    const response = await apiClient.get('/carriers/coverage');
    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('serviceAreas');
    expect(response.data).toHaveProperty('supportedServices');
  });
}); 