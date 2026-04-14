const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createAdmin() {
  try {
    const name = 'Admin'
    const email = 'admin@temple.com'
    const password = 'password123'

    const passwordHash = await bcrypt.hash(password, 10)

    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        name,
        email,
        passwordHash,
        role: 'admin',
      },
    })

    console.log('✅ Admin user created/verified successfully')
    console.log(`   Email: ${user.email}`)
    console.log('   Password: password123')
  } catch (error) {
    console.error('❌ Error creating admin:', error.message)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

createAdmin()
