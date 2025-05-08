
# 🛠️ PostgreSQL + TypeScript + Knex Guide

Includes: Tables, CRUD, Relationships, Indexing — using async/await and Knex.js in TypeScript

---

## 🔧 Tech Stack

- Node.js + TypeScript
- PostgreSQL
- [pg](https://node-postgres.com/) (PostgreSQL driver)
- [knex.js](https://knexjs.org/) (SQL query builder)

---

## 🗃️ Tables Overview (Schema)

**Users Table**
- `id` (PK)
- `name`
- `email`

**Tasks Table**
- `id` (PK)
- `title`
- `description`
- `status` (`pending` | `in_progress` | `completed`)
- `user_id` (FK → users.id)

---

## 📦 Project Setup

```bash
mkdir task-manager && cd task-manager
npm init -y
npm i typescript ts-node-dev knex pg
npx tsc --init
```

Update `tsconfig.json`:
```json
"esModuleInterop": true,
"target": "es2020"
```

---

## 🔌 Knex Config (`knexfile.ts`)

```ts
import type { Knex } from 'knex';

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'pg',
    connection: {
      host: 'localhost',
      user: 'postgres',
      password: 'yourpassword',
      database: 'taskmanager',
    },
    migrations: {
      directory: './migrations',
    },
  },
};

export default config;
```

Run:
```bash
npx knex --knexfile knexfile.ts migrate:make create_users_and_tasks
```

---

## 🧬 Migration Example

```ts
import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('email').notNullable().unique();
  });

  await knex.schema.createTable('tasks', (table) => {
    table.increments('id').primary();
    table.string('title').notNullable();
    table.text('description');
    table.enum('status', ['pending', 'in_progress', 'completed']).defaultTo('pending');
    table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
    table.index(['user_id']); // 🔍 Indexing
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('tasks');
  await knex.schema.dropTableIfExists('users');
}
```

Run:
```bash
npx knex --knexfile knexfile.ts migrate:latest
```

---

## 🔗 Database Connector (`db.ts`)

```ts
import knex from 'knex';
import config from './knexfile';

const db = knex(config.development);
export default db;
```

---

## ⚙️ Services (CRUD Operations)

### UserService.ts

```ts
import db from './db';

export const createUser = async (name: string, email: string) => {
  return await db('users').insert({ name, email }).returning('*');
};

export const getUser = async (id: number) => {
  return await db('users').where({ id }).first();
};
```

### TaskService.ts

```ts
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
```

---

## 🧪 Sample Usage (`index.ts`)

```ts
import { createUser, getUser } from './UserService';
import { createTask, getUserTasks } from './TaskService';

(async () => {
  const [user] = await createUser('Alice', 'alice@example.com');
  console.log('Created user:', user);

  await createTask(user.id, 'Finish backend module', 'Write the services');

  const tasks = await getUserTasks(user.id);
  console.log('Tasks for user:', tasks);
})();
```

Run it:
```bash
npx ts-node-dev index.ts
```

---

## 🔍 Indexing Tips

Use `.index(['column_name'])` in migrations to speed up queries with `WHERE` filters or `JOIN` on that column.

Example:
```ts
table.index(['user_id']); // Useful for WHERE user_id = ...
```

---
