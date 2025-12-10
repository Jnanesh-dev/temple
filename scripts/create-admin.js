const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const readline = require('readline')

const prisma = new PrismaClient()

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

function question(query) {
  return new Promise((resolve) => rl.question(query, resolve))
}

async function createAdmin() {
  try {
    console.log('🔐 Create Admin User\n')

    const name = await question('Name: ')
    const email = await question('Email: ')
    const password = await question('Password: ')

    if (!name || !email || !password) {
      console.error('❌ All fields are required')
      process.exit(1)
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10)

    // Create admin user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: 'admin',
      },
    })

    console.log('\n✅ Admin user created successfully!')
    console.log(`   ID: ${user.id}`)
    console.log(`   Email: ${user.email}`)
    console.log(`   Role: ${user.role}`)
  } catch (error) {
    if (error.code === 'P2002') {
      console.error('❌ User with this email already exists')
    } else {
      console.error('❌ Error:', error.message)
    }
    process.exit(1)
  } finally {
    await prisma.$disconnect()
    rl.close()
  }
}

createAdmin()

