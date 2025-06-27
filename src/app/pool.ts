'use server'

import postgres from 'postgres'

const pool = postgres(process.env.DATABASE_URL!)

export default pool
