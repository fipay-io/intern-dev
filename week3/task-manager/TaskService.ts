import db from './db';

export const createTask = async (userId: number, title: string, desc?: string) => {
  return await db('tasks').insert({
    user_id: userId,
    title,
    description: desc,
  }).returning('*');
};

export const getUserTasks = async (userId: number) => {
    return await db('tasks').where({ user_id: userId });
};

export const updateTaskStatus = async (taskId: number, status: string) => {
    return await db('tasks').where({ id: taskId }).update({ status }).returning('*');
};

export const deleteTask = async (taskId: number) => {
    return await db('tasks').where({ id: taskId }).del();
};