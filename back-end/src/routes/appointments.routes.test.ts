/* eslint-disable import/no-extraneous-dependencies */
import request from 'supertest';
import { createConnection, getConnection } from 'typeorm';

describe('appointments routes test', () => {
  beforeAll(async () => {
    await createConnection('development');
    await getConnection('development')
      .createQueryBuilder()
      .delete()
      .from('appointments')
      .execute();
  });

  afterAll(async () => {
    const connection = getConnection('development');
    connection.close();
  });

  it('get appointments status code 200', async () => {
    const response = await request('localhost:3333').get('/appointments');
    expect(response.status).toBe(200);
  });
  it('post appointments no arguments', async () => {
    const response = await request('localhost:3333').post('/appointments');
    expect(response.status).toBe(400);
  });
  it('post appointments provider argument', async () => {
    const response = await request('localhost:3333')
      .post('/appointments')
      .send({ provider: 'Gustavo' });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'date not informed' });
  });
  it('post appointments date argument', async () => {
    const response = await request('localhost:3333')
      .post('/appointments')
      .send({ date: 'dd-mm-yy' });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'provider not informed' });
  });
  it('post new appointments with date and provider', async () => {
    const response = await request('localhost:3333')
      .post('/appointments')
      .send({ date: '2020-10-28T22:52:58.608Z', provider: 'Gustavo' });
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      provider: 'Gustavo',
      date: '2020-10-28T22:00:00.000Z',
    });
  });
  it('post existing appointment', async () => {
    const response = await request('localhost:3333')
      .post('/appointments')
      .send({ date: '2020-10-28T22:52:58.608Z', provider: 'Gustavo' });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: 'This appointment is already booked',
    });
  });
});
