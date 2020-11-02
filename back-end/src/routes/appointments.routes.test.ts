/* eslint-disable no-useless-escape */
/* eslint-disable import/no-extraneous-dependencies */
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
      .from('appointments')
      .execute();

    await getConnection('test')
      .createQueryBuilder()
      .delete()
      .from('users')
      .execute();
  });

  afterAll(async () => {
    const connection = getConnection('test');
    connection.close();
  });

  it('get appointments status code 200', async () => {
    const response = await request(app).get('/appointments');
    expect(response.status).toBe(200);
  });
  it('post appointments no arguments', async () => {
    const response = await request(app).post('/appointments');
    expect(response.status).toBe(400);
  });
  it('post new appointment without date', async () => {
    const response = await request(app)
      .post('/appointments')
      .send({ provider_id: 'Gustavo' });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'date not informed' });
  });
  it('post new appointments without provider_id', async () => {
    const response = await request(app)
      .post('/appointments')
      .send({ date: 'dd-mm-yy' });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'provider_id not informed' });
  });
  it('post new appointment with not provider_id not in uuid format', async () => {
    const response = await request(app).post('/appointments').send({
      date: '2020-10-28T22:52:58.608Z',
      provider_id: 'Gustavo',
    });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      // eslint-disable-next-line prettier/prettier
      error: 'invalid input syntax for type uuid: \"Gustavo\"',
    });
  });
  it('post new appointment with no existing provider_id', async () => {
    const response = await request(app).post('/appointments').send({
      date: '2020-10-28T22:52:58.608Z',
      provider_id: 'e03a3a4b-469f-4685-a6ed-58416a26e211',
    });
    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({
      error: 'Does not exist an user with given id',
    });
  });

  let userRequest: request.Response;
  it('post new valid appointment', async () => {
    userRequest = await request(app).post('/users').send({
      name: 'Gustavo',
      email: 'ga@gmail.com',
      password: '123456',
    });
    const response = await request(app).post('/appointments').send({
      date: '2020-10-28T22:52:58.608Z',
      provider_id: userRequest.body.id,
    });
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      date: '2020-10-28T22:00:00.000Z',
      provider_id: userRequest.body.id,
    });
  });
  it('post existing appointment', async () => {
    const response = await request(app).post('/appointments').send({
      date: '2020-10-28T22:52:58.608Z',
      provider_id: userRequest.body.id,
    });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: 'This appointment is already booked',
    });
  });
});
