import { Pool } from 'pg';

// Create a connection pool using the DATABASE_URL environment variable
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// Helper function to execute queries
export async function query(text, params) {
    const start = Date.now();
    try {
        const result = await pool.query(text, params);
        const duration = Date.now() - start;
        console.log('Executed query', { text, duration, rows: result.rowCount });
        return result;
    } catch (error) {
        console.error('Database query error:', error);
        throw error;
    }
}

// Get a client from the pool for transactions
export async function getClient() {
    const client = await pool.connect();
    return client;
}

// Test the database connection
export async function testConnection() {
    try {
        const result = await pool.query('SELECT NOW()');
        return { success: true, timestamp: result.rows[0].now };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

export default pool;
