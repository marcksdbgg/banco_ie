import { Pool } from '@neondatabase/serverless'

const dbUrl = process.env.DATABASE_URL
if (!dbUrl) {
  throw new Error('DATABASE_URL environment variable is not set')
}

export const pool = new Pool({ connectionString: dbUrl })
