const request = require('supertest');
const { expect } = require('chai');
const app = require('../server'); // server.js در انتها app را export می‌کند

describe('Health Check API', () => {
  it('GET /health should return { ok: true }', async () => {
    const res = await request(app).get('/health');
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('ok', true);
  });
});

