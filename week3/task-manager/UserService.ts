import db from './db';

export const createUser = async (name: string, email: string) => {
  return await db('users').insert({ name, email }).returning('*');
};

export const getUser = async (id: number) => {
    return await db('users').where({ id }).first();
};