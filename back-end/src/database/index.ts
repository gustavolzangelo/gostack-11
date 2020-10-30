import { Connection, createConnection } from 'typeorm';

const startConnection = async (): Promise<Connection> => {
  if (process.env.NODE_ENV === 'production') {
    return createConnection('production');
  }
  return createConnection('development');
};

export default startConnection;
