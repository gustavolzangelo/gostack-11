import request from 'supertest';
import { createConnection, getConnection } from 'typeorm';

describe('appointments routes test', () => {
  beforeAll(async () => {
    await createConnection('development');
    await getConnection('development')
      .createQueryBuilder()
      .delete()
      .from('users')
      .execute();
  });
  afterAll(async () => {
    await getConnection('development')
      .createQueryBuilder()
      .delete()
      .from('users')
      .execute();
    const connection = getConnection('development');
    connection.close();
  });

  it('post new user without name', async () => {
    const response = await request('localhost:3333').post('/users').send({});
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Name not informed' });
  });
  it('post new user without email', async () => {
    const response = await request('localhost:3333')
      .post('/users')
      .send({ name: 'Gustavo' });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Email not informed' });
  });
  it('post new user without password', async () => {
    const response = await request('localhost:3333')
      .post('/users')
      .send({ name: 'Gustavo', email: 'gustavolz.angelo@gmail.com' });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Password not informed' });
  });
  it('post new valid user', async () => {
    const response = await request('localhost:3333').post('/users').send({
      name: 'Gustavo',
      email: 'gustavolz.angelo@gmail.com',
      password: '12345',
    });
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      name: 'Gustavo',
      email: 'gustavolz.angelo@gmail.com',
    });
  });
});
