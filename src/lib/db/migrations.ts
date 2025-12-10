import pool from '../db'
import fs from 'fs'
import path from 'path'

export async function runMigrations() {
  const client = await pool.connect()
  
  try {
    // Read schema file
    const schemaPath = path.join(process.cwd(), 'src/lib/db/schema.sql')
    const schema = fs.readFileSync(schemaPath, 'utf-8')
    
    // Split by semicolons and execute each statement
    const statements = schema
      .split(';')
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !s.startsWith('--'))
    
    for (const statement of statements) {
      if (statement.trim()) {
        await client.query(statement)
      }
    }
    
    console.log('✅ Database migrations completed successfully')
  } catch (error) {
    console.error('❌ Migration error:', error)
    throw error
  } finally {
    client.release()
    await pool.end()
  }
}

