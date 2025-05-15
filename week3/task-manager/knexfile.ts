import type { Knex } from 'knex';

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'pg',
    connection: {
      host: 'localhost',
      user: 'postgres',
      password: '6666',
      database: 'taskmanager',
    },
    migrations: {
      directory: './migrations',
    },
  },
};

export default config;