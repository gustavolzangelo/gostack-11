import 'reflect-metadata';

import express from 'express';
import routes from './routes';

import startConnection from './database';

const app = express();

app.use(express.json());
app.use(routes);

startConnection();

app.listen(3333, () => {
  console.log(`server started on port 3333! ${process.env.NODE_ENV}`);
});
