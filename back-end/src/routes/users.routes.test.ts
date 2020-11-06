import request from 'supertest';
import { createConnection, getConnection } from 'typeorm';
import express from 'express';
import routes from './index';

const app = express();

app.use(express.json());
app.use(routes);

describe('appointments routes test', () => {
  beforeAll(async () => {
    await createConnection('test');
    await getConnection('test')
      .createQueryBuilder()
      .delete()
      .from('users')
      .execute();
  });
  afterAll(async () => {
    await getConnection('test')
      .createQueryBuilder()
      .delete()
      .from('users')
      .execute();
    const connection = getConnection('test');
    connection.close();
  });

  it('post new user without name', async () => {
    const response = await request(app).post('/users').send({});
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Name not informed' });
  });
  it('post new user without email', async () => {
    const response = await request(app)
      .post('/users')
      .send({ name: 'Gustavo' });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Email not informed' });
  });
  it('post new user without password', async () => {
    const response = await request(app)
      .post('/users')
      .send({ name: 'Gustavo', email: 'ga@gmail.com' });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Password not informed' });
  });
  it('post new valid user', async () => {
    const response = await request(app).post('/users').send({
      name: 'Gustavo',
      email: 'gao@gmail.com',
      password: '12345',
    });
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      name: 'Gustavo',
      email: 'gao@gmail.com',
    });
  });
  it('post an user with existing email', async () => {
    const response = await request(app).post('/users').send({
      name: 'Gustavo',
      email: 'gao@gmail.com',
      password: '12345',
    });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Email address already used' });
  });
});
