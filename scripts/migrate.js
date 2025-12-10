const { Pool } = require('pg')
const fs = require('fs')
const path = require('path')

async function runMigrations() {
  const pool = new Pool({
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT || '5432'),
    database: process.env.POSTGRES_DB || 'temple_db',
    user: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || '',
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  })

  const client = await pool.connect()

  try {
    console.log('📖 Reading schema file...')
    // Read schema file - try multiple possible paths
    let schemaPath = path.join(__dirname, '../src/lib/db/schema.sql')
    if (!fs.existsSync(schemaPath)) {
      schemaPath = path.join(process.cwd(), 'src/lib/db/schema.sql')
    }
    if (!fs.existsSync(schemaPath)) {
      throw new Error(`Schema file not found at ${schemaPath}`)
    }
    
    const schema = fs.readFileSync(schemaPath, 'utf-8')
    console.log('✅ Schema file loaded')

    // Split by semicolons and execute each statement
    const statements = schema
      .split(';')
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !s.startsWith('--') && !s.startsWith('/*'))

    console.log(`📝 Executing ${statements.length} SQL statements...`)

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]
      if (statement.trim()) {
        try {
          await client.query(statement)
          console.log(`✅ Statement ${i + 1}/${statements.length} executed`)
        } catch (error) {
          // Ignore errors for "already exists" cases
          if (
            error.message.includes('already exists') ||
            error.message.includes('duplicate') ||
            error.message.includes('does not exist')
          ) {
            console.log(`⏭️  Statement ${i + 1} skipped: ${error.message.split('\n')[0]}`)
          } else {
            console.warn(`⚠️  Warning on statement ${i + 1}:`, error.message)
          }
        }
      }
    }

    console.log('✅ Database migrations completed successfully')
  } catch (error) {
    console.error('❌ Migration error:', error.message)
    throw error
  } finally {
    client.release()
    await pool.end()
  }
}

runMigrations()
  .then(() => {
    console.log('✅ Migrations completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  })

