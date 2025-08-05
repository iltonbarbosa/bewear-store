import 'dotenv/config';

import { drizzle } from 'drizzle-orm/node-postgres';

import * as schema from './schema'; //para o db saber quais schema está sendo utilizado

export const db = drizzle(process.env.DATABASE_URL!, {
  schema });