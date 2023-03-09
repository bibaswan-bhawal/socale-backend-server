import Surreal from 'surrealdb.js';
import dotenv from 'dotenv';

dotenv.config();

export const db = new Surreal(`${process.env.SURREALDB_URL}/rpc`);