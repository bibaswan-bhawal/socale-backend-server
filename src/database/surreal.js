import Surreal from 'surrealdb.js';
import dotenv from 'dotenv';

dotenv.config();

let attempts = 0;

/**
 * Connect to SurrealDB
 * 
 * @returns {Promise<void>}
 * @throws {Error}
 */
export async function connectSurrealDB() {
    try {
        Surreal.Instance.connect(`${process.env.SURREALDB_URL}/rpc`);
        await Surreal.Instance.wait();
        attempts = 0;

        if (process.env.NODE_ENV == 'development') console.log('Connected to SurrealDB');
    } catch (e) {
        console.error('ERROR', e);
        if (attempts < 5) {
            attempts++;
            setTimeout(() => {
                connectSurrealDB();
            }, 2 ** attempts * 1000);
        } else {
            throw e;
        }
    }
}

/**
 * Close SurrealDB connection
 * 
 */
export function closeSurrealDB() {
    Surreal.Instance.close();
    if (process.env.NODE_ENV == 'development') console.log('Closed SurrealDB connection');
}