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

  it('post an invalid email', async () => {
    const response = await request(app).post('/sessions').send({
      email: 'gao@gmail.com',
      password: '12345',
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: 'Incorrect email/password combination',
    });
  });

  it('post an user with invalid password', async () => {
    await request(app).post('/users').send({
      name: 'Gustavo',
      email: 'gao@gmail.com',
      password: '12345',
    });

    const response = await request(app).post('/sessions').send({
      email: 'gao@gmail.com',
      password: '123456',
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: 'Incorrect email/password combination',
    });
  });

  it('post an user with invalid password', async () => {
    const response = await request(app).post('/sessions').send({
      email: 'gao@gmail.com',
      password: '12345',
    });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });
});
