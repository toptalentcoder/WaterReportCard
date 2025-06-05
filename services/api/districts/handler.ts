import { APIGatewayProxyHandler } from 'aws-lambda'
import { Pool } from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
})

export const handler: APIGatewayProxyHandler = async (event) => {
    const res = await pool.query('SELECT * FROM districts LIMIT 10')
    return {
        statusCode: 200,
        body: JSON.stringify(res.rows),
    }
}
